import { createClient } from "@supabase/supabase-js";

export default async (request) => {
  try {
    const url = new URL(request.url);
    const teamId = url.searchParams.get("teamId");

    if (!teamId) {
      return new Response(
        JSON.stringify({
          error: "teamId is required",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const footballToken = process.env.FOOTBALL_DATA_API_TOKEN;
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!footballToken) {
      return new Response(
        JSON.stringify({
          error: "FOOTBALL_DATA_API_TOKEN is not configured",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({
          error: "Supabase environment variables are not configured",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const supabase = createClient(
      supabaseUrl,
      supabaseKey
    );

    // Find the team and its football-data.org ID
    const { data: team, error: teamError } = await supabase
      .from("teams")
      .select("id, name, football_data_id")
      .eq("id", Number(teamId))
      .single();

    if (teamError || !team) {
      return new Response(
        JSON.stringify({
          error: "Team not found",
          details: teamError,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (!team.football_data_id) {
      return new Response(
        JSON.stringify({
          error: "Football-Data.org ID is not configured for this team",
          teamId: team.id,
          teamName: team.name,
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Get the team's recent finished matches
    const apiUrl =
      `https://api.football-data.org/v4/teams/${team.football_data_id}/matches` +
      `?status=FINISHED&limit=5`;

    const response = await fetch(apiUrl, {
      headers: {
        "X-Auth-Token": footballToken,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: "Football-Data.org request failed",
          details: data,
        }),
        {
          status: response.status,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const matches = data.matches || [];

    if (matches.length === 0) {
      return new Response(
        JSON.stringify({
          error: "No finished matches found",
          team: team.name,
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const form = matches
      .slice(0, 5)
      .map((match) => {
        const isHome =
          match.homeTeam.id === Number(team.football_data_id);

        const teamScore = isHome
          ? match.score.fullTime.home
          : match.score.fullTime.away;

        const opponentScore = isHome
          ? match.score.fullTime.away
          : match.score.fullTime.home;

        if (teamScore > opponentScore) return "W";
        if (teamScore < opponentScore) return "L";
        return "D";
      })
      .join(" ");

    // Save the form against the correct Supabase team
    const { error: updateError } = await supabase
      .from("teams")
      .update({
        form,
        form_updated_at: new Date().toISOString(),
      })
      .eq("id", Number(teamId));

    if (updateError) {
      return new Response(
        JSON.stringify({
          error: "Failed to update team form",
          details: updateError,
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        teamId: team.id,
        teamName: team.name,
        footballDataId: team.football_data_id,
        form,
        matchesUsed: matches.length,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Update form error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to update team form",
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
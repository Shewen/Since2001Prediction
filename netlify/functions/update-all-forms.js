import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export default async (request) => {
  try {
    const token = process.env.FOOTBALL_DATA_API_TOKEN;

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "FOOTBALL_DATA_API_TOKEN is not configured",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get all teams that have a football-data.org ID
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("id, name, football_data_id")
      .not("football_data_id", "is", null)
      .order("id");

    if (teamsError) {
      throw teamsError;
    }

    const results = [];

    for (const team of teams) {
      try {
        const url =
          `https://api.football-data.org/v4/teams/${team.football_data_id}/matches` +
          `?status=FINISHED&limit=5`;

        const response = await fetch(url, {
          headers: {
            "X-Auth-Token": token,
          },
        });

        if (!response.ok) {
          const errorText = await response.text();

          results.push({
            teamId: team.id,
            teamName: team.name,
            footballDataId: team.football_data_id,
            success: false,
            error: errorText,
          });

          // Wait before the next request
          await sleep(7000);
          continue;
        }

        const data = await response.json();

        const matches = data.matches || [];

        // Make sure newest matches come first
        matches.sort(
          (a, b) => new Date(b.utcDate) - new Date(a.utcDate)
        );

        const recentMatches = matches.slice(0, 5);

        const form = recentMatches
          .map((match) => {
            const homeTeamId = match.homeTeam?.id;
            const awayTeamId = match.awayTeam?.id;

            const homeScore = match.score?.fullTime?.home;
            const awayScore = match.score?.fullTime?.away;

            if (
              homeScore === null ||
              homeScore === undefined ||
              awayScore === null ||
              awayScore === undefined
            ) {
              return null;
            }

            const isHome = homeTeamId === team.football_data_id;

            if (homeScore === awayScore) {
              return "D";
            }

            if (isHome) {
              return homeScore > awayScore ? "W" : "L";
            }

            return awayScore > homeScore ? "W" : "L";
          })
          .filter(Boolean)
          .join("");

        const { error: updateError } = await supabase
          .from("teams")
          .update({
            form: form || null,
            form_updated_at: new Date().toISOString(),
          })
          .eq("id", team.id);

        if (updateError) {
          throw updateError;
        }

        results.push({
          teamId: team.id,
          teamName: team.name,
          footballDataId: team.football_data_id,
          success: true,
          form,
          matchesUsed: recentMatches.length,
        });

        // Free plan is limited to 10 requests/minute.
        await sleep(7000);
      } catch (error) {
        results.push({
          teamId: team.id,
          teamName: team.name,
          footballDataId: team.football_data_id,
          success: false,
          error: error.message,
        });

        await sleep(7000);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        totalTeams: teams.length,
        updated: results.filter((item) => item.success).length,
        failed: results.filter((item) => !item.success).length,
        results,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Update all forms error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
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
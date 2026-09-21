import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const config = {
  schedule: "0 */3 * * *",
};

export default async () => {
  try {
    const { data: teams, error } = await supabase
      .from("teams")
      .select("id, league_id, football_data_id")
      .not("football_data_id", "is", null)
      .order("league_id")
      .order("id");

    if (error) {
      throw error;
    }

    const batchSize = 2;

    const leagues = {};

    for (const team of teams) {
      if (!leagues[team.league_id]) {
        leagues[team.league_id] = [];
      }

      leagues[team.league_id].push(team);
    }

    const leagueBatches = [];

    for (const leagueId of Object.keys(leagues)) {
      const leagueTeams = leagues[leagueId];
      const totalBatches = Math.ceil(leagueTeams.length / batchSize);

      for (let batch = 1; batch <= totalBatches; batch++) {
        leagueBatches.push({
          leagueId: Number(leagueId),
          batch,
        });
      }
    }

    const totalBatches = leagueBatches.length;

    const hoursSinceEpoch = Math.floor(
      Date.now() / (3 * 60 * 60 * 1000)
    );

    const batchIndex = hoursSinceEpoch % totalBatches;

    const selected = leagueBatches[batchIndex];

    const siteUrl =
      process.env.URL || "https://since2001prediction.netlify.app";

    const updateUrl =
      `${siteUrl}/.netlify/functions/update-all-forms` +
      `?league=${selected.leagueId}&batch=${selected.batch}`;

    const response = await fetch(updateUrl);

    const result = await response.json();

    return new Response(
      JSON.stringify({
        success: true,
        selectedLeague: selected.leagueId,
        selectedBatch: selected.batch,
        totalBatches,
        result,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Scheduled form update error:", error);

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
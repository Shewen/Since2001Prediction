import { supabase } from "../lib/supabase";

// Normalize team names so different formats can match.
// Example:
// "real-madrid" → "realmadrid"
// "Real Madrid" → "realmadrid"
const normalizeTeamName = (name = "") => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
};


// Convert Supabase row → React prediction
const formatPrediction = (item, teams = []) => {
  const predictionHomeName = normalizeTeamName(
    item.home_team
  );

  const predictionAwayName = normalizeTeamName(
    item.away_team
  );

  const homeTeam = teams.find(
    (team) => {
      const teamName = normalizeTeamName(team.name);

      return (
        teamName === predictionHomeName ||
        (predictionHomeName === "intermilan" &&
          teamName === "inter") ||
        (predictionHomeName === "acmilan" &&
          teamName === "acmilan")
      );
    }
  );

  const awayTeam = teams.find(
    (team) => {
      const teamName = normalizeTeamName(team.name);

      return (
        teamName === predictionAwayName ||
        (predictionAwayName === "intermilan" &&
          teamName === "inter") ||
        (predictionAwayName === "acmilan" &&
          teamName === "acmilan")
      );
    }
  );

  return {
    id: item.id,
    fixtureId: item.fixture_id,

    league: item.league,
    date: item.date,
    time: item.time,

    homeTeam: item.home_team,
    awayTeam: item.away_team,

    homeLogo: item.home_logo || homeTeam?.logo || "",
    awayLogo: item.away_logo || awayTeam?.logo || "",

    prediction: item.prediction,

    premium: item.premium,
    confidence: item.confidence,

    homeScore: item.home_score,
    awayScore: item.away_score,

    resultStatus: item.result_status || "pending",
    resultAnalysis: item.result_analysis || "",
  };
};


// Get all predictions
export async function getPredictions() {
  const [{ data, error }, { data: teams, error: teamsError }] =
    await Promise.all([
      supabase
        .from("predictions")
        .select("*")
        .order("id", { ascending: true }),

      supabase
        .from("teams")
        .select("id, name, logo"),
    ]);

  if (error) {
    console.error("Error fetching predictions:", error);
    throw error;
  }

  if (teamsError) {
    console.error("Error fetching teams:", teamsError);
    throw teamsError;
  }

  return data.map((item) =>
    formatPrediction(item, teams || [])
  );
};


// Add a prediction
export async function addPrediction(prediction) {
  const { data, error } = await supabase
    .from("predictions")
    .insert({
      fixture_id: prediction.fixtureId
        ? Number(prediction.fixtureId)
        : null,

      league: prediction.league,
      date: prediction.date,
      time: prediction.time,

      home_team: prediction.homeTeam,
      away_team: prediction.awayTeam,

      home_logo: prediction.homeLogo || null,
      away_logo: prediction.awayLogo || null,

      prediction: prediction.prediction,

      confidence: Number(prediction.confidence),
      premium: Boolean(prediction.premium),
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding prediction:", error);
    throw error;
  }

  return formatPrediction(data);
};


// Update a prediction
export async function updatePrediction(id, updatedData) {
  const { data, error } = await supabase
    .from("predictions")
    .update({
      fixture_id: updatedData.fixtureId
        ? Number(updatedData.fixtureId)
        : null,

      league: updatedData.league,
      date: updatedData.date,
      time: updatedData.time,

      home_team: updatedData.homeTeam,
      away_team: updatedData.awayTeam,

      home_logo: updatedData.homeLogo || null,
      away_logo: updatedData.awayLogo || null,

      prediction: updatedData.prediction,

      confidence: Number(updatedData.confidence),
      premium: Boolean(updatedData.premium),
    })
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    console.error("Error updating prediction:", error);
    throw error;
  }

  return formatPrediction(data);
};


// Update result
export async function updatePredictionResult(
  id,
  homeScore,
  awayScore,
  resultStatus,
  resultAnalysis = ""
) {
  const { data, error } = await supabase
    .from("predictions")
    .update({
      home_score: Number(homeScore),
      away_score: Number(awayScore),
      result_status: resultStatus,
      result_analysis: resultAnalysis,
    })
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    console.error("Error updating prediction result:", error);
    throw error;
  }

  return formatPrediction(data);
};


// Delete a prediction
export async function deletePrediction(id) {
  const { error } = await supabase
    .from("predictions")
    .delete()
    .eq("id", Number(id));

  if (error) {
    console.error("Error deleting prediction:", error);
    throw error;
  }

  return getPredictions();
};


// Get one prediction
export async function getPredictionById(id) {
  const { data, error } = await supabase
    .from("predictions")
    .select("*")
    .eq("id", Number(id))
    .single();

  if (error) {
    console.error("Error fetching prediction:", error);
    throw error;
  }

  return formatPrediction(data);
}
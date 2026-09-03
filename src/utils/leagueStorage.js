import { supabase } from "../lib/supabase";

// Get all leagues
export async function getLeagues() {
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching leagues:", error);
    throw error;
  }

  return data;
}

// Add league
export async function addLeague(league) {
  const { data, error } = await supabase
    .from("leagues")
    .insert({
      name: league.name,
      country: league.country,
      logo: league.logo || null,
      api_league_id: league.api_league_id
        ? Number(league.api_league_id)
        : null,
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding league:", error);
    throw error;
  }

  return data;
}

// Update league
export async function updateLeague(id, league) {
  const { data, error } = await supabase
    .from("leagues")
    .update({
      name: league.name,
      country: league.country,
      logo: league.logo || null,
      api_league_id: league.api_league_id
        ? Number(league.api_league_id)
        : null,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Error updating league:", error);
    throw error;
  }

  return data;
}

// Delete league
export async function deleteLeague(id) {
  const { error } = await supabase
    .from("leagues")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting league:", error);
    throw error;
  }
}
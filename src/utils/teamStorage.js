import { supabase } from "../lib/supabase";

// Convert Supabase row → React team
const formatTeam = (item) => ({
  id: item.id,
  name: item.name,
  logo: item.logo,
  leagueId: item.league_id,
});

// Get all teams
export async function getTeams() {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching teams:", error);
    throw error;
  }

  return data.map(formatTeam);
}

// Get teams belonging to one league
export async function getTeamsByLeague(leagueId) {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("league_id", Number(leagueId))
    .order("name", { ascending: true });

  if (error) {
    console.error("Error fetching league teams:", error);
    throw error;
  }

  return data.map(formatTeam);
}

// Add team
export async function addTeam(team) {
  const { data, error } = await supabase
    .from("teams")
    .insert({
      name: team.name,
      logo: team.logo,
      league_id: Number(team.league_id),
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding team:", error);
    throw error;
  }

  return formatTeam(data);
}

// Delete team
export async function deleteTeam(id) {
  const { error } = await supabase
    .from("teams")
    .delete()
    .eq("id", Number(id));

  if (error) {
    console.error("Error deleting team:", error);
    throw error;
  }
}

// Add multiple teams
export async function addTeams(teams) {
  const rows = teams.map((team) => ({
    name: team.name,
    logo: team.logo || null,
    league_id: Number(team.league_id),
  }));

  const { data, error } = await supabase
    .from("teams")
    .insert(rows)
    .select();

  if (error) {
    console.error("Error adding teams:", error);
    throw error;
  }

  return data.map(formatTeam);
}

// Update team logo
export async function updateTeamLogo(id, logo) {
  const { data, error } = await supabase
    .from("teams")
    .update({ logo })
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    console.error("Error updating team logo:", error);
    throw error;
  }

  return formatTeam(data);
}
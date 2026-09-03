import { getTeams } from "../utils/apiFootball";

export async function getLeagueTeams(leagueId, season = 2024) {
  try {
    const teams = await getTeams(leagueId, season);

    return teams.map((item) => ({
      id: item.team.id,
      name: item.team.name,
      logo: item.team.logo,
      leagueId,
    }));
  } catch (error) {
    console.error("Failed to load league teams:", error);
    return [];
  }
}
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 ,RefreshCw } from "lucide-react";

import { getLeagues } from "../../utils/leagueStorage";
import {
  getTeamsByLeague,
  addTeams,
  deleteTeam,
  updateTeamLogo,
} from "../../utils/teamStorage";

import {
  getTeams,
  searchTeams,
} from "../../utils/apiFootball";


const championsLeague2026Teams = [
  { name: "AEK Athens", aliases: ["AEK Athens"] },
  { name: "Arsenal", aliases: ["Arsenal"] },
  { name: "Aston Villa", aliases: ["Aston Villa"] },
  {
    name: "Atletico Madrid",
    aliases: ["Atletico Madrid", "Atlético de Madrid", "Atleti"],
  },
  { name: "Barcelona", aliases: ["Barcelona", "FC Barcelona"] },
  {
    name: "Bayern Munich",
    aliases: ["Bayern Munich", "Bayern München", "Bayern Munchen"],
  },
  {
    name: "Bodo/Glimt",
    aliases: ["Bodo/Glimt", "Bodø/Glimt", "Bodo Glimt", "Bodoe/Glimt"],
  },
  {
    name: "Borussia Dortmund",
    aliases: ["Borussia Dortmund", "Dortmund", "B. Dortmund"],
  },
  { name: "Club Brugge", aliases: ["Club Brugge", "Club Brugge KV"] },
  { name: "Como", aliases: ["Como", "Como 1907"] },
  { name: "Fenerbahce", aliases: ["Fenerbahce", "Fenerbahçe"] },
  { name: "Feyenoord", aliases: ["Feyenoord"] },
  { name: "Galatasaray", aliases: ["Galatasaray"] },
  {
    name: "Inter Milan",
    aliases: ["Inter Milan", "Inter", "Inter Milano", "Internazionale"],
  },
  { name: "LASK", aliases: ["LASK", "LASK Linz"] },
  {
    name: "RB Leipzig",
    aliases: ["RB Leipzig", "Leipzig", "RasenBallsport Leipzig"],
  },
  { name: "Lens", aliases: ["Lens", "RC Lens"] },
  { name: "Lille", aliases: ["Lille", "Lille OSC"] },
  { name: "Liverpool", aliases: ["Liverpool", "Liverpool FC"] },
  {
    name: "Manchester City",
    aliases: ["Manchester City", "Man City"],
  },
  {
    name: "Manchester United",
    aliases: ["Manchester United", "Man United", "Man Utd"],
  },
  { name: "Napoli", aliases: ["Napoli", "SSC Napoli"] },
  {
    name: "Paris Saint-Germain",
    aliases: [
      "Paris Saint-Germain",
      "Paris",
      "PSG",
      "Paris SG",
      "Paris Saint Germain",
    ],
  },
  { name: "Porto", aliases: ["Porto", "FC Porto"] },
  {
    name: "PSV Eindhoven",
    aliases: ["PSV Eindhoven", "PSV"],
  },
  { name: "Real Betis", aliases: ["Real Betis", "Real Betis Balompie"] },
  { name: "Real Madrid", aliases: ["Real Madrid", "Real Madrid CF"] },
  { name: "Roma", aliases: ["Roma", "AS Roma"] },
  { name: "Sabah", aliases: ["Sabah", "Sabah FC"] },
  {
    name: "Shakhtar Donetsk",
    aliases: ["Shakhtar Donetsk", "Shakhtar"],
  },
  {
    name: "Slavia Prague",
    aliases: ["Slavia Prague", "Slavia Praha"],
  },
  {
    name: "Slovan Bratislava",
    aliases: ["Slovan Bratislava", "Slovan"],
  },
  {
    name: "Sporting CP",
    aliases: [
      "Sporting CP",
      "Sporting Lisbon",
      "Sporting Clube de Portugal",
    ],
  },
  {
    name: "Stuttgart",
    aliases: ["Stuttgart", "VfB Stuttgart"],
  },
  { name: "Viking", aliases: ["Viking", "Viking FK"] },
  { name: "Villarreal", aliases: ["Villarreal", "Villarreal CF"] },
];

const normalizeTeamName = (name) => {
  return String(name || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
};


function AdminTeams() {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);

  const [selectedLeague, setSelectedLeague] = useState("");
const selectedLeagueData = leagues.find(
  (league) => String(league.id) === String(selectedLeague)
);
  const [loadingLeagues, setLoadingLeagues] = useState(true);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  // Load leagues
  useEffect(() => {
    const loadLeagues = async () => {
      try {
        setLoadingLeagues(true);

        const data = await getLeagues();

        setLeagues(data);

        if (data.length > 0) {
          setSelectedLeague(String(data[0].id));
        }
      } catch (error) {
        console.error("Failed to load leagues:", error);
        setError("Failed to load leagues.");
      } finally {
        setLoadingLeagues(false);
      }
    };

    loadLeagues();
  }, []);

  // Load teams when league changes
  useEffect(() => {
    if (!selectedLeague) {
      setTeams([]);
      return;
    }

    const loadTeams = async () => {
      try {
        setLoadingTeams(true);
        setError("");

        const data = await getTeamsByLeague(selectedLeague);

        setTeams(data);
      } catch (error) {
        console.error("Failed to load teams:", error);
        setError("Failed to load teams.");
        setTeams([]);
      } finally {
        setLoadingTeams(false);
      }
    };

    loadTeams();
  }, [selectedLeague]);

  // Import all teams for selected league
 const handleImportTeams = async () => {
  if (!selectedLeague) {
    setError("Please select a league.");
    return;
  }

  const selectedLeagueData = leagues.find(
    (league) =>
      String(league.id) === String(selectedLeague)
  );

  if (!selectedLeagueData) {
    setError("League not found.");
    return;
  }

  if (!selectedLeagueData.api_league_id) {
    setError(
      `API league ID is not configured for ${selectedLeagueData.name}.`
    );
    return;
  }

  try {
    setSaving(true);
    setError("");

    // API-Football uses the API league ID
    const apiLeagueId = selectedLeagueData.api_league_id;

    // API-Football Free plan supports seasons up to 2024
    const season = 2026;

    // Get teams from API-Football
    const apiTeams = await getTeams(
      apiLeagueId,
      season
    );

    if (!apiTeams || apiTeams.length === 0) {
      setError(
        `No teams found for ${selectedLeagueData.name}.`
      );
      return;
    }

    // Get teams already stored in Supabase
    const existingTeams =
      await getTeamsByLeague(selectedLeague);

    const existingNames = new Set(
      existingTeams.map((team) =>
        team.name.toLowerCase()
      )
    );

    // Convert API teams → Supabase teams
    const newTeams = apiTeams
      .filter(
        (item) =>
          item.team &&
          !existingNames.has(
            item.team.name.toLowerCase()
          )
      )
      .map((item) => ({
        name: item.team.name,
        logo: item.team.logo || "",
        league_id: selectedLeague,
      }));

    if (newTeams.length === 0) {
      setError(
        `${selectedLeagueData.name} teams have already been imported.`
      );
      return;
    }

    // Save teams to Supabase
    const addedTeams = await addTeams(newTeams);

    setTeams((current) =>
      [...current, ...addedTeams].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );
  } catch (error) {
    console.error(
      "Failed to import teams:",
      error
    );

    setError(
      "Failed to import teams. Check the console for details."
    );
  } finally {
    setSaving(false);
  }
};

// Import official 2026/27 Champions League teams
const handleImportChampionsLeague2026 = async () => {
  if (!selectedLeague) {
    alert("Please select the Champions League first.");
    return;
  }

  if (!selectedLeagueData) {
    alert("Champions League data could not be found.");
    return;
  }

  const confirmed = window.confirm(
    "This will clean the Champions League teams and keep only the official 36 teams for 2026/27.\n\n" +
      "Extra Champions League teams will be deleted.\n" +
      "Other leagues will NOT be affected.\n\n" +
      "Do you want to continue?"
  );

  if (!confirmed) return;

  try {
    setSaving(true);
    setError("");

    // Get all current teams in the selected league
    const currentTeams = await getTeamsByLeague(selectedLeague);

    const officialTeams = championsLeague2026Teams;

    // Find teams that already exist
    const existingOfficialTeams = officialTeams.filter((officialTeam) => {
      return currentTeams.some((currentTeam) => {
        const currentName = normalizeTeamName(currentTeam.name);

        return officialTeam.aliases.some(
          (alias) => normalizeTeamName(alias) === currentName
        );
      });
    });

    // Find teams that need to be added
    const missingTeams = officialTeams.filter((officialTeam) => {
      return !currentTeams.some((currentTeam) => {
        const currentName = normalizeTeamName(currentTeam.name);

        return officialTeam.aliases.some(
          (alias) => normalizeTeamName(alias) === currentName
        );
      });
    });

    // Find unwanted teams
    const unwantedTeams = currentTeams.filter((currentTeam) => {
      const currentName = normalizeTeamName(currentTeam.name);

      return !officialTeams.some((officialTeam) =>
        officialTeam.aliases.some(
          (alias) => normalizeTeamName(alias) === currentName
        )
      );
    });

    console.log("Current Champions League teams:", currentTeams.length);
    console.log("Official teams:", officialTeams.length);
    console.log("Teams already correct:", existingOfficialTeams.length);
    console.log("Missing teams:", missingTeams);
    console.log("Unwanted teams:", unwantedTeams);

    // Delete unwanted teams
    for (const team of unwantedTeams) {
      await deleteTeam(team.id);
    }

    // Add missing official teams
    if (missingTeams.length > 0) {
      const teamsToAdd = missingTeams.map((team) => ({
        name: team.name,
        league_id: selectedLeague,
        logo: "",
      }));

      await addTeams(teamsToAdd);
    }

    // Reload the teams
    const updatedTeams = await getTeamsByLeague(selectedLeague);
    setTeams(updatedTeams);

    alert(
      `Champions League cleaned successfully!\n\n` +
        `Official teams: ${officialTeams.length}\n` +
        `Removed: ${unwantedTeams.length}\n` +
        `Added: ${missingTeams.length}`
    );
  } catch (err) {
    console.error("Failed to clean Champions League teams:", err);

    setError(
      err?.message || "Failed to clean Champions League teams."
    );

    alert("Failed to clean Champions League teams. Check the console.");
  } finally {
    setSaving(false);
  }
};

const handleUpdateMissingLogos = async () => {
  if (!selectedLeague) {
    setError("Please select a league.");
    return;
  }

  try {
    setSaving(true);
    setError("");

    const leagueTeams = await getTeamsByLeague(selectedLeague);

    const teamsWithoutLogos = leagueTeams.filter(
      (team) => !team.logo
    );

    if (teamsWithoutLogos.length === 0) {
      setError("All teams already have logos.");
      return;
    }

    let updatedCount = 0;

    for (const team of teamsWithoutLogos) {
      try {
        console.log(`Searching logo for: ${team.name}`);

        const results = await searchTeams(team.name);

        console.log(`API results for ${team.name}:`, results);

        if (!results || results.length === 0) {
          console.log(`No API result found for ${team.name}`);
          continue;
        }

        const databaseName = normalizeTeamName(team.name);

        // Find the closest matching team
        const match =
          results.find((item) => {
            const apiName = normalizeTeamName(
              item.team?.name
            );

            return (
              apiName === databaseName ||
              apiName.includes(databaseName) ||
              databaseName.includes(apiName)
            );
          }) || results[0];

        const logo = match?.team?.logo;

        if (!logo) {
          console.log(`No logo found for ${team.name}`);
          continue;
        }

        console.log(
          `Updating ${team.name} with logo:`,
          logo
        );

        const updatedTeam = await updateTeamLogo(
          team.id,
          logo
        );

        setTeams((current) =>
          current.map((item) =>
            item.id === updatedTeam.id
              ? updatedTeam
              : item
          )
        );

        updatedCount++;
      } catch (error) {
        console.error(
          `Failed to update logo for ${team.name}:`,
          error
        );
      }
    }

    if (updatedCount === 0) {
      setError(
        "No team logos were updated. Check the browser console for API results."
      );
    } else {
      setError(
        `${updatedCount} team logo${
          updatedCount !== 1 ? "s" : ""
        } updated successfully.`
      );
    }
  } catch (error) {
    console.error(
      "Failed to update team logos:",
      error
    );

    setError(
      "Failed to update team logos. Check the console for details."
    );
  } finally {
    setSaving(false);
  }
};

  // Delete team
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this team?"
    );

    if (!confirmed) return;

    try {
      setError("");

      await deleteTeam(id);

      setTeams((current) =>
        current.filter((team) => team.id !== id)
      );
    } catch (error) {
      console.error("Failed to delete team:", error);
      setError("Failed to delete team.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b0f] text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-lime-400"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="mt-6">
            <h1 className="text-3xl font-black">
              Manage Teams
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Import and manage teams for each football league.
            </p>
          </div>

        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">

            {/* Import Teams */}
            <div className="h-fit rounded-2xl border border-white/10 bg-[#10171e] p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                  <Plus size={20} />
                </div>

                <div>
                  <h2 className="font-black">
                    Import Teams
                  </h2>

                  <p className="text-xs text-gray-500">
                    Import teams for a league
                  </p>
                </div>

              </div>

              {/* League */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  League
                </label>

                <select
                  value={selectedLeague}
                  onChange={(e) =>
                    setSelectedLeague(e.target.value)
                  }
                  disabled={loadingLeagues}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40 disabled:opacity-50"
                >
                  {loadingLeagues ? (
                    <option>
                      Loading leagues...
                    </option>
                  ) : leagues.length === 0 ? (
                    <option>
                      No leagues available
                    </option>
                  ) : (
                    leagues.map((league) => (
                      <option
                        key={league.id}
                        value={league.id}
                      >
                        {league.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              {/* Import Button */}
              <div className="mt-6">

                <button
                  type="button"
                  onClick={handleImportTeams}
                  disabled={
                    saving ||
                    loadingLeagues ||
                    !selectedLeague
                  }
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lime-400 text-sm font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Plus size={17} />

                  {saving
                    ? "Importing..."
                    : "Import League Teams"}
                </button>
{selectedLeagueData?.api_league_id === 2 && (
  <button
    type="button"
    onClick={handleImportChampionsLeague2026}
    disabled={saving || loadingLeagues || !selectedLeague}
    className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-lime-400/30 bg-lime-400/10 text-sm font-black text-lime-400 transition hover:bg-lime-400/20 disabled:cursor-not-allowed disabled:opacity-60"
  >
    {saving ? "Cleaning..." : "Clean Champions League Teams"}
  </button>
)}

<button
  type="button"
  onClick={handleUpdateMissingLogos}
  disabled={saving || loadingLeagues || !selectedLeague}
  className="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-blue-400/10 text-sm font-black text-blue-400 transition hover:bg-blue-400/20 disabled:cursor-not-allowed disabled:opacity-60"
>
  {saving ? "Updating Logos..." : "Update Missing Logos"}
</button>




                <p className="mt-3 text-center text-xs text-gray-500">
                  Import all available teams for the
                  selected league.
                </p>

              </div>

            </div>

            {/* Teams */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e]">

              <div className="border-b border-white/10 px-6 py-5">

                <div className="flex items-center justify-between gap-4">

                  <div>
                    <h2 className="font-black">
                      Teams
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {teams.length} team
                      {teams.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <select
                    value={selectedLeague}
                    onChange={(e) =>
                      setSelectedLeague(e.target.value)
                    }
                    className="rounded-lg border border-white/10 bg-[#070b0f] px-3 py-2 text-xs text-gray-300 outline-none"
                  >
                    {leagues.map((league) => (
                      <option
                        key={league.id}
                        value={league.id}
                      >
                        {league.name}
                      </option>
                    ))}
                  </select>

                </div>

              </div>

              {loadingTeams ? (

                <div className="px-6 py-16 text-center text-sm text-gray-500">
                  Loading teams...
                </div>

              ) : teams.length === 0 ? (

                <div className="px-6 py-16 text-center">

                  <p className="text-sm text-gray-500">
                    No teams added to this league yet.
                  </p>

                </div>

              ) : (

                <div className="divide-y divide-white/5">

                  {teams.map((team) => (

                    <div
                      key={team.id}
                      className="flex items-center justify-between gap-4 px-6 py-4"
                    >

                      <div className="flex items-center gap-4">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5">

                          {team.logo ? (
                            <img
                              src={team.logo}
                              alt={`${team.name} logo`}
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">
                              —
                            </span>
                          )}

                        </div>

                        <p className="font-bold">
                          {team.name}
                        </p>

                      </div>

                      <button
                        onClick={() =>
                          handleDelete(team.id)
                        }
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-red-500/10 hover:text-red-400"
                        title="Delete team"
                      >
                        <Trash2 size={17} />
                      </button>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default AdminTeams;
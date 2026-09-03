import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

import { getLeagues } from "../../utils/leagueStorage";
import {
  getTeamsByLeague,
  addTeams,
  deleteTeam,
} from "../../utils/teamStorage";
import { getTeams } from "../../utils/apiFootball";





function AdminTeams() {
  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);

  const [selectedLeague, setSelectedLeague] = useState("");

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
    const season = 2024;

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
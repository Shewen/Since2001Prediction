import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import { addPrediction } from "../../utils/predictionStorage";
import { getTeamsByLeague } from "../../utils/teamStorage";
import { getLeagues } from "../../utils/leagueStorage";
import { useEffect, useState } from "react";

function AddPrediction() {
  const navigate = useNavigate();

  const [leagues, setLeagues] = useState([]);
  const [teams, setTeams] = useState([]);

  const [leaguesLoading, setLeaguesLoading] = useState(true);
  const [teamsLoading, setTeamsLoading] = useState(false);

  const [form, setForm] = useState({
    league: "",
    date: "",
    time: "",
    homeTeam: "",
    awayTeam: "",
    prediction: "",
    confidence: 50,
    premium: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load leagues
  useEffect(() => {
    const loadLeagues = async () => {
      try {
        const data = await getLeagues();
        setLeagues(data);
      } catch (error) {
        console.error("Failed to load leagues:", error);
        setError("Failed to load leagues.");
      } finally {
        setLeaguesLoading(false);
      }
    };

    loadLeagues();
  }, []);

  // Load teams when league changes
  useEffect(() => {
    const loadTeams = async () => {
      if (!form.league) {
        setTeams([]);
        return;
      }

      try {
        setTeamsLoading(true);
        setError("");

        const data = await getTeamsByLeague(form.league);

        setTeams(data);
      } catch (error) {
        console.error("Failed to load teams:", error);
        setError("Failed to load teams.");
        setTeams([]);
      } finally {
        setTeamsLoading(false);
      }
    };

    loadTeams();
  }, [form.league]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "league") {
      setForm((previous) => ({
        ...previous,
        league: value,
        homeTeam: "",
        awayTeam: "",
      }));

      return;
    }

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.league ||
      !form.time ||
      !form.homeTeam ||
      !form.awayTeam ||
      !form.prediction.trim() ||
      !form.confidence
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.homeTeam === form.awayTeam) {
      setError("Home team and away team cannot be the same.");
      return;
    }

    try {
      setLoading(true);

      const selectedLeague = leagues.find(
        (league) =>
          String(league.id) === String(form.league)
      );

      const homeTeamData = teams.find(
        (team) =>
          String(team.id) === String(form.homeTeam)
      );

      const awayTeamData = teams.find(
        (team) =>
          String(team.id) === String(form.awayTeam)
      );

      await addPrediction({
        fixtureId: null,

        league: selectedLeague?.name || "",
        date: form.date,
        time: form.time,

        homeTeam: homeTeamData?.name || "",
        awayTeam: awayTeamData?.name || "",

        // Owner can type ANY prediction
        prediction: form.prediction.trim(),

        confidence: Number(form.confidence),

        premium: form.premium,

        homeLogo: homeTeamData?.logo || "",
        awayLogo: awayTeamData?.logo || "",
      });

      navigate("/admin");
    } catch (error) {
      console.error(
        "Failed to add prediction:",
        error
      );

      setError(
        "Failed to add prediction. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b0f] text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-lime-400"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <h1 className="mt-6 text-3xl font-black">
            Add Prediction
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Create a new football prediction.
          </p>

        </div>
      </section>

      {/* Form */}
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">

          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-white/10 bg-[#10171e] p-6 sm:p-8"
          >

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">

              {/* League */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  League
                </label>

                <select
                  name="league"
                  value={form.league}
                  onChange={handleChange}
                  required
                  disabled={leaguesLoading}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40 disabled:opacity-50"
                >
                  <option value="">
                    {leaguesLoading
                      ? "Loading leagues..."
                      : "Select league"}
                  </option>

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

              {/* Date */}
              {/* Date */}
<div>
  <label className="mb-2 block text-sm font-semibold text-gray-300">
    Date
  </label>

  <input
    type="date"
    name="date"
    value={form.date}
    onChange={handleChange}
    required
    className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 py-3 text-sm text-white outline-none focus:border-lime-400/40"
  />
</div>

              {/* Time */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Match Time
                </label>

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 py-3 text-sm text-white outline-none focus:border-lime-400/40"
                />
              </div>

              {/* Home Team */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Home Team
                </label>

                <select
                  name="homeTeam"
                  value={form.homeTeam}
                  onChange={handleChange}
                  required
                  disabled={
                    !form.league || teamsLoading
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40 disabled:opacity-50"
                >
                  <option value="">
                    {!form.league
                      ? "Select league first"
                      : teamsLoading
                      ? "Loading teams..."
                      : teams.length === 0
                      ? "No teams found"
                      : "Select home team"}
                  </option>

                  {teams.map((team) => (
                    <option
                      key={team.id}
                      value={team.id}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Away Team */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Away Team
                </label>

                <select
                  name="awayTeam"
                  value={form.awayTeam}
                  onChange={handleChange}
                  required
                  disabled={
                    !form.league || teamsLoading
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40 disabled:opacity-50"
                >
                  <option value="">
                    {!form.league
                      ? "Select league first"
                      : teamsLoading
                      ? "Loading teams..."
                      : teams.length === 0
                      ? "No teams found"
                      : "Select away team"}
                  </option>

                  {teams.map((team) => (
                    <option
                      key={team.id}
                      value={team.id}
                    >
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prediction */}
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Prediction
                </label>

                <input
                  type="text"
                  name="prediction"
                  value={form.prediction}
                  onChange={handleChange}
                  placeholder="e.g. Manchester United to Win"
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Type any prediction you want.
                </p>
              </div>

              {/* Confidence */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Confidence (%)
                </label>

                <input
                  type="number"
                  name="confidence"
                  value={form.confidence}
                  onChange={handleChange}
                  min="1"
                  max="100"
                  placeholder="e.g. 85"
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                />
              </div>

              {/* Premium */}
              <div className="flex items-center rounded-xl border border-white/10 bg-[#070b0f] px-4">
                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="premium"
                    checked={form.premium}
                    onChange={handleChange}
                    className="h-5 w-5 accent-lime-400"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-gray-200">
                      Premium Prediction
                    </span>

                    <span className="block text-xs text-gray-500">
                      Mark this prediction as premium.
                    </span>
                  </span>

                </label>
              </div>

            </div>

            {/* Submit */}
            <div className="mt-8 flex justify-end">

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-sm font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {loading
                  ? "Saving..."
                  : "Save Prediction"}
              </button>

            </div>

          </form>

        </div>
      </section>

    </div>
  );
}

export default AddPrediction;
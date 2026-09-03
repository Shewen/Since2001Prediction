import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import { getTeams } from "../../utils/teamStorage";
import {
  getPredictionById,
  updatePrediction,
} from "../../utils/predictionStorage";

function EditPrediction() {

    const [teams, setTeams] = useState([]);
const [loadingTeams, setLoadingTeams] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    league: "",
    date: "Today",
    time: "",
    homeTeam: "",
    awayTeam: "",
    prediction: "",
    confidence: "",
    premium: false,
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);
      setLoadingTeams(true);
      setError("");

      const [predictionData, teamData] = await Promise.all([
        getPredictionById(id),
        getTeams(),
      ]);

      setTeams(teamData);

      setForm({
        league: predictionData.league || "",
        date: predictionData.date || "Today",
        time: predictionData.time || "",
        homeTeam: predictionData.homeTeam || "",
        awayTeam: predictionData.awayTeam || "",
        prediction: predictionData.prediction || "",
        confidence: predictionData.confidence || "",
        premium: predictionData.premium || false,
      });
    } catch (error) {
      console.error("Failed to load prediction:", error);
      setError("Prediction could not be found.");
    } finally {
      setLoading(false);
      setLoadingTeams(false);
    }
  };

  loadData();
}, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

const getTeamById = (teamId) => {
  return teams.find(
    (team) => String(team.id) === String(teamId)
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (
      !form.league ||
      !form.time ||
      !form.homeTeam ||
      !form.awayTeam ||
      !form.prediction ||
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
      setSaving(true);

const home = getTeamById(form.homeTeam);
const away = getTeamById(form.awayTeam);

      await updatePrediction(id, {
  ...form,
  confidence: Number(form.confidence),
  homeLogo: home?.logo || "",
  awayLogo: away?.logo || "",
});

      navigate("/admin");
    } catch (error) {
      console.error("Failed to update prediction:", error);
      setError("Failed to update prediction. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b0f] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-lime-400" />

          <p className="mt-4 text-sm text-gray-500">
            Loading prediction...
          </p>
        </div>
      </div>
    );
  }

  if (error && !form.league) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b0f] px-4 text-white">
        <div className="text-center">
          <h1 className="text-2xl font-black">
            Prediction not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error}
          </p>

          <Link
            to="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

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
            Edit Prediction
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Update the match prediction details.
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

                <input
                  type="text"
                  name="league"
                  value={form.league}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Premier League"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                />
              </div>

              {/* Date */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Date
                </label>

                <select
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40"
                >
                  <option value="Today">Today</option>
                  <option value="Tomorrow">Tomorrow</option>
                </select>
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
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none focus:border-lime-400/40"
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
                    disabled={loadingTeams}
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40"
                >
                  <option value=""> {loadingTeams ? "Loading teams..." : "Select home team"}
</option>

                  {teams.map((team) => (
                    <option key={team.id} value={team.name}>
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
                disabled={loadingTeams}
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40"
                >
                  <option value="">{loadingTeams ? "Loading teams..." : "Select away team"}
</option>

                  {teams.map((team) => (
                    <option key={team.id} value={team.name}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Prediction */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Prediction
                </label>

                <input
                  type="text"
                  name="prediction"
                  value={form.prediction}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Arsenal to Win"
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                />
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
                  required
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none focus:border-lime-400/40"
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

            {/* Buttons */}
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Link
                to="/admin"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3 text-sm font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={18} />

                {saving ? "Saving Changes..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default EditPrediction;
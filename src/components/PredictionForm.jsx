import { useEffect, useState } from "react";
import { getLeagueTeams } from "../data/apiTeams";
import leagues from "../data/leagues";

function PredictionForm() {
  const [leagueId, setLeagueId] = useState("");
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);

  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");

  const [prediction, setPrediction] = useState("");
  const [predictionDetails, setPredictionDetails] = useState("");
  const [confidence, setConfidence] = useState("");
  const [premium, setPremium] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    async function loadTeams() {
      if (!leagueId) {
        setTeams([]);
        return;
      }

      setLoadingTeams(true);

      const data = await getLeagueTeams(
        Number(leagueId),
        2024
      );

      setTeams(data);
      setLoadingTeams(false);

      setHomeTeam("");
      setAwayTeam("");
    }

    loadTeams();
  }, [leagueId]);

  const handleSubmit = () => {
    const newPrediction = {
      leagueId,
      homeTeam,
      awayTeam,
      prediction,
      predictionDetails,
      confidence: Number(confidence),
      premium,
      date,
      time,
    };

    console.log("NEW PREDICTION:", newPrediction);
  };

  return (
    <div className="max-w-2xl rounded-2xl border border-white/10 bg-[#10171e] p-6">

      <h2 className="text-2xl font-black">
        Create Prediction
      </h2>

      {/* League */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-gray-300">
          League
        </label>

        <select
          value={leagueId}
          onChange={(e) => setLeagueId(e.target.value)}
          className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none"
        >
          <option value="">
            Select a league
          </option>

          {leagues.map((league) => (
            <option key={league.id} value={league.id}>
              {league.name} — {league.country}
            </option>
          ))}
        </select>
      </div>

      {/* Teams */}
      {leagueId && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">

          {/* Home Team */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              Home Team
            </label>

            <select
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              disabled={loadingTeams}
              className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none disabled:opacity-50"
            >
              <option value="">
                {loadingTeams
                  ? "Loading teams..."
                  : "Select home team"}
              </option>

              {teams.map((team) => (
                <option key={team.id} value={team.id}>
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
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              disabled={loadingTeams}
              className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none disabled:opacity-50"
            >
              <option value="">
                {loadingTeams
                  ? "Loading teams..."
                  : "Select away team"}
              </option>

              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

        </div>
      )}

      {/* Prediction */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-gray-300">
          Prediction
        </label>

        <select
          value={prediction}
          onChange={(e) => setPrediction(e.target.value)}
          className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none"
        >
          <option value="">Select prediction</option>
          <option value="Home Team to Win">Home Team to Win</option>
          <option value="Away Team to Win">Away Team to Win</option>
          <option value="Draw">Draw</option>
          <option value="Home Team or Draw">Home Team or Draw</option>
          <option value="Away Team or Draw">Away Team or Draw</option>
          <option value="Over 1.5 Goals">Over 1.5 Goals</option>
          <option value="Over 2.5 Goals">Over 2.5 Goals</option>
          <option value="Under 2.5 Goals">Under 2.5 Goals</option>
          <option value="Under 3.5 Goals">Under 3.5 Goals</option>
          <option value="Both Teams to Score">
            Both Teams to Score
          </option>
          <option value="Both Teams Not to Score">
            Both Teams Not to Score
          </option>
          <option value="Home Team to Score">
            Home Team to Score
          </option>
          <option value="Away Team to Score">
            Away Team to Score
          </option>
          <option value="Clean Sheet - Home Team">
            Clean Sheet - Home Team
          </option>
          <option value="Clean Sheet - Away Team">
            Clean Sheet - Away Team
          </option>
          <option value="Exact Score">Exact Score</option>
          <option value="Custom">Custom Prediction</option>
        </select>

        {(prediction === "Exact Score" ||
          prediction === "Custom") && (
          <div className="mt-4">
            <label className="mb-2 block text-sm font-semibold text-gray-300">
              {prediction === "Exact Score"
                ? "Exact Score"
                : "Prediction Details"}
            </label>

            <input
              type="text"
              value={predictionDetails}
              onChange={(e) =>
                setPredictionDetails(e.target.value)
              }
              placeholder={
                prediction === "Exact Score"
                  ? "e.g. 2 - 1"
                  : "Enter your prediction..."
              }
              className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none placeholder:text-gray-600"
            />
          </div>
        )}
      </div>

      {/* Confidence */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-gray-300">
          Confidence (%)
        </label>

        <input
          type="number"
          min="1"
          max="100"
          value={confidence}
          onChange={(e) => setConfidence(e.target.value)}
          placeholder="e.g. 78"
          className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none placeholder:text-gray-600"
        />
      </div>

      {/* Date and Time */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Date
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-300">
            Time
          </label>

          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none"
          />
        </div>

      </div>

      {/* Access */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-semibold text-gray-300">
          Access
        </label>

        <select
          value={premium ? "Premium" : "Free"}
          onChange={(e) =>
            setPremium(e.target.value === "Premium")
          }
          className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-white outline-none"
        >
          <option value="Free">Free</option>
          <option value="Premium">Premium</option>
        </select>
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={handleSubmit}
        className="mt-8 w-full rounded-xl bg-lime-400 px-5 py-3 font-bold text-black transition hover:bg-lime-300"
      >
        Create Prediction
      </button>

    </div>
  );
}

export default PredictionForm;
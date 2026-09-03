import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Save, Trophy } from "lucide-react";

import {
  getPredictions,
  updatePredictionResult,
} from "../../utils/predictionStorage";

function AdminResults() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [results, setResults] = useState({});

  useEffect(() => {
    loadPredictions();
  }, []);

  const loadPredictions = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPredictions();
      setPredictions(data);
    } catch (error) {
      console.error("Failed to load predictions:", error);
      setError("Failed to load predictions.");
    } finally {
      setLoading(false);
    }
  };

  const handleResultChange = (id, field, value) => {
    setResults((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        [field]: value,
      },
    }));
  };

  const handleSaveResult = async (prediction) => {
    const result = results[prediction.id];

    if (
      result?.homeScore === undefined ||
      result?.homeScore === "" ||
      result?.awayScore === undefined ||
      result?.awayScore === ""
    ) {
      setError(
        `Please enter the final score for ${prediction.homeTeam} vs ${prediction.awayTeam}.`
      );
      return;
    }

    if (!result?.status) {
      setError(
        `Please select whether the prediction WON or LOST.`
      );
      return;
    }

    const homeScore = Number(result.homeScore);
    const awayScore = Number(result.awayScore);

    if (
      homeScore < 0 ||
      awayScore < 0 ||
      !Number.isInteger(homeScore) ||
      !Number.isInteger(awayScore)
    ) {
      setError(
        "Scores must be whole numbers greater than or equal to 0."
      );
      return;
    }

    try {
      setSavingId(prediction.id);
      setError("");
      setSuccess("");

      await updatePredictionResult(
        prediction.id,
        homeScore,
        awayScore,
        result.status
      );

      setPredictions((previous) =>
        previous.map((item) =>
          item.id === prediction.id
            ? {
                ...item,
                homeScore,
                awayScore,
                resultStatus: result.status,
              }
            : item
        )
      );

      setSuccess(
        `${prediction.homeTeam} vs ${prediction.awayTeam} has been marked ${result.status.toUpperCase()}.`
      );
    } catch (error) {
      console.error("Failed to save result:", error);
      setError(
        "Failed to save result. Please try again."
      );
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b0f] text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-lime-400"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <Trophy size={24} />
            </div>

            <div>
              <h1 className="text-3xl font-black">
                Manage Results
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Enter final scores and update prediction results.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-xl border border-lime-400/20 bg-lime-400/10 px-4 py-3 text-sm text-lime-300">
              {success}
            </div>
          )}

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-10 text-center text-gray-500">
              Loading predictions...
            </div>
          ) : predictions.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-10 text-center">

              <Trophy
                size={40}
                className="mx-auto mb-4 text-gray-600"
              />

              <h2 className="text-lg font-bold text-gray-300">
                No predictions found
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add some predictions first.
              </p>

            </div>
          ) : (
            <div className="space-y-5">

              {predictions.map((prediction) => {
                const result =
                  results[prediction.id] || {};

                return (
                  <div
                    key={prediction.id}
                    className="rounded-2xl border border-white/10 bg-[#10171e] p-5 sm:p-6"
                  >

                    {/* Match Information */}
                    <div className="flex flex-col gap-6">

                      <div>

                        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
                          <span>
                            {prediction.league}
                          </span>

                          <span>•</span>

                          <span>
                            {prediction.date}
                          </span>

                          {prediction.time && (
                            <>
                              <span>•</span>
                              <span>
                                {prediction.time}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3">

                          {prediction.homeLogo ? (
                            <img
                              src={prediction.homeLogo}
                              alt={prediction.homeTeam}
                              className="h-9 w-9 object-contain"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-white/5" />
                          )}

                          <span className="font-bold text-gray-200">
                            {prediction.homeTeam}
                          </span>

                          <span className="text-gray-600">
                            vs
                          </span>

                          <span className="font-bold text-gray-200">
                            {prediction.awayTeam}
                          </span>

                          {prediction.awayLogo ? (
                            <img
                              src={prediction.awayLogo}
                              alt={prediction.awayTeam}
                              className="h-9 w-9 object-contain"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-full bg-white/5" />
                          )}

                        </div>

                        {/* Prediction */}
                        <div className="mt-4 rounded-xl border border-lime-400/10 bg-lime-400/5 px-4 py-3">

                          <span className="text-xs text-gray-500">
                            Prediction
                          </span>

                          <p className="mt-1 text-sm font-bold text-lime-400">
                            {prediction.prediction}
                          </p>

                        </div>

                      </div>

                      {/* Existing Result */}
                      {prediction.homeScore !== null &&
                      prediction.homeScore !== undefined &&
                      prediction.awayScore !== null &&
                      prediction.awayScore !== undefined ? (
                        <div className="rounded-xl border border-white/10 bg-[#070b0f] px-4 py-4">

                          <p className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                            Current Result
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-3">

                            <span className="text-2xl font-black">
                              {prediction.homeScore} -{" "}
                              {prediction.awayScore}
                            </span>

                            {prediction.resultStatus && (
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-black uppercase ${
                                  prediction.resultStatus === "won"
                                    ? "bg-lime-400/10 text-lime-400"
                                    : prediction.resultStatus === "lost"
                                    ? "bg-red-400/10 text-red-400"
                                    : "bg-yellow-400/10 text-yellow-400"
                                }`}
                              >
                                {prediction.resultStatus}
                              </span>
                            )}

                          </div>

                        </div>
                      ) : null}

                      {/* Result Form */}
                      <div className="rounded-xl border border-white/10 bg-[#070b0f] p-4">

                        <p className="mb-4 text-sm font-bold text-gray-300">
                          Enter Final Result
                        </p>

                        <div className="flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-end">

                          {/* Home Score */}
                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                              {prediction.homeTeam} Score
                            </label>

                            <input
                              type="number"
                              min="0"
                              value={
                                result.homeScore ?? ""
                              }
                              onChange={(e) =>
                                handleResultChange(
                                  prediction.id,
                                  "homeScore",
                                  e.target.value
                                )
                              }
                              className="h-11 w-24 rounded-xl border border-white/10 bg-[#10171e] px-3 text-center text-white outline-none focus:border-lime-400/40"
                            />
                          </div>

                          {/* Away Score */}
                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                              {prediction.awayTeam} Score
                            </label>

                            <input
                              type="number"
                              min="0"
                              value={
                                result.awayScore ?? ""
                              }
                              onChange={(e) =>
                                handleResultChange(
                                  prediction.id,
                                  "awayScore",
                                  e.target.value
                                )
                              }
                              className="h-11 w-24 rounded-xl border border-white/10 bg-[#10171e] px-3 text-center text-white outline-none focus:border-lime-400/40"
                            />
                          </div>

                          {/* Prediction Result */}
                          <div>
                            <label className="mb-2 block text-xs font-semibold text-gray-500">
                              Prediction Result
                            </label>

                            <select
                              value={
                                result.status || ""
                              }
                              onChange={(e) =>
                                handleResultChange(
                                  prediction.id,
                                  "status",
                                  e.target.value
                                )
                              }
                              className="h-11 w-36 rounded-xl border border-white/10 bg-[#10171e] px-3 text-sm text-white outline-none focus:border-lime-400/40"
                            >
                              <option value="">
                                Select result
                              </option>

                              <option value="won">
                                Won
                              </option>

                              <option value="lost">
                                Lost
                              </option>
                            </select>
                          </div>

                          {/* Save */}
                          <button
                            type="button"
                            onClick={() =>
                              handleSaveResult(
                                prediction
                              )
                            }
                            disabled={
                              savingId === prediction.id
                            }
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 text-sm font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            <Save size={16} />

                            {savingId === prediction.id
                              ? "Saving..."
                              : "Save Result"}
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </section>

    </div>
  );
}

export default AdminResults;
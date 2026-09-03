import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Lock,
  TrendingUp,
  Plus,
  Check,
} from "lucide-react";

import { getPredictions } from "../utils/predictionStorage";
import { usePicks } from "../context/PicksContext";

function PredictionDetails() {
  const { id } = useParams();

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { addPick, removePick, isPicked, picks } = usePicks();

  useEffect(() => {
    loadPrediction();
  }, [id]);

  const loadPrediction = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPredictions();

      const found = data.find(
        (item) => String(item.id) === String(id)
      );

      setPrediction(found || null);
    } catch (err) {
      console.error("Failed to load prediction:", err);
      setError("Failed to load prediction.");
    } finally {
      setLoading(false);
    }
  };

  const picked = prediction
    ? isPicked(prediction.id)
    : false;

  const pickNumber = prediction
    ? picks.findIndex(
        (pick) => pick.id === prediction.id
      ) + 1
    : 0;

  const handleAddPick = () => {
    if (!prediction || !prediction.prediction) return;

    addPick({
      id: prediction.id,
      league: prediction.league,
      date: prediction.date,
      time: prediction.time,
      homeTeam: prediction.homeTeam,
      awayTeam: prediction.awayTeam,
      homeLogo: prediction.homeLogo,
      awayLogo: prediction.awayLogo,
      prediction: prediction.prediction,
      predictionType: "prediction",
      confidence: prediction.confidence,
      premium: prediction.premium,
    });
  };

  const handleRemovePick = () => {
    if (!prediction) return;

    removePick(prediction.id);
  };

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#070b0f] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-lime-400" />

          <p className="text-sm text-gray-500">
            Loading prediction...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#070b0f] px-4">
        <div className="text-center">
          <h1 className="text-2xl font-black text-white">
            Something went wrong
          </h1>

          <p className="mt-3 text-gray-500">
            {error}
          </p>

          <Link
            to="/predictions"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-bold text-black transition hover:bg-lime-300"
          >
            <ArrowLeft size={17} />
            Back to Predictions
          </Link>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#070b0f] px-4">
        <div className="text-center">
          <h1 className="text-3xl font-black text-white">
            Prediction not found
          </h1>

          <p className="mt-3 text-gray-500">
            This prediction may have been removed or is no longer available.
          </p>

          <Link
            to="/predictions"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-bold text-black transition hover:bg-lime-300"
          >
            <ArrowLeft size={17} />
            Back to Predictions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b0f]">

      {/* Header */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

          <Link
            to="/predictions"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-lime-400"
          >
            <ArrowLeft size={16} />
            Back to Predictions
          </Link>

          <div className="mt-8 flex items-center justify-between gap-4">

            <div>
              <p className="text-sm font-black uppercase tracking-widest text-lime-400">
                {prediction.league}
              </p>

              <h1 className="mt-2 text-3xl font-black sm:text-4xl">
                Match Prediction
              </h1>
            </div>

            {prediction.premium ? (
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-yellow-400/10 px-3 py-2 text-xs font-bold text-yellow-400">
                <Lock size={13} />
                PREMIUM
              </span>
            ) : (
              <span className="shrink-0 rounded-full bg-lime-400/10 px-3 py-2 text-xs font-bold text-lime-400">
                FREE
              </span>
            )}

          </div>
        </div>
      </section>

      {/* Main */}
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#10171e]">

          {/* Match information */}
          <div className="border-b border-white/10 px-5 py-6 sm:px-8">

            <div className="flex flex-wrap justify-center gap-5 text-xs text-gray-500">

              <span className="flex items-center gap-2">
                <Calendar size={14} />
                {prediction.date}
              </span>

              {prediction.time && (
                <span className="flex items-center gap-2">
                  <Clock size={14} />
                  {prediction.time}
                </span>
              )}

            </div>

            {/* Teams */}
            <div className="mt-10 flex items-center justify-center gap-5 sm:gap-14">

              {/* Home */}
              <div className="w-28 text-center sm:w-36">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 sm:h-24 sm:w-24">

                  {prediction.homeLogo ? (
                    <img
                      src={prediction.homeLogo}
                      alt={`${prediction.homeTeam} logo`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-600">
                      No logo
                    </span>
                  )}

                </div>

                <h2 className="mt-4 text-base font-black sm:text-lg">
                  {prediction.homeTeam}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Home
                </p>

              </div>

              {/* VS */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5">
                <span className="text-xs font-black text-gray-500">
                  VS
                </span>
              </div>

              {/* Away */}
              <div className="w-28 text-center sm:w-36">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/5 p-3 sm:h-24 sm:w-24">

                  {prediction.awayLogo ? (
                    <img
                      src={prediction.awayLogo}
                      alt={`${prediction.awayTeam} logo`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="text-xs text-gray-600">
                      No logo
                    </span>
                  )}

                </div>

                <h2 className="mt-4 text-base font-black sm:text-lg">
                  {prediction.awayTeam}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Away
                </p>

              </div>

            </div>

          </div>

          {/* Prediction */}
          <div className="px-5 py-7 sm:px-8">

            <div className="rounded-2xl border border-lime-400/20 bg-lime-400/5 p-5">

              <div className="flex items-center justify-between gap-4">

                <div className="flex items-center gap-2">
                  <TrendingUp
                    size={18}
                    className="text-lime-400"
                  />

                  <span className="text-xs font-black uppercase tracking-widest text-lime-400">
                    Prediction
                  </span>
                </div>

                <span className="text-sm font-black text-lime-400">
                  {prediction.confidence}%
                </span>

              </div>

              {prediction.premium ? (

                <div className="mt-5">

                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/10">
                      <Lock
                        size={18}
                        className="text-yellow-400"
                      />
                    </div>

                    <div>
                      <h3 className="font-black text-yellow-400">
                        Premium Prediction
                      </h3>

                      <p className="mt-1 text-xs text-gray-500">
                        This prediction is available as premium content.
                      </p>
                    </div>

                  </div>

                </div>

              ) : (

                <h2 className="mt-5 text-2xl font-black text-white sm:text-3xl">
                  {prediction.prediction}
                </h2>

              )}

              {/* Confidence */}
              <div className="mt-5">

                <div className="mb-2 flex justify-between text-xs text-gray-500">
                  <span>Confidence</span>
                  <span>{prediction.confidence}%</span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/10">

                  <div
                    className="h-full rounded-full bg-lime-400 transition-all"
                    style={{
                      width: `${prediction.confidence}%`,
                    }}
                  />

                </div>

              </div>

              {/* Add to My Picks */}
              {!prediction.premium && prediction.prediction && (
                <button
                  type="button"
                  onClick={
                    picked
                      ? handleRemovePick
                      : handleAddPick
                  }
                  className={`mt-6 flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-black transition ${
                    picked
                      ? "border border-lime-400/30 bg-lime-400/10 text-lime-400"
                      : "bg-lime-400 text-black hover:bg-lime-300"
                  }`}
                >
                  {picked ? (
                    <>
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-400 text-black">
                        <Check size={14} />
                      </span>

                      Pick #{pickNumber} — Added to My Picks
                    </>
                  ) : (
                    <>
                      <Plus size={17} />
                      Add to My Picks
                    </>
                  )}
                </button>
              )}

            </div>

            {/* Analysis */}
            <div className="mt-8">

              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-widest text-lime-400">
                  Match Analysis
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  Why this prediction?
                </h2>
              </div>

              {prediction.premium ? (

                <div className="rounded-2xl border border-yellow-400/20 bg-yellow-400/5 p-6">

                  <Lock
                    size={24}
                    className="text-yellow-400"
                  />

                  <h3 className="mt-4 text-lg font-black">
                    Premium Analysis
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    The detailed analysis for this prediction is available
                    as premium content.
                  </p>

                </div>

              ) : (

                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">

                  <p className="text-sm leading-7 text-gray-400">
                    Our prediction is based on the available match
                    information, team form and other relevant factors.
                    Detailed analysis will be added by the prediction
                    administrator.
                  </p>

                </div>

              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}

export default PredictionDetails;
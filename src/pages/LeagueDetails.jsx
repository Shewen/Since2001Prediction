
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Trophy,
} from "lucide-react";

import { getPredictions } from "../utils/predictionStorage";
import { getLeagues } from "../utils/leagueStorage";
import PredictionCard from "../components/PredictionCard";

function normalizeLeagueName(name = "") {
  const value = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");

  // Treat LaLiga and La Liga as the same league
  if (value === "laliga") {
    return "laliga";
  }

  return value;
}

function createSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function LeagueDetails() {
  const { slug } = useParams();

  const [league, setLeague] = useState(null);
  const [leaguePredictions, setLeaguePredictions] = useState([]);

  const [loadingLeague, setLoadingLeague] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(true);

  // Load league from Supabase
  useEffect(() => {
    const loadLeague = async () => {
      try {
        setLoadingLeague(true);

        const leagues = await getLeagues();

        const foundLeague = leagues.find(
          (item) => createSlug(item.name) === slug
        );

        setLeague(foundLeague || null);
      } catch (error) {
        console.error("Failed to load league:", error);
        setLeague(null);
      } finally {
        setLoadingLeague(false);
      }
    };

    loadLeague();
  }, [slug]);

  // Load predictions for this league
  useEffect(() => {
    if (!league) return;

    const loadLeaguePredictions = async () => {
      try {
        setLoadingPredictions(true);

        const data = await getPredictions();

        const leagueName = normalizeLeagueName(league.name);

        const filtered = data
          .filter((prediction) => {
            return (
              normalizeLeagueName(prediction.league) ===
              leagueName
            );
          })
          .sort((a, b) => Number(b.id) - Number(a.id));

        console.log("League:", league.name);
        console.log("Normalized league:", leagueName);
        console.log("All predictions:", data);
        console.log("League predictions:", filtered);

        setLeaguePredictions(filtered);
      } catch (error) {
        console.error(
          "Failed to load league predictions:",
          error
        );

        setLeaguePredictions([]);
      } finally {
        setLoadingPredictions(false);
      }
    };

    loadLeaguePredictions();
  }, [league]);

  // Loading league
  if (loadingLeague) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#070b0f] text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-white/10 border-t-lime-400" />

          <p className="mt-4 text-sm text-gray-500">
            Loading league...
          </p>
        </div>
      </div>
    );
  }

  // League not found
  if (!league) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#070b0f] px-4 text-white">
        <div className="text-center">
          <Trophy
            size={40}
            className="mx-auto text-gray-600"
          />

          <h1 className="mt-5 text-3xl font-black">
            League not found
          </h1>

          <p className="mt-3 text-gray-500">
            The league you're looking for doesn't exist.
          </p>

          <Link
            to="/leagues"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 font-bold text-black transition hover:bg-lime-300"
          >
            <ArrowLeft size={17} />
            Back to Leagues
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b0f] text-white">

      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 bg-[#0a1015]">

        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <Link
            to="/leagues"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-lime-400"
          >
            <ArrowLeft size={16} />
            All Leagues
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-center">

            {/* League Logo */}
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5">

              {league.logo ? (
                <img
                  src={league.logo}
                  alt={`${league.name} logo`}
                  className="h-14 w-14 object-contain"
                />
              ) : (
                <span className="text-4xl">
                  {league.flag || "🏆"}
                </span>
              )}

            </div>

            <div>

              <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
                {league.country || "International"}
              </p>

              <h1 className="mt-2 text-4xl font-black sm:text-5xl">
                {league.name}
              </h1>

              <p className="mt-3 text-gray-500">
                Football predictions and match insights for{" "}
                {league.name}.
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-white/10">

        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px bg-white/10 sm:grid-cols-3 lg:grid-cols-4">

          <div className="bg-[#070b0f] p-6">

            <Trophy
              className="text-lime-400"
              size={20}
            />

            <p className="mt-3 text-2xl font-black">
              {loadingPredictions
                ? "..."
                : leaguePredictions.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Predictions
            </p>

          </div>

          <div className="bg-[#070b0f] p-6">

            <p className="text-2xl font-black">
              {league.country || "—"}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Country
            </p>

          </div>

          <div className="bg-[#070b0f] p-6">

            <p className="text-2xl font-black">
              Daily
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Updates
            </p>

          </div>

          <div className="hidden bg-[#070b0f] p-6 lg:block">

            <p className="text-2xl font-black text-lime-400">
              Live
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Prediction coverage
            </p>

          </div>

        </div>

      </section>

      {/* Predictions */}
      <section className="py-14">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

            <div>

              <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
                {league.name}
              </p>

              <h2 className="mt-2 text-3xl font-black">
                Latest Predictions
              </h2>

              <p className="mt-2 text-gray-500">
                Predictions currently available for this league.
              </p>

            </div>

            <Link
              to="/predictions"
              className="inline-flex items-center gap-2 text-sm font-bold text-lime-400 hover:text-lime-300"
            >
              All Predictions
              <ArrowRight size={16} />
            </Link>

          </div>

          {/* Loading */}
          {loadingPredictions ? (

            <div className="mt-10 rounded-2xl border border-white/10 bg-[#10171e] px-6 py-16 text-center">

              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-lime-400" />

              <p className="mt-4 text-sm text-gray-500">
                Loading predictions...
              </p>

            </div>

          ) : leaguePredictions.length > 0 ? (

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {leaguePredictions.map((prediction) => (
                <PredictionCard
                  key={prediction.id}
                  {...prediction}
                />
              ))}

            </div>

          ) : (

            <div className="mt-10 rounded-2xl border border-dashed border-white/10 bg-[#10171e] px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5">

                {league.logo ? (
                  <img
                    src={league.logo}
                    alt={`${league.name} logo`}
                    className="h-9 w-9 object-contain"
                  />
                ) : (
                  <span className="text-2xl">
                    {league.flag || "🏆"}
                  </span>
                )}

              </div>

              <h3 className="mt-5 text-lg font-bold">
                No predictions yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                There are currently no predictions available
                for this league.
              </p>

              <Link
                to="/predictions"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
              >
                Browse Predictions
                <ArrowRight size={16} />
              </Link>

            </div>

          )}

        </div>

      </section>

    </div>
  );
}

export default LeagueDetails;


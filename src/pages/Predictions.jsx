import {
  Search,
  SlidersHorizontal,
  X,
  CalendarDays,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import PredictionCard from "../components/PredictionCard";
import { getPredictions } from "../utils/predictionStorage";
import leaguesData from "../data/leagues";

function Predictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [league, setLeague] = useState("All Leagues");
  const [access, setAccess] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const loadPredictions = async () => {
      try {
        const data = await getPredictions();

        console.log(
          "Predictions loaded from Supabase:",
          data
        );

        setPredictions(data);
      } catch (error) {
        console.error(
          "Failed to load predictions:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, []);

  const leagues = [
    "All Leagues",
    ...leaguesData.map((item) => item.name),
  ];

  const filteredPredictions = useMemo(() => {
    return predictions.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        (item.homeTeam || "")
          .toLowerCase()
          .includes(searchValue) ||
        (item.awayTeam || "")
          .toLowerCase()
          .includes(searchValue) ||
        (item.league || "")
          .toLowerCase()
          .includes(searchValue) ||
        (item.prediction || "")
          .toLowerCase()
          .includes(searchValue);

      const matchesLeague =
        league === "All Leagues" ||
        item.league === league;

      const matchesAccess =
        access === "All" ||
        (access === "Free" && !item.premium) ||
        (access === "Premium" && item.premium);

      const predictionDate = String(
        item.date || ""
      ).slice(0, 10);

      const matchesDate =
        !selectedDate ||
        predictionDate === selectedDate;

      return (
        matchesSearch &&
        matchesLeague &&
        matchesAccess &&
        matchesDate
      );
    });
  }, [
    predictions,
    search,
    league,
    access,
    selectedDate,
  ]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b0f] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-lime-400" />

          <p className="mt-4 text-sm text-gray-500">
            Loading predictions...
          </p>
        </div>
      </div>
    );
  }

  const hasFilters =
    search !== "" ||
    league !== "All Leagues" ||
    access !== "All" ||
    selectedDate !== "";

  const clearFilters = () => {
    setSearch("");
    setLeague("All Leagues");
    setAccess("All");
    setSelectedDate("");
  };

  return (
    <div className="min-h-screen bg-[#070b0f]">

      {/* Page Header */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
            Football predictions
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">
            Today's Predictions
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Explore football predictions, match analysis and
            insights across the world's biggest leagues.
          </p>

        </div>
      </section>

      {/* Filters */}
      <section className="border-b border-white/10 bg-[#070b0f]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">

            {/* Search */}
            <div className="relative xl:col-span-1">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search teams or predictions..."
                className="h-12 w-full rounded-xl border border-white/10 bg-[#10171e] pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
              />

            </div>

            {/* League */}
            <select
              value={league}
              onChange={(e) =>
                setLeague(e.target.value)
              }
              className="h-12 rounded-xl border border-white/10 bg-[#10171e] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40"
            >
              {leagues.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {/* Date */}
            <div className="relative">

              <CalendarDays
                size={17}
                className="pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2 text-gray-500"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(e) =>
                  setSelectedDate(e.target.value)
                }
                className="h-12 w-full rounded-xl border border-white/10 bg-[#10171e] pl-11 pr-10 text-sm font-semibold text-white outline-none focus:border-lime-400/40"
              />

              {selectedDate && (
                <button
                  type="button"
                  onClick={() =>
                    setSelectedDate("")
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 transition hover:text-white"
                  title="Clear date"
                >
                  <X size={16} />
                </button>
              )}

            </div>

            {/* Access */}
            <select
              value={access}
              onChange={(e) =>
                setAccess(e.target.value)
              }
              className="h-12 rounded-xl border border-white/10 bg-[#10171e] px-4 text-sm text-gray-300 outline-none focus:border-lime-400/40"
            >
              <option value="All">
                All Predictions
              </option>

              <option value="Free">
                Free
              </option>

              <option value="Premium">
                Premium
              </option>
            </select>

          </div>

          {/* Active filters */}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-3">

              <SlidersHorizontal
                size={15}
                className="text-gray-500"
              />

              <span className="text-sm text-gray-500">
                Filters applied
              </span>

              {league !== "All Leagues" && (
                <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                  {league}
                </span>
              )}

              {selectedDate && (
                <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                  {selectedDate}
                </span>
              )}

              {access !== "All" && (
                <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                  {access}
                </span>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm font-semibold text-lime-400 transition hover:text-lime-300"
              >
                Clear
                <X size={14} />
              </button>

            </div>
          )}

        </div>
      </section>

      {/* Predictions */}
      <section className="py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-2xl font-black">
                Available Predictions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                {filteredPredictions.length} prediction
                {filteredPredictions.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>
            </div>

            {selectedDate && (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <CalendarDays size={14} />
                <span>
                  Showing predictions for{" "}
                  <strong className="text-gray-300">
                    {selectedDate}
                  </strong>
                </span>
              </div>
            )}

          </div>

          {filteredPredictions.length > 0 ? (

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

              {filteredPredictions.map((prediction) => (
                <PredictionCard
                  key={prediction.id}
                  {...prediction}
                />
              ))}

            </div>

          ) : (

            <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171e] px-6 py-16 text-center">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/5">
                <Search
                  size={22}
                  className="text-gray-500"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold">
                No predictions found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
                We couldn't find any predictions matching
                your current filters. Try changing your
                search or filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
              >
                Clear Filters
              </button>

            </div>

          )}

        </div>
      </section>

    </div>
  );
}

export default Predictions;
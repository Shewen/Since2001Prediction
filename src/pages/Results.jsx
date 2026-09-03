import { useEffect, useState } from "react";
import {
  Trophy,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  CalendarDays,
  Filter,
  X,
} from "lucide-react";
import { getPredictions } from "../utils/predictionStorage";

function Results() {
  const [predictions, setPredictions] = useState([]);
  const [selectedLeague, setSelectedLeague] = useState("All Leagues");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getPredictions();

      const completedResults = data.filter(
        (prediction) =>
          (prediction.resultStatus === "won" ||
            prediction.resultStatus === "lost") &&
          prediction.homeScore !== null &&
          prediction.homeScore !== undefined &&
          prediction.awayScore !== null &&
          prediction.awayScore !== undefined
      );

      setPredictions(completedResults);
    } catch (error) {
      console.error("Failed to load results:", error);
      setError("Failed to load results.");
    } finally {
      setLoading(false);
    }
  };

  const leagues = [
    "All Leagues",
    ...Array.from(
      new Set(
        predictions
          .map((prediction) => prediction.league)
          .filter(Boolean)
      )
    ),
  ];

  // League + Date filtering
  const filteredPredictions = predictions.filter((prediction) => {
    const leagueMatches =
      selectedLeague === "All Leagues" ||
      prediction.league === selectedLeague;

    const predictionDate = String(
      prediction.date || ""
    ).slice(0, 10);

    const dateMatches =
      !selectedDate ||
      predictionDate === selectedDate;

    return leagueMatches && dateMatches;
  });

  const won = filteredPredictions.filter(
    (prediction) => prediction.resultStatus === "won"
  ).length;

  const lost = filteredPredictions.filter(
    (prediction) => prediction.resultStatus === "lost"
  ).length;

  const total = filteredPredictions.length;

  const winRate =
    total > 0 ? Math.round((won / total) * 100) : 0;

  const clearDate = () => {
    setSelectedDate("");
  };

  return (
    <div className="min-h-screen bg-[#070b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-4 flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <Trophy size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-lime-400">
                Prediction Performance
              </p>

              <h1 className="text-3xl font-black sm:text-4xl">
                Results
              </h1>
            </div>

          </div>

          <p className="max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            See how our football predictions performed.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 rounded-2xl border border-white/10 bg-[#10171e] p-4 sm:p-5">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            {/* Filter Title */}
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                <Filter size={17} />
              </div>

              <div>
                <p className="text-sm font-bold text-white">
                  Filter Results
                </p>

                <p className="text-xs text-gray-600">
                  View results by league or date
                </p>
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

              {/* League */}
              <div className="relative w-full sm:w-64">

                <select
                  value={selectedLeague}
                  onChange={(e) =>
                    setSelectedLeague(e.target.value)
                  }
                  className="w-full appearance-none rounded-xl border border-white/10 bg-[#070b0f] px-4 py-3 pr-10 text-sm font-semibold text-white outline-none transition focus:border-lime-400/50"
                >
                  {leagues.map((league) => (
                    <option
                      key={league}
                      value={league}
                      className="bg-[#10171e] text-white"
                    >
                      {league}
                    </option>
                  ))}
                </select>

                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  ▼
                </div>

              </div>

              {/* Date */}
              <div className="relative w-full sm:w-64">

                <CalendarDays
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-gray-500"
                />

                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) =>
                    setSelectedDate(e.target.value)
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#070b0f] py-3 pl-10 pr-10 text-sm font-semibold text-white outline-none transition focus:border-lime-400/50"
                />

                {selectedDate && (
                  <button
                    type="button"
                    onClick={clearDate}
                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-500 transition hover:text-white"
                    title="Clear date"
                  >
                    <X size={16} />
                  </button>
                )}

              </div>

            </div>
          </div>

          {/* Active Filters */}
          {(selectedLeague !== "All Leagues" ||
            selectedDate) && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-4">

              <span className="text-xs text-gray-600">
                Active filters:
              </span>

              {selectedLeague !== "All Leagues" && (
                <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                  {selectedLeague}
                </span>
              )}

              {selectedDate && (
                <span className="rounded-full bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                  {selectedDate}
                </span>
              )}

              <button
                type="button"
                onClick={() => {
                  setSelectedLeague("All Leagues");
                  setSelectedDate("");
                }}
                className="ml-1 text-xs font-semibold text-gray-500 transition hover:text-white"
              >
                Clear all
              </button>

            </div>
          )}

        </div>

        {/* Stats */}
        <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Total */}
          <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5 transition hover:border-white/20">

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Total Results
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-400">
                <Trophy size={17} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-black">
              {total}
            </p>

            <p className="mt-1 text-xs text-gray-600">
              {selectedLeague === "All Leagues" &&
              !selectedDate
                ? "All completed predictions"
                : "Matching results"}
            </p>

          </div>

          {/* Won */}
          <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5 transition hover:border-lime-400/30">

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Won
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                <CheckCircle size={17} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-black text-lime-400">
              {won}
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Successful predictions
            </p>

          </div>

          {/* Lost */}
          <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5 transition hover:border-red-400/30">

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Lost
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-400/10 text-red-400">
                <XCircle size={17} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-black text-red-400">
              {lost}
            </p>

            <p className="mt-1 text-xs text-gray-600">
              Unsuccessful predictions
            </p>

          </div>

          {/* Win Rate */}
          <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5 transition hover:border-lime-400/30">

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Win Rate
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                <Target size={17} />
              </div>
            </div>

            <p className="mt-3 text-3xl font-black text-lime-400">
              {winRate}%
            </p>

            <p className="mt-1 text-xs text-gray-600">
              {selectedLeague === "All Leagues" &&
              !selectedDate
                ? "Overall accuracy"
                : "Filtered accuracy"}
            </p>

          </div>

        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#10171e] p-10 text-center text-gray-500">
            Loading results...
          </div>
        ) : filteredPredictions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#10171e] p-10 text-center">

            <Clock
              size={40}
              className="mx-auto mb-4 text-gray-600"
            />

            <h2 className="text-lg font-bold text-gray-300">
              No results found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              {selectedLeague !== "All Leagues" &&
              selectedDate
                ? `No results for ${selectedLeague} on ${selectedDate}.`
                : selectedLeague !== "All Leagues"
                ? `No results for ${selectedLeague}.`
                : selectedDate
                ? `No results found on ${selectedDate}.`
                : "Completed prediction results will appear here."}
            </p>

          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {filteredPredictions.map((prediction) => {
              const isWon =
                prediction.resultStatus === "won";

              return (
                <div
                  key={prediction.id}
                  className={`group overflow-hidden rounded-2xl border bg-[#10171e] transition duration-300 hover:-translate-y-1 ${
                    isWon
                      ? "border-lime-400/10 hover:border-lime-400/40"
                      : "border-red-400/10 hover:border-red-400/30"
                  }`}
                >

                  {/* Card Top */}
                  <div
                    className={`border-b px-5 py-4 ${
                      isWon
                        ? "border-lime-400/10 bg-lime-400/[0.03]"
                        : "border-red-400/10 bg-red-400/[0.03]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">

                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-lime-400">
                          {prediction.league}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <CalendarDays size={13} />

                          <span>
                            {prediction.date}
                          </span>

                          {prediction.time && (
                            <>
                              <span className="text-gray-700">
                                •
                              </span>

                              <span>
                                {prediction.time}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Result Badge */}
                      <div
                        className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${
                          isWon
                            ? "bg-lime-400/10 text-lime-400"
                            : "bg-red-400/10 text-red-400"
                        }`}
                      >
                        {isWon ? (
                          <CheckCircle size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}

                        {isWon ? "WON" : "LOST"}
                      </div>

                    </div>
                  </div>

                  {/* Match */}
                  <div className="px-5 py-6">

                    <div className="flex items-center justify-between gap-3">

                      {/* Home */}
                      <div className="flex min-w-0 flex-1 flex-col items-center text-center">

                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 transition duration-300 group-hover:border-white/20">

                          {prediction.homeLogo ? (
                            <img
                              src={prediction.homeLogo}
                              alt={`${prediction.homeTeam} logo`}
                              className="h-11 w-11 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-600">
                              —
                            </span>
                          )}

                        </div>

                        <p className="line-clamp-2 text-sm font-bold leading-5 text-white">
                          {prediction.homeTeam}
                        </p>

                      </div>

                      {/* Score */}
                      <div className="flex shrink-0 flex-col items-center">

                        <span className="mb-1 text-[10px] font-black uppercase tracking-widest text-gray-600">
                          Final
                        </span>

                        <div className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                          <span className="text-2xl font-black tracking-tight text-white">
                            {prediction.homeScore}
                          </span>

                          <span className="mx-1.5 text-gray-600">
                            -
                          </span>

                          <span className="text-2xl font-black tracking-tight text-white">
                            {prediction.awayScore}
                          </span>
                        </div>

                      </div>

                      {/* Away */}
                      <div className="flex min-w-0 flex-1 flex-col items-center text-center">

                        <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] p-2 transition duration-300 group-hover:border-white/20">

                          {prediction.awayLogo ? (
                            <img
                              src={prediction.awayLogo}
                              alt={`${prediction.awayTeam} logo`}
                              className="h-11 w-11 object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <span className="text-xs text-gray-600">
                              —
                            </span>
                          )}

                        </div>

                        <p className="line-clamp-2 text-sm font-bold leading-5 text-white">
                          {prediction.awayTeam}
                        </p>

                      </div>

                    </div>

                    {/* Prediction */}
                    <div className="mt-6 rounded-xl border border-white/10 bg-black/20 p-4">

                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                          Our Prediction
                        </span>

                        <span
                          className={`text-[10px] font-black uppercase tracking-widest ${
                            isWon
                              ? "text-lime-400"
                              : "text-red-400"
                          }`}
                        >
                          {isWon
                            ? "Successful"
                            : "Unsuccessful"}
                        </span>
                      </div>

                      <p className="text-sm font-bold leading-6 text-white">
                        {prediction.prediction}
                      </p>

                    </div>

                  </div>

                  {/* Card Bottom */}
                  <div className="border-t border-white/5 bg-black/10 px-5 py-3">

                    <div className="flex items-center justify-between">

                      <span className="text-xs text-gray-600">
                        Prediction Result
                      </span>

                      <div
                        className={`flex items-center gap-1.5 text-xs font-black uppercase ${
                          isWon
                            ? "text-lime-400"
                            : "text-red-400"
                        }`}
                      >
                        {isWon ? (
                          <CheckCircle size={14} />
                        ) : (
                          <XCircle size={14} />
                        )}

                        {isWon
                          ? "Prediction Won"
                          : "Prediction Lost"}
                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default Results;
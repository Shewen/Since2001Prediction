import { useState, useEffect } from "react";
import {
  ArrowRight,
  TrendingUp,
  Trophy,
  Target,
} from "lucide-react";

import PredictionCard from "../components/PredictionCard";
import { getPredictions } from "../utils/predictionStorage";
import LeagueCard from "../components/LeagueCard";
import { getLeagues } from "../utils/leagueStorage";
import ResultCard from "../components/ResultCard";

function Home() {
  const [predictions, setPredictions] = useState([]);

  const [results, setResults] = useState([]);
  const [leagues, setLeagues] = useState([]);
const [loadingLeagues, setLoadingLeagues] = useState(true);
const [loadingResults, setLoadingResults] = useState(true);

const [loadingPredictions, setLoadingPredictions] = useState(true);

const completedPredictions = predictions.filter(
  (prediction) =>
    prediction.resultStatus === "won" ||
    prediction.resultStatus === "lost"
);

const wonPredictions = predictions.filter(
  (prediction) => prediction.resultStatus === "won"
);

const lostPredictions = predictions.filter(
  (prediction) => prediction.resultStatus === "lost"
);

const winRate =
  completedPredictions.length > 0
    ? Math.round(
        (wonPredictions.length / completedPredictions.length) * 100
      )
    : 0;

const totalPredictions = predictions.length;

const totalLeagues = new Set(
  predictions
    .map((prediction) => prediction.league)
    .filter(Boolean)
).size;

useEffect(() => {
  const loadHomeData = async () => {
    try {
      setLoadingPredictions(true);
      setLoadingResults(true);

      const data = await getPredictions();

      setPredictions(data);

      const leagueData = await getLeagues();

setLeagues(leagueData);

      const completedResults = data
        .filter(
          (prediction) =>
            prediction.resultStatus === "won" ||
            prediction.resultStatus === "lost"
        )
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 3);

      setResults(completedResults);
    } catch (error) {
      console.error("Failed to load homepage data:", error);
      setPredictions([]);
      setResults([]);
      setLeagues([]);
    } finally {
  setLoadingPredictions(false);
  setLoadingResults(false);
  setLoadingLeagues(false);
}
  };

  loadHomeData();
}, []);


   


  return (
    <div>
      {/* Hero */}
      <section
  className="relative overflow-hidden border-b border-white/10 bg-cover bg-center"
  style={{
    backgroundImage:
      "url('https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=2000&q=80')",
  }}
>

  <div className="absolute inset-0 bg-black/70" />
<div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />
        {/* Background glow */}
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="absolute -right-40 top-10 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[650px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:px-8">
          
          {/* Hero Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-4 py-2 text-sm font-medium text-lime-400">
              <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
              Daily Football Predictions
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Predict the game.
              <span className="block text-lime-400">
                Follow the numbers.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-gray-400 sm:text-lg">
              Get football predictions, match analysis and insights across
              the world's biggest leagues — all in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="/predictions"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 font-bold text-black transition hover:bg-lime-300"
              >
                Today's Predictions
                <ArrowRight
                  size={18}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="/leagues"
                className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Explore Leagues
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-8">
              <div>
                <div className="flex items-center gap-2 text-lime-400">
                  <Target size={17} />
                  <span className="text-2xl font-black">78%</span>
                </div>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Prediction accuracy
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-lime-400">
                  <Trophy size={17} />
                  <span className="text-2xl font-black">20+</span>
                </div>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Leagues covered
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-lime-400">
                  <TrendingUp size={17} />
                  <span className="text-2xl font-black">Daily</span>
                </div>
                <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                  Fresh predictions
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          
        </div>
      </section>

  



      {/* Today's Predictions */}
<section className="border-b border-white/10 bg-[#0a1015] py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
          Today's picks
        </p>

        <h2 className="mt-2 text-3xl font-black sm:text-4xl">
          Today's Predictions
        </h2>

        <p className="mt-3 max-w-xl text-gray-400">
          Explore our latest football predictions and match insights.
        </p>
      </div>

      <a
        href="/predictions"
        className="flex items-center gap-2 text-sm font-bold text-lime-400 hover:text-lime-300"
      >
        View all predictions
        <ArrowRight size={16} />
      </a>
    </div>

    <div className="mt-10">
  {loadingPredictions ? (
    <p className="text-sm text-gray-500">
      Loading today's predictions...
    </p>
  ) : predictions.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171e] px-6 py-12 text-center">
      <p className="text-sm text-gray-500">
        No predictions available today.
      </p>
    </div>
  ) : (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {predictions
        .filter((prediction) => prediction.date === "Today")
        .slice(0, 3)
        .map((prediction) => (
          <PredictionCard
            key={prediction.id}
            {...prediction}
          />
        ))}
    </div>
  )}
</div>

  </div>
</section>

{/* Popular Leagues */}
{/* Popular Leagues */}
<section className="border-b border-white/10 py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
          Explore
        </p>

        <h2 className="mt-2 text-3xl font-black sm:text-4xl">
          Popular Leagues
        </h2>

        <p className="mt-3 max-w-xl text-gray-400">
          Find predictions from the leagues and competitions you follow.
        </p>
      </div>

      <a
        href="/leagues"
        className="flex items-center gap-2 text-sm font-bold text-lime-400 hover:text-lime-300"
      >
        View all leagues
        <ArrowRight size={16} />
      </a>
    </div>

    <div className="mt-10">
      {loadingLeagues ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-2xl border border-white/10 bg-[#10171e]"
            />
          ))}
        </div>
      ) : leagues.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171e] px-6 py-12 text-center">
          <Trophy
            size={32}
            className="mx-auto text-gray-600"
          />

          <h3 className="mt-4 text-lg font-bold">
            No leagues available
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Leagues added from the admin dashboard will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {leagues.slice(0, 6).map((league) => {
  const matchCount = predictions.filter(
    (prediction) =>
      String(prediction.league || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "") ===
      String(league.name || "")
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
  ).length;

  return (
    <LeagueCard
      key={league.id}
      id={league.id}
      name={league.name}
      country={league.country}
      logo={league.logo}
      flag={league.flag}
      matches={matchCount}
    />
  );
})}
        </div>
      )}
    </div>

  </div>
</section>

{/* Latest Results */}
{/* Latest Results */}
<section className="border-b border-white/10 bg-[#0a1015] py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
          Track the performance
        </p>

        <h2 className="mt-2 text-3xl font-black sm:text-4xl">
          Latest Results
        </h2>

        <p className="mt-3 max-w-xl text-gray-400">
          See how our previous football predictions performed.
        </p>
      </div>

      <a
        href="/results"
        className="flex items-center gap-2 text-sm font-bold text-lime-400 hover:text-lime-300"
      >
        View all results
        <ArrowRight size={16} />
      </a>
    </div>

    <div className="mt-10">
      {loadingResults ? (
        <div className="grid gap-5 lg:grid-cols-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-64 animate-pulse rounded-2xl border border-white/10 bg-[#10171e]"
            />
          ))}
        </div>
      ) : results.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171e] px-6 py-14 text-center">
          <Trophy
            size={32}
            className="mx-auto text-gray-600"
          />

          <h3 className="mt-4 text-lg font-bold">
            No results yet
          </h3>

          <p className="mt-2 text-sm text-gray-500">
            Completed prediction results will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {results.map((result) => (
            <ResultCard
              key={result.id}
              {...result}
            />
          ))}
        </div>
      )}
    </div>

  </div>
</section>

<section className="border-b border-white/10 py-20">
  <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">

    <p className="text-sm font-bold uppercase tracking-widest text-lime-400">
      Our performance
    </p>

    <h2 className="mt-3 text-3xl font-black sm:text-4xl">
      Prediction Performance
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-gray-400">
      Track our prediction history and see how our selections have performed
      over time.
    </p>

    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">

      <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6">
        <p className="text-4xl font-black">{winRate}%</p>
        <p className="mt-2 text-sm text-gray-500">
          Success Rate
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6">
        <p className="text-4xl font-black">{wonPredictions.length}</p>
        <p className="mt-2 text-sm text-gray-500">
          Predictions Won
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6">
        {totalPredictions}
        <p className="mt-2 text-sm text-gray-500">
          Total Predictions
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6">
        {totalLeagues}+
        <p className="mt-2 text-sm text-gray-500">
          Leagues
        </p>
      </div>

    </div>
  </div>
</section>
{/* CTA */}
<section className="px-4 py-20 sm:px-6 lg:px-8">
  <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-lime-400/20 bg-lime-400 p-8 sm:p-12 lg:p-16">
    
    {/* Decorative circles */}
    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-black/10 blur-2xl" />
    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-black/10 blur-2xl" />

    <div className="relative max-w-2xl">
      <p className="text-sm font-black uppercase tracking-widest text-black/60">
        Stay ahead of the game
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight text-black sm:text-4xl lg:text-5xl">
        Find today's football predictions.
      </h2>

      <p className="mt-4 max-w-xl leading-7 text-black/70">
        Explore our latest predictions, match analysis and football insights
        across the world's biggest leagues.
      </p>

      <a
        href="/predictions"
        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-black px-6 py-3.5 text-sm font-bold text-white transition hover:bg-gray-900"
      >
        Explore Predictions
        <ArrowRight size={17} />
      </a>
    </div>
  </div>
</section>
    </div>
  );
}

export default Home;
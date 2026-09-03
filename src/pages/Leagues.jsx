
import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";

import LeagueCard from "../components/LeagueCard";
import { getPredictions } from "../utils/predictionStorage";
import { getLeagues } from "../utils/leagueStorage";

function normalizeLeagueName(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, "");
}

function Leagues() {
  const [leagues, setLeagues] = useState([]);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [leagueData, predictionData] = await Promise.all([
          getLeagues(),
          getPredictions(),
        ]);

        setLeagues(leagueData);
        setPredictions(predictionData);
      } catch (error) {
        console.error("Failed to load leagues:", error);
        setLeagues([]);
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#070b0f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
              <Trophy size={22} />
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-lime-400">
                Competitions
              </p>

              <h1 className="text-3xl font-black sm:text-4xl">
                Football Leagues
              </h1>
            </div>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore predictions from the world's biggest football leagues
            and competitions.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-lime-400" />

              <p className="mt-4 text-sm text-gray-500">
                Loading leagues...
              </p>
            </div>
          </div>
        ) : leagues.length === 0 ? (
          /* Empty State */
          <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171e] px-6 py-16 text-center">
            <Trophy
              size={36}
              className="mx-auto text-gray-600"
            />

            <h2 className="mt-4 text-xl font-black">
              No leagues available
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Leagues added from the admin dashboard will appear here.
            </p>
          </div>
        ) : (
          /* League Grid */
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {leagues.map((league) => {
              const matchCount = predictions.filter(
                (prediction) =>
                  normalizeLeagueName(prediction.league) ===
                  normalizeLeagueName(league.name)
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
  );
}

export default Leagues;



import { Check, X } from "lucide-react";

function ResultCard({
  league,
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  prediction,
  homeScore,
  awayScore,
  resultStatus,
  resultAnalysis,
  date,
}) {
  const won = resultStatus === "won";
  const lost = resultStatus === "lost";

  return (
    <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5 transition hover:-translate-y-1 hover:border-white/20">
      {/* League + Status */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-lime-400">
            {league}
          </p>

          {date && (
            <p className="mt-1 text-xs text-gray-500">
              {date}
            </p>
          )}
        </div>

        <div
          className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            won
              ? "bg-lime-400/10 text-lime-400"
              : lost
              ? "bg-red-400/10 text-red-400"
              : "bg-yellow-400/10 text-yellow-400"
          }`}
        >
          {won ? (
            <Check size={13} />
          ) : lost ? (
            <X size={13} />
          ) : null}

          {won ? "WON" : lost ? "LOST" : "PENDING"}
        </div>
      </div>

      {/* Match */}
      <div className="mt-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        {/* Home Team */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">
            {homeLogo ? (
              <img
                src={homeLogo}
                alt={`${homeTeam} logo`}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <span className="text-xs text-gray-600">
                No logo
              </span>
            )}
          </div>

          <p className="mt-2 truncate text-sm font-bold">
            {homeTeam}
          </p>
        </div>

        {/* Score */}
        <div className="text-center">
          <p className="text-xs font-bold text-gray-600">
            FINAL
          </p>

          <div className="mt-1 flex items-center gap-2 text-2xl font-black">
            <span>{homeScore ?? "-"}</span>
            <span className="text-gray-600">:</span>
            <span>{awayScore ?? "-"}</span>
          </div>
        </div>

        {/* Away Team */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">
            {awayLogo ? (
              <img
                src={awayLogo}
                alt={`${awayTeam} logo`}
                className="h-10 w-10 object-contain"
              />
            ) : (
              <span className="text-xs text-gray-600">
                No logo
              </span>
            )}
          </div>

          <p className="mt-2 truncate text-sm font-bold">
            {awayTeam}
          </p>
        </div>
      </div>

      {/* Prediction */}
      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          Prediction
        </p>

        <p className="mt-2 text-sm font-black text-white">
          {prediction}
        </p>
      </div>

      {/* Result Analysis */}
      {resultAnalysis && (
        <div className="mt-4">
          <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Analysis
          </p>

          <p className="mt-2 text-sm leading-relaxed text-gray-400">
            {resultAnalysis}
          </p>
        </div>
      )}
    </div>
  );
}

export default ResultCard;


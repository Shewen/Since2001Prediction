
import { ArrowLeft, Printer, Trash2, CheckCircle2 , Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { usePicks } from "../context/PicksContext";

function MyPicksPage() {
  const { picks, removePick, clearPicks } = usePicks();

  const handlePrint = () => {
    window.print();
  };


  const handleShare = async () => {
  if (picks.length === 0) return;

  const shareText = `⚽ Since2001Prediction — My Picks

${picks
  .map(
    (pick, index) =>
      `${index + 1}. ${pick.homeTeam} vs ${pick.awayTeam}
🔮 Prediction: ${pick.prediction}
📊 Confidence: ${pick.confidence}%`
  )
  .join("\n\n")}

Check more football predictions:
${window.location.origin}/predictions`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: "Since2001Prediction — My Picks",
        text: shareText,
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Share failed:", error);
      }
    }
  } else {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      shareText
    )}`;

    window.open(whatsappUrl, "_blank");
  }
};

  return (
    <div className="min-h-screen bg-[#070b0f] px-4 py-8 text-white sm:px-6 lg:px-8 print:bg-white print:px-0 print:py-0 print:text-black">
      <div className="mx-auto max-w-4xl">

        {/* Page Header */}
        <div className="mb-8 flex items-end justify-between gap-4 print:hidden">
          <div>
            <Link
              to="/predictions"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-lime-400"
            >
              <ArrowLeft size={16} />
              Back to Predictions
            </Link>

            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
              My Picks
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              {picks.length} prediction
              {picks.length !== 1 ? "s" : ""} selected
            </p>
          </div>

          {picks.length > 0 && (
  <div className="flex items-center gap-2">
    <button
      onClick={handleShare}
      className="flex items-center gap-2 rounded-xl border border-lime-400/20 bg-lime-400/10 px-4 py-3 text-sm font-black text-lime-400 transition hover:bg-lime-400/20"
    >
      <Share2 size={17} />
      <span className="hidden sm:inline">Share Picks</span>
      <span className="sm:hidden">Share</span>
    </button>

    <button
      onClick={handlePrint}
      className="hidden items-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-sm font-black text-black shadow-lg shadow-lime-400/10 transition hover:bg-lime-300 sm:flex"
    >
      <Printer size={17} />
      Print Ticket
    </button>
  </div>
)}
        </div>

        {/* Empty State */}
        {picks.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-white/10 bg-[#10171e] px-6 py-20 text-center shadow-xl shadow-black/10 print:border-gray-300 print:bg-white">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
              <CheckCircle2 size={30} />
            </div>

            <h2 className="mt-5 text-xl font-black">
              No picks yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Go to the predictions page and add the predictions you want
              to your ticket.
            </p>

            <Link
              to="/predictions"
              className="mt-6 inline-flex rounded-xl bg-lime-400 px-5 py-3 text-sm font-black text-black transition hover:bg-lime-300"
            >
              Browse Predictions
            </Link>
          </div>
        ) : (
          <>
            {/* Prediction Ticket */}
            <div
              id="print-ticket"
              className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#10171e] shadow-2xl shadow-black/30 print:rounded-none print:border print:border-gray-300 print:bg-white print:shadow-none"
            >

              {/* Top Accent */}
              <div className="h-1.5 bg-lime-400 print:bg-black" />

              {/* Ticket Header */}
              <div className="border-b border-dashed border-white/10 px-5 py-7 text-center sm:px-8 print:border-gray-300">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400 text-black">
                  <CheckCircle2 size={25} />
                </div>

                <p className="mt-4 text-[10px] font-black uppercase tracking-[0.35em] text-lime-400 print:text-black">
                  Football Predictions
                </p>

                <h2 className="mt-2 text-3xl font-black tracking-tight print:text-black">
                  Prediction Ticket
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  {picks.length} selected pick
                  {picks.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Ticket Picks */}
              <div className="divide-y divide-dashed divide-white/10 print:divide-gray-200">
                {picks.map((pick, index) => (
                  <div
                    key={`${pick.id}-${pick.homeTeam}-${pick.awayTeam}`}
                    className="relative px-5 py-7 sm:px-8 print:px-6"
                  >

                    {/* Pick Header */}
                    <div className="mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black print:bg-black print:text-white">
                          {index + 1}
                        </div>

                        <div>
                          <p className="text-sm font-black">
                            Pick #{index + 1}
                          </p>

                          <p className="mt-0.5 text-xs font-medium text-gray-500">
                            {pick.league}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => removePick(pick.id)}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-red-400/10 hover:text-red-400 print:hidden"
                        title="Remove pick"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>

                    {/* Match */}
                    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-6">

                      {/* Home Team */}
                      <div className="min-w-0 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[#0a1015] p-3 sm:h-24 sm:w-24 print:border-gray-200 print:bg-gray-50">
                          {pick.homeLogo ? (
                            <img
                              src={pick.homeLogo}
                              alt={`${pick.homeTeam} logo`}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">
                              No logo
                            </span>
                          )}
                        </div>

                        <p className="mx-auto mt-3 max-w-[130px] truncate text-sm font-black sm:max-w-[180px] sm:text-base">
                          {pick.homeTeam}
                        </p>

                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                          Home
                        </p>
                      </div>

                      {/* VS */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                          Match
                        </span>

                        <div className="my-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 print:border-gray-300 print:bg-gray-50">
                          <span className="text-xs font-black text-gray-400">
                            VS
                          </span>
                        </div>

                        <span className="text-[10px] font-bold text-gray-600">
                          {pick.time}
                        </span>
                      </div>

                      {/* Away Team */}
                      <div className="min-w-0 text-center">
                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-[#0a1015] p-3 sm:h-24 sm:w-24 print:border-gray-200 print:bg-gray-50">
                          {pick.awayLogo ? (
                            <img
                              src={pick.awayLogo}
                              alt={`${pick.awayTeam} logo`}
                              className="h-full w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-500">
                              No logo
                            </span>
                          )}
                        </div>

                        <p className="mx-auto mt-3 max-w-[130px] truncate text-sm font-black sm:max-w-[180px] sm:text-base">
                          {pick.awayTeam}
                        </p>

                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                          Away
                        </p>
                      </div>
                    </div>

                    {/* Match Date */}
                    <div className="mt-6 text-center">
                      <span className="inline-flex rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-bold text-gray-400 print:border-gray-300 print:bg-gray-50 print:text-gray-700">
                        {pick.date}
                      </span>
                    </div>

                    {/* Prediction Box */}
                    <div className="mt-6 overflow-hidden rounded-2xl border border-lime-400/20 bg-lime-400/[0.04] print:border-gray-300 print:bg-gray-50">

                      <div className="flex items-center justify-between border-b border-lime-400/10 px-4 py-3 print:border-gray-200">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                          Prediction
                        </span>

                        <span className="rounded-full bg-lime-400/10 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-lime-400 print:bg-gray-200 print:text-black">
                          Selected
                        </span>
                      </div>

                      <div className="px-4 py-5 text-center">
                        <p className="text-xl font-black text-lime-400 print:text-black">
                          {pick.prediction}
                        </p>

                        {pick.confidence !== undefined && (
                          <div className="mx-auto mt-4 max-w-xs">
                            <div className="mb-2 flex items-center justify-between text-[10px] font-bold text-gray-500">
                              <span>Confidence</span>
                              <span className="text-white print:text-black">
                                {pick.confidence}%
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-white/10 print:bg-gray-200">
                              <div
                                className="h-full rounded-full bg-lime-400 print:bg-black"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, Number(pick.confidence))
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Ticket Footer */}
              <div className="border-t border-dashed border-white/10 px-5 py-6 sm:px-8 print:border-gray-300">

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 print:border-gray-200 print:bg-gray-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Total Picks
                    </p>

                    <p className="mt-1 text-2xl font-black">
                      {picks.length}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-right print:border-gray-200 print:bg-gray-50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                      Generated
                    </p>

                    <p className="mt-1 text-sm font-black">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="mt-6 text-center text-[10px] leading-5 text-gray-600">
                  Football predictions are for informational purposes only.
                </p>
              </div>
            </div>

            {/* Mobile Print Button */}
            <button
              onClick={handlePrint}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-black text-black transition hover:bg-lime-300 sm:hidden print:hidden"
            >
              <Printer size={16} />
              Print Ticket
            </button>

            {/* Bottom Controls */}
            <div className="mt-5 flex items-center justify-between print:hidden">
              <button
                onClick={clearPicks}
                className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-bold text-gray-500 transition hover:text-red-400"
              >
                <Trash2 size={15} />
                Clear All Picks
              </button>

              <button
                onClick={handlePrint}
                className="hidden items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-black text-black transition hover:bg-lime-300 sm:flex"
              >
                <Printer size={16} />
                Print Ticket
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyPicksPage;


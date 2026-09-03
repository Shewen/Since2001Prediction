import { Check, Printer, Trash2, X } from "lucide-react";
import { useState } from "react";
import { usePicks } from "../context/PicksContext";
import { Link, useLocation } from "react-router-dom";

function MyPicks() {
  const { picks, removePick, clearPicks } = usePicks();
  const location = useLocation();

  const [minimized, setMinimized] = useState(false);

  // Don't show floating slip on My Picks page
  if (location.pathname === "/my-picks") {
    return null;
  }

  // Nothing selected
  if (picks.length === 0) {
    return null;
  }

  // -------------------------
  // MINIMIZED PICK BUTTON
  // -------------------------
  if (minimized) {
    return (
      <button
  onClick={() => setMinimized(false)}
  className="no-print fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-black shadow-2xl shadow-black/40 transition hover:bg-lime-300"
>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-sm font-black text-lime-400">
          {picks.length}
        </span>
      </button>
    );
  }

  // -------------------------
  // FULL PICK SLIP
  // -------------------------
  return (
    
  <div className="no-print fixed bottom-5 right-5 z-50 w-[calc(100%-2rem)] max-w-sm">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#10171e] shadow-2xl shadow-black/40">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">

          <div>
            <h3 className="font-black text-white">
              My Picks
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              {picks.length} pick{picks.length !== 1 ? "s" : ""} selected
            </p>
          </div>

          <div className="flex items-center gap-2">

            {/* Minimize */}
            <button
              onClick={() => setMinimized(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              title="Minimize"
            >
              <X size={17} />
            </button>

            {/* Selected indicator */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
              <Check size={18} />
            </div>

          </div>
        </div>

        {/* Picks */}
        <div className="max-h-80 overflow-y-auto">

          {picks.map((pick, index) => (
            <div
              key={pick.id}
              className="border-b border-white/5 px-4 py-3"
            >

              <div className="flex items-start justify-between gap-3">

                <div className="flex min-w-0 gap-3">

                  {/* Pick number */}
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lime-400 text-xs font-black text-black">
                    {index + 1}
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-xs font-bold text-gray-400">
                      {pick.homeTeam} vs {pick.awayTeam}
                    </p>

                    <p className="mt-1 text-sm font-black text-white">
                      {pick.prediction}
                    </p>

                    <p className="mt-1 text-xs text-gray-600">
                      {pick.league}
                    </p>

                  </div>

                </div>

                {/* Remove individual pick */}
                <button
                  onClick={() => removePick(pick.id)}
                  className="shrink-0 text-gray-600 transition hover:text-red-400"
                  title="Remove pick"
                >
                  <X size={16} />
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* Footer */}
        <div className="p-4">

          <div className="flex gap-2">

            {/* Clear */}
            <button
              onClick={clearPicks}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/10 py-3 text-xs font-bold text-gray-400 transition hover:border-red-400/20 hover:text-red-400"
            >
              <Trash2 size={14} />
              Clear
            </button>

            {/* View & Print */}
            <Link
              to="/my-picks"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-lime-400 py-3 text-xs font-black text-black transition hover:bg-lime-300"
            >
              <Printer size={14} />
              View & Print
            </Link>

          </div>

        </div>

      </div>
    </div>
  );
}

export default MyPicks;
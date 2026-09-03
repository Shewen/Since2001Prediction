
import { ArrowRight, Lock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import teams from "../data/teams";
import { usePicks } from "../context/PicksContext";

function PredictionCard({
  id,
  league,
  date,
  time,
  homeTeam,
  awayTeam,
  homeLogo,
  awayLogo,
  prediction,
  confidence,
  markets,
  premium = false,
})  {

  const home = teams.find(
  (team) =>
    team.id === String(homeTeam).toLowerCase() ||
    team.name.toLowerCase() === String(homeTeam).toLowerCase()
);

const away = teams.find(
  (team) =>
    team.id === String(awayTeam).toLowerCase() ||
    team.name.toLowerCase() === String(awayTeam).toLowerCase()
);

const homeLogoUrl = home?.logo || homeLogo;
const awayLogoUrl = away?.logo || awayLogo;

  const {
    addPick,
    removePick,
    isPicked,
    picks,
  } = usePicks();

  const picked = isPicked(id);

  const pickNumber =
    picks.findIndex((pick) => pick.id === id) + 1;

  const homeName = home?.name || homeTeam;
  const awayName = away?.name || awayTeam;




const handleAddPick = () => {
  if (!prediction) return;

  addPick({
    id,
    league,
    date,
    time,
    homeTeam: homeName,
    awayTeam: awayName,
    homeLogo: homeLogoUrl,
    awayLogo: awayLogoUrl,
    prediction,
    predictionType: "prediction",
    confidence,
    premium,
  });
};

const handleRemovePick = () => {
  removePick(id);
};

   




  return (
    <article className="group overflow-hidden rounded-2xl border border-white/10 bg-[#10171e] transition duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:shadow-xl hover:shadow-black/20">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">

        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-lime-400">
            {league}
          </p>

          <p className="mt-1 text-xs text-gray-500">
            {date} • {time}
          </p>
        </div>

        {premium ? (
          <span className="flex items-center gap-1 rounded-full bg-yellow-400/10 px-2.5 py-1 text-xs font-bold text-yellow-400">
            <Lock size={12} />
            PREMIUM
          </span>
        ) : (
          <span className="rounded-full bg-lime-400/10 px-2.5 py-1 text-xs font-bold text-lime-400">
            FREE
          </span>
        )}

      </div>

      {/* Teams */}
      <div className="flex items-center justify-center gap-5 px-4 py-7">

        {/* Home */}
        <div className="w-24 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">

    {homeLogoUrl && (
  <img
    src={homeLogoUrl}
    alt={`${home?.name || homeTeam} logo`}
    className="h-10 w-10 object-contain"
  />
)}

          </div>

          <p className="mt-2 truncate text-sm font-bold">
            {homeName}
          </p>

        </div>

        {/* VS */}
        <div className="text-center">
          <span className="text-xs font-bold text-gray-600">
            VS
          </span>
        </div>

        {/* Away */}
        <div className="w-24 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white/5">

 {awayLogoUrl && (
  <img
    src={awayLogoUrl}
    alt={`${away?.name || awayTeam} logo`}
    className="h-10 w-10 object-contain"
  />
)}

          </div>

          <p className="mt-2 truncate text-sm font-bold">
            {awayName}
          </p>

        </div>

      </div>

      {/* Prediction */}
      <div className="mx-4 mb-4 rounded-xl border border-white/10 bg-white/[0.03] p-4">

        <div className="flex items-center justify-between">

          <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
            Prediction
          </span>

          <div className="flex items-center gap-1 text-xs font-bold text-lime-400">
            <TrendingUp size={13} />
            {confidence}%
          </div>

        </div>

        {premium ? (

          <div className="mt-3">

            <p className="font-bold text-yellow-400">
              🔒 Premium Prediction
            </p>

            <p className="mt-1 text-xs text-gray-500">
              This prediction is available as premium content.
            </p>

          </div>

        ) : (

          <>
      {prediction && (
  <p className="mt-3 text-sm font-black text-white">
    {prediction}
  </p>
)}



            {/* Prediction Options */}
            

            

          </>

        )}

        {/* Confidence */}
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">

          <div
            className="h-full rounded-full bg-lime-400"
            style={{
              width: `${confidence}%`,
            }}
          />

        </div>

      </div>

     {/* Add / Remove */}
{!premium && (
  <button
    type="button"
    onClick={picked ? handleRemovePick : handleAddPick}
    className={`mx-4 mb-4 flex w-[calc(100%-2rem)] items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition ${
      picked
        ? "border border-lime-400/30 bg-lime-400/10 text-lime-400"
        : "bg-lime-400 text-black hover:bg-lime-300"
    }`}
  >
    {picked ? (
      <>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime-400 text-xs font-black text-black">
          {pickNumber}
        </span>

        Pick #{pickNumber}
      </>
    ) : (
      "+ Add to My Picks"
    )}
  </button>
)}

      {/* Footer */}
      <div className="flex items-center justify-between px-4 pb-4">

        <span className="text-xs text-gray-500">
          Football prediction
        </span>

        <Link
          to={`/predictions/${id}`}
          className="flex items-center gap-1 text-sm font-bold text-white transition group-hover:text-lime-400"
        >
          View Analysis

          <ArrowRight
            size={15}
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>

      </div>

    </article>
  );
}

export default PredictionCard;


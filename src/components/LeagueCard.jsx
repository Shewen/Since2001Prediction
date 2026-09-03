
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function createSlug(name = "") {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function LeagueCard({
  id,
  name,
  country,
  logo,
  flag,
  matches,
}) {
  const slug = createSlug(name);

  return (
    <Link
      to={`/leagues/${slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#10171e] p-5 transition duration-300 hover:-translate-y-1 hover:border-lime-400/30 hover:bg-[#131c24]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5">
          {logo ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="h-9 w-9 object-contain"
            />
          ) : (
            <span className="text-2xl">
              {flag || "🏆"}
            </span>
          )}
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-500 transition group-hover:border-lime-400/30 group-hover:text-lime-400">
          <ArrowUpRight size={17} />
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-medium uppercase tracking-wider text-gray-500">
          {country || "International"}
        </p>

        <h3 className="mt-1 text-lg font-black text-white">
          {name}
        </h3>

        <p className="mt-2 text-sm text-gray-500">
          {matches ?? 0} predictions
        </p>
      </div>

      <div className="absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-lime-400/5 blur-2xl transition group-hover:bg-lime-400/10" />
    </Link>
  );
}

export default LeagueCard;


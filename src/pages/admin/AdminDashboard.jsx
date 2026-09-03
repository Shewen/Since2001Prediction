import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  CalendarDays,
  Crown,
  Unlock,
  Trophy,
  LogOut,
  Users,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock3,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

import {
  getPredictions,
  deletePrediction,
} from "../../utils/predictionStorage";

import { supabase } from "../../lib/supabase";

function AdminDashboard() {
  const navigate = useNavigate();

  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPredictions = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const data = await getPredictions();
      setPredictions(data);
    } catch (error) {
      console.error("Failed to load predictions:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this prediction?"
    );

    if (!confirmed) return;

    try {
      const updatedPredictions = await deletePrediction(id);
      setPredictions(updatedPredictions);
    } catch (error) {
      console.error("Failed to delete prediction:", error);
      alert("Failed to delete prediction.");
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  // --------------------------------
  // Dashboard calculations
  // --------------------------------

  const today = new Date().toISOString().slice(0, 10);

  const todayPredictions = predictions.filter((prediction) => {
    const predictionDate = String(prediction.date || "").slice(0, 10);

    return (
      prediction.date === "Today" ||
      predictionDate === today
    );
  });

  const freePredictions = predictions.filter(
    (prediction) => !prediction.premium
  );

  const premiumPredictions = predictions.filter(
    (prediction) => prediction.premium
  );

  const completedResults = predictions.filter(
    (prediction) =>
      prediction.resultStatus === "won" ||
      prediction.resultStatus === "lost"
  );

  const wonResults = predictions.filter(
    (prediction) => prediction.resultStatus === "won"
  );

  const lostResults = predictions.filter(
    (prediction) => prediction.resultStatus === "lost"
  );

  const winRate =
    completedResults.length > 0
      ? Math.round(
          (wonResults.length / completedResults.length) * 100
        )
      : 0;

  // --------------------------------
  // Recent predictions
  // --------------------------------

  const recentPredictions = [...predictions]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  const recentResults = [...completedResults]
    .sort((a, b) => Number(b.id) - Number(a.id))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#070b0f] text-white">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-lime-400" />

          <p className="mt-4 text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b0f] text-white">

      {/* ================= HEADER ================= */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-lime-400" />

                <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
                  Owner Dashboard
                </p>
              </div>

              <h1 className="mt-3 text-3xl font-black sm:text-4xl">
                Prediction Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm text-gray-400">
                Manage predictions, results, teams and leagues from one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <Link
                to="/admin/predictions/new"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-lime-300"
              >
                <Plus size={17} />
                Add Prediction
              </Link>

              <button
                type="button"
                onClick={() => loadPredictions(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <RefreshCw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-gray-300 transition hover:bg-white/10 hover:text-white"
              >
                <LogOut size={16} />
                Logout
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* ================= QUICK ACTIONS ================= */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <Link
              to="/admin/predictions/new"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#10171e] p-4 transition hover:border-lime-400/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                  <Plus size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Add Prediction
                  </p>

                  <p className="text-xs text-gray-500">
                    Create a new pick
                  </p>
                </div>
              </div>

              <ArrowRight
                size={16}
                className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-lime-400"
              />
            </Link>

            <Link
              to="/admin/results"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#10171e] p-4 transition hover:border-lime-400/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
                  <Trophy size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Manage Results
                  </p>

                  <p className="text-xs text-gray-500">
                    Enter match results
                  </p>
                </div>
              </div>

              <ArrowRight
                size={16}
                className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-lime-400"
              />
            </Link>

            <Link
              to="/admin/teams"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#10171e] p-4 transition hover:border-lime-400/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-400/10 text-purple-400">
                  <Users size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Manage Teams
                  </p>

                  <p className="text-xs text-gray-500">
                    Add or update teams
                  </p>
                </div>
              </div>

              <ArrowRight
                size={16}
                className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-lime-400"
              />
            </Link>

            <Link
              to="/admin/leagues"
              className="group flex items-center justify-between rounded-xl border border-white/10 bg-[#10171e] p-4 transition hover:border-lime-400/30 hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/10 text-yellow-400">
                  <BarChart3 size={18} />
                </div>

                <div>
                  <p className="text-sm font-bold">
                    Manage Leagues
                  </p>

                  <p className="text-xs text-gray-500">
                    Organize competitions
                  </p>
                </div>
              </div>

              <ArrowRight
                size={16}
                className="text-gray-600 transition group-hover:translate-x-1 group-hover:text-lime-400"
              />
            </Link>

          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Total */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Total Predictions
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                  <Trophy size={18} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black">
                {predictions.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                All predictions
              </p>
            </div>

            {/* Today */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Today's Predictions
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10 text-blue-400">
                  <CalendarDays size={18} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black">
                {todayPredictions.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Scheduled for today
              </p>
            </div>

            {/* Completed */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Completed Results
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-400/10 text-purple-400">
                  <CheckCircle2 size={18} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black">
                {completedResults.length}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Matches with results
              </p>
            </div>

            {/* Win Rate */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  Win Rate
                </span>

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400/10 text-lime-400">
                  <BarChart3 size={18} />
                </div>
              </div>

              <p className="mt-4 text-3xl font-black">
                {winRate}%
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {wonResults.length} won · {lostResults.length} lost
              </p>
            </div>

          </div>

          {/* Access stats */}
          <div className="mt-4 grid gap-4 sm:grid-cols-2">

            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-400">
                    Free Predictions
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {freePredictions.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-lime-400">
                  <Unlock size={20} />
                </div>

              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-5">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-400">
                    Premium Predictions
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {premiumPredictions.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400">
                  <Crown size={20} />
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ================= RECENT PREDICTIONS ================= */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Recent Predictions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your latest predictions.
              </p>
            </div>

            <Link
              to="/admin"
              className="hidden text-sm font-bold text-lime-400 sm:block"
            >
              View all
            </Link>
          </div>

          {recentPredictions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171e] p-10 text-center">
              <Trophy
                size={28}
                className="mx-auto text-gray-600"
              />

              <p className="mt-3 text-sm text-gray-500">
                No predictions yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#10171e]">

              <div className="divide-y divide-white/10">

                {recentPredictions.map((prediction) => (
                  <div
                    key={prediction.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between"
                  >

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
                          {prediction.league}
                        </span>

                        {prediction.premium ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-yellow-400/10 px-2 py-1 text-[10px] font-bold text-yellow-400">
                            <Crown size={11} />
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-lime-400/10 px-2 py-1 text-[10px] font-bold text-lime-400">
                            <Unlock size={11} />
                            FREE
                          </span>
                        )}

                      </div>

                      <p className="mt-2 truncate text-sm font-bold sm:text-base">
                        {prediction.homeTeam}{" "}
                        <span className="mx-1 text-gray-600">
                          vs
                        </span>{" "}
                        {prediction.awayTeam}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {prediction.date} · {prediction.time}
                      </p>

                    </div>

                    <div className="flex items-center gap-3">

                      <div className="text-right">
                        <p className="text-xs text-gray-500">
                          Prediction
                        </p>

                        <p className="mt-1 max-w-[220px] truncate text-sm font-bold text-lime-400">
                          {prediction.prediction}
                        </p>
                      </div>

                      <Link
                        to={`/admin/predictions/${prediction.id}/edit`}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                        title="Edit prediction"
                      >
                        <Pencil size={15} />
                      </Link>

                    </div>

                  </div>
                ))}

              </div>
            </div>
          )}

        </div>
      </section>

      {/* ================= RECENT RESULTS ================= */}
      <section className="pb-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black">
                Recent Results
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Latest completed prediction results.
              </p>
            </div>

            <Link
              to="/admin/results"
              className="hidden text-sm font-bold text-lime-400 sm:block"
            >
              Manage results
            </Link>
          </div>

          {recentResults.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171e] p-10 text-center">

              <Clock3
                size={28}
                className="mx-auto text-gray-600"
              />

              <p className="mt-3 text-sm text-gray-500">
                No completed results yet.
              </p>

              <Link
                to="/admin/results"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-black"
              >
                Manage Results
                <ArrowRight size={15} />
              </Link>

            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">

              {recentResults.map((prediction) => {

                const won =
                  prediction.resultStatus === "won";

                return (
                  <div
                    key={prediction.id}
                    className="rounded-2xl border border-white/10 bg-[#10171e] p-5"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                          {prediction.league}
                        </p>

                        <p className="mt-2 text-sm font-bold">
                          {prediction.homeTeam}
                          <span className="mx-2 text-gray-600">
                            vs
                          </span>
                          {prediction.awayTeam}
                        </p>

                      </div>

                      {won ? (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-lime-400/10 px-3 py-1.5 text-xs font-bold text-lime-400">
                          <CheckCircle2 size={13} />
                          WON
                        </span>
                      ) : (
                        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-red-400/10 px-3 py-1.5 text-xs font-bold text-red-400">
                          <XCircle size={13} />
                          LOST
                        </span>
                      )}

                    </div>

                    <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">

                      <div>
                        <p className="text-[11px] uppercase tracking-wider text-gray-600">
                          Final Score
                        </p>

                        <p className="mt-1 text-xl font-black">
                          {prediction.homeScore} -{" "}
                          {prediction.awayScore}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wider text-gray-600">
                          Prediction
                        </p>

                        <p className="mt-1 max-w-[180px] truncate text-sm font-bold text-lime-400">
                          {prediction.prediction}
                        </p>
                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>
      </section>

      {/* ================= ALL PREDICTIONS ================= */}
      <section className="border-t border-white/10 py-10">

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <h2 className="text-2xl font-black">
                All Predictions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Add, edit or remove predictions.
              </p>
            </div>

            <Link
              to="/admin/predictions/new"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-lime-400 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-lime-300"
            >
              <Plus size={16} />
              New Prediction
            </Link>

          </div>

          {predictions.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/10 bg-[#10171e] px-6 py-16 text-center">

              <Trophy
                size={30}
                className="mx-auto text-gray-600"
              />

              <h3 className="mt-4 text-lg font-bold">
                No predictions yet
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first football prediction.
              </p>

              <Link
                to="/admin/predictions/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-lime-400 px-5 py-3 text-sm font-bold text-black"
              >
                <Plus size={18} />
                Add Prediction
              </Link>

            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#10171e]">

              <div className="overflow-x-auto">

                <table className="w-full min-w-[900px] text-left">

                  <thead className="border-b border-white/10 bg-white/[0.02]">

                    <tr>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Match
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        League
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Date
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Prediction
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Confidence
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Access
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Result
                      </th>

                      <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-white/10">

                    {predictions.map((prediction) => {

                      const hasResult =
                        prediction.resultStatus === "won" ||
                        prediction.resultStatus === "lost";

                      return (
                        <tr
                          key={prediction.id}
                          className="transition hover:bg-white/[0.02]"
                        >

                          <td className="px-5 py-5">

                            <div className="font-bold">
                              {prediction.homeTeam}
                            </div>

                            <div className="my-1 text-xs text-gray-600">
                              VS
                            </div>

                            <div className="font-bold">
                              {prediction.awayTeam}
                            </div>

                            <div className="mt-2 text-xs text-gray-500">
                              {prediction.time}
                            </div>

                          </td>

                          <td className="px-5 py-5 text-sm text-gray-300">
                            {prediction.league}
                          </td>

                          <td className="px-5 py-5">

                            <span className="rounded-lg bg-white/5 px-3 py-1.5 text-xs font-semibold text-gray-300">
                              {prediction.date}
                            </span>

                          </td>

                          <td className="max-w-[220px] px-5 py-5 text-sm font-semibold text-lime-400">
                            <span className="line-clamp-2">
                              {prediction.prediction}
                            </span>
                          </td>

                          <td className="px-5 py-5 text-sm font-bold">
                            {prediction.confidence}%
                          </td>

                          <td className="px-5 py-5">

                            {prediction.premium ? (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-yellow-400/10 px-3 py-1.5 text-xs font-bold text-yellow-400">
                                <Crown size={13} />
                                Premium
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-lime-400/10 px-3 py-1.5 text-xs font-bold text-lime-400">
                                <Unlock size={13} />
                                Free
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-5">

                            {hasResult ? (
                              <div>

                                <span
                                  className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold ${
                                    prediction.resultStatus === "won"
                                      ? "bg-lime-400/10 text-lime-400"
                                      : "bg-red-400/10 text-red-400"
                                  }`}
                                >
                                  {prediction.resultStatus === "won" ? (
                                    <CheckCircle2 size={13} />
                                  ) : (
                                    <XCircle size={13} />
                                  )}

                                  {prediction.resultStatus.toUpperCase()}
                                </span>

                                <p className="mt-1 text-xs text-gray-500">
                                  {prediction.homeScore} -{" "}
                                  {prediction.awayScore}
                                </p>

                              </div>
                            ) : (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-white/5 px-3 py-1.5 text-xs font-bold text-gray-500">
                                <Clock3 size={13} />
                                Pending
                              </span>
                            )}

                          </td>

                          <td className="px-5 py-5">

                            <div className="flex items-center gap-2">

                              <Link
                                to={`/admin/predictions/${prediction.id}/edit`}
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-gray-300 transition hover:bg-white/10 hover:text-white"
                                title="Edit prediction"
                              >
                                <Pencil size={16} />
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(prediction.id)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 transition hover:bg-red-500/20"
                                title="Delete prediction"
                              >
                                <Trash2 size={16} />
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    })}

                  </tbody>

                </table>

              </div>

            </div>
          )}

        </div>

      </section>

    </div>
  );
}

export default AdminDashboard;
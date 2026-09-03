import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Pencil,
  X,
  Save,
  Search,
  Check,
} from "lucide-react";

import {
  getLeagues as getSavedLeagues,
  addLeague,
  updateLeague,
  deleteLeague,
} from "../../utils/leagueStorage";

import { getLeagues as searchApiLeagues } from "../../utils/apiFootball";

function AdminLeagues() {
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    country: "",
    logo: "",
    api_league_id: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // API-Football search
  const [apiSearch, setApiSearch] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [searchingApi, setSearchingApi] = useState(false);
  const [apiSearchError, setApiSearchError] = useState("");

  const loadLeagues = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSavedLeagues();

      setLeagues(data);
    } catch (error) {
      console.error("Failed to load leagues:", error);
      setError("Failed to load leagues.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeagues();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      country: "",
      logo: "",
      api_league_id: "",
    });

    setEditingId(null);

    setApiSearch("");
    setApiResults([]);
    setApiSearchError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Search API-Football
  const handleApiSearch = async () => {
    const searchTerm = apiSearch.trim();

    if (!searchTerm) {
      setApiSearchError("Enter a league name to search.");
      setApiResults([]);
      return;
    }

    try {
      setSearchingApi(true);
      setApiSearchError("");
      setApiResults([]);

      const results = await searchApiLeagues(searchTerm);

      if (!results || results.length === 0) {
        setApiSearchError(
          "No leagues found. Try another league name."
        );
        return;
      }

      setApiResults(results);
    } catch (error) {
      console.error(
        "Failed to search API-Football leagues:",
        error
      );

      setApiSearchError(
        "Failed to search API-Football. Please try again."
      );
    } finally {
      setSearchingApi(false);
    }
  };

  // Select API-Football league
  const handleSelectApiLeague = (item) => {
    const league = item?.league;
    const country = item?.country;

    if (!league) return;

    setForm({
      name: league.name || "",
      country: country?.name || "",
      logo: league.logo || "",
      api_league_id: league.id || "",
    });

    setApiSearch("");
    setApiResults([]);
    setApiSearchError("");

    setSuccess(
      `${league.name} selected from API-Football.`
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("League name is required.");
      return;
    }

    if (!form.api_league_id) {
      setError(
        "Please search API-Football and select a league first."
      );
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const updatedLeague = await updateLeague(
          editingId,
          {
            name: form.name.trim(),
            country: form.country.trim(),
            logo: form.logo.trim(),
            api_league_id: form.api_league_id,
          }
        );

        setLeagues((current) =>
          current
            .map((league) =>
              league.id === editingId
                ? updatedLeague
                : league
            )
            .sort((a, b) =>
              a.name.localeCompare(b.name)
            )
        );

        setSuccess("League updated successfully.");
      } else {
        const newLeague = await addLeague({
          name: form.name.trim(),
          country: form.country.trim(),
          logo: form.logo.trim(),
          api_league_id: form.api_league_id,
        });

        setLeagues((current) =>
          [...current, newLeague].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );

        setSuccess("League added successfully.");
      }

      resetForm();
    } catch (error) {
      console.error("Failed to save league:", error);

      setError(
        editingId
          ? "Failed to update league."
          : "Failed to add league."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (league) => {
    setError("");
    setSuccess("");

    setEditingId(league.id);

    setForm({
      name: league.name || "",
      country: league.country || "",
      logo: league.logo || "",
      api_league_id: league.api_league_id || "",
    });

    setApiSearch("");
    setApiResults([]);
    setApiSearchError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this league?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteLeague(id);

      setLeagues((current) =>
        current.filter((league) => league.id !== id)
      );

      if (editingId === id) {
        resetForm();
      }

      setSuccess("League deleted successfully.");
    } catch (error) {
      console.error("Failed to delete league:", error);
      setError("Failed to delete league.");
    }
  };

  return (
    <div className="min-h-screen bg-[#070b0f] text-white">

      {/* Header */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

          <Link
            to="/admin"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-lime-400"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>

          <div className="mt-6">
            <h1 className="text-3xl font-black">
              Manage Leagues
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add and manage the football leagues available
              on your platform.
            </p>
          </div>

        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-6 rounded-xl border border-lime-400/20 bg-lime-400/10 px-4 py-3 text-sm text-lime-400">
              {success}
            </div>
          )}

          <div className="grid gap-8 lg:grid-cols-[360px_1fr]">

            {/* Add / Edit League */}
            <div className="h-fit rounded-2xl border border-white/10 bg-[#10171e] p-6">

              <div className="mb-6 flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400 text-black">
                  {editingId ? (
                    <Pencil size={18} />
                  ) : (
                    <Plus size={20} />
                  )}
                </div>

                <div>
                  <h2 className="font-black">
                    {editingId
                      ? "Edit League"
                      : "Add League"}
                  </h2>

                  <p className="text-xs text-gray-500">
                    {editingId
                      ? "Update league information"
                      : "Create a new league"}
                  </p>
                </div>

              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                {/* API-Football Search */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Find League
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={apiSearch}
                      onChange={(e) =>
                        setApiSearch(e.target.value)
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleApiSearch();
                        }
                      }}
                      placeholder="e.g. Premier League"
                      className="h-12 min-w-0 flex-1 rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                    />

                    <button
                      type="button"
                      onClick={handleApiSearch}
                      disabled={searchingApi}
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gray-300 transition hover:bg-lime-400 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                      title="Search API-Football"
                    >
                      <Search size={18} />
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-gray-600">
                    Search API-Football and select the correct
                    league.
                  </p>

                  {/* Search Error */}
                  {apiSearchError && (
                    <p className="mt-2 text-xs text-red-400">
                      {apiSearchError}
                    </p>
                  )}

                  {/* Search Results */}
                  {apiResults.length > 0 && (
                    <div className="mt-3 max-h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-[#070b0f] p-2">

                      {apiResults.map((item, index) => {
                        const league = item?.league;
                        const country = item?.country;

                        if (!league) return null;

                        return (
                          <button
                            key={`${league.id}-${index}`}
                            type="button"
                            onClick={() =>
                              handleSelectApiLeague(item)
                            }
                            className="flex w-full items-center gap-3 rounded-lg border border-transparent p-3 text-left transition hover:border-lime-400/20 hover:bg-white/5"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5">
                              {league.logo ? (
                                <img
                                  src={league.logo}
                                  alt={`${league.name} logo`}
                                  className="h-7 w-7 object-contain"
                                />
                              ) : (
                                <span className="text-xs text-gray-600">
                                  —
                                </span>
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-white">
                                {league.name}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {country?.name ||
                                  "International"}{" "}
                                • API ID: {league.id}
                              </p>
                            </div>

                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-400/10 text-lime-400">
                              <Check size={15} />
                            </div>
                          </button>
                        );
                      })}

                    </div>
                  )}
                </div>

                {/* Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    League Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Premier League"
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                  />
                </div>

                {/* Country */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Country
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    placeholder="e.g. England"
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                  />
                </div>

                {/* Logo */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    League Logo URL
                  </label>

                  <input
                    type="text"
                    name="logo"
                    value={form.logo}
                    onChange={handleChange}
                    placeholder="https://..."
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                  />

                  <p className="mt-2 text-xs text-gray-600">
                    Automatically filled when you select a league.
                  </p>
                </div>

                {/* API League ID */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    API-Football League ID
                  </label>

                  <input
                    type="number"
                    name="api_league_id"
                    value={form.api_league_id}
                    onChange={handleChange}
                    placeholder="Automatically filled"
                    className="h-12 w-full rounded-xl border border-white/10 bg-[#070b0f] px-4 text-sm text-white outline-none placeholder:text-gray-600 focus:border-lime-400/40"
                  />

                  <p className="mt-2 text-xs text-gray-600">
                    Automatically filled when you select a league.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-lime-400 text-sm font-black text-black transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {editingId ? (
                    <Save size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Save Changes"
                    : "Add League"}
                </button>

                {/* Cancel */}
                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 text-sm font-bold text-gray-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <X size={16} />
                    Cancel Editing
                  </button>
                )}

              </form>
            </div>

            {/* League List */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e]">

              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="font-black">
                  Your Leagues
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  {leagues.length} league
                  {leagues.length !== 1 ? "s" : ""}
                </p>
              </div>

              {loading ? (

                <div className="px-6 py-16 text-center text-sm text-gray-500">
                  Loading leagues...
                </div>

              ) : leagues.length === 0 ? (

                <div className="px-6 py-16 text-center">
                  <p className="text-sm text-gray-500">
                    No leagues added yet.
                  </p>
                </div>

              ) : (

                <div className="divide-y divide-white/5">

                  {leagues.map((league) => (

                    <div
                      key={league.id}
                      className="flex items-center justify-between gap-4 px-6 py-5"
                    >

                      <div className="flex min-w-0 items-center gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5">

                          {league.logo ? (
                            <img
                              src={league.logo}
                              alt={`${league.name} logo`}
                              className="h-8 w-8 object-contain"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">
                              —
                            </span>
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-bold">
                            {league.name}
                          </p>

                          {league.country && (
                            <p className="mt-1 text-xs text-gray-500">
                              {league.country}
                            </p>
                          )}

                          {league.api_league_id && (
                            <p className="mt-1 text-[11px] text-gray-600">
                              API ID: {league.api_league_id}
                            </p>
                          )}

                        </div>

                      </div>

                      <div className="flex items-center gap-1">

                        <button
                          type="button"
                          onClick={() =>
                            handleEdit(league)
                          }
                          className="rounded-lg p-2 text-gray-600 transition hover:bg-lime-400/10 hover:text-lime-400"
                          title="Edit league"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(league.id)
                          }
                          className="rounded-lg p-2 text-gray-600 transition hover:bg-red-500/10 hover:text-red-400"
                          title="Delete league"
                        >
                          <Trash2 size={17} />
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}

export default AdminLeagues;
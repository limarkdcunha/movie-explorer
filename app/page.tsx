"use client";

import { useState } from "react";
import { useFavorites } from "./components/useFavorites/useFavorites";

interface OMDbMovie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState<OMDbMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { favorites, addFavorite, removeFavorite } = useFavorites();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    setMovies([]);

    try {
      const res = await fetch(`/api/search?query=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Search failed");

      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        setError("No movies found.");
      } else {
        const uniqueMovies = data.results.filter(
          (movie: OMDbMovie, index: number, self: OMDbMovie[]) =>
            index === self.findIndex((m) => m.imdbID === movie.imdbID),
        );

        setMovies(uniqueMovies);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setError("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      <header className="bg-slate-900 text-white p-6 shadow-md">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">🎬 Movie Explorer</h1>
          <a
            href="/pages/favorites"
            className="text-sm bg-slate-700 hover:bg-slate-600 px-3 py-1 rounded transition"
          >
            View Favorites ({favorites.length})
          </a>
        </div>
      </header>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="text"
            className="flex-1 p-4 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Search titles (e.g., Star Wars)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Movie Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => {
            const isFav = favorites.some((f) => f.imdbID === movie.imdbID);
            const hasPoster = movie.Poster && movie.Poster !== "N/A";

            return (
              <div
                key={movie.imdbID}
                className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-gray-100 flex flex-col"
              >
                <div className="aspect-[2/3] relative bg-gray-200">
                  {hasPoster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 font-medium">
                      No Poster
                    </div>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3
                    className="font-bold text-lg leading-tight mb-1 truncate"
                    title={movie.Title}
                  >
                    {movie.Title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{movie.Year}</p>

                  <div className="mt-auto">
                    <button
                      onClick={() => {
                        if (isFav) {
                          removeFavorite(movie.imdbID);
                        } else {
                          addFavorite({
                            imdbID: movie.imdbID,
                            Title: movie.Title,
                            Poster: movie.Poster,
                            Year: movie.Year,
                            rating: 0,
                            note: "",
                          });
                        }
                      }}
                      className={`w-full py-2 rounded-lg text-sm font-medium transition ${
                        isFav
                          ? "bg-red-100 text-red-600 hover:bg-red-200"
                          : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {isFav ? "Remove Favorite" : "Add to Favorites"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

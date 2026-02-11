"use client";

import { useFavorites } from "@/app/components/useFavorites/useFavorites";
import Link from "next/link";

export default function FavoritesPage() {
  const { favorites, removeFavorite, updateRating } = useFavorites(); // We will add updateRating to the hook next

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-10">
      <header className="bg-slate-900 text-white p-6 shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">⭐ My Collection</h1>
          <Link
            href="/"
            className="text-sm bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded transition"
          >
            ← Back to Search
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto mt-8 px-4">
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-semibold text-gray-600">
              No favorites yet.
            </h2>
            <p className="text-gray-500 mt-2">
              Go back and search for movies to add them!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {favorites.map((movie) => (
              <div
                key={movie.imdbID}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-6"
              >
                {/* Poster */}
                <div className="w-full md:w-32 flex-shrink-0">
                  {movie.Poster && movie.Poster !== "N/A" ? (
                    // Using Image from next requires whitelisting and
                    // since this is not a breaking point we can update it later
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={movie.Poster}
                      alt={movie.Title}
                      className="w-full rounded-md shadow-sm"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center text-xs text-gray-500">
                      No Image
                    </div>
                  )}
                </div>

                {/* Details & Rating Form */}
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {movie.Title}
                      </h3>
                      <p className="text-sm text-gray-500">{movie.Year}</p>
                    </div>
                    <button
                      onClick={() => removeFavorite(movie.imdbID)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {/* Rating Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                        Your Rating (1-5)
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() =>
                              updateRating(movie.imdbID, star, movie.note)
                            }
                            className={`text-2xl transition ${
                              star <= (movie.rating || 0)
                                ? "text-yellow-400 scale-110"
                                : "text-gray-300 hover:text-yellow-200"
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                        Personal Notes
                      </label>
                      <textarea
                        className="w-full p-3 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        rows={2}
                        placeholder="What did you think of this movie?"
                        value={movie.note || ""}
                        onChange={(e) =>
                          updateRating(
                            movie.imdbID,
                            movie.rating,
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

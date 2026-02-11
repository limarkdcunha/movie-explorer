"use client";

import { useFavorites } from "@/app/components/useFavorites/useFavorites";
import Link from "next/link";
import { use, useEffect, useState } from "react";

interface MovieDetails {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Poster: string;
  imdbRating: string;
  imdbID: string;
}

export default function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrapping params for Next.js 15+ (if on older Next.js, remove 'use' and 'Promise')
  const { id } = use(params);

  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { favorites, addFavorite, removeFavorite } = useFavorites();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await fetch(`/api/movie?id=${id}`);
        const data = await res.json();
        if (data.Title) {
          setMovie(data);
        }
      } catch (error) {
        console.error("Failed to load movie");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500">
        Loading movie details...
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-700">Movie not found</h2>
        <Link href="/" className="text-blue-600 mt-4 hover:underline">
          ← Back to Home
        </Link>
      </div>
    );
  }

  const isFav = favorites.some((f) => f.imdbID === movie.imdbID);

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans py-10 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-block mb-6 text-sm text-gray-500 hover:text-blue-600 transition"
        >
          ← Back to Search
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          {/* Large Poster */}
          <div className="w-full md:w-1/3 bg-gray-200">
            {movie.Poster && movie.Poster !== "N/A" ? (
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="h-96 flex items-center justify-center text-gray-400">
                No Image
              </div>
            )}
          </div>

          {/* Details Content */}
          <div className="p-8 md:w-2/3 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-2">
                  {movie.Title}
                </h1>
                <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {movie.Year}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {movie.Rated}
                  </span>
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {movie.Runtime}
                  </span>
                </div>
              </div>
              <div className="text-center bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-100">
                <span className="block text-2xl font-bold text-yellow-600">
                  {movie.imdbRating}
                </span>
                <span className="text-xs text-yellow-700 font-medium">
                  IMDb
                </span>
              </div>
            </div>

            {/* Plot */}
            <p className="text-gray-700 leading-relaxed mb-6 text-lg">
              {movie.Plot}
            </p>

            <div className="space-y-3 mb-8 text-sm">
              <p>
                <strong className="text-gray-900">Genre:</strong> {movie.Genre}
              </p>
              <p>
                <strong className="text-gray-900">Director:</strong>{" "}
                {movie.Director}
              </p>
              <p>
                <strong className="text-gray-900">Cast:</strong> {movie.Actors}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-auto pt-6 border-t border-gray-100">
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
                className={`w-full md:w-auto px-6 py-3 rounded-lg font-semibold transition ${
                  isFav
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                    : "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                }`}
              >
                {isFav ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

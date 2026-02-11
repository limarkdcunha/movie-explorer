import { useEffect, useState } from "react";

export interface FavoriteMovie {
  imdbID: string;
  Title: string;
  Poster: string;
  Year: string;
  rating: number;
  note: string;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  // ✅ Track if we have finished loading from localStorage
  const [isLoaded, setIsLoaded] = useState(false);

  // 1. Load from localStorage (runs once on mount)
  useEffect(() => {
    const saved = localStorage.getItem("omdb-movie-favs");
    if (saved) {
      try {
        // TO DO: Update this with a proper fix for handling localStorage in Next.js
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
    setIsLoaded(true); // ✅ Mark as loaded
  }, []);

  // 2. Persist to localStorage whenever favorites change
  useEffect(() => {
    // ✅ ONLY save if we have finished the initial load.
    // This prevents overwriting with an empty array on page refresh.
    if (isLoaded) {
      localStorage.setItem("omdb-movie-favs", JSON.stringify(favorites));
    }
  }, [favorites, isLoaded]);

  const addFavorite = (movie: FavoriteMovie) => {
    if (!favorites.some((f) => f.imdbID === movie.imdbID)) {
      setFavorites((prev) => [...prev, movie]);
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.imdbID !== id));
  };

  const updateRating = (id: string, rating: number, note: string) => {
    setFavorites((prev) =>
      prev.map((movie) =>
        movie.imdbID === id ? { ...movie, rating, note } : movie,
      ),
    );
  };

  return { favorites, addFavorite, removeFavorite, updateRating, isLoaded };
}

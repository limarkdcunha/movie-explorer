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

  console.log("FAV RENDER");

  useEffect(() => {
    const saved = localStorage.getItem("omdb-movie-favs");
    if (saved) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Persist to localStorage whenever favorites change
  useEffect(() => {
    localStorage.setItem("omdb-movie-favs", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (movie: FavoriteMovie) => {
    if (!favorites.some((f) => f.imdbID === movie.imdbID)) {
      setFavorites([...favorites, movie]);
    }
  };

  const removeFavorite = (id: string) => {
    setFavorites(favorites.filter((f) => f.imdbID !== id));
  };

  const updateRating = (id: string, rating: number, note: string) => {
    setFavorites(
      favorites.map((movie) =>
        movie.imdbID === id ? { ...movie, rating, note } : movie,
      ),
    );
  };

  return { favorites, addFavorite, removeFavorite, updateRating };
}

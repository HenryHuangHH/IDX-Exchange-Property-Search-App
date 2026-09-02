import { useState, useEffect } from 'react';

const STORAGE_KEY = 'favoriteProperties';
const CHANGE_EVENT = 'favoritePropertiesChanged';

function readFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState(() => readFavorites());

  useEffect(() => {
    function sync() {
      setFavorites(readFavorites());
    }

    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const saveFavorites = (newFavorites) => {
    setFavorites(newFavorites);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  const addFavorite = (propertyId) => {
    if (!favorites.includes(propertyId)) {
      saveFavorites([...favorites, propertyId]);
    }
  };

  const removeFavorite = (propertyId) => {
    saveFavorites(favorites.filter((id) => id !== propertyId));
  };

  const isFavorite = (propertyId) => {
    return favorites.includes(propertyId);
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };
}

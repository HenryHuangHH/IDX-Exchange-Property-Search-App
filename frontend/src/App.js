import ListingsPage from './pages/ListingsPage';
import FavoritesPage from './pages/FavoritesPage';

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PropertyDetailPage from './pages/PropertyDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<ListingsPage />}
        />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </BrowserRouter>

  );
}

export default App;

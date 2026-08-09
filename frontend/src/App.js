import ListingsPage from './pages/ListingsPage';

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
      </Routes>
    </BrowserRouter>

  );
}

export default App;

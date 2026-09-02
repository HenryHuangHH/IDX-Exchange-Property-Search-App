import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/PropertyCard';
import { fetchPropertyDetail } from '../api/client';
import { useFavorites } from '../hooks/useFavorites';

function FavoritesPage() {
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (favorites.length === 0) {
        setProperties([]);
        setLoading(false);
        setError(null);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const results = await Promise.all(
          favorites.map((id) => fetchPropertyDetail(id).catch(() => null))
        );
        if (!cancelled) {
          setProperties(results.filter(Boolean));
        }
      } catch (err) {
        if (!cancelled) {
          setError('Could not load favorites.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [favorites]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <Link to="/" className="text-slate-700 underline">
          Back to listings
        </Link>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Favorites</h1>
        <p className="mt-2 text-slate-600">
          {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
        </p>
      </header>

      {loading && (
        <p className="text-slate-600">Loading favorites…</p>
      )}

      {error && (
        <p className="text-red-600">{error}</p>
      )}

      {!loading && !error && favorites.length === 0 && (
        <p className="text-slate-600">No favorites yet. Star a property on the listings page.</p>
      )}

      {!loading && !error && properties.length > 0 && (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((listing) => (
            <PropertyCard key={listing.L_ListingID} listing={listing} />
          ))}
        </section>
      )}
    </main>
  );
}

export default FavoritesPage;

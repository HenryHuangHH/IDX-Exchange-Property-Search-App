import { useMemo, useState } from 'react';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { useProperties } from '../hooks/useProperties';

function ListingsPage() {
  const [filters, setFilters] = useState({});

  const params = useMemo(() => {
    const merged = { limit: 20, offset: 0, ...filters };
    return Object.fromEntries(
      Object.entries(merged).filter(([, value]) => value !== '' && value !== undefined && value !== null)
    );
  }, [filters]);

  const { properties, total, loading, error } = useProperties(params);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Property Listings</h1>
        {!loading && !error && (
          <p className="mt-2 text-slate-600">
            Showing {properties.length} of {total} properties
          </p>
        )}
      </header>

      <PropertyFilters onApply={setFilters} />

      {loading && (
        <div className="flex min-h-[40vh] items-center justify-center text-lg text-slate-600">
          Fetching listings…
        </div>
      )}

      {error && (
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((listing) => (
            <PropertyCard key={listing.L_ListingID} listing={listing} />
          ))}
        </section>
      )}
    </main>
  );
}

export default ListingsPage;

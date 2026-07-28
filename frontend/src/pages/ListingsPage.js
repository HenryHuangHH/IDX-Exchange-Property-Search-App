import PropertyCard from '../components/PropertyCard';
import { useProperties } from '../hooks/useProperties';

function ListingsPage() {
  const { properties, total, loading, error } = useProperties({ limit: 20, offset: 0 });

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-lg text-slate-600">
        Fetching listings…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
          {error}
        </p>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Property Listings</h1>
        <p className="mt-2 text-slate-600">
          Showing {properties.length} of {total} properties
        </p>
      </header>

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((listing) => (
          <PropertyCard key={listing.L_ListingID} listing={listing} />
        ))}
      </section>
    </main>
  );
}

export default ListingsPage;

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Pagination from '../components/Pagination';
import PropertyCard from '../components/PropertyCard';
import PropertyFilters from '../components/PropertyFilters';
import { useProperties } from '../hooks/useProperties';

function ListingsPage() {
  const [filters, setFilters] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(21);

  const params = useMemo(() => {
    const merged = {
      limit: itemsPerPage,
      offset: (currentPage - 1) * itemsPerPage,
      ...filters,
    };
    return Object.fromEntries(
      Object.entries(merged).filter(([, value]) => value !== '' && value !== undefined && value !== null)
    );
  }, [filters, currentPage, itemsPerPage]);

  function handleApplyFilters(nextFilters) {
    setFilters(nextFilters);
    setCurrentPage(1);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const { properties, total, loading, error } = useProperties(params);
  const totalPages = Math.max(1, Math.ceil(total / itemsPerPage));

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Property Listings</h1>
          <Link to="/favorites" className="text-slate-700 underline">
            Favorites
          </Link>
        </div>
        {!loading && !error && (
          <p className="mt-2 text-slate-600">
            Showing {properties.length} of {total} properties
          </p>
        )}
      </header>

      <PropertyFilters onApply={handleApplyFilters} />

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

      {!loading && !error && properties.length === 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-600">
          No properties found.
        </div>
      )}

      {!loading && !error && properties.length > 0 && (
        <>
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((listing) => (
              <PropertyCard key={listing.L_ListingID} listing={listing} />
            ))}
          </section>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </main>
  );
}

export default ListingsPage;

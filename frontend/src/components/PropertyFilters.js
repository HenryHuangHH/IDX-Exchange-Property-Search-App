import { useState } from 'react';

const BEDS_OPTIONS = [1, 2, 3, 4, 5];
const BATHS_OPTIONS = [1, 2, 3, 4, 5];

const EMPTY_FILTERS = {
    city: '',
    zipcode: '',
    minPrice: '',
    maxPrice: '',
    beds: '',
    baths: '',
};

function PropertyFilters({ onApply }) {
    const [filters, setFilters] = useState(EMPTY_FILTERS);

    function handleChange(field) {
        return (e) => setFilters((prev) => ({ ...prev, [field]: e.target.value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        onApply(filters);
    }

    function handleReset() {
        setFilters(EMPTY_FILTERS);
        onApply(EMPTY_FILTERS);
    }

    const inputClasses =
        'rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-slate-500 focus:outline-none';
    const labelClasses = 'text-sm font-medium text-slate-700';

    return (
        <form
            onSubmit={handleSubmit}
            className="mb-8 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-3 lg:grid-cols-6"
        >
            <div className="flex flex-col gap-1">
                <label htmlFor="filter-city" className={labelClasses}>City</label>
                <input
                    id="filter-city"
                    type="text"
                    value={filters.city}
                    onChange={handleChange('city')}
                    placeholder="Ann Arbor"
                    className={inputClasses}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="filter-zipcode" className={labelClasses}>ZIP Code</label>
                <input
                    id="filter-zipcode"
                    type="text"
                    value={filters.zipcode}
                    onChange={handleChange('zipcode')}
                    placeholder="12345"
                    className={inputClasses}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="filter-min-price" className={labelClasses}>Min Price</label>
                <input
                    id="filter-min-price"
                    type="number"
                    min="0"
                    value={filters.minPrice}
                    onChange={handleChange('minPrice')}
                    placeholder="0"
                    className={inputClasses}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="filter-max-price" className={labelClasses}>Max Price</label>
                <input
                    id="filter-max-price"
                    type="number"
                    min="0"
                    value={filters.maxPrice}
                    onChange={handleChange('maxPrice')}
                    placeholder="1,000,000"
                    className={inputClasses}
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="filter-beds" className={labelClasses}>Beds</label>
                <select
                    id="filter-beds"
                    value={filters.beds}
                    onChange={handleChange('beds')}
                    className={inputClasses}
                >
                    <option value="">Any</option>
                    {BEDS_OPTIONS.map((n) => (
                        <option key={n} value={n}>{n}+</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="filter-baths" className={labelClasses}>Baths</label>
                <select
                    id="filter-baths"
                    value={filters.baths}
                    onChange={handleChange('baths')}
                    className={inputClasses}
                >
                    <option value="">Any</option>
                    {BATHS_OPTIONS.map((n) => (
                        <option key={n} value={n}>{n}+</option>
                    ))}
                </select>
            </div>

            <div className="col-span-2 flex items-end gap-2 sm:col-span-3 lg:col-span-6">
                <button
                    type="submit"
                    className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Clear Filters
                </button>
            </div>
        </form>
    );
}

export default PropertyFilters;

import { useNavigate } from 'react-router-dom';
import PropertyImageCarousel from './PropertyImageCarousel';

function formatPrice(price) {
  if (price == null) {
    return 'Price unavailable';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);
}

function PropertyCard({ listing }) {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/property/${listing.L_ListingID}`);
  };

  const location = [listing.L_City, listing.L_State].filter(Boolean).join(', ');

  return (
    <article
      className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg"
      onClick={handleClick}
    >
      <PropertyImageCarousel photos={listing.L_Photos} />

      <div className="space-y-2 p-4">
        <p className="text-xl font-bold text-slate-900">{formatPrice(listing.L_SystemPrice)}</p>
        <p className="font-medium text-slate-900">{listing.L_Address || 'Address unavailable'}</p>
        <p className="text-sm text-slate-500">{location || 'Location unavailable'}</p>

        <div className="flex flex-wrap gap-2 pt-1 text-sm text-slate-600">
          <span>{listing.L_Keyword2 ?? '—'} beds</span>
          <span className="text-slate-300">|</span>
          <span>{listing.LM_Dec_3 ?? '—'} baths</span>
          {listing.LM_Int2_3 != null && (
            <>
              <span className="text-slate-300">|</span>
              <span>{listing.LM_Int2_3.toLocaleString()} sqft</span>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default PropertyCard;

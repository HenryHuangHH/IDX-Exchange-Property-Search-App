import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchPropertyDetail, fetchOpenHouses } from '../api/client';
import PropertyMap from '../components/PropertyMap';
import { getFirstPhotoUrl } from '../utils/parsePhotos';

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

function getOpenHouseRemarks(allData) {
  try {
    const data = typeof allData === 'string' ? JSON.parse(allData) : allData;
    return data?.OpenHouseRemarks || null;
  } catch {
    return null;
  }
}

function PropertyDetailPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [openhouses, setOpenhouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const [propertyData, openHouseData] = await Promise.all([
          fetchPropertyDetail(id),
          fetchOpenHouses(id),
        ]);
        if (!cancelled) {
          setProperty(propertyData);
          setOpenhouses(openHouseData.openhouses || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Could not load property.');
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
  }, [id]);

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-slate-600">Loading…</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-red-600">{error}</p>
        <Link to="/" className="mt-4 inline-block text-slate-700 underline">
          Back to listings
        </Link>
      </main>
    );
  }

  if (!property) {
    return null;
  }

  const details = [
    ['Type', property.L_Type_],
    [
      'Location',
      [[property.L_City, property.L_State].filter(Boolean).join(', '), property.L_Zip]
        .filter(Boolean)
        .join(' '),
    ],
    ['Year built', property.YearBuilt],
    ['Subdivision', property.SubdivisionName || property.LM_char10_70],
  ].filter(([, value]) => value != null && value !== '');

  const amenities = [
    ['Garage', property.L_Keyword5],
    ['Heating', property.Heating],
    ['Cooling', property.Cooling],
  ].filter(([, value]) => value != null && value !== '');

  const photoUrl = getFirstPhotoUrl(property.L_Photos);

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-8">
      <Link to="/" className="text-slate-700 underline">
        Back to listings
      </Link>

      {photoUrl ? (
        <img
          src={photoUrl}
          alt={property.L_Address || 'Property'}
          className="h-64 w-full object-cover"
        />
      ) : (
        <div className="flex h-64 items-center justify-center bg-slate-100 text-slate-400">
          No photo available
        </div>
      )}

      <div>
        <p className="text-3xl font-bold text-slate-900">{formatPrice(property.L_SystemPrice)}</p>
        <p className="mt-2 text-lg text-slate-900">
          {property.L_Address || 'Address unavailable'}
          {' '}
          ({property.LM_Int2_3 != null ? `${property.LM_Int2_3.toLocaleString()} sqft` : '— sqft'},{' '}
          {property.L_Keyword2 ?? '—'} bedrooms, {property.LM_Dec_3 ?? '—'} bathrooms)
        </p>
      </div>

      <section>
        <h2 className="mb-2 text-xl font-semibold text-slate-900">Description</h2>
        <p className="whitespace-pre-wrap text-slate-700">
          {property.L_Remarks || 'No description available.'}
        </p>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold text-slate-900">Property details</h2>
        {details.length === 0 ? (
          <p className="text-slate-600">No details available.</p>
        ) : (
          <ul className="space-y-1 text-slate-700">
            {details.map(([label, value]) => (
              <li key={label}>
                <span className="font-medium">{label}:</span> {value}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold text-slate-900">Amenities</h2>
        {amenities.length === 0 ? (
          <p className="text-slate-600">No amenities listed.</p>
        ) : (
          <ul className="space-y-1 text-slate-700">
            {amenities.map(([label, value]) => (
              <li key={label}>
                <span className="font-medium">{label}:</span> {value}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold text-slate-900">Map</h2>
        <PropertyMap
          latitude={property.LMD_MP_Latitude}
          longitude={property.LMD_MP_Longitude}
        />
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold text-slate-900">Open houses</h2>
        {openhouses.length === 0 ? (
          <p className="text-slate-600">No open houses scheduled.</p>
        ) : (
          <ul className="space-y-4">
            {openhouses.map((oh) => {
              const remarks = getOpenHouseRemarks(oh.all_data);
              return (
                <li key={oh.id} className="border-b border-slate-200 pb-4">
                  <p className="text-slate-900">Date: {oh.OpenHouseDate}</p>
                  <p className="text-slate-700">
                    Time: {oh.OH_StartTime} – {oh.OH_EndTime}
                  </p>
                  {remarks && <p className="mt-1 text-slate-600">{remarks}</p>}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}

export default PropertyDetailPage;

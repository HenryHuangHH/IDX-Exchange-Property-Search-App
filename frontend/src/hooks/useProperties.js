import { useEffect, useState } from 'react';
import { fetchProperties } from '../api/client';

export function useProperties(params = { limit: 20, offset: 0 }) {
  const [properties, setProperties] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchProperties(params);
        if (!cancelled) {
          setProperties(data.results);
          setTotal(data.total);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Could not load properties. Make sure the backend is running.');
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
  }, [JSON.stringify(params)]);

  return { properties, total, loading, error };
}

import { fetchProperties, fetchPropertyDetail, fetchOpenHouses } from '../api/client';

function mockFetchOnce(response, { ok = true, status = 200, statusText = 'OK' } = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    statusText,
    json: () => Promise.resolve(response),
  });
}

describe('fetchProperties', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requests the properties endpoint with no query string when called without params', async () => {
    mockFetchOnce({ total: 0, limit: 20, offset: 0, results: [] });

    await fetchProperties();

    expect(global.fetch).toHaveBeenCalledWith('/api/properties');
  });

  it('serializes params into the query string', async () => {
    mockFetchOnce({ total: 1, limit: 5, offset: 0, results: [] });

    await fetchProperties({ city: 'Ann Arbor', beds: 3 });

    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain('/api/properties?');
    expect(calledUrl).toContain('city=Ann+Arbor');
    expect(calledUrl).toContain('beds=3');
  });

  it('returns the parsed JSON body on success', async () => {
    const payload = { total: 2, limit: 20, offset: 0, results: [{ L_ListingID: '1' }] };
    mockFetchOnce(payload);

    const data = await fetchProperties({ limit: 20, offset: 0 });

    expect(data).toEqual(payload);
  });

  it('throws when the response is not ok', async () => {
    mockFetchOnce({ error: 'bad request' }, { ok: false, status: 400, statusText: 'Bad Request' });

    await expect(fetchProperties({ minPrice: 'not-a-number' })).rejects.toThrow('HTTP 400');
  });
});

describe('fetchPropertyDetail', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requests the property by id', async () => {
    mockFetchOnce({ L_ListingID: '123' });

    await fetchPropertyDetail('123');

    expect(global.fetch).toHaveBeenCalledWith('/api/properties/123');
  });

  it('throws a "Property not found" error on 404', async () => {
    mockFetchOnce({ error: 'Property not found' }, { ok: false, status: 404, statusText: 'Not Found' });

    await expect(fetchPropertyDetail('missing')).rejects.toThrow('Property not found');
  });
});

describe('fetchOpenHouses', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('requests open houses for the given listing id', async () => {
    mockFetchOnce({ propertyId: '123', count: 0, openhouses: [] });

    await fetchOpenHouses('123');

    expect(global.fetch).toHaveBeenCalledWith('/api/properties/123/openhouses');
  });

  it('throws on a non-ok response', async () => {
    mockFetchOnce({}, { ok: false, status: 500, statusText: 'Internal Server Error' });

    await expect(fetchOpenHouses('123')).rejects.toThrow('HTTP 500');
  });
});

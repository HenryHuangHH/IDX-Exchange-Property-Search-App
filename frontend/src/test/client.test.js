import { fetchProperties, fetchPropertyDetail } from '../api/client';

function mockFetchOnce(body, { ok = true, status = 200, statusText = 'OK' } = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok,
    status,
    statusText,
    json: () => Promise.resolve(body),
  });
}

afterEach(() => {
  jest.restoreAllMocks();
});

describe('api client', () => {
  // test fetchProperties
  it('fetchProperties returns parsed data and sends query params', async () => {
    const payload = { total: 1, results: [{ L_ListingID: '123' }] };
    mockFetchOnce(payload);

    const data = await fetchProperties({ city: 'Ann Arbor', beds: 3 });

    expect(global.fetch).toHaveBeenCalledTimes(1);
    const calledUrl = global.fetch.mock.calls[0][0];
    expect(calledUrl).toContain('/api/properties?');
    expect(calledUrl).toContain('city=Ann+Arbor');
    expect(calledUrl).toContain('beds=3');
    expect(data).toEqual(payload);
  });

  // test bad request
  it('fetchProperties throws a error response', async () => {
    mockFetchOnce({}, { ok: false, status: 400, statusText: 'Bad Request' });

    await expect(fetchProperties({ minPrice: 'abc' })).rejects.toThrow('HTTP 400: Bad Request');
  });

  // test "Property not found".
  it('fetchPropertyDetail throws "Property not found" on 404', async () => {
    mockFetchOnce({}, { ok: false, status: 404, statusText: 'Not Found' });

    await expect(fetchPropertyDetail('missing')).rejects.toThrow('Property not found');
  });
});

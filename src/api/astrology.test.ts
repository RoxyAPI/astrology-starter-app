/**
 * Tests for the astrology data layer. `@roxyapi/sdk` is mocked, so these run offline with no real key. They prove every `astrologyApi` method calls the matching SDK method with the spec param shape (path, body, or query), unwraps `data`, and turns an SDK `{ error }` result into a thrown message the screens can catch.
 *
 * The mock SDK builds its astrology and location clients once and returns the same instance from every `createRoxy` call, so the test can grab the same `jest.fn` handles the data layer holds. The factory is self-contained to satisfy the `jest.mock` hoisting rule.
 */

import { createRoxy } from '@roxyapi/sdk';

jest.mock('@roxyapi/sdk', () => {
  const astrology = {
    listZodiacSigns: jest.fn(),
    getZodiacSign: jest.fn(),
    getDailyHoroscope: jest.fn(),
    getWeeklyHoroscope: jest.fn(),
    getMonthlyHoroscope: jest.fn(),
    getCurrentMoonPhase: jest.fn(),
    generateNatalChart: jest.fn(),
    getPlanetaryPositions: jest.fn(),
    calculateSynastry: jest.fn(),
    calculateCompatibility: jest.fn(),
    generateCompositeChart: jest.fn(),
  };
  const location = { searchCities: jest.fn() };
  return { createRoxy: () => ({ astrology, location }) };
});

import { astrologyApi } from './astrology';

const client = createRoxy('test-key') as unknown as {
  astrology: Record<string, jest.Mock>;
  location: Record<string, jest.Mock>;
};
const mockAstrology = client.astrology;
const mockLocation = client.location;

const ok = <T>(data: T) => ({ data, error: undefined });

const person = { date: '1990-01-15', time: '14:30:00', latitude: 40.7, longitude: -74, timezone: -5 };

beforeEach(() => {
  for (const fn of Object.values(mockAstrology)) fn.mockReset();
  for (const fn of Object.values(mockLocation)) fn.mockReset();
});

describe('astrologyApi success paths', () => {
  it('searchCities forwards the query and returns the cities array', async () => {
    mockLocation.searchCities.mockResolvedValue(ok({ total: 1, limit: 10, offset: 0, cities: [{ city: 'Berlin' }] }));
    const cities = await astrologyApi.searchCities('Berlin');
    expect(mockLocation.searchCities).toHaveBeenCalledWith({ query: { q: 'Berlin' } });
    expect(cities[0].city).toBe('Berlin');
  });

  it('getSigns lists zodiac signs', async () => {
    mockAstrology.listZodiacSigns.mockResolvedValue(ok([{ id: 'aries', name: 'Aries' }]));
    const signs = await astrologyApi.getSigns();
    expect(mockAstrology.listZodiacSigns).toHaveBeenCalledWith();
    expect(signs[0].id).toBe('aries');
  });

  it('getSignById forwards the id as a path param', async () => {
    mockAstrology.getZodiacSign.mockResolvedValue(ok({ id: 'aries', name: 'Aries' }));
    const sign = await astrologyApi.getSignById('aries');
    expect(mockAstrology.getZodiacSign).toHaveBeenCalledWith({ path: { id: 'aries' } });
    expect(sign.name).toBe('Aries');
  });

  it('getDailyHoroscope forwards the sign as a path param', async () => {
    mockAstrology.getDailyHoroscope.mockResolvedValue(ok({ sign: 'aries', overview: 'A good day' }));
    const daily = await astrologyApi.getDailyHoroscope('aries');
    expect(mockAstrology.getDailyHoroscope).toHaveBeenCalledWith({ path: { sign: 'aries' } });
    expect(daily.overview).toBe('A good day');
  });

  it('getWeeklyHoroscope forwards the sign as a path param', async () => {
    mockAstrology.getWeeklyHoroscope.mockResolvedValue(ok({ sign: 'leo' }));
    await astrologyApi.getWeeklyHoroscope('leo');
    expect(mockAstrology.getWeeklyHoroscope).toHaveBeenCalledWith({ path: { sign: 'leo' } });
  });

  it('getMonthlyHoroscope forwards the sign as a path param', async () => {
    mockAstrology.getMonthlyHoroscope.mockResolvedValue(ok({ sign: 'virgo' }));
    await astrologyApi.getMonthlyHoroscope('virgo');
    expect(mockAstrology.getMonthlyHoroscope).toHaveBeenCalledWith({ path: { sign: 'virgo' } });
  });

  it('getMoonPhase reads the current phase', async () => {
    mockAstrology.getCurrentMoonPhase.mockResolvedValue(ok({ phase: 'Full Moon', illumination: 99 }));
    const moon = await astrologyApi.getMoonPhase();
    expect(mockAstrology.getCurrentMoonPhase).toHaveBeenCalledWith();
    expect(moon.phase).toBe('Full Moon');
  });

  it('getNatalChart forwards the birth details in the body', async () => {
    mockAstrology.generateNatalChart.mockResolvedValue(ok({ planets: [], houses: [], aspects: [] }));
    const body = { ...person, houseSystem: 'placidus' as const };
    await astrologyApi.getNatalChart(body);
    expect(mockAstrology.generateNatalChart).toHaveBeenCalledWith({ body });
  });

  it('getPlanetPositions builds the body from positional args', async () => {
    mockAstrology.getPlanetaryPositions.mockResolvedValue(ok({ planets: [{ name: 'Sun' }] }));
    const result = await astrologyApi.getPlanetPositions('2026-05-23', '12:00:00', 0, 0, 0);
    expect(mockAstrology.getPlanetaryPositions).toHaveBeenCalledWith({
      body: { date: '2026-05-23', time: '12:00:00', latitude: 0, longitude: 0, timezone: 0 },
    });
    expect(result.planets[0].name).toBe('Sun');
  });

  it('getSynastry forwards both people in the body', async () => {
    mockAstrology.calculateSynastry.mockResolvedValue(ok({ compatibilityScore: 82 }));
    const body = { person1: person, person2: person };
    const result = await astrologyApi.getSynastry(body);
    expect(mockAstrology.calculateSynastry).toHaveBeenCalledWith({ body });
    expect(result.compatibilityScore).toBe(82);
  });

  it('getCompatibilityScore forwards both people in the body', async () => {
    mockAstrology.calculateCompatibility.mockResolvedValue(ok({ overallScore: 75 }));
    const body = { person1: person, person2: person };
    const result = await astrologyApi.getCompatibilityScore(body);
    expect(mockAstrology.calculateCompatibility).toHaveBeenCalledWith({ body });
    expect(result.overallScore).toBe(75);
  });

  it('getCompositeChart forwards both people in the body', async () => {
    mockAstrology.generateCompositeChart.mockResolvedValue(ok({ compositePlanets: [] }));
    const body = { person1: person, person2: person };
    await astrologyApi.getCompositeChart(body);
    expect(mockAstrology.generateCompositeChart).toHaveBeenCalledWith({ body });
  });
});

describe('astrologyApi error paths', () => {
  it('throws when the SDK returns an error result', async () => {
    mockAstrology.generateNatalChart.mockResolvedValue({ data: undefined, error: { error: 'boom', code: 'internal_error' } });
    await expect(astrologyApi.getNatalChart(person)).rejects.toThrow('Failed to generate natal chart');
  });

  it('throws when the SDK returns no data', async () => {
    mockAstrology.listZodiacSigns.mockResolvedValue({ data: undefined, error: undefined });
    await expect(astrologyApi.getSigns()).rejects.toThrow('Failed to fetch signs');
  });
});

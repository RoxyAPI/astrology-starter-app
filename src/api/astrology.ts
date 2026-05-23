import { roxy } from './client';
import type {
  GetAstrologySignsResponse,
  GetAstrologySignsByIdResponse,
  GetAstrologyHoroscopeBySignDailyData,
  GetAstrologyHoroscopeBySignDailyResponse,
  GetAstrologyHoroscopeBySignWeeklyResponse,
  GetAstrologyHoroscopeBySignMonthlyResponse,
  GetAstrologyMoonPhaseCurrentResponse,
  PostAstrologyNatalChartData,
  PostAstrologyNatalChartResponse,
  PostAstrologyPlanetsResponse,
  PostAstrologySynastryData,
  PostAstrologySynastryResponse,
  PostAstrologyCompatibilityScoreData,
  PostAstrologyCompatibilityScoreResponse,
  PostAstrologyCompositeChartData,
  PostAstrologyCompositeChartResponse,
  GetLocationSearchResponse,
} from '@roxyapi/sdk';

type SdkResult<T> = { data?: T; error?: unknown };

/**
 * Unwrap a Roxy SDK result, returning `data` or throwing a screen-friendly message. The SDK never throws on a non-2xx response: it returns `{ data, error }`, so every call site funnels through here to turn an error into one thrown `Error` the screens can catch.
 */
const unwrap = <T>(result: SdkResult<T>, message: string): T => {
  if (result.error || !result.data) throw new Error(message);
  return result.data;
};

/** Birth details for one person on a chart. Pulled from the natal chart request type so screens cannot drift from the spec. `timezone` accepts the IANA string from {@link astrologyApi.searchCities} or a decimal offset. */
export type BirthDetails = NonNullable<PostAstrologyNatalChartData['body']>;

/** A pair of people for synastry, composite, and compatibility calls. */
export type SynastryRequest = NonNullable<PostAstrologySynastryData['body']>;
export type CompatibilityRequest = NonNullable<PostAstrologyCompatibilityScoreData['body']>;
export type CompositeChartRequest = NonNullable<PostAstrologyCompositeChartData['body']>;

/** One city from {@link astrologyApi.searchCities}. Feed `latitude`, `longitude`, and `timezone` straight into any chart call. */
export type City = GetLocationSearchResponse['cities'][number];

/** Lowercase zodiac sign id accepted by the horoscope path param (aries, taurus, ...). Matches `ZodiacSign['id']` from the signs list. */
export type ZodiacSignId = GetAstrologyHoroscopeBySignDailyData['path']['sign'];

export const astrologyApi = {
  searchCities: async (q: string): Promise<City[]> =>
    unwrap(await roxy.location.searchCities({ query: { q } }), 'Failed to search cities').cities,

  getSigns: async (): Promise<GetAstrologySignsResponse> =>
    unwrap(await roxy.astrology.listZodiacSigns(), 'Failed to fetch signs'),

  getSignById: async (id: string): Promise<GetAstrologySignsByIdResponse> =>
    unwrap(await roxy.astrology.getZodiacSign({ path: { id } }), 'Sign not found'),

  getDailyHoroscope: async (sign: ZodiacSignId): Promise<GetAstrologyHoroscopeBySignDailyResponse> =>
    unwrap(await roxy.astrology.getDailyHoroscope({ path: { sign } }), 'Failed to fetch daily horoscope'),

  getWeeklyHoroscope: async (sign: ZodiacSignId): Promise<GetAstrologyHoroscopeBySignWeeklyResponse> =>
    unwrap(await roxy.astrology.getWeeklyHoroscope({ path: { sign } }), 'Failed to fetch weekly horoscope'),

  getMonthlyHoroscope: async (sign: ZodiacSignId): Promise<GetAstrologyHoroscopeBySignMonthlyResponse> =>
    unwrap(await roxy.astrology.getMonthlyHoroscope({ path: { sign } }), 'Failed to fetch monthly horoscope'),

  getMoonPhase: async (): Promise<GetAstrologyMoonPhaseCurrentResponse> =>
    unwrap(await roxy.astrology.getCurrentMoonPhase(), 'Failed to fetch moon phase'),

  getNatalChart: async (body: BirthDetails): Promise<PostAstrologyNatalChartResponse> =>
    unwrap(await roxy.astrology.generateNatalChart({ body }), 'Failed to generate natal chart'),

  getPlanetPositions: async (
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    timezone: number,
  ): Promise<PostAstrologyPlanetsResponse> =>
    unwrap(
      await roxy.astrology.getPlanetaryPositions({ body: { date, time, latitude, longitude, timezone } }),
      'Failed to fetch planet positions',
    ),

  getSynastry: async (body: SynastryRequest): Promise<PostAstrologySynastryResponse> =>
    unwrap(await roxy.astrology.calculateSynastry({ body }), 'Failed to calculate synastry'),

  getCompatibilityScore: async (
    body: CompatibilityRequest,
  ): Promise<PostAstrologyCompatibilityScoreResponse> =>
    unwrap(await roxy.astrology.calculateCompatibility({ body }), 'Failed to calculate compatibility'),

  getCompositeChart: async (body: CompositeChartRequest): Promise<PostAstrologyCompositeChartResponse> =>
    unwrap(await roxy.astrology.generateCompositeChart({ body }), 'Failed to generate composite chart'),
};

/**
 * Astrology response and request types, re-exported from `@roxyapi/sdk` under app-friendly names so screens and components import stable names without depending on the SDK's path-based type names. The SDK ships these types from the same OpenAPI spec the API serves, so they cannot drift from the live responses. There is no local schema file to regenerate.
 */

import type {
  GetAstrologySignsResponse,
  GetAstrologySignsByIdResponse,
  GetAstrologyHoroscopeBySignDailyResponse,
  GetAstrologyHoroscopeBySignWeeklyResponse,
  GetAstrologyHoroscopeBySignMonthlyResponse,
  GetAstrologyMoonPhaseCurrentResponse,
  NatalChartResponse,
  PostAstrologyPlanetsResponse,
  PostAstrologySynastryResponse,
  PostAstrologyCompatibilityScoreResponse,
  PostAstrologyCompositeChartResponse,
} from '@roxyapi/sdk';

/** One entry from the zodiac signs list. The list response is an array, so a single sign is its element type. */
export type ZodiacSign = GetAstrologySignsResponse[number];
export type ZodiacSignDetail = GetAstrologySignsByIdResponse;

export type Horoscope = GetAstrologyHoroscopeBySignDailyResponse;
export type WeeklyHoroscope = GetAstrologyHoroscopeBySignWeeklyResponse;
export type MonthlyHoroscope = GetAstrologyHoroscopeBySignMonthlyResponse;

export type MoonPhase = GetAstrologyMoonPhaseCurrentResponse;

export type NatalChart = NatalChartResponse;
/** One celestial body on a natal chart. {@link PlanetCard} renders this shape. */
export type Planet = NatalChartResponse['planets'][number];
/** One aspect between two planets. {@link AspectCard} renders this shape. */
export type Aspect = NatalChartResponse['aspects'][number];

export type PlanetPositionsResponse = PostAstrologyPlanetsResponse;

export type Synastry = PostAstrologySynastryResponse;
export type CompatibilityScore = PostAstrologyCompatibilityScoreResponse;
export type CompositeChart = PostAstrologyCompositeChartResponse;

/** Birth details for one person, used by chart and compatibility forms. */
export type { BirthDetails, BirthDetails as PersonBirthData, City, ZodiacSignId } from './astrology';

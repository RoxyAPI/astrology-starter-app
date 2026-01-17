/**
 * Type definitions for RoxyAPI Astrology API
 * Auto-generated from OpenAPI schema at https://roxyapi.com/api/v2/astrology/openapi.json
 * 
 * Regenerate with: npm run generate:types
 */

import type { paths, components } from './schema';

// Response types - Zodiac Signs
export type SignsResponse = paths['/signs']['get']['responses']['200']['content']['application/json'];
export type ZodiacSign = SignsResponse[number];
export type ZodiacSignDetail = paths['/signs/{identifier}']['get']['responses']['200']['content']['application/json'];

// Response types - Natal Chart
export type NatalChartResponse = components['schemas']['NatalChartResponse'];
export type NatalChart = NatalChartResponse;
export type Planet = NatalChartResponse['planets'][number];

// Response types - Horoscopes
export type Horoscope = paths['/horoscope/{sign}/daily']['get']['responses']['200']['content']['application/json'];
export type WeeklyHoroscope = paths['/horoscope/{sign}/weekly']['get']['responses']['200']['content']['application/json'];
export type MonthlyHoroscope = paths['/horoscope/{sign}/monthly']['get']['responses']['200']['content']['application/json'];

// Response types - Moon Phase
export type MoonPhase = paths['/moon-phase/current']['get']['responses']['200']['content']['application/json'];

// Response types - Planets
export type PlanetPositionsResponse = paths['/planets']['post']['responses']['200']['content']['application/json'];
export type PlanetMeaning = paths['/planet-meanings']['get']['responses']['200']['content']['application/json'][number];

// Response types - Relationship Analysis
export type Synastry = paths['/synastry']['post']['responses']['200']['content']['application/json'];
export type CompatibilityScore = paths['/compatibility-score']['post']['responses']['200']['content']['application/json'];
export type CompositeChart = paths['/composite-chart']['post']['responses']['200']['content']['application/json'];

// Response types - Returns
export type SolarReturn = paths['/solar-return']['post']['responses']['200']['content']['application/json'];
export type LunarReturn = paths['/lunar-return']['post']['responses']['200']['content']['application/json'];
export type PlanetaryReturn = paths['/planetary-returns']['post']['responses']['200']['content']['application/json'];

// Response types - Houses & Aspects
export type HousesResponse = paths['/houses']['post']['responses']['200']['content']['application/json'];
export type AspectsResponse = paths['/aspects']['post']['responses']['200']['content']['application/json'];
export type Aspect = NonNullable<AspectsResponse['aspects']>[number];

// Response types - Transits
export type TransitsResponse = paths['/transits']['post']['responses']['200']['content']['application/json'];

// Request types
export type NatalChartRequest = NonNullable<paths['/natal-chart']['post']['requestBody']>['content']['application/json'];
export type PersonBirthData = NonNullable<paths['/synastry']['post']['requestBody']>['content']['application/json']['person1'];

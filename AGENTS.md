# Agents Guide

This is a RoxyAPI starter app. A cross platform Western astrology app built with React Native, Expo SDK 54, and TypeScript. Runs on iOS, Android, and Web from one codebase. Demonstrates horoscopes, natal charts, synastry, composite charts, compatibility scoring, planetary positions, moon phase, and zodiac references, all powered by the RoxyAPI Astrology API through the official `@roxyapi/sdk`.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Create `.env` in the project root with:
  - `EXPO_PUBLIC_ROXYAPI_KEY=your_api_key_here`
- Install with `npm install`
- Run with `npm start`, then `npm run ios`, `npm run android`, or `npm run web`
- Test with `npm test`, typecheck with `npm run typecheck`

## How it calls RoxyAPI
- The only data layer is `@roxyapi/sdk`. `createRoxy(key)` sets the base URL and the auth header, and ships its own types from the OpenAPI spec, so there is no generated schema file to keep in sync.
- The key is bundled into the app (mobile has no server). Treat `EXPO_PUBLIC_ROXYAPI_KEY` as a public, restricted key locked to your bundle id, or proxy calls through a backend you control.
- Charts need latitude, longitude, and timezone. Never ask users to type coordinates. Geocode the birth city with `roxy.location.searchCities` first, then feed `city.latitude`, `city.longitude`, and `city.timezone` (the IANA string) straight into any chart call.
- Live OpenAPI spec: https://roxyapi.com/api/v2/astrology/openapi.json
- Live playground: https://roxyapi.com/api-reference

## Endpoints used in this app
- `roxy.location.searchCities` to geocode a birth city into latitude, longitude, and timezone
- `roxy.astrology.listZodiacSigns` and `roxy.astrology.getZodiacSign` for the zodiac reference library
- `roxy.astrology.getDailyHoroscope`, `roxy.astrology.getWeeklyHoroscope`, `roxy.astrology.getMonthlyHoroscope` for readings
- `roxy.astrology.generateNatalChart` for a full birth chart with planets, houses, and aspects
- `roxy.astrology.calculateSynastry` for relationship cross aspect analysis
- `roxy.astrology.calculateCompatibility` for a numeric compatibility breakdown
- `roxy.astrology.generateCompositeChart` for a combined relationship chart
- `roxy.astrology.getPlanetaryPositions` and `roxy.astrology.getCurrentMoonPhase` for current cosmic information

## Where to extend
- `src/api/client.ts` is the single Roxy SDK client and the `hasApiKey` guard.
- `src/api/astrology.ts` wraps the `roxy.astrology.*` and `roxy.location.*` methods used by screens and unwraps the SDK `{ data, error }` result.
- `src/api/types.ts` re-exports the SDK response types under app friendly names.
- `src/components/CityPicker.tsx` is the reusable geocoding picker. Reuse it for any new screen that needs a location.
- `app/(tabs)/` holds the tab screens: `index.tsx` (horoscopes), `charts.tsx`, `cosmos.tsx`, `signs.tsx`, `tools.tsx`.

## Conventions
- All RoxyAPI calls go through `src/api/`. Do not call `fetch` or the SDK directly from screens.
- Method names and body fields come from the SDK types, never invented. Verify against the OpenAPI spec.
- Verified accuracy claims are cross referenced against NASA JPL Horizons. Never claim the calculation engine is open source. The public framing is Roxy Ephemeris.

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP servers: https://roxyapi.com/docs/mcp
- Methodology and accuracy: https://roxyapi.com/methodology
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing

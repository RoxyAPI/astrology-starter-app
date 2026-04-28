# Agents Guide

This is a RoxyAPI starter app. A cross platform Western astrology app built with React Native, Expo SDK 54, and TypeScript. Runs on iOS, Android, and Web from one codebase. Demonstrates horoscopes, natal charts, synastry, planetary positions, and zodiac references using the RoxyAPI Astrology API.

## Setup
- Get an API key at https://roxyapi.com/pricing
- Copy `.env.example` to `.env` and set `EXPO_PUBLIC_ROXYAPI_KEY`
- Install with `npm install`
- Run with `npm start`, then `npm run ios`, `npm run android`, or `npm run web`

## How to call RoxyAPI
- Base URL: `https://roxyapi.com/api/v2`
- Auth header: `X-API-Key: <key>`
- Live OpenAPI spec: https://roxyapi.com/api/v2/openapi.json
- Live playground: https://roxyapi.com/api-reference

## Endpoints used in this app
- `GET /astrology/horoscope/{sign}/daily` for daily readings, with weekly and monthly variants
- `GET /astrology/natal-chart` for full natal chart with planets, houses, and aspects
- `GET /astrology/synastry` for relationship compatibility analysis
- `GET /astrology/compatibility-score` for a numeric compatibility breakdown
- `GET /astrology/planets` and `GET /astrology/moon-phase` for current cosmic information
- Geocode birth locations with `GET /location/search` before calling chart endpoints, so users never have to type latitude and longitude

## Where to extend
- `src/api/client.ts` is the typed API client. Add a new endpoint method here.
- `src/api/astrology.ts` exports the astrology specific calls used by screens.
- `src/api/schema.ts` holds auto generated types from the OpenAPI spec.
- `app/` (Expo Router) holds the tab screens: horoscopes, charts, cosmos, signs, and tools.

## Conventions
- All RoxyAPI calls go through `src/api/`. Do not call `fetch` directly from screens.
- Types are auto generated from `https://roxyapi.com/api/v2/astrology/openapi.json`. Regenerate when the API changes.
- Verified accuracy claims are cross referenced against NASA JPL Horizons DE441. Never claim the calculation engine is "open source". The public framing is "Roxy Ephemeris".

## Resources
- TypeScript SDK: https://github.com/RoxyAPI/sdk-typescript (npm: `@roxyapi/sdk`)
- Python SDK: https://github.com/RoxyAPI/sdk-python (PyPI: `roxy-sdk`)
- MCP servers: https://roxyapi.com/docs/mcp
- Methodology and accuracy: https://roxyapi.com/methodology
- Open benchmark: https://github.com/RoxyAPI/astrology-api-benchmark
- More starters: https://roxyapi.com/starters
- Pricing: https://roxyapi.com/pricing

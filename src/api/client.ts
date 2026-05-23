import { createRoxy } from '@roxyapi/sdk';

/**
 * The single Roxy SDK client for the whole app. `createRoxy` sets the base URL and injects the auth header on every request, so there is no base URL to configure and no generated schema to keep in sync: the SDK ships its own types. One key unlocks every domain in the catalog, so the same client serves both `roxy.astrology.*` charts and `roxy.location.*` city geocoding.
 *
 * @remarks This is a mobile app with no server, so the key is bundled into the build and reaches the device. Treat `EXPO_PUBLIC_ROXYAPI_KEY` as a public, restricted key (lock it to your bundle id / origin in the dashboard) or proxy calls through a thin backend you control. Read {@link hasApiKey} before rendering a screen that calls the API.
 */
const key = process.env.EXPO_PUBLIC_ROXYAPI_KEY ?? '';

export const roxy = createRoxy(key);

/** True when `EXPO_PUBLIC_ROXYAPI_KEY` is set. Show a setup hint instead of letting calls fail with a 401. */
export const hasApiKey = (): boolean => Boolean(key);

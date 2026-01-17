import createClient from 'openapi-fetch';
import type { paths } from './schema';

const API_BASE_URL = process.env.EXPO_PUBLIC_ROXYAPI_BASE_URL || 'https://roxyapi.com/api/v2';
const API_KEY = process.env.EXPO_PUBLIC_ROXYAPI_KEY || '';

export const apiClient = createClient<paths>({
  baseUrl: `${API_BASE_URL}/astrology`,
  headers: {
    'X-API-Key': API_KEY,
  },
});

export const hasApiKey = (): boolean => !!API_KEY;

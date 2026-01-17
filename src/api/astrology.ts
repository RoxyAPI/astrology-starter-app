import { apiClient } from './client';

export const astrologyApi = {
  getSigns: async () => {
    const { data, error } = await apiClient.GET('/signs');
    if (error) throw new Error(`Failed to fetch signs: ${JSON.stringify(error)}`);
    return data!;
  },

  getSignById: async (id: string) => {
    const { data, error } = await apiClient.GET('/signs/{identifier}', {
      params: { path: { identifier: id } },
    });
    if (error) throw new Error(`Failed to fetch sign: ${JSON.stringify(error)}`);
    return data!;
  },

  getNatalChart: async (params: any) => {
    const { data, error } = await apiClient.POST('/natal-chart', { body: params });
    if (error) throw new Error(`Failed to generate natal chart: ${JSON.stringify(error)}`);
    return data!;
  },

  getDailyHoroscope: async (sign: string) => {
    const { data, error } = await apiClient.GET('/horoscope/{sign}/daily', {
      params: { path: { sign: sign as any } },
    });
    if (error) throw new Error(`Failed to fetch daily horoscope: ${JSON.stringify(error)}`);
    return data!;
  },

  getAllDailyHoroscopes: async () => {
    const { data, error } = await apiClient.GET('/horoscope/daily');
    if (error) throw new Error(`Failed to fetch all horoscopes: ${JSON.stringify(error)}`);
    return data!;
  },

  getWeeklyHoroscope: async (sign: string) => {
    const { data, error } = await apiClient.GET('/horoscope/{sign}/weekly', {
      params: { path: { sign: sign as any } },
    });
    if (error) throw new Error(`Failed to fetch weekly horoscope: ${JSON.stringify(error)}`);
    return data!;
  },

  getMonthlyHoroscope: async (sign: string) => {
    const { data, error } = await apiClient.GET('/horoscope/{sign}/monthly', {
      params: { path: { sign: sign as any } },
    });
    if (error) throw new Error(`Failed to fetch monthly horoscope: ${JSON.stringify(error)}`);
    return data!;
  },

  getMoonPhase: async () => {
    const { data, error } = await apiClient.GET('/moon-phase/current');
    if (error) throw new Error(`Failed to fetch moon phase: ${JSON.stringify(error)}`);
    return data!;
  },

  getPlanetPositions: async (
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    timezone: number
  ) => {
    const { data, error } = await apiClient.POST('/planets', {
      body: { date, time, latitude, longitude, timezone },
    });
    if (error) throw new Error(`Failed to fetch planet positions: ${JSON.stringify(error)}`);
    return data!;
  },

  getSynastry: async (
    person1: any,
    person2: any,
    houseSystem?: 'placidus' | 'whole-sign' | 'equal' | 'koch'
  ) => {
    const { data, error } = await apiClient.POST('/synastry', {
      body: { person1, person2, houseSystem: houseSystem || 'placidus' },
    });
    if (error) throw new Error(`Failed to calculate synastry: ${JSON.stringify(error)}`);
    return data!;
  },

  getCompatibilityScore: async (person1: any, person2: any) => {
    const { data, error } = await apiClient.POST('/compatibility-score', {
      body: { person1, person2 },
    });
    if (error) throw new Error(`Failed to calculate compatibility: ${JSON.stringify(error)}`);
    return data!;
  },

  getCompositeChart: async (
    person1: any,
    person2: any,
    houseSystem?: 'placidus' | 'whole-sign' | 'equal' | 'koch'
  ) => {
    const { data, error } = await apiClient.POST('/composite-chart', {
      body: { person1, person2, houseSystem: houseSystem || 'placidus' },
    });
    if (error) throw new Error(`Failed to generate composite chart: ${JSON.stringify(error)}`);
    return data!;
  },

  getTransits: async (date: string, time: string, timezone: number, natalChart?: any) => {
    const { data, error } = await apiClient.POST('/transits', {
      body: { date, time, timezone, natalChart },
    });
    if (error) throw new Error(`Failed to calculate transits: ${JSON.stringify(error)}`);
    return data!;
  },

  getTransitAspects: async (natalChart: any, transitDate?: string) => {
    const { data, error } = await apiClient.POST('/transit-aspects', {
      body: { natalChart, transitDate },
    });
    if (error) throw new Error(`Failed to calculate transit aspects: ${JSON.stringify(error)}`);
    return data!;
  },

  getSolarReturn: async (
    birthDate: string,
    birthTime: string,
    returnYear: number,
    latitude: number,
    longitude: number,
    timezone: number,
    houseSystem?: 'placidus' | 'whole-sign' | 'equal' | 'koch'
  ) => {
    const { data, error } = await apiClient.POST('/solar-return', {
      body: {
        birthDate,
        birthTime,
        returnYear,
        latitude,
        longitude,
        timezone,
        houseSystem: houseSystem || 'placidus',
      },
    });
    if (error) throw new Error(`Failed to calculate solar return: ${JSON.stringify(error)}`);
    return data!;
  },

  getLunarReturn: async (
    birthDate: string,
    birthTime: string,
    returnDate: string,
    latitude: number,
    longitude: number,
    timezone: number,
    houseSystem?: 'placidus' | 'whole-sign' | 'equal' | 'koch'
  ) => {
    const { data, error } = await apiClient.POST('/lunar-return', {
      body: {
        birthDate,
        birthTime,
        returnDate,
        latitude,
        longitude,
        timezone,
        houseSystem: houseSystem || 'placidus',
      },
    });
    if (error) throw new Error(`Failed to calculate lunar return: ${JSON.stringify(error)}`);
    return data!;
  },

  getPlanetaryReturn: async (
    birthDate: string,
    birthTime: string,
    planet: string,
    approximateDate: string,
    latitude: number,
    longitude: number,
    timezone: number,
    houseSystem?: 'placidus' | 'whole-sign' | 'equal' | 'koch'
  ) => {
    const { data, error } = await apiClient.POST('/planetary-returns', {
      body: {
        birthDate,
        birthTime,
        planet: planet as any,
        approximateDate,
        latitude,
        longitude,
        timezone,
        houseSystem: houseSystem || 'placidus',
      },
    });
    if (error) throw new Error(`Failed to calculate planetary return: ${JSON.stringify(error)}`);
    return data!;
  },

  getHouses: async (
    date: string,
    time: string,
    latitude: number,
    longitude: number,
    timezone: number,
    houseSystem?: 'placidus' | 'whole-sign' | 'equal' | 'koch'
  ) => {
    const { data, error } = await apiClient.POST('/houses', {
      body: {
        date,
        time,
        latitude,
        longitude,
        timezone,
        houseSystem: houseSystem || 'placidus',
      },
    });
    if (error) throw new Error(`Failed to calculate houses: ${JSON.stringify(error)}`);
    return data!;
  },

  getAspects: async (
    date: string,
    time: string,
    timezone: number,
    planets?: string[],
    aspectTypes?: string[]
  ) => {
    const { data, error } = await apiClient.POST('/aspects', {
      body: { date, time, timezone, planets, aspectTypes },
    });
    if (error) throw new Error(`Failed to calculate aspects: ${JSON.stringify(error)}`);
    return data!;
  },

  getPlanetMeanings: async () => {
    const { data, error } = await apiClient.GET('/planet-meanings');
    if (error) throw new Error(`Failed to fetch planet meanings: ${JSON.stringify(error)}`);
    return data!;
  },

  getPlanetMeaningById: async (id: string) => {
    const { data, error } = await apiClient.GET('/planet-meanings/{identifier}', {
      params: { path: { identifier: id } },
    });
    if (error) throw new Error(`Failed to fetch planet meaning: ${JSON.stringify(error)}`);
    return data!;
  },
};

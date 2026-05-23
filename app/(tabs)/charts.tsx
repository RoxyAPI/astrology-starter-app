import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { LoadingSpinner, FormInput, CityPicker, PlanetCard, AspectCard } from '../../src/components';
import { astrologyApi } from '../../src/api';
import type { NatalChart, Synastry, CompositeChart, BirthDetails, City } from '../../src/api/types';

type ChartType = 'natal' | 'synastry' | 'composite';
type HouseSystem = 'placidus' | 'whole-sign' | 'equal' | 'koch';

const HOUSE_SYSTEMS: { value: HouseSystem; label: string }[] = [
  { value: 'placidus', label: 'Placidus' },
  { value: 'whole-sign', label: 'Whole Sign' },
  { value: 'equal', label: 'Equal' },
  { value: 'koch', label: 'Koch' },
];

/** Build the chart request body from a date, a time, and a geocoded city. */
const toBirthDetails = (date: string, time: string, city: City): BirthDetails => ({
  date,
  time,
  latitude: city.latitude,
  longitude: city.longitude,
  timezone: city.timezone,
});

export default function ChartsScreen() {
  const [chartType, setChartType] = useState<ChartType>('natal');
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus');

  // Natal Chart state
  const [natalDate, setNatalDate] = useState('');
  const [natalTime, setNatalTime] = useState('');
  const [natalCity, setNatalCity] = useState<City | null>(null);
  const [natalChart, setNatalChart] = useState<NatalChart | null>(null);
  const [natalLoading, setNatalLoading] = useState(false);

  // Synastry / composite state (two people share the same inputs)
  const [p1Date, setP1Date] = useState('');
  const [p1Time, setP1Time] = useState('');
  const [p1City, setP1City] = useState<City | null>(null);
  const [p2Date, setP2Date] = useState('');
  const [p2Time, setP2Time] = useState('');
  const [p2City, setP2City] = useState<City | null>(null);

  const [synastry, setSynastry] = useState<Synastry | null>(null);
  const [synastryLoading, setSynastryLoading] = useState(false);
  const [composite, setComposite] = useState<CompositeChart | null>(null);
  const [compositeLoading, setCompositeLoading] = useState(false);

  const handleCalculateNatal = async () => {
    if (!natalDate || !natalTime || !natalCity) {
      Alert.alert('Missing Data', 'Please enter date, time, and a birth city');
      return;
    }
    setNatalLoading(true);
    try {
      const chart = await astrologyApi.getNatalChart({
        ...toBirthDetails(natalDate, natalTime, natalCity),
        houseSystem,
      });
      setNatalChart(chart);
    } catch {
      Alert.alert('Error', 'Failed to calculate natal chart');
    } finally {
      setNatalLoading(false);
    }
  };

  const haveBothPeople = Boolean(p1Date && p1Time && p1City && p2Date && p2Time && p2City);

  const handleCalculateSynastry = async () => {
    if (!haveBothPeople) {
      Alert.alert('Missing Data', 'Please enter both birth dates, times, and cities');
      return;
    }
    setSynastryLoading(true);
    try {
      const result = await astrologyApi.getSynastry({
        person1: toBirthDetails(p1Date, p1Time, p1City!),
        person2: toBirthDetails(p2Date, p2Time, p2City!),
        houseSystem,
      });
      setSynastry(result);
    } catch {
      Alert.alert('Error', 'Failed to calculate synastry');
    } finally {
      setSynastryLoading(false);
    }
  };

  const handleCalculateComposite = async () => {
    if (!haveBothPeople) {
      Alert.alert('Missing Data', 'Please enter both birth details in the Synastry tab first');
      return;
    }
    setCompositeLoading(true);
    try {
      const chart = await astrologyApi.getCompositeChart({
        person1: toBirthDetails(p1Date, p1Time, p1City!),
        person2: toBirthDetails(p2Date, p2Time, p2City!),
        houseSystem,
      });
      setComposite(chart);
    } catch {
      Alert.alert('Error', 'Failed to generate composite chart');
    } finally {
      setCompositeLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="px-6 pt-6 pb-8">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white">Charts</Text>
          <Text className="text-zinc-600 dark:text-zinc-400 mt-2">
            Calculate natal charts, synastry, and composite charts
          </Text>
        </View>

        <View className="flex-row gap-2 mb-6">
          {(['natal', 'synastry', 'composite'] as const).map((type) => (
            <Pressable
              key={type}
              onPress={() => setChartType(type)}
              className={`flex-1 py-3 px-4 rounded-xl ${
                chartType === type ? 'bg-indigo-600' : 'bg-zinc-100 dark:bg-zinc-900'
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  chartType === type ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mb-6">
          <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            House System
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {HOUSE_SYSTEMS.map((system) => (
              <Pressable
                key={system.value}
                onPress={() => setHouseSystem(system.value)}
                className={`py-2 px-4 rounded-lg ${
                  houseSystem === system.value
                    ? 'bg-indigo-100 dark:bg-indigo-950 border-2 border-indigo-600'
                    : 'bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800'
                }`}
              >
                <Text
                  className={`text-sm font-medium ${
                    houseSystem === system.value
                      ? 'text-indigo-600 dark:text-indigo-400'
                      : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {system.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Natal Chart Tab */}
        {chartType === 'natal' && (
          <View className="mb-6">
            <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl mb-4">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Birth Information
              </Text>
              <FormInput
                label="Date (YYYY-MM-DD)"
                value={natalDate}
                onChangeText={setNatalDate}
                placeholder="1990-01-15"
              />
              <FormInput
                label="Time (HH:MM:SS)"
                value={natalTime}
                onChangeText={setNatalTime}
                placeholder="14:30:00"
              />
              <CityPicker label="Birth City" value={natalCity} onSelect={setNatalCity} />
              <Pressable
                onPress={handleCalculateNatal}
                disabled={natalLoading}
                className="bg-indigo-600 py-4 px-6 rounded-xl active:bg-indigo-700"
              >
                <Text className="text-white text-center font-semibold">
                  {natalLoading ? 'Calculating...' : 'Calculate Natal Chart'}
                </Text>
              </Pressable>
            </View>

            {natalLoading && <LoadingSpinner />}

            {natalChart && (
              <View className="space-y-4">
                <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl">
                  <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                    Houses
                  </Text>
                  <View className="space-y-2">
                    {natalChart.houses.map((house) => (
                      <View key={house.number} className="flex-row justify-between">
                        <Text className="text-zinc-700 dark:text-zinc-300">House {house.number}</Text>
                        <Text className="text-zinc-900 dark:text-white">
                          {house.sign} {house.degree.toFixed(2)}°
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View>
                  <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                    Planets
                  </Text>
                  {natalChart.planets.map((planet) => (
                    <PlanetCard key={planet.name} planet={planet} />
                  ))}
                </View>

                {natalChart.aspects && natalChart.aspects.length > 0 && (
                  <View>
                    <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                      Aspects
                    </Text>
                    {natalChart.aspects.map((aspect, idx) => (
                      <AspectCard key={idx} aspect={aspect} />
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Synastry Tab */}
        {chartType === 'synastry' && (
          <View className="mb-6">
            <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl mb-4">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Person 1 Birth Information
              </Text>
              <FormInput label="Date (YYYY-MM-DD)" value={p1Date} onChangeText={setP1Date} placeholder="1990-01-15" />
              <FormInput label="Time (HH:MM:SS)" value={p1Time} onChangeText={setP1Time} placeholder="14:30:00" />
              <CityPicker label="Birth City" value={p1City} onSelect={setP1City} />
            </View>

            <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl mb-4">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">
                Person 2 Birth Information
              </Text>
              <FormInput label="Date (YYYY-MM-DD)" value={p2Date} onChangeText={setP2Date} placeholder="1992-06-20" />
              <FormInput label="Time (HH:MM:SS)" value={p2Time} onChangeText={setP2Time} placeholder="09:15:00" />
              <CityPicker label="Birth City" value={p2City} onSelect={setP2City} />
            </View>

            <Pressable
              onPress={handleCalculateSynastry}
              disabled={synastryLoading}
              className="bg-indigo-600 py-4 px-6 rounded-xl active:bg-indigo-700"
            >
              <Text className="text-white text-center font-semibold">
                {synastryLoading ? 'Calculating...' : 'Calculate Synastry'}
              </Text>
            </Pressable>

            {synastryLoading && <LoadingSpinner />}

            {synastry && (
              <View className="space-y-4">
                <View className="bg-indigo-50 dark:bg-indigo-950 p-6 rounded-2xl border-2 border-indigo-600">
                  <Text className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
                    Overall Compatibility
                  </Text>
                  <Text className="text-5xl font-bold text-indigo-600 dark:text-indigo-400">
                    {synastry.compatibilityScore}%
                  </Text>
                  {synastry.analysis && (
                    <Text className="text-zinc-700 dark:text-zinc-300 mt-3">
                      {synastry.analysis.overall}
                    </Text>
                  )}
                </View>

                {synastry.interAspects && synastry.interAspects.length > 0 && (
                  <View>
                    <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                      Cross Aspects ({synastry.summary.total})
                    </Text>
                    {synastry.interAspects.slice(0, 20).map((aspect, idx) => (
                      <AspectCard key={idx} aspect={aspect} />
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Composite Tab */}
        {chartType === 'composite' && (
          <View className="mb-6">
            <View className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 mb-4">
              <Text className="text-zinc-700 dark:text-zinc-300">
                Composite chart combines two birth charts into one relationship chart. Enter both birth details in the Synastry tab first.
              </Text>
            </View>

            <Pressable
              onPress={handleCalculateComposite}
              disabled={compositeLoading}
              className="bg-indigo-600 py-4 px-6 rounded-xl active:bg-indigo-700 mb-4"
            >
              <Text className="text-white text-center font-semibold">
                {compositeLoading ? 'Calculating...' : 'Calculate Composite Chart'}
              </Text>
            </Pressable>

            {compositeLoading && <LoadingSpinner />}

            {composite && (
              <View className="space-y-4">
                <View className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900">
                  <Text className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
                    Composite Ascendant
                  </Text>
                  <Text className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {composite.compositeAscendant.sign} {composite.compositeAscendant.degree.toFixed(2)}°
                  </Text>
                </View>

                <View>
                  <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                    Composite Planets
                  </Text>
                  {composite.compositePlanets.map((planet) => (
                    <PlanetCard key={planet.name} planet={planet} />
                  ))}
                </View>

                {composite.compositeHouses && composite.compositeHouses.length > 0 && (
                  <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl">
                    <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                      Composite Houses
                    </Text>
                    <View className="space-y-2">
                      {composite.compositeHouses.map((house) => (
                        <View key={house.number} className="flex-row justify-between">
                          <Text className="text-zinc-700 dark:text-zinc-300">House {house.number}</Text>
                          <Text className="text-zinc-900 dark:text-white">
                            {house.sign} {house.degree.toFixed(2)}°
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {composite.aspects && composite.aspects.length > 0 && (
                  <View>
                    <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                      Composite Aspects
                    </Text>
                    {composite.aspects.map((aspect, idx) => (
                      <AspectCard key={idx} aspect={aspect} />
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

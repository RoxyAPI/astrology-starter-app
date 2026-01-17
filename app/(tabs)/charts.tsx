import { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { LoadingSpinner, FormInput, PlanetCard, AspectCard } from '../../src/components';
import { astrologyApi } from '../../src/api';
import type { NatalChart, Synastry, CompositeChart, PersonBirthData } from '../../src/api/types';

type ChartType = 'natal' | 'synastry' | 'composite';
type HouseSystem = 'placidus' | 'whole-sign' | 'equal' | 'koch';

const HOUSE_SYSTEMS: { value: HouseSystem; label: string }[] = [
  { value: 'placidus', label: 'Placidus' },
  { value: 'whole-sign', label: 'Whole Sign' },
  { value: 'equal', label: 'Equal' },
  { value: 'koch', label: 'Koch' },
];

export default function ChartsScreen() {
  const [chartType, setChartType] = useState<ChartType>('natal');
  const [houseSystem, setHouseSystem] = useState<HouseSystem>('placidus');

  // Natal Chart state
  const [natalData, setNatalData] = useState<PersonBirthData>({
    date: '',
    time: '',
    latitude: 0,
    longitude: 0,
    timezone: 0,
  });
  const [natalChart, setNatalChart] = useState<NatalChart | null>(null);
  const [natalLoading, setNatalLoading] = useState(false);
  const [natalError, setNatalError] = useState<string | null>(null);

  // Synastry state
  const [person1Data, setPerson1Data] = useState<PersonBirthData>({
    date: '',
    time: '',
    latitude: 0,
    longitude: 0,
    timezone: 0,
  });
  const [person2Data, setPerson2Data] = useState<PersonBirthData>({
    date: '',
    time: '',
    latitude: 0,
    longitude: 0,
    timezone: 0,
  });
  const [synastry, setSynastry] = useState<Synastry | null>(null);
  const [synastryLoading, setSynastryLoading] = useState(false);
  const [synastryError, setSynastryError] = useState<string | null>(null);

  // Composite state
  const [composite, setComposite] = useState<CompositeChart | null>(null);
  const [compositeLoading, setCompositeLoading] = useState(false);
  const [compositeError, setCompositeError] = useState<string | null>(null);

  const handleCalculateNatal = async () => {
    if (!natalData.date || !natalData.time) {
      Alert.alert('Missing Data', 'Please enter date and time');
      return;
    }

    setNatalLoading(true);
    setNatalError(null);
    try {
      const chart = await astrologyApi.getNatalChart({ ...natalData, houseSystem });
      setNatalChart(chart);
    } catch {
      setNatalError('Failed to calculate natal chart');
    } finally {
      setNatalLoading(false);
    }
  };

  const handleCalculateSynastry = async () => {
    if (!person1Data.date || !person1Data.time || !person2Data.date || !person2Data.time) {
      Alert.alert('Missing Data', 'Please enter both birth dates and times');
      return;
    }

    setSynastryLoading(true);
    setSynastryError(null);
    try {
      const result = await astrologyApi.getSynastry(person1Data, person2Data, houseSystem);
      setSynastry(result);
    } catch {
      setSynastryError('Failed to calculate synastry');
    } finally {
      setSynastryLoading(false);
    }
  };

  const handleCalculateComposite = async () => {
    if (!person1Data.date || !person1Data.time || !person2Data.date || !person2Data.time) {
      Alert.alert('Missing Data', 'Please enter both birth dates and times');
      return;
    }

    setCompositeLoading(true);
    setCompositeError(null);
    try {
      const chart = await astrologyApi.getCompositeChart(person1Data, person2Data, houseSystem);
      setComposite(chart);
    } catch {
      setCompositeError('Failed to calculate composite chart');
    } finally {
      setCompositeLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="px-6 pt-6 pb-8">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white">Charts</Text>
          <Text className="text-zinc-600 dark:text-zinc-400 mt-2">
            Calculate natal charts, synastry, and composite charts
          </Text>
        </View>

        {/* Chart Type Tabs */}
        <View className="flex-row gap-2 mb-6">
          {(['natal', 'synastry', 'composite'] as const).map((type) => (
            <Pressable
              key={type}
              onPress={() => setChartType(type)}
              className={`flex-1 py-3 px-4 rounded-xl ${
                chartType === type
                  ? 'bg-indigo-600'
                  : 'bg-zinc-100 dark:bg-zinc-900'
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  chartType === type
                    ? 'text-white'
                    : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {type}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* House System Selector */}
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
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white">
                Birth Information
              </Text>
              <FormInput
                label="Date (YYYY-MM-DD)"
                value={natalData.date}
                onChangeText={(text) => setNatalData({ ...natalData, date: text })}
                placeholder="1990-01-15"
              />
              <FormInput
                label="Time (HH:MM:SS)"
                value={natalData.time}
                onChangeText={(text) => setNatalData({ ...natalData, time: text })}
                placeholder="14:30:00"
              />
              <FormInput
                label="Latitude"
                value={natalData.latitude.toString()}
                onChangeText={(text) => setNatalData({ ...natalData, latitude: parseFloat(text) || 0 })}
                placeholder="40.7128"
                keyboardType="numeric"
              />
              <FormInput
                label="Longitude"
                value={natalData.longitude.toString()}
                onChangeText={(text) => setNatalData({ ...natalData, longitude: parseFloat(text) || 0 })}
                placeholder="-74.0060"
                keyboardType="numeric"
              />
              <FormInput
                label="Timezone (offset from UTC)"
                value={natalData.timezone.toString()}
                onChangeText={(text) => setNatalData({ ...natalData, timezone: parseFloat(text) || 0 })}
                placeholder="-5"
                keyboardType="numeric"
              />
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
            {/* Error silently caught - users can add custom error UI */}
            
            {natalChart && (
              <View className="space-y-4">
                {/* House Cusps */}
                <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl">
                  <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                    Houses
                  </Text>
                  <View className="space-y-2">
                    {natalChart.houses.map((house, idx) => (
                      <View key={idx} className="flex-row justify-between">
                        <Text className="text-zinc-700 dark:text-zinc-300">House {house.number}</Text>
                        <Text className="text-zinc-900 dark:text-white">
                          {house.sign} {house.degree.toFixed(2)}°
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Planets */}
                <View>
                  <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                    Planets
                  </Text>
                  {natalChart.planets.map((planet) => (
                    <PlanetCard key={planet.name} planet={planet} />
                  ))}
                </View>

                {/* Aspects */}
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
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white">
                Person 1 Birth Information
              </Text>
              <FormInput
                label="Date (YYYY-MM-DD)"
                value={person1Data.date}
                onChangeText={(text) => setPerson1Data({ ...person1Data, date: text })}
                placeholder="1990-01-15"
              />
              <FormInput
                label="Time (HH:MM:SS)"
                value={person1Data.time}
                onChangeText={(text) => setPerson1Data({ ...person1Data, time: text })}
                placeholder="14:30:00"
              />
              <FormInput
                label="Latitude"
                value={person1Data.latitude.toString()}
                onChangeText={(text) => setPerson1Data({ ...person1Data, latitude: parseFloat(text) || 0 })}
                placeholder="40.7128"
                keyboardType="numeric"
              />
              <FormInput
                label="Longitude"
                value={person1Data.longitude.toString()}
                onChangeText={(text) => setPerson1Data({ ...person1Data, longitude: parseFloat(text) || 0 })}
                placeholder="-74.0060"
                keyboardType="numeric"
              />
              <FormInput
                label="Timezone"
                value={person1Data.timezone.toString()}
                onChangeText={(text) => setPerson1Data({ ...person1Data, timezone: parseFloat(text) || 0 })}
                placeholder="-5"
                keyboardType="numeric"
              />
            </View>

            <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl mb-4">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white">
                Person 2 Birth Information
              </Text>
              <FormInput
                label="Date (YYYY-MM-DD)"
                value={person2Data.date}
                onChangeText={(text) => setPerson2Data({ ...person2Data, date: text })}
                placeholder="1992-06-20"
              />
              <FormInput
                label="Time (HH:MM:SS)"
                value={person2Data.time}
                onChangeText={(text) => setPerson2Data({ ...person2Data, time: text })}
                placeholder="09:15:00"
              />
              <FormInput
                label="Latitude"
                value={person2Data.latitude.toString()}
                onChangeText={(text) => setPerson2Data({ ...person2Data, latitude: parseFloat(text) || 0 })}
                placeholder="34.0522"
                keyboardType="numeric"
              />
              <FormInput
                label="Longitude"
                value={person2Data.longitude.toString()}
                onChangeText={(text) => setPerson2Data({ ...person2Data, longitude: parseFloat(text) || 0 })}
                placeholder="-118.2437"
                keyboardType="numeric"
              />
              <FormInput
                label="Timezone"
                value={person2Data.timezone.toString()}
                onChangeText={(text) => setPerson2Data({ ...person2Data, timezone: parseFloat(text) || 0 })}
                placeholder="-8"
                keyboardType="numeric"
              />
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
            {/* Error silently caught - users can add custom error UI */}
            
            {synastry && (
              <View className="space-y-4">
                {/* Compatibility Score */}
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

                {/* Cross Aspects */}
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
            {/* Error silently caught - users can add custom error UI */}
            
            {composite && (
              <View className="space-y-4">
                {/* Composite Ascendant */}
                <View className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900">
                  <Text className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
                    Composite Ascendant
                  </Text>
                  <Text className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                    {composite.compositeAscendant.sign} {composite.compositeAscendant.degree.toFixed(2)}°
                  </Text>
                </View>

                {/* Composite Planets */}
                <View>
                  <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                    Composite Planets
                  </Text>
                  {composite.compositePlanets.map((planet) => (
                    <PlanetCard key={planet.name} planet={planet} />
                  ))}
                </View>

                {/* Composite Houses */}
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

                {/* Composite Aspects */}
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

import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { useState } from "react";
import { LoadingSpinner, ErrorMessage, FormInput, CityPicker } from "../../src/components";
import { astrologyApi } from "../../src/api";
import type { CompatibilityScore, BirthDetails, City } from "../../src/api/types";

type ToolType = 'compatibility' | 'houses' | 'aspects';

/** Build the chart request body from a date, a time, and a geocoded city. */
const toBirthDetails = (date: string, time: string, city: City): BirthDetails => ({
  date,
  time,
  latitude: city.latitude,
  longitude: city.longitude,
  timezone: city.timezone,
});

export default function ToolsScreen() {
  const [activeTool, setActiveTool] = useState<ToolType>('compatibility');

  const [p1Date, setP1Date] = useState('');
  const [p1Time, setP1Time] = useState('');
  const [p1City, setP1City] = useState<City | null>(null);
  const [p2Date, setP2Date] = useState('');
  const [p2Time, setP2Time] = useState('');
  const [p2City, setP2City] = useState<City | null>(null);

  const [compatibility, setCompatibility] = useState<CompatibilityScore | null>(null);
  const [compatibilityLoading, setCompatibilityLoading] = useState(false);
  const [compatibilityError, setCompatibilityError] = useState<string | null>(null);

  const handleCalculateCompatibility = async () => {
    if (!p1Date || !p1Time || !p1City || !p2Date || !p2Time || !p2City) {
      Alert.alert('Missing Data', 'Please enter both birth dates, times, and cities');
      return;
    }

    setCompatibilityLoading(true);
    setCompatibilityError(null);
    try {
      const result = await astrologyApi.getCompatibilityScore({
        person1: toBirthDetails(p1Date, p1Time, p1City),
        person2: toBirthDetails(p2Date, p2Time, p2City),
      });
      setCompatibility(result);
    } catch {
      setCompatibilityError('Failed to calculate compatibility');
    } finally {
      setCompatibilityLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="px-6 pt-6 pb-8">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white">Tools</Text>
          <Text className="text-zinc-600 dark:text-zinc-400 mt-2">
            Astrology calculators and tools
          </Text>
        </View>

        <View className="flex-row gap-2 mb-6">
          {(['compatibility', 'houses', 'aspects'] as const).map((tool) => (
            <Pressable
              key={tool}
              onPress={() => setActiveTool(tool)}
              className={`flex-1 py-3 px-4 rounded-xl ${
                activeTool === tool ? 'bg-indigo-600' : 'bg-zinc-100 dark:bg-zinc-900'
              }`}
            >
              <Text
                className={`text-center font-semibold capitalize ${
                  activeTool === tool ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {tool}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Compatibility Calculator */}
        {activeTool === 'compatibility' && (
          <View className="mb-6">
            <View className="bg-indigo-50 dark:bg-indigo-950 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900 mb-4">
              <Text className="text-zinc-700 dark:text-zinc-300">
                Calculate relationship compatibility score based on birth charts. Enter birth information for both people.
              </Text>
            </View>

            <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl mb-4">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Person 1</Text>
              <FormInput label="Date (YYYY-MM-DD)" value={p1Date} onChangeText={setP1Date} placeholder="1990-01-15" />
              <FormInput label="Time (HH:MM:SS)" value={p1Time} onChangeText={setP1Time} placeholder="14:30:00" />
              <CityPicker label="Birth City" value={p1City} onSelect={setP1City} />
            </View>

            <View className="bg-zinc-50 dark:bg-zinc-900 p-4 rounded-2xl mb-4">
              <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Person 2</Text>
              <FormInput label="Date (YYYY-MM-DD)" value={p2Date} onChangeText={setP2Date} placeholder="1992-06-20" />
              <FormInput label="Time (HH:MM:SS)" value={p2Time} onChangeText={setP2Time} placeholder="09:15:00" />
              <CityPicker label="Birth City" value={p2City} onSelect={setP2City} />
            </View>

            <Pressable
              onPress={handleCalculateCompatibility}
              disabled={compatibilityLoading}
              className="bg-indigo-600 py-4 px-6 rounded-xl active:bg-indigo-700"
            >
              <Text className="text-white text-center font-semibold">
                {compatibilityLoading ? 'Calculating...' : 'Calculate Compatibility'}
              </Text>
            </Pressable>

            {compatibilityLoading && <LoadingSpinner />}
            {compatibilityError && <ErrorMessage message={compatibilityError} onRetry={handleCalculateCompatibility} />}

            {compatibility && (
              <View className="space-y-4">
                <View className="bg-indigo-50 dark:bg-indigo-950 p-6 rounded-2xl border-2 border-indigo-600">
                  <Text className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-2">
                    Overall Compatibility
                  </Text>
                  <Text className="text-6xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">
                    {compatibility.overallScore}%
                  </Text>
                  <Text className="text-zinc-700 dark:text-zinc-300 leading-6">
                    {compatibility.interpretation}
                  </Text>
                </View>

                <View className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl">
                  <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                    Category Breakdown
                  </Text>
                  <View className="space-y-3">
                    {Object.entries(compatibility.categories).map(([category, score]) => (
                      <View key={category}>
                        <View className="flex-row justify-between mb-1">
                          <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 capitalize">
                            {category}
                          </Text>
                          <Text className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                            {score}%
                          </Text>
                        </View>
                        <View className="bg-zinc-200 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <View
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: `${score}%` }}
                          />
                        </View>
                      </View>
                    ))}
                  </View>
                </View>

                {compatibility.strengths && compatibility.strengths.length > 0 && (
                  <View className="bg-green-50 dark:bg-green-950/30 p-6 rounded-2xl border border-green-200 dark:border-green-900">
                    <Text className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3">
                      Strengths
                    </Text>
                    <View className="space-y-2">
                      {compatibility.strengths.map((strength, idx) => (
                        <Text key={idx} className="text-zinc-700 dark:text-zinc-300">
                          + {strength}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {compatibility.challenges && compatibility.challenges.length > 0 && (
                  <View className="bg-amber-50 dark:bg-amber-950/30 p-6 rounded-2xl border border-amber-200 dark:border-amber-900">
                    <Text className="text-lg font-semibold text-amber-700 dark:text-amber-400 mb-3">
                      Areas to Work On
                    </Text>
                    <View className="space-y-2">
                      {compatibility.challenges.map((challenge, idx) => (
                        <Text key={idx} className="text-zinc-700 dark:text-zinc-300">
                          {challenge}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {compatibility.aspectBreakdown && (
                  <View className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl">
                    <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                      Aspect Analysis
                    </Text>
                    <View className="space-y-2">
                      <View className="flex-row justify-between">
                        <Text className="text-zinc-700 dark:text-zinc-300">Total Aspects</Text>
                        <Text className="font-semibold text-zinc-900 dark:text-white">
                          {compatibility.aspectBreakdown.total}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-green-700 dark:text-green-400">Harmonious</Text>
                        <Text className="font-semibold text-green-700 dark:text-green-400">
                          {compatibility.aspectBreakdown.harmonious}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-red-700 dark:text-red-400">Challenging</Text>
                        <Text className="font-semibold text-red-700 dark:text-red-400">
                          {compatibility.aspectBreakdown.challenging}
                        </Text>
                      </View>
                      <View className="flex-row justify-between">
                        <Text className="text-zinc-700 dark:text-zinc-300">Neutral</Text>
                        <Text className="font-semibold text-zinc-900 dark:text-white">
                          {compatibility.aspectBreakdown.neutral}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Houses Calculator Placeholder */}
        {activeTool === 'houses' && (
          <View className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl">
            <Text className="text-xl font-bold text-zinc-900 dark:text-white mb-3 text-center">
              Houses Calculator
            </Text>
            <Text className="text-zinc-600 dark:text-zinc-400 text-center">
              Calculate house cusps for a specific date, time, and location. Use the Charts tab for a natal chart with houses.
            </Text>
          </View>
        )}

        {/* Aspects Calculator Placeholder */}
        {activeTool === 'aspects' && (
          <View className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-2xl mb-8">
            <Text className="text-xl font-bold text-zinc-900 dark:text-white mb-3 text-center">
              Aspects Calculator
            </Text>
            <Text className="text-zinc-600 dark:text-zinc-400 text-center">
              Calculate aspects between planets. Use the Charts tab for a natal chart with full aspect analysis.
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

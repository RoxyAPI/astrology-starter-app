import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { LoadingSpinner, ErrorMessage, PlanetCard } from "../../src/components";
import { astrologyApi } from "../../src/api";
import type { PlanetPositionsResponse, MoonPhase } from "../../src/api/types";

export default function CosmosScreen() {
  const [planets, setPlanets] = useState<PlanetPositionsResponse | null>(null);
  const [moonPhase, setMoonPhase] = useState<MoonPhase | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCosmosData = async () => {
    setLoading(true);
    setError(null);
    try {
      const now = new Date();
      const date = now.toISOString().split('T')[0];
      const time = now.toTimeString().split(' ')[0];
      
      // Get current positions (using UTC coordinates at prime meridian)
      const [planetsData, moonData] = await Promise.all([
        astrologyApi.getPlanetPositions(date, time, 0, 0, 0),
        astrologyApi.getMoonPhase(),
      ]);
      
      setPlanets(planetsData);
      setMoonPhase(moonData);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch cosmos data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCosmosData();
  }, []);

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="px-6 pt-6 pb-8">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-zinc-900 dark:text-white">Cosmos</Text>
          <Text className="text-zinc-600 dark:text-zinc-400 mt-2">
            Current planetary positions and moon phase
          </Text>
        </View>

        {loading && <LoadingSpinner />}
        {error && <ErrorMessage message={error} onRetry={fetchCosmosData} />}

        {/* Moon Phase */}
        {moonPhase && (
          <View className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 p-6 rounded-2xl border-2 border-indigo-600 mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <View>
                <Text className="text-sm uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-1">
                  Current Moon Phase
                </Text>
                <Text className="text-3xl font-bold text-zinc-900 dark:text-white">
                  {moonPhase.meaning?.name || moonPhase.phase}
                </Text>
              </View>
              <Text className="text-6xl">{moonPhase.meaning?.symbol || '🌙'}</Text>
            </View>

            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-zinc-700 dark:text-zinc-300">Illumination</Text>
                <Text className="font-semibold text-zinc-900 dark:text-white">
                  {moonPhase.illumination.toFixed(1)}%
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-zinc-700 dark:text-zinc-300">Age</Text>
                <Text className="font-semibold text-zinc-900 dark:text-white">
                  {moonPhase.age.toFixed(1)} days
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-zinc-700 dark:text-zinc-300">Sign</Text>
                <Text className="font-semibold text-zinc-900 dark:text-white capitalize">
                  {moonPhase.sign}
                </Text>
              </View>
            </View>

            {moonPhase.meaning?.description && (
              <View className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-900">
                <Text className="text-zinc-700 dark:text-zinc-300 mb-3">
                  {moonPhase.meaning.description}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Planet Positions */}
        {planets && planets.planets && planets.planets.length > 0 && (
          <View>
            <Text className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
              Current Planetary Positions
            </Text>
            <Text className="text-zinc-600 dark:text-zinc-400 mb-4">
              Calculated for {new Date().toLocaleString()}
            </Text>
            {planets.planets.map((planet) => (
              <PlanetCard key={planet.name} planet={planet} showHouse={false} />
            ))}
          </View>
        )}

        {/* Refresh Button */}
        <Pressable
          onPress={fetchCosmosData}
          disabled={loading}
          className="bg-indigo-600 py-4 px-6 rounded-xl active:bg-indigo-700 mb-8"
        >
          <Text className="text-white text-center font-semibold">
            {loading ? 'Refreshing...' : 'Refresh Data'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

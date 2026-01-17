import { View, Text } from "react-native";
import type { Planet } from "../api/types";

interface PlanetCardProps {
  planet: Pick<Planet, 'name' | 'sign' | 'degree' | 'speed' | 'isRetrograde'> & {
    house?: number;
    interpretation?: {
      summary: string;
      detailed?: string;
      planetMeaning?: string;
      signExpression?: string;
      keywords: string[];
    };
  };
  showHouse?: boolean;
}

export function PlanetCard({ planet, showHouse = true }: PlanetCardProps) {
  return (
    <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-zinc-900 dark:text-white">
            {planet.name}
          </Text>
          {planet.isRetrograde && (
            <View className="ml-2 bg-red-100 dark:bg-red-950/50 px-2 py-1 rounded-full">
              <Text className="text-xs font-semibold text-red-700 dark:text-red-400">
                Rx
              </Text>
            </View>
          )}
        </View>
        <Text className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
          {planet.sign}
        </Text>
      </View>
      
      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">
            Position
          </Text>
          <Text className="text-sm text-zinc-700 dark:text-zinc-300">
            {planet.degree.toFixed(2)}°
          </Text>
        </View>
        {showHouse && planet.house !== undefined && (
          <View>
            <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">
              House
            </Text>
            <Text className="text-sm text-zinc-700 dark:text-zinc-300">
              {planet.house}
            </Text>
          </View>
        )}
        <View>
          <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">
            Speed
          </Text>
          <Text className="text-sm text-zinc-700 dark:text-zinc-300">
            {planet.speed.toFixed(4)}
          </Text>
        </View>
      </View>

      {planet.interpretation && (
        <View className="mt-3 pt-3 border-t border-zinc-200 dark:border-zinc-800">
          <Text className="text-sm text-zinc-700 dark:text-zinc-300 leading-6">
            {planet.interpretation.summary}
          </Text>
        </View>
      )}
    </View>
  );
}

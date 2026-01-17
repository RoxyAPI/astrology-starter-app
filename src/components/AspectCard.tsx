import { View, Text } from "react-native";
import type { Aspect } from "../api/types";

interface AspectCardProps {
  aspect: Pick<Aspect, 'planet1' | 'planet2' | 'type' | 'angle' | 'orb' | 'strength' | 'interpretation'> & {
    isApplying?: boolean;
  };
}

const aspectColors = {
  harmonious: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
  challenging: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
  neutral: "bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800",
};

const aspectBadgeColors = {
  harmonious: "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400",
  challenging: "bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400",
  neutral: "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400",
};

export function AspectCard({ aspect }: AspectCardProps) {
  const interpretation = aspect.interpretation as keyof typeof aspectColors;
  const colorClass = aspectColors[interpretation] || aspectColors.neutral;
  const badgeClass = aspectBadgeColors[interpretation] || aspectBadgeColors.neutral;

  return (
    <View className={`rounded-2xl border p-4 mb-3 ${colorClass}`}>
      <View className="flex-row items-center justify-between mb-2">
        <Text className="text-base font-bold text-zinc-900 dark:text-white">
          {aspect.planet1} {aspect.type} {aspect.planet2}
        </Text>
        <View className={`px-3 py-1 rounded-full ${badgeClass}`}>
          <Text className="text-xs font-semibold">
            {aspect.interpretation.toUpperCase()}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between mb-2">
        <View>
          <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">
            Angle
          </Text>
          <Text className="text-sm text-zinc-700 dark:text-zinc-300">
            {aspect.angle}°
          </Text>
        </View>
        <View>
          <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">
            Orb
          </Text>
          <Text className="text-sm text-zinc-700 dark:text-zinc-300">
            {aspect.orb.toFixed(2)}°
          </Text>
        </View>
        <View>
          <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">
            Strength
          </Text>
          <Text className="text-sm text-zinc-700 dark:text-zinc-300">
            {aspect.strength}%
          </Text>
        </View>
        {aspect.isApplying !== undefined && (
          <View>
            <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-1">
              Type
            </Text>
            <Text className="text-sm text-zinc-700 dark:text-zinc-300">
              {aspect.isApplying ? 'Applying' : 'Separating'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

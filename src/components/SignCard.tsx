import { View, Text, Pressable } from "react-native";
import type { ZodiacSign } from "../api/types";

interface SignCardProps {
  sign: ZodiacSign;
  onPress?: () => void;
}

const elementColors = {
  fire: "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900",
  earth: "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900",
  air: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900",
  water: "bg-cyan-50 dark:bg-cyan-950/30 border-cyan-200 dark:border-cyan-900",
};

const elementTextColors = {
  fire: "text-red-700 dark:text-red-400",
  earth: "text-green-700 dark:text-green-400",
  air: "text-blue-700 dark:text-blue-400",
  water: "text-cyan-700 dark:text-cyan-400",
};

export function SignCard({ sign, onPress }: SignCardProps) {
  const element = sign.element.toLowerCase() as keyof typeof elementColors;
  const colorClass = elementColors[element] || elementColors.fire;
  const textColorClass = elementTextColors[element] || elementTextColors.fire;

  const content = (
    <View className={`rounded-2xl border-2 p-4 ${colorClass}`}>
      <View className="items-center">
        {sign.symbol && (
          <Text className="text-4xl mb-2">{sign.symbol}</Text>
        )}
        <Text className="text-lg font-bold text-zinc-900 dark:text-white text-center">
          {sign.name}
        </Text>
        <Text className={`text-xs font-medium mt-1 uppercase tracking-wide ${textColorClass}`}>
          {sign.element}
        </Text>
        <Text className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
          {sign.dates.start} - {sign.dates.end}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} className="active:opacity-70">
        {content}
      </Pressable>
    );
  }

  return content;
}

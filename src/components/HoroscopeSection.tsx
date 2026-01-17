import { View, Text } from "react-native";

interface HoroscopeSectionProps {
  title: string;
  content: string;
  icon?: string;
}

export function HoroscopeSection({ title, content, icon }: HoroscopeSectionProps) {
  return (
    <View className="mb-6">
      <View className="flex-row items-center mb-3">
        {icon && <Text className="text-xl mr-2">{icon}</Text>}
        <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 font-medium">
          {title}
        </Text>
      </View>
      <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5">
        <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-7">
          {content}
        </Text>
      </View>
    </View>
  );
}

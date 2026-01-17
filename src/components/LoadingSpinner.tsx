import { View, Text, ActivityIndicator } from "react-native";
import { appColors } from "../constants/colors";

export function LoadingSpinner() {
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-950">
      <ActivityIndicator size="large" color={appColors.primary} />
      <Text className="text-zinc-500 dark:text-zinc-400 mt-4">Loading...</Text>
    </View>
  );
}

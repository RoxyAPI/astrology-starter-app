import { View, Text, Pressable } from "react-native";
import { AlertCircle, RotateCcw } from "lucide-react-native";
import { appColors } from "../constants/colors";
import colors from "tailwindcss/colors";

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <View className="flex-1 justify-center items-center bg-white dark:bg-zinc-950 px-6">
      <View className="items-center mb-6">
        <AlertCircle size={48} color={colors.red[500]} />
        <Text className="text-xl font-semibold text-zinc-900 dark:text-white mt-4 text-center">
          {message}
        </Text>
      </View>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          className="bg-indigo-600 px-6 py-3 rounded-xl active:bg-indigo-700 flex-row items-center"
        >
          <RotateCcw size={20} color={appColors.white} />
          <Text className="text-white font-semibold ml-2">Retry</Text>
        </Pressable>
      )}
    </View>
  );
}

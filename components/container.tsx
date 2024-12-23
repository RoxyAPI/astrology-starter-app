import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Container = ({ children }: { children: React.ReactElement }) => {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-gray-950" style={{ paddingTop: insets.top }}>
      {children}
    </View>
  );
};

export default Container;

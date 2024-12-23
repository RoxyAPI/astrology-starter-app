import { Pressable, View } from "react-native";
import Text from "./ui/text";
import { FontAwesome6 } from "@expo/vector-icons";
import { router } from "expo-router";
import { memo, useCallback } from "react";

const Header = memo(({ title }: { title?: string }) => {
  const goBack = useCallback(
    () => (router.canGoBack() ? router.back() : router.push("/")),
    [],
  );

  return (
    <View className="justify-center">
      <Pressable
        className="absolute left-4 flex-1 h-full items-center justify-center p-4 z-10"
        onPress={goBack}
      >
        <Text className="">
          <FontAwesome6
            size={20}
            style={{ marginBottom: -3 }}
            name="chevron-left"
          />
        </Text>
      </Pressable>
      {title && (
        <Text className="text-3xl font-bold text-center p-4">{title}</Text>
      )}
    </View>
  );
});

Header.displayName = "Header";

export default Header;

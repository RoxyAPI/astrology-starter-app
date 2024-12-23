import Container from "@/components/container";
import Text from "@/components/ui/text";
import { TarotCardType } from "@/types/tarot";
import { router } from "expo-router";
import { Pressable, View } from "react-native";

export default function Tarot() {
  const drawOneCard = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/data/astro/tarot/single-card-draw?token=${process.env.EXPO_PUBLIC_API_KEY}`,
    );
    const data: TarotCardType = await response.json();
    if (data) {
      router.push({
        pathname: `/tarot/card`,
        params: { cardData: JSON.stringify(data) },
      });
    }
  };

  return (
    <Container>
      <View className="flex-1">
        <View>
          <Text className="text-3xl font-bold text-center p-4">
            Daily Tarot
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Pressable
            onPress={drawOneCard}
            className="p-4 px-16 rounded-xl border border-primary bg-primary/70 active:bg-primary/80"
          >
            <Text className="text-xl font-bold text-center">Draw a card</Text>
          </Pressable>
        </View>
      </View>
    </Container>
  );
}

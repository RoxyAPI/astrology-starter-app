import Container from "@/components/container";
import Header from "@/components/header";
import Text from "@/components/ui/text";
import { HoroscopeType } from "@/types/horoscope";
import { ZodiacType } from "@/types/zodiac";
import { FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, View } from "react-native";

const HoroscopeSign = () => {
  const item: ZodiacType = useLocalSearchParams();
  const [data, setData] = useState<HoroscopeType | null>(null);

  const fetchData = useCallback(async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/data/astro/astrology/horoscope/${item.name}?token=${process.env.EXPO_PUBLIC_API_KEY}`,
    );
    const data = await response.json();
    setData(data);
  }, [item.name]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Container>
      <View className="flex-1 pb-4">
        <Header title={item.name} />
        <ScrollView>
          <Image
            className="w-32 h-32 mx-auto my-4"
            source={{ uri: item.image }}
          />
          <View className="gap-2 p-4 flex-1">
            {/* Symbol */}
            <Text className="text-center font-bold text-3xl">
              {item.symbol}
            </Text>
            {/* Date */}
            <Text className="text-center font-bold text-2xl">
              {item.start_date} - {item.end_date}
            </Text>
            {/* Element */}
            <Text className="text-center font-semibold">{item.element}</Text>
            {/* Modality */}
            <Text className="text-center">{item.modality}</Text>
            {/* Personality */}
            {data ? (
              <Text className="text-xl leading-7 text-justify mt-6">
                {data.horoscope}
              </Text>
            ) : (
              <View className="flex-1 justify-center items-center mt-8">
                <Text className="text-center animate-spin">
                  <FontAwesome6
                    name="circle-notch"
                    size={32}
                    className="w-24 bg-black"
                  />
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </Container>
  );
};

export default HoroscopeSign;

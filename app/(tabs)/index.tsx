import Container from "@/components/container";
import Text from "@/components/ui/text";
import Colors from "@/constants/Colors";
import { ZodiacType } from "@/types/zodiac";
import { Link } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ColorValue, FlatList, Image, Pressable, RefreshControl, View } from "react-native";

export default function Zodiac() {
  const [data, setData] = useState<ZodiacType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    setRefreshing(true);
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/data/astro/astrology/zodiac/signs?token=${process.env.EXPO_PUBLIC_API_KEY}`,
    );
    const data = await response.json();
    setData(data);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ZodiacType }) => (
      <Link
        asChild
        href={{
          pathname: `/zodiac/[sign_name]`,
          params: { ...item, sign_name: item.name },
        }}
        key={item.name}
      >
        <Pressable className="flex-1">
          <View className="flex flex-1 my-4">
            <View className="flex border flex-1 m-2 rounded-3xl bg-secondary">
              <Image
                className="w-24 h-24 mx-auto my-4"
                source={{ uri: item.image }}
              />
            </View>
            <View className="flex flex-col px-4">
              <Text className="text-xl font-bold text-center">{item.name}</Text>
            </View>
          </View>
        </Pressable>
      </Link>
    ),
    [],
  );

  return (
    <Container>
      <View>
        <Text className="text-3xl font-bold text-center p-4">Zodiac Signs</Text>
        <FlatList
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} tintColor={Colors.dark.tint} colors={[Colors.dark.tint as ColorValue]} />}
          data={data}
          numColumns={3}
          contentContainerStyle={{ paddingBottom: 50 }}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderItem}
        />
      </View>
    </Container>
  );
}

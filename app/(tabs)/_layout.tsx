import React from "react";
import { Link, Tabs } from "expo-router";
import { Pressable } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { FontAwesome6, MaterialCommunityIcons } from "@expo/vector-icons";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome6>["name"];
  color: string;
}) {
  return <FontAwesome6 size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        animation: "none",
        tabBarStyle: {
          backgroundColor: "#000",
          borderColor: "#444",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Zodiac",
          headerShown: false,
          tabBarIcon: ({ color }) => <TabBarIcon name="star-of-david" color={color} />,
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome6
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="horoscope"
        options={{
          title: "Horoscope",
          tabBarIcon: ({ color }) => <TabBarIcon name="spa" color={color} />,
        }}
      />
      <Tabs.Screen
        name="numerology"
        options={{
          title: "Numerology",
          tabBarIcon: ({ color }) => <TabBarIcon name="hashtag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="tarot"
        options={{
          title: "Tarot",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name="cards-club" size={32} color={color} />,
        }}
      />
    </Tabs>
  );
}

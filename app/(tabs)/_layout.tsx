import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import { Star, CalendarDays, Orbit, Library, Wrench } from "lucide-react-native";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#6366f1",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff',
          borderTopColor: colorScheme === 'dark' ? '#27272a' : '#e5e7eb',
        },
        headerStyle: {
          backgroundColor: colorScheme === 'dark' ? '#09090b' : '#ffffff',
        },
        headerTintColor: colorScheme === 'dark' ? '#ffffff' : '#18181b',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Horoscope",
          tabBarIcon: ({ color }) => <Star color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="charts"
        options={{
          title: "Charts",
          tabBarIcon: ({ color }) => <CalendarDays color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="cosmos"
        options={{
          title: "Cosmos",
          tabBarIcon: ({ color }) => <Orbit color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="signs"
        options={{
          title: "Signs",
          tabBarIcon: ({ color }) => <Library color={String(color)} size={24} />,
        }}
      />
      <Tabs.Screen
        name="tools"
        options={{
          title: "Tools",
          tabBarIcon: ({ color }) => <Wrench color={String(color)} size={24} />,
        }}
      />
    </Tabs>
  );
}

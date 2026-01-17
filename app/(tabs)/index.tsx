import { View, Text, ScrollView, Pressable } from "react-native";
import { useState, useEffect } from "react";
import { Picker } from "@react-native-picker/picker";
import { hasApiKey, astrologyApi } from "../../src/api";
import type { Horoscope, WeeklyHoroscope, MonthlyHoroscope, ZodiacSign } from "../../src/api/types";
import { LoadingSpinner, ErrorMessage, HoroscopeSection } from "../../src/components";

type Period = 'daily' | 'weekly' | 'monthly';

export default function HoroscopeScreen() {
  const [signs, setSigns] = useState<ZodiacSign[]>([]);
  const [selectedSign, setSelectedSign] = useState<string>("");
  const [period, setPeriod] = useState<Period>("daily");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [dailyData, setDailyData] = useState<Horoscope | null>(null);
  const [weeklyData, setWeeklyData] = useState<WeeklyHoroscope | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyHoroscope | null>(null);

  useEffect(() => {
    fetchSigns();
  }, []);

  useEffect(() => {
    if (selectedSign) {
      fetchHoroscope();
    }
  }, [selectedSign, period]);

  const fetchSigns = async () => {
    try {
      const data = await astrologyApi.getSigns();
      setSigns(data);
      if (data.length > 0) {
        setSelectedSign(data[0].id);
      }
    } catch {
      setError("Failed to load signs");
    }
  };

  const fetchHoroscope = async () => {
    if (!hasApiKey()) {
      setError("API key not configured");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (period === 'daily') {
        const data = await astrologyApi.getDailyHoroscope(selectedSign);
        setDailyData(data);
      } else if (period === 'weekly') {
        const data = await astrologyApi.getWeeklyHoroscope(selectedSign);
        setWeeklyData(data);
      } else {
        const data = await astrologyApi.getMonthlyHoroscope(selectedSign);
        setMonthlyData(data);
      }
    } catch {
      setError("Failed to load horoscope");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchHoroscope} />;

  const currentData = period === 'daily' ? dailyData : period === 'weekly' ? weeklyData : monthlyData;
  if (!currentData) return null;

  return (
    <ScrollView className="flex-1 bg-white dark:bg-zinc-950">
      <View className="px-6 pt-6 pb-8">
        <Text className="text-4xl font-bold text-zinc-900 dark:text-white mb-2">
          Your Horoscope
        </Text>
        <Text className="text-zinc-500 dark:text-zinc-400 mb-6">
          Personalized astrological guidance
        </Text>

        <View className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl mb-6 overflow-hidden">
          <Picker
            selectedValue={selectedSign}
            onValueChange={setSelectedSign}
            style={{ color: '#18181b' }}
          >
            {signs.map(sign => (
              <Picker.Item
                key={sign.id}
                label={sign.name}
                value={sign.id}
              />
            ))}
          </Picker>
        </View>

        <View className="flex-row bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-1 mb-8">
          {(['daily', 'weekly', 'monthly'] as Period[]).map((p) => (
            <Pressable
              key={p}
              onPress={() => setPeriod(p)}
              className={`flex-1 py-3 rounded-xl ${
                period === p
                  ? 'bg-indigo-600'
                  : 'bg-transparent'
              }`}
            >
              <Text
                className={`text-center font-semibold ${
                  period === p
                    ? 'text-white'
                    : 'text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View className="mb-6 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl p-5 border border-indigo-100 dark:border-indigo-900/50">
          <Text className="text-base text-zinc-700 dark:text-zinc-300 leading-7 text-center">
            {currentData.overview}
          </Text>
        </View>

        <HoroscopeSection title="Love & Relationships" content={currentData.love} icon="💕" />
        <HoroscopeSection title="Career & Work" content={currentData.career} icon="💼" />
        <HoroscopeSection title="Health & Wellness" content={currentData.health} icon="🌿" />
        <HoroscopeSection title="Finance & Money" content={currentData.finance} icon="💰" />
        {'advice' in currentData && currentData.advice && (
          <HoroscopeSection title="Daily Advice" content={currentData.advice} icon="✨" />
        )}

        {period === 'daily' && dailyData && (
          <View className="mt-2">
            <View className="flex-row justify-between">
              <View className="flex-1 bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 mr-2">
                <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                  Lucky Number
                </Text>
                <Text className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {dailyData.luckyNumber}
                </Text>
              </View>
              <View className="flex-1 bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 ml-2">
                <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-2 uppercase tracking-wide">
                  Lucky Color
                </Text>
                <Text className="text-lg font-bold text-zinc-900 dark:text-white">
                  {dailyData.luckyColor}
                </Text>
              </View>
            </View>
          </View>
        )}

        {period === 'weekly' && weeklyData && (
          <View className="mt-2">
            <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 mb-4">
              <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-3 uppercase tracking-wide">
                Lucky Days
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {weeklyData.luckyDays.map((day, idx) => (
                  <View key={idx} className="bg-indigo-100 dark:bg-indigo-950 px-4 py-2 rounded-full">
                    <Text className="text-indigo-700 dark:text-indigo-400 font-semibold">
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
            <View className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5">
              <Text className="text-xs text-zinc-500 dark:text-zinc-500 mb-3 uppercase tracking-wide">
                Lucky Numbers
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {weeklyData.luckyNumbers.map((num, idx) => (
                  <View key={idx} className="bg-indigo-100 dark:bg-indigo-950 px-4 py-2 rounded-full">
                    <Text className="text-indigo-700 dark:text-indigo-400 font-semibold">
                      {num}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {period === 'monthly' && monthlyData && (
          <View className="mt-2">
            <View className="mb-6">
              <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 font-medium mb-4">
                Week by Week
              </Text>
              {monthlyData.weekByWeek.map((week) => (
                <View key={week.week} className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 mb-3">
                  <Text className="text-sm font-bold text-zinc-900 dark:text-white mb-2">
                    Week {week.week}: {week.focus}
                  </Text>
                  <Text className="text-sm text-zinc-700 dark:text-zinc-300 leading-6">
                    {week.advice}
                  </Text>
                </View>
              ))}
            </View>

            {monthlyData.keyDates.length > 0 && (
              <View className="mb-6">
                <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 font-medium mb-4">
                  Key Dates
                </Text>
                {monthlyData.keyDates.map((item, idx) => (
                  <View key={idx} className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-5 mb-3">
                    <Text className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mb-1">
                      {item.date}
                    </Text>
                    <Text className="text-sm text-zinc-700 dark:text-zinc-300">
                      {item.event}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        <View className="mt-4">
          <Text className="text-xs uppercase tracking-wider text-zinc-500 dark:text-zinc-500 font-medium mb-3">
            Compatible Signs
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {currentData.compatibleSigns.map((sign, idx) => (
              <View key={idx} className="bg-green-100 dark:bg-green-950/50 px-4 py-2 rounded-full">
                <Text className="text-green-700 dark:text-green-400 font-semibold">
                  {sign}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

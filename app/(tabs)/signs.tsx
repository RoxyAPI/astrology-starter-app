import { View, Text, ScrollView, Pressable, Modal, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { X } from "lucide-react-native";
import { LoadingSpinner, ErrorMessage, SignCard } from "../../src/components";
import { astrologyApi } from "../../src/api";
import type { ZodiacSign, ZodiacSignDetail } from "../../src/api/types";
import { appColors } from "../../src/constants/colors";

export default function SignsScreen() {
  const [signs, setSigns] = useState<ZodiacSign[]>([]);
  const [selectedSign, setSelectedSign] = useState<ZodiacSignDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const fetchSigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await astrologyApi.getSigns();
      setSigns(data);
    } catch {
      setError('Failed to fetch zodiac signs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSigns();
  }, []);

  const handleSignPress = async (sign: ZodiacSign) => {
    setModalVisible(true);
    setLoadingDetail(true);
    try {
      const detail = await astrologyApi.getSignById(sign.id);
      setSelectedSign(detail);
    } catch {
      setError('Failed to fetch sign details');
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedSign(null);
  };

  return (
    <View className="flex-1 bg-white dark:bg-zinc-950">
      <ScrollView className="flex-1">
        <View className="px-6 pt-6 pb-8">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-3xl font-bold text-zinc-900 dark:text-white">Zodiac Signs</Text>
            <Text className="text-zinc-600 dark:text-zinc-400 mt-2">
              Explore the 12 zodiac signs and their characteristics
            </Text>
          </View>

          {loading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} onRetry={fetchSigns} />}

          {/* Signs Grid */}
          {signs.length > 0 && (
            <FlatList
              data={signs}
              keyExtractor={(item) => item.id}
              numColumns={3}
              scrollEnabled={false}
              columnWrapperStyle={{ gap: 12 }}
              contentContainerStyle={{ gap: 12 }}
              renderItem={({ item }) => (
                <View style={{ flex: 1 / 3 }}>
                  <SignCard
                    sign={item}
                    onPress={() => handleSignPress(item)}
                  />
                </View>
              )}
            />
          )}
        </View>
      </ScrollView>

      {/* Sign Detail Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <View className="flex-1 bg-white dark:bg-zinc-950">
          {loadingDetail && <LoadingSpinner />}
          {!loadingDetail && selectedSign && (
            <ScrollView className="flex-1">
              <View className="px-6 pt-6 pb-8">
                {/* Header with Close Button */}
                <View className="flex-row items-center justify-between mb-6">
                  <View className="flex-row items-center">
                    <Text className="text-4xl mr-3">{selectedSign.symbol}</Text>
                    <View>
                      <Text className="text-3xl font-bold text-zinc-900 dark:text-white">
                        {selectedSign.name}
                      </Text>
                      <Text className="text-zinc-600 dark:text-zinc-400 mt-1">
                        {selectedSign.dates.start} - {selectedSign.dates.end}
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={closeModal}
                    className="bg-zinc-100 dark:bg-zinc-900 p-3 rounded-full active:bg-zinc-200 dark:active:bg-zinc-800"
                  >
                    <X size={24} color={appColors.primary} />
                  </Pressable>
                </View>

                {/* Element & Modality */}
                <View className="flex-row gap-2 mb-6">
                  <View className="flex-1 bg-indigo-50 dark:bg-indigo-950 p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900">
                    <Text className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-1">
                      Element
                    </Text>
                    <Text className="text-xl font-bold text-zinc-900 dark:text-white capitalize">
                      {selectedSign.element}
                    </Text>
                  </View>
                  {selectedSign.modality && (
                    <View className="flex-1 bg-purple-50 dark:bg-purple-950 p-4 rounded-2xl border border-purple-200 dark:border-purple-900">
                      <Text className="text-xs uppercase tracking-wide text-purple-600 dark:text-purple-400 mb-1">
                        Modality
                      </Text>
                      <Text className="text-xl font-bold text-zinc-900 dark:text-white capitalize">
                        {selectedSign.modality}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Ruling Planet */}
                {selectedSign.rulingPlanet && (
                  <View className="bg-amber-50 dark:bg-amber-950 p-4 rounded-2xl border border-amber-200 dark:border-amber-900 mb-6">
                    <Text className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1">
                      Ruling Planet
                    </Text>
                    <Text className="text-xl font-bold text-zinc-900 dark:text-white">
                      {selectedSign.rulingPlanet}
                    </Text>
                  </View>
                )}

                {/* Description */}
                <View className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl mb-6">
                  <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                    About
                  </Text>
                  <Text className="text-zinc-700 dark:text-zinc-300 leading-6">
                    {selectedSign.description.long || selectedSign.description.short}
                  </Text>
                </View>

                {/* Keywords */}
                {selectedSign.keywords && selectedSign.keywords.length > 0 && (
                  <View className="bg-indigo-50 dark:bg-indigo-950 p-6 rounded-2xl border border-indigo-200 dark:border-indigo-900 mb-6">
                    <Text className="text-lg font-semibold text-indigo-700 dark:text-indigo-400 mb-3">
                      Keywords
                    </Text>
                    <View className="flex-row flex-wrap gap-2">
                      {selectedSign.keywords.map((keyword, idx) => (
                        <View
                          key={idx}
                          className="bg-indigo-100 dark:bg-indigo-950 px-3 py-2 rounded-full border border-indigo-200 dark:border-indigo-800"
                        >
                          <Text className="text-sm font-medium text-indigo-700 dark:text-indigo-400 capitalize">
                            {keyword}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}

                {/* Strengths */}
                {selectedSign.strengths && selectedSign.strengths.length > 0 && (
                  <View className="bg-green-50 dark:bg-green-950/30 p-6 rounded-2xl border border-green-200 dark:border-green-900 mb-6">
                    <Text className="text-lg font-semibold text-green-700 dark:text-green-400 mb-3">
                      Strengths
                    </Text>
                    <View>
                      {selectedSign.strengths.map((strength, idx) => (
                        <Text key={idx} className="text-zinc-700 dark:text-zinc-300">
                          • {strength}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}

                {/* Famous People */}
                {selectedSign.famous && selectedSign.famous.length > 0 && (
                  <View className="bg-zinc-50 dark:bg-zinc-900 p-6 rounded-2xl mb-8">
                    <Text className="text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                      Famous {selectedSign.name} Personalities
                    </Text>
                    <View>
                      {selectedSign.famous.map((person, idx) => (
                        <Text key={idx} className="text-zinc-700 dark:text-zinc-300">
                          • {person}
                        </Text>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

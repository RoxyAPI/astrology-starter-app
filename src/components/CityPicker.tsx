import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { astrologyApi, type City } from '../api';
import { appColors } from '../constants/colors';

interface CityPickerProps {
  label: string;
  /** The currently selected city, or null until the user picks one. */
  value: City | null;
  onSelect: (city: City) => void;
}

/**
 * Birth-location picker. Geocodes a typed city name through `roxy.location.searchCities` and returns the chosen city, so screens never ask users to type latitude, longitude, or timezone by hand. Pass the selected city's `latitude`, `longitude`, and `timezone` straight into any chart call.
 */
export function CityPicker({ label, value, onSelect }: CityPickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [searching, setSearching] = useState(false);

  const search = async () => {
    if (query.trim().length < 2) return;
    setSearching(true);
    try {
      setResults(await astrologyApi.searchCities(query.trim()));
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const pick = (city: City) => {
    onSelect(city);
    setResults([]);
    setQuery('');
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">{label}</Text>

      {value && (
        <View className="bg-indigo-50 dark:bg-indigo-950 border border-indigo-200 dark:border-indigo-900 rounded-xl px-4 py-3 mb-2">
          <Text className="text-zinc-900 dark:text-white font-medium">
            {value.city}, {value.province ? `${value.province}, ` : ''}{value.country}
          </Text>
          <Text className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {value.latitude.toFixed(2)}, {value.longitude.toFixed(2)} · {value.timezone}
          </Text>
        </View>
      )}

      <View className="flex-row gap-2">
        <TextInput
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          placeholder="Search a city (e.g. New York)"
          placeholderTextColor="#9ca3af"
          className="flex-1 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-zinc-900 dark:text-white"
        />
        <Pressable
          onPress={search}
          disabled={searching}
          className="bg-indigo-600 px-5 rounded-xl items-center justify-center active:bg-indigo-700"
        >
          {searching ? (
            <ActivityIndicator color={appColors.white} />
          ) : (
            <Text className="text-white font-semibold">Search</Text>
          )}
        </Pressable>
      </View>

      {results.length > 0 && (
        <View className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl mt-2 overflow-hidden">
          {results.map((city, idx) => (
            <Pressable
              key={`${city.city}-${city.latitude}-${city.longitude}-${idx}`}
              onPress={() => pick(city)}
              className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 active:bg-zinc-100 dark:active:bg-zinc-800"
            >
              <Text className="text-zinc-900 dark:text-white">
                {city.city}{city.province ? `, ${city.province}` : ''}, {city.country}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

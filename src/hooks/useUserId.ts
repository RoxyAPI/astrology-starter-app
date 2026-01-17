import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_ID_KEY = '@roxyapi_tarot_user_id';

export const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      let id = await AsyncStorage.getItem(USER_ID_KEY);
      if (!id) {
        id = generateUserId();
        await AsyncStorage.setItem(USER_ID_KEY, id);
      }
      setUserId(id);
    } catch (error) {
      console.error('Failed to load user ID:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateUserId = (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  return { userId, loading };
};

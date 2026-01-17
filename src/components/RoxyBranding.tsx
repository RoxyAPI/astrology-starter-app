import { View, Text, Pressable, Linking } from 'react-native';
import { Image } from 'expo-image';

export function RoxyBranding() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 24 }}>
      <Image
        source={require('../../assets/logo.png')}
        style={{ width: 120, height: 120, marginBottom: 32 }}
        contentFit="contain"
      />
      <Text style={{ fontSize: 28, fontWeight: 'bold', color: '#1f2937', marginBottom: 8, textAlign: 'center' }}>
        Powered by RoxyAPI
      </Text>
      <Text style={{ fontSize: 16, color: '#6b7280', marginBottom: 32, textAlign: 'center', paddingHorizontal: 16 }}>
        Professional Tarot API with 78-card Rider-Waite deck, spread layouts, and divination endpoints
      </Text>
      <View style={{ width: '100%', maxWidth: 400, gap: 12 }}>
        <Pressable
          onPress={() => Linking.openURL('https://roxyapi.com/pricing')}
          style={{
            backgroundColor: '#8b5cf6',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
            Get API Key - roxyapi.com/pricing
          </Text>
        </Pressable>
        <Pressable
          onPress={() => Linking.openURL('https://roxyapi.com/docs')}
          style={{
            backgroundColor: '#f3f4f6',
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 12,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: '#374151', fontSize: 16, fontWeight: '600' }}>
            View Documentation - roxyapi.com/docs
          </Text>
        </Pressable>
      </View>
      <Text style={{ fontSize: 12, color: '#9ca3af', marginTop: 32, textAlign: 'center' }}>
        Add EXPO_PUBLIC_ROXYAPI_KEY to your .env file
      </Text>
    </View>
  );
}

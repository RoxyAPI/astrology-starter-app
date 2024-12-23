import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { UnknownOutputParams, useLocalSearchParams } from "expo-router";
import { TarotCardType } from "@/types/tarot";
import Container from "@/components/container";
import Text from "@/components/ui/text";
import Header from "@/components/header";

const TarotCardFlip = () => {
  const params = useLocalSearchParams() as UnknownOutputParams & {
    cardData: string;
  };
  const cardData: TarotCardType = JSON.parse(params.cardData);
  const [isFlipped, setIsFlipped] = useState(false); // state of card
  const flipAnimation = useRef(new Animated.Value(0)).current; // animated value for flip animation

  // Front card rotation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const flipToFrontStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  // Back card rotation
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipToBackStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  // Card flip animation
  const flipCard = () => {
    if (!isFlipped) {
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  if (!cardData) {
    return (
      <Container>
        <View className="flex-1 items-center justify-center">
          <Text className="text-3xl font-bold text-center">Card Not Found</Text>
        </View>
      </Container>
    );
  }

  // Card UI
  return (
    <Container>
      <View className="flex-1">
        <Header title="Tarot Card" />
        <TouchableWithoutFeedback onPress={flipCard}>
          <View className="flex-1 rounded-3xl justify-center items-center">
            {/* Front Side */}
            <Animated.View
              className="bg-secondary flex-1 rounded-3xl overflow-hidden"
              style={[styles.card, flipToFrontStyle]}
            >
              <Image
                source={{ uri: cardData.image }}
                className="flex-1 aspect-[9/16] rounded-3xl"
                resizeMode="cover"
              />
              {/* message to flip the card */}
              <Text className="absolute p-4 px-16 rounded-xl border border-black bg-black/80 font-semibold left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-2xl">
                Tap to reveal
              </Text>
            </Animated.View>

            {/* Back Side */}
            <Animated.View
              className="bg-secondary rounded-3xl p-8"
              style={[styles.card, flipToBackStyle]}
            >
              <ScrollView keyboardShouldPersistTaps="handled">
                <Text className="text-4xl font-bold mb-4">{cardData.name}</Text>
                {cardData.meaning && (
                  <Text className="text-lg leading-relaxed mb-4">
                    <Text className="font-semibold">Meaning: </Text>
                    {cardData.meaning}
                  </Text>
                )}
                {cardData.message && (
                  <Text className="italic mb-4">
                    <Text className="font-semibold">Message: </Text>
                    {cardData.message}
                  </Text>
                )}
                {cardData.reversed_meaning && (
                  <Text className="text-lg leading-relaxed mb-4">
                    <Text className="font-semibold">Reversed Meaning: </Text>
                    {cardData.reversed_meaning}
                  </Text>
                )}
                {cardData.qabalah && (
                  <Text className="mb-4">
                    <Text className="font-semibold">Qabalah Path: </Text>
                    {cardData.qabalah}
                  </Text>
                )}
                {cardData.meditation && (
                  <Text className="italic">
                    <Text className="font-semibold">Meditation: </Text>
                    {cardData.meditation}
                  </Text>
                )}
              </ScrollView>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Container>
  );
};

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  card: {
    width: width - 50,
    height: height - 250,
    position: "absolute",
    backfaceVisibility: "hidden",
  },
});

export default TarotCardFlip;

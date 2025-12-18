import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Bookmark } from "lucide-react-native";
import Markdown from "react-native-markdown-display";

interface FlashcardCardProps {
  item: {
    id: string;
    Question: string;
    Answer: string;
    react_order_final?: number;
    maximum_value?: number;
  };
  index: number;
  subject: string;
  isBookmarked: boolean;
  onView: (flashcardId: string, subject: string) => void;
  onBookmark: (flashcardId: string, subject: string) => void;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({
  item,
  index,
  subject,
  isBookmarked,
  onView,
  onBookmark,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState(200);

  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  const frontHeightRef = useRef(200);
  const backHeightRef = useRef(200);

  const isOddCard = index % 2 === 0;
  const borderColors = isOddCard
    ? ["#1e3a8a", "#3b82f6", "#60a5fa"]
    : ["#065f46", "#10b981", "#34d399"];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    shimmerAnim.setValue(0.5);
  }, []);

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();

    if (!isFlipped) {
      onView(item.id, subject);
    }

    setIsFlipped(!isFlipped);
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [0, 0, 1, 1],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const handleFrontLayout = (e: any) => {
    frontHeightRef.current = e.nativeEvent.layout.height;
    setCardHeight(Math.max(frontHeightRef.current, backHeightRef.current));
  };

  const handleBackLayout = (e: any) => {
    backHeightRef.current = e.nativeEvent.layout.height;
    setCardHeight(Math.max(frontHeightRef.current, backHeightRef.current));
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={styles.cardWrapper}>
        <Animated.View style={[styles.leftBorder, { opacity: shimmerOpacity }]}>
          <LinearGradient
            colors={borderColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.leftBorderGradient}
          />
        </Animated.View>

        <TouchableWithoutFeedback onPress={handleFlip}>
          <View style={[styles.cardTouchable, { height: cardHeight }]}>
            {/* FRONT */}
            <Animated.View
              onLayout={handleFrontLayout}
              style={[
                styles.cardFace,
                styles.cardFront,
                { opacity: frontOpacity, transform: [{ rotateY: frontInterpolate }] },
              ]}
            >
              <LinearGradient
                colors={["#1a1a1a", "#141414", "#0f0f0f"]}
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.badgeLabel}>QUESTION</Text>
                  <TouchableOpacity onPress={() => onBookmark(item.id, subject)}>
                    <Bookmark
                      size={20}
                      color="#3b82f6"
                      fill={isBookmarked ? "#3b82f6" : "transparent"}
                    />
                  </TouchableOpacity>
                </View>

                <Markdown style={{ text: styles.questionText }}>
                  {item.Question}
                </Markdown>
              </LinearGradient>
            </Animated.View>

            {/* BACK */}
            <Animated.View
              onLayout={handleBackLayout}
              style={[
                styles.cardFace,
                styles.cardBack,
                { opacity: backOpacity, transform: [{ rotateY: backInterpolate }] },
              ]}
            >
              <LinearGradient
                colors={["#1a1a1a", "#141414", "#0f0f0f"]}
                style={styles.cardGradient}
              >
                <Text style={styles.badgeLabel}>ANSWER</Text>
                <Markdown style={{ text: styles.answerText }}>
                  {item.Answer}
                </Markdown>
              </LinearGradient>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Animated.View>
  );
};

export default React.memo(FlashcardCard);

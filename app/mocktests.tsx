// app/mocktests.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  Alert,
  SafeAreaView,
} from "react-native";

import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";

import AnimatedReanimated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

import { Clock, ChevronRight, SkipForward, Grid3x3 } from "lucide-react-native";
import Markdown from "react-native-markdown-display";

import { supabase } from "@/lib/supabaseClient";

import { MocktestDashboard } from "@/components/types/MocktestSubjectSelection";
import { BottomNav } from "@/components/navigation/BottomNav";
import PageHeader from "@/components/common/PageHeader";
import QuestionNavigationScreen from "@/components/types/QuestionNavigationScreen";

import type { MockTest, UserMockTest } from "@/types/mock-test";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

/* 
===========================================================
   🔥 LOGIN SYSTEM REMOVED COMPLETELY
   🔥 LANDING PAGE REMOVED COMPLETELY
   🔥 NO AUTH CHECK → DIRECT MOCKTEST DASHBOARD ALWAYS
===========================================================
*/

// 🔹 Zoomable Image Component (unchanged)
function ZoomableImage({ uri, height = 250 }: { uri: string; height?: number }) {
  const scale = useSharedValue(1);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);

  const pinch = Gesture.Pinch()
    .onUpdate((e) => {
      scale.value = Math.min(Math.max(e.scale, 1), 3);
    })
    .onEnd(() => {
      if (scale.value < 1) scale.value = withTiming(1);
    });

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        translationX.value = e.translationX;
        translationY.value = e.translationY;
      }
    })
    .onEnd(() => {
      translationX.value = withTiming(0);
      translationY.value = withTiming(0);
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      scale.value = withTiming(scale.value > 1 ? 1 : 2, { duration: 200 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
  }));

  return (
    <View style={[zoomStyles.wrapper, { height }]}>
      <GestureDetector gesture={Gesture.Simultaneous(pinch, pan, doubleTap)}>
        <AnimatedReanimated.Image
          source={{ uri }}
          style={[zoomStyles.image, animatedStyle]}
          resizeMode="contain"
        />
      </GestureDetector>
    </View>
  );
}

const zoomStyles = StyleSheet.create({
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1f26",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: { width: SCREEN_WIDTH - 40, height: "100%", borderRadius: 12 },
});

/* 
===========================================================
   🔥 MAIN MOCKTEST SCREEN (NO LOGIN, NO LANDING)
===========================================================
*/

export default function MockTestsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // 💡 User NOT required → We use a placeholder ID for mocktests
  const userId = "practice-user"; // always available

  const testTitle = params.title ? decodeURIComponent(params.title as string) : null;
  const testDate = params.date ? decodeURIComponent(params.date as string) : null;

  // Test engine states
  const [mockWindow, setMockWindow] = useState<{ present?: any; next?: any; review?: any } | null>(null);
  const [completedTests, setCompletedTests] = useState<UserMockTest[]>([]);
  const [loading, setLoading] = useState(true);

  const [testStarted, setTestStarted] = useState(false);
  const [testEnded, setTestEnded] = useState(false);

  const [phaseData, setPhaseData] = useState<any>(null);
  const [currentMCQ, setCurrentMCQ] = useState<any | null>(null);

  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scrollRef = useRef<ScrollView>(null);

  const [paletteData, setPaletteData] = useState(null);
  const [showNav, setShowNav] = useState(false);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const autoStartDone = useRef(false);

  console.log("🟡 PARAMS RECEIVED:", params);
  console.log("🟡 TestStarted:", testStarted);

  /* 
  ===========================================================
     DIRECT DASHBOARD → NO LOGIN REQUIRED
  ===========================================================
  */

  useEffect(() => {
    loadData();
  }, []);

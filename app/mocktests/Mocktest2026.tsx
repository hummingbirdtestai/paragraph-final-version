// app/mocktests/Mocktest2026.tsx

import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { Clock, Grid3x3 } from "lucide-react-native";
import Markdown from "react-native-markdown-display";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import MainLayout from "@/components/MainLayout";
import { MocktestDashboard } from "@/components/types/MocktestSubjectSelection";
import QuestionNavigationScreennew from "@/components/types/QuestionNavigationScreennew";

import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

console.log("🟦 LOADED SCREEN → app/mocktests/Mocktest2026.tsx");

export default function Mocktest2026() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();

  const examSerial = params.exam_serial
    ? Number(params.exam_serial)
    : null;

  console.log("🧭 [2026] ROUTE PARAMS:", { examSerial });

  /* ---------------- DASHBOARD STATE ---------------- */
  const [mockWindow, setMockWindow] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(true);

  /* ---------------- SECTION STATE ---------------- */
  const [feed, setFeed] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentMCQ = feed[currentIndex] ?? null;

  const [section, setSection] = useState<string>("A");
  const [remainingTime, setRemainingTime] = useState<number>(42 * 60);
  const [showPalette, setShowPalette] = useState(false);

  /* =====================================================
     1️⃣ DASHBOARD LOAD (ONLY WHEN exam_serial IS ABSENT)
  ===================================================== */
  useEffect(() => {
    if (!user?.id || examSerial) return;

    console.log("📊 [2026] Loading Mock Test Dashboard");

    const loadDashboard = async () => {
      const { data, error } = await supabase.rpc(
        "get_mock_test_window",
        { p_student_id: user.id }
      );

      if (error) {
        console.error("❌ Dashboard RPC failed", error);
        setLoadingDashboard(false);
        return;
      }

      const parsed = data?.get_mock_test_window || data;

      console.log("🟢 Dashboard RPC Parsed:", parsed);

      setMockWindow({
        present: parsed.present_mock_test,
        next: parsed.next_mock_test,
        review: parsed.review_tests,
      });

      setLoadingDashboard(false);
    };

    loadDashboard();
  }, [user?.id, examSerial]);

  /* =====================================================
     DASHBOARD SCREEN
  ===================================================== */
  if (!examSerial) {
    return (
      <MainLayout>
        <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
          <MocktestDashboard
            mockWindow={mockWindow}
            completedTests={[]}
            loading={loadingDashboard}
            onStartTest={(exam) => {
              console.log("▶️ Start Test Clicked:", exam);
              router.push(`/mocktests/Mocktest2026?exam_serial=${exam}`);
            }}
            onReviewTest={(exam) => {
              console.log("📘 Review Test Clicked:", exam);
              router.push(`/reviewmocktest?exam_serial=${exam}`);
            }}
          />
        </SafeAreaView>
      </MainLayout>
    );
  }
  /* =====================================================
     2️⃣ LOAD SECTION MCQs (40 AT A TIME)
     RPC: get_mocktest_section_mcqs
  ===================================================== */
  useEffect(() => {
    if (!user?.id || !examSerial) return;

    console.log("📦 [2026] Loading Section MCQs");

    const loadSection = async () => {
      const { data, error } = await supabase.rpc(
        "get_mocktest_section_mcqs",
        {
          p_student_id: user.id,
          p_exam_serial: examSerial,
        }
      );

      if (error) {
        console.error("❌ Section RPC failed", error);
        return;
      }

      console.log("🟢 Section RPC Response:", {
        section: data.section,
        count: data.mcqs.length,
        time_left: data.time_left,
      });

      setFeed(data.mcqs);
      setSection(data.section);
      setCurrentIndex(0);

      if (data.time_left) {
        const [h, m, s] = data.time_left.split(":").map(Number);
        setRemainingTime(h * 3600 + m * 60 + s);
      } else {
        setRemainingTime(42 * 60);
      }
    };

    loadSection();
  }, [user?.id, examSerial]);

  /* =====================================================
     3️⃣ SECTION TIMER
  ===================================================== */
  useEffect(() => {
    if (!feed.length) return;

    console.log("⏱ [2026] Section Timer Started");

    const timer = setInterval(() => {
      setRemainingTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [feed]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };
  /* =====================================================
     4️⃣ SUBMIT ANSWER
     RPC: submit_mocktest_answer
  ===================================================== */
  const submit = async ({
    answer,
    skipped,
    review,
  }: {
    answer: string | null;
    skipped: boolean;
    review: boolean;
  }) => {
    if (!user?.id || !currentMCQ) return;

    console.log("📤 [2026] SUBMIT", {
      react_order: currentMCQ.react_order,
      answer,
      skipped,
      review,
    });

    await supabase.rpc("submit_mocktest_answer", {
      p_student_id: user.id,
      p_exam_serial: examSerial,
      p_react_order_final: currentMCQ.react_order,
      p_correct_answer:
        currentMCQ.phase_json?.correct_answer ?? null,
      p_student_answer: answer,
      p_is_correct:
        answer === currentMCQ.phase_json?.correct_answer,
      p_is_skipped: skipped,
      p_is_review: review,
      p_time_left: formatTime(remainingTime),
    });

    setFeed((prev) => {
      const copy = [...prev];
      copy[currentIndex] = {
        ...copy[currentIndex],
        student_answer: answer,
        is_skipped: skipped,
        is_review: review,
      };
      return copy;
    });

    setCurrentIndex((i) => i + 1);
  };

  /* =====================================================
     5️⃣ IMAGE MCQ — ZOOMABLE
  ===================================================== */
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));
  if (!currentMCQ) {
    return (
      <MainLayout>
        <SafeAreaView style={styles.container}>
          <Text style={{ color: "#888" }}>Loading MCQs…</Text>
        </SafeAreaView>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <SafeAreaView style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.section}>Section {section}</Text>
          <Text style={styles.timer}>
            <Clock size={14} /> {formatTime(remainingTime)}
          </Text>
          <TouchableOpacity onPress={() => setShowPalette(true)}>
            <Grid3x3 size={18} />
          </TouchableOpacity>
        </View>

        {/* IMAGE MCQ */}
        {currentMCQ.is_mcq_image_type && currentMCQ.mcq_image && (
          <GestureDetector
            gesture={Gesture.Pinch().onUpdate((e) => {
              scale.value = withTiming(e.scale);
            })}
          >
            <Animated.Image
              source={{ uri: currentMCQ.mcq_image }}
              style={[styles.image, animatedStyle]}
              resizeMode="contain"
            />
          </GestureDetector>
        )}

        {/* QUESTION */}
        <Markdown>{currentMCQ.phase_json.stem}</Markdown>

        {/* OPTIONS */}
        {Object.entries(currentMCQ.phase_json.options).map(
          ([key, val]) => (
            <TouchableOpacity
              key={key}
              onPress={() =>
                submit({
                  answer: key,
                  skipped: false,
                  review: false,
                })
              }
            >
              <Text style={styles.option}>
                {key}. {val}
              </Text>
            </TouchableOpacity>
          )
        )}

        {/* PALETTE */}
        <QuestionNavigationScreennew
          isVisible={showPalette}
          onClose={() => setShowPalette(false)}
          mcqs={feed}
          counts={{ answered: 0, skipped: 0, marked: 0, unanswered: 0 }}
          sectionId={section}
          currentQuestion={currentMCQ.section_q_number}
          timeLeft={remainingTime}
          onSelectQuestion={(ro) => {
            const idx = feed.findIndex(
              (m) => m.react_order === ro
            );
            console.log("🟣 Palette Jump:", { ro, idx });
            if (idx >= 0) setCurrentIndex(idx);
            setShowPalette(false);
          }}
        />
      </SafeAreaView>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000", padding: 16 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  section: { color: "#4ade80", fontWeight: "700" },
  timer: { color: "#4ade80" },
  image: { width: "100%", height: 280, marginBottom: 16 },
  option: { color: "#e5e7eb", padding: 12 },
});

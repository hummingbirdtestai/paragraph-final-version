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
import PageHeader from "@/components/common/PageHeader";
import QuestionNavigationScreen from "@/components/types/QuestionNavigationScreen";

import type { MockTest, UserMockTest } from "@/types/mock-test";
import { useRouter, useLocalSearchParams } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";

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
/* 
===========================================================
   🔥 AUTO-START LOGIC (optional exam_serial=start)
===========================================================
*/

useEffect(() => {
  if (
    !autoStartDone.current &&
    params.start === "true" &&
    params.exam_serial
  ) {
    autoStartDone.current = true;
    handleStartTest(params.exam_serial as string);
  }
}, [params]);

/* 
===========================================================
   🟦 NORMALIZE MCQ DATA
===========================================================
*/
const normalizePhaseData = (data: any) => {
  if (!data?.phase_json) return data;

  const mcqs = Array.isArray(data.phase_json)
    ? data.phase_json
    : [data.phase_json];

  const normalizedMCQs = mcqs.map((q) => ({
    ...q,
    is_mcq_image_type:
      typeof q.is_mcq_image_type === "string"
        ? q.is_mcq_image_type === "true"
        : !!q.is_mcq_image_type,
  }));

  return { ...data, phase_json: normalizedMCQs };
};

/* 
===========================================================
   📡 LOAD MOCK TEST WINDOW + COMPLETED TESTS
===========================================================
*/

const loadData = async () => {
  try {
    // Load present & next tests
    const { data: rpcData } = await supabase.rpc("get_mock_test_window", {
      p_student_id: userId,
    });

    if (rpcData) {
      const parsed = rpcData?.get_mock_test_window || rpcData;
      setMockWindow({
        present: parsed.present_mock_test,
        next: parsed.next_mock_test,
        review: parsed.review_tests,
      });
    }

    // Completed tests
    const { data: userTests } = await supabase
      .from("user_mock_tests")
      .select("*, mock_test:mock_tests(*)")
      .eq("user_id", userId)
      .eq("status", "completed")
      .order("completed_at", { ascending: false });

    if (userTests) {
      setCompletedTests(userTests.map(mapToUserMockTest));
    }
  } catch (error) {
    console.error("Error loading data:", error);
  } finally {
    setLoading(false);
  }
};

const mapToMockTest = (d: any): MockTest => ({
  id: d.id,
  title: d.title,
  description: d.description,
  totalQuestions: d.total_questions,
  durationMinutes: d.duration_minutes,
  isActive: d.is_active,
  createdAt: d.created_at,
});

const mapToUserMockTest = (d: any): UserMockTest => ({
  id: d.id,
  userId: d.user_id,
  mockTestId: d.mock_test_id,
  status: d.status,
  score: d.score,
  completedAt: d.completed_at,
  startedAt: d.started_at,
  createdAt: d.created_at,
  mockTest: d.mock_test ? mapToMockTest(d.mock_test) : undefined,
});

/* 
===========================================================
   🧠 START TEST — CALL FASTAPI ORCHESTRATOR
===========================================================
*/

const handleStartTest = async (exam_serial: string) => {
  console.log("📤 Calling start_mocktest:", { student_id: userId, exam_serial });

  try {
    const response = await fetch(
      "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "start_mocktest",
          student_id: userId,
          exam_serial,
        }),
      }
    );

    const data = await response.json();
    console.log("🧠 start_mocktest result:", data);

    const normalized = normalizePhaseData(data);

    if (normalized?.phase_json) {
      setTestStarted(true);
      setPhaseData(normalized);
      setCurrentMCQ(normalized.phase_json[0]);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setSelectedOption(null);

      const ro = Number(normalized.react_order_final);

      if ([1, 41, 81, 121, 161].includes(ro)) {
        setRemainingTime(42 * 60); // new section
      } else if (normalized.time_left) {
        const [h, m, s] = normalized.time_left.split(":").map(Number);
        setRemainingTime(h * 3600 + m * 60 + s);
      }
    } else {
      Alert.alert("Test Completed", "No more questions.");
    }
  } catch (error) {
    console.error("Error starting test:", error);
  }
};

/* 
===========================================================
   ⏱ COUNTDOWN TIMER — CALL TIMER EXPIRED RPC
===========================================================
*/

useEffect(() => {
  if (!testStarted || testEnded || remainingTime === null) return;

  const timer = setInterval(() => {
    setRemainingTime((prev) => {
      if (typeof prev !== "number") return prev;

      if (prev > 1) {
        return prev - 1;
      }

      // FINAL 0 SECONDS
      clearInterval(timer);
      console.log("🟥 TIMER EXPIRED");

      const currentRO = Number(phaseData?.react_order_final);
      callTimerExpiredRPC(currentRO);

      return 0;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [testStarted, testEnded, remainingTime]);

// 🔥 Timer expired → jump to next section
const callTimerExpiredRPC = async (currentRO) => {
  try {
    console.log("🟧 Calling timer_expired_jump_section_v10");

    const { data, error } = await supabase.rpc(
      "timer_expired_jump_section_v10",
      {
        p_student_id: userId,
        p_exam_serial: phaseData.exam_serial,
        p_current_ro: currentRO,
        p_time_left: "00:00:00",
      }
    );

    if (error) {
      console.error("RPC ERROR:", error);
      return;
    }

    const normalized = normalizePhaseData(data);

    if (normalized?.phase_json) {
      setPhaseData(normalized);
      setCurrentMCQ(normalized.phase_json[0]);
      setRemainingTime(42 * 60);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  } catch (err) {
    console.error("Timer RPC failed:", err);
  }
};

/* 
===========================================================
   🟦 NEXT QUESTION
===========================================================
*/

const formatTime = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const handleNext = async () => {
  if (testEnded || !phaseData) return;

  try {
    const response = await fetch(
      "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "next_mocktest_phase",
          student_id: userId,
          exam_serial: phaseData.exam_serial,
          react_order_final: phaseData.react_order_final,
          student_answer: selectedOption,
          is_correct: selectedOption === currentMCQ?.correct_answer,
          time_left: formatTime(remainingTime),
        }),
      }
    );

    const data = await response.json();
    const normalized = normalizePhaseData(data);

    if (normalized?.phase_json) {
      setPhaseData(normalized);
      setCurrentMCQ(normalized.phase_json[0]);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setSelectedOption(null);

      const ro = Number(normalized.react_order_final);
      const previousSection = getSection(phaseData.react_order_final);
      const currentSection = getSection(ro);

      if (currentSection !== previousSection) {
        setRemainingTime(42 * 60);
      } else if (normalized.time_left) {
        const [h, m, s] = normalized.time_left.split(":").map(Number);
        setRemainingTime(h * 3600 + m * 60 + s);
      }
    } else {
      setTestEnded(true);
      setTestStarted(false);
    }
  } catch (error) {
    console.error("Error moving next:", error);
  }
};

/* 
===========================================================
   🟨 SKIP QUESTION
===========================================================
*/

const handleSkip = async () => {
  if (testEnded || !phaseData) return;

  try {
    const response = await fetch(
      "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "skip_mocktest_phase",
          student_id: userId,
          exam_serial: phaseData.exam_serial,
          react_order_final: phaseData.react_order_final,
          time_left: formatTime(remainingTime),
        }),
      }
    );

    const data = await response.json();
    const normalized = normalizePhaseData(data);

    if (normalized?.phase_json) {
      setPhaseData(normalized);
      setCurrentMCQ(normalized.phase_json[0]);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setSelectedOption(null);

      // SECTION SWITCH?
      const ro = Number(normalized.react_order_final);
      const previousSection = getSection(phaseData.react_order_final);
      const currentSection = getSection(ro);

      if (currentSection !== previousSection) {
        setRemainingTime(42 * 60);
      }
    } else {
      setTestEnded(true);
      setTestStarted(false);
    }
  } catch (err) {
    console.error("Error skipping:", err);
  }
};

/* 
===========================================================
   ⭐ REVIEW (MARK FOR REVIEW)
===========================================================
*/

const handleReview = async () => {
  if (testEnded || !phaseData) return;

  try {
    const response = await fetch(
      "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "mark_review",
          student_id: userId,
          exam_serial: phaseData.exam_serial,
          react_order_final: phaseData.react_order_final,
          time_left: formatTime(remainingTime),
        }),
      }
    );

    const data = await response.json();
    const normalized = normalizePhaseData(data);

    if (normalized?.phase_json) {
      setPhaseData(normalized);
      setCurrentMCQ(normalized.phase_json[0]);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setSelectedOption(null);
    }
  } catch (err) {
    console.error("Review error:", err);
  }
};

/* 
===========================================================
   ⭐ PALETTE (QUESTION NAVIGATION)
===========================================================
*/

const fetchPalette = async () => {
  if (!phaseData?.exam_serial) return;

  const ro = Number(phaseData.react_order_final);

  // determine section block
  const sectionStart =
    ro <= 40 ? 1 :
    ro <= 80 ? 41 :
    ro <= 120 ? 81 :
    ro <= 160 ? 121 :
    161;

  const sectionEnd = sectionStart + 39;

  const { data, error } = await supabase.rpc("palette_mocktest", {
    p_student_id: userId,
    p_exam_serial: phaseData.exam_serial,
    p_section_start: sectionStart,
    p_section_end: sectionEnd,
  });

  if (error) {
    console.log("Palette error:", error);
    return;
  }

  setPaletteData(data);
};

const handleSelectQuestion = async (targetRO) => {
  if (!targetRO) return;

  const { data, error } = await supabase.rpc("jump_to_specific_mcq_mocktest", {
    p_student_id: userId,
    p_exam_serial: phaseData.exam_serial,
    p_target_ro: targetRO,
    p_time_left: formatTime(remainingTime),
  });

  if (error) return console.log("Jump error:", error);

  const normalized = normalizePhaseData(data);
  const mcq = normalized.phase_json[0];

  mcq.student_answer = data.student_answer;

  setSelectedOption(data.student_answer ?? null);
  setPhaseData(normalized);
  setCurrentMCQ(mcq);
  scrollRef.current?.scrollTo({ y: 0, animated: true });
  setShowNav(false);
};

/* 
===========================================================
   SECTION HELPERS
===========================================================
*/

const getSection = (ro: number) => {
  if (ro <= 40) return "A";
  if (ro <= 80) return "B";
  if (ro <= 120) return "C";
  if (ro <= 160) return "D";
  if (ro <= 200) return "E";
  return null;
};

const getSectionQNumber = (ro: number) => ((ro - 1) % 40) + 1;

/* 
===========================================================
   MAIN RENDER — UP TO FOOTER
===========================================================
*/

return (
  <SafeAreaView style={styles.container} edges={["top"]}>
    <PageHeader 
      title={testTitle || "Mock Test"} 
      subtitle={testDate ? new Date(testDate).toDateString() : ""}
    />

    <ScrollView
      ref={scrollRef}
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* BEFORE START → SHOW DASHBOARD DIRECTLY */}
      {!testStarted ? (
        <MocktestDashboard
          userId={userId}
          mockWindow={mockWindow}
          completedTests={completedTests}
          loading={loading}
          onStartTest={(exam_serial) => handleStartTest(exam_serial)}
          onReviewTest={(exam_serial) =>
            router.push(`/reviewmocktest?exam_serial=${exam_serial}`)
          }
        />
      ) : testEnded ? (
        <View style={styles.endedContainer}>
          <Text style={styles.endedTitle}>Test Ended</Text>
        </View>
      ) : currentMCQ ? (
        <>
          {/* HEADER */}
          <View style={styles.headerTop}>
            <View style={styles.questionInfo}>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionText}>
                  Section {getSection(phaseData.react_order_final)}
                </Text>
              </View>

              <View style={styles.questionBadge}>
                <Text style={styles.questionCounter}>
                  Q {getSectionQNumber(phaseData.react_order_final)}/40
                </Text>
              </View>
            </View>

            {/* TIMER + PALETTE */}
            <View style={styles.headerRight}>
              <View style={styles.timerContainer}>
                <Clock size={16} color="#4ade80" />
                <Text style={styles.timer}>
                  {remainingTime !== null ? formatTime(remainingTime) : "--:--"}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.navButton}
                onPress={async () => {
                  await fetchPalette();
                  setShowNav(true);
                }}
              >
                <Grid3x3 size={18} color="#4ade80" />
              </TouchableOpacity>
            </View>
          </View>

          {/* MCQ IMAGE */}
          {currentMCQ.is_mcq_image_type && (
            <View
              style={{
                backgroundColor: "#0f172a",
                borderRadius: 12,
                overflow: "hidden",
                marginBottom: 20,
              }}
            >
              {currentMCQ.mcq_image ? (
                <ZoomableImage uri={currentMCQ.mcq_image} height={300} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderText}>Image not available</Text>
                </View>
              )}
            </View>
          )}

          {/* QUESTION */}
          <View style={styles.questionBubble}>
            <Markdown style={markdownStyles}>{currentMCQ.stem}</Markdown>
          </View>

          {/* OPTIONS */}
          <View style={styles.optionsContainer}>
            {Object.entries(currentMCQ.options).map(([key, value]) => {
              const effectiveSelected =
                selectedOption ??
                currentMCQ.student_answer ??
                null;

              return (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionBubble,
                    effectiveSelected === key && styles.optionSelected,
                  ]}
                  onPress={() => setSelectedOption(key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionContent}>
                    <View
                      style={[
                        styles.optionCircle,
                        effectiveSelected === key && styles.optionCircleSelected,
                      ]}
                    >
                      <Text
                        style={[
                          styles.optionLabel,
                          effectiveSelected === key && styles.optionLabelSelected,
                        ]}
                      >
                        {key}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.optionText,
                        effectiveSelected === key && styles.optionTextSelected,
                      ]}
                    >
                      {value}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          {/* FOOTER BUTTONS */}
          <View style={styles.footer}>

            {/* SKIP */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <SkipForward size={20} color="#94a3b8" />
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>

            {/* REVIEW — DISABLED IF ANSWER SELECTED */}
            <TouchableOpacity
              style={[
                styles.reviewButton,
                selectedOption ? { opacity: 0.3 } : {},
              ]}
              disabled={!!selectedOption}
              onPress={selectedOption ? undefined : handleReview}
            >
              <Text style={styles.reviewButtonText}>Review</Text>
            </TouchableOpacity>

            {/* FINISH BUTTON — SECTION E */}
            {Number(phaseData.react_order_final) >= 161 &&
              Number(phaseData.react_order_final) <= 200 && (
                <TouchableOpacity
                  style={styles.finishTestButton}
                  onPress={() => setShowConfirmFinish(true)}
                >
                  <Text style={styles.finishTestButtonText}>Finish</Text>
                </TouchableOpacity>
              )}

            {/* NEXT OR COMPLETE TEST */}
            {Number(phaseData.react_order_final) === 200 ? (
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !selectedOption && styles.nextButtonDisabled,
                ]}
                disabled={!selectedOption}
                onPress={async () => {
                  const response = await fetch(
                    "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate",
                    {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        intent: "next_mocktest_phase",
                        student_id: userId,
                        exam_serial: phaseData.exam_serial,
                        react_order_final: phaseData.react_order_final,
                        student_answer: selectedOption,
                        is_correct: selectedOption === currentMCQ?.correct_answer,
                        time_left: formatTime(remainingTime),
                      }),
                    }
                  );

                  setShowCompletionModal(true);
                }}
              >
                <Text style={styles.nextButtonText}>Complete</Text>
                <ChevronRight size={20} color="#000" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[
                  styles.nextButton,
                  !selectedOption && styles.nextButtonDisabled,
                ]}
                disabled={!selectedOption}
                onPress={handleNext}
              >
                <Text style={styles.nextButtonText}>Next</Text>
                <ChevronRight size={20} color="#000" />
              </TouchableOpacity>
            )}
          </View>

          {/* PALETTE MODAL */}
          <QuestionNavigationScreen
            isVisible={showNav}
            onClose={() => setShowNav(false)}
            currentQuestion={getSectionQNumber(phaseData.react_order_final)}
            mcqs={paletteData?.mcqs || []}
            counts={
              paletteData?.counts || {
                answered: 0,
                skipped: 0,
                marked: 0,
                unanswered: 0,
              }
            }
            sectionId={getSection(phaseData.react_order_final)}
            timeLeft={remainingTime}
            onSelectQuestion={handleSelectQuestion}
          />
        </>
      ) : (
        <Text style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
          Loading...
        </Text>
      )}
    </ScrollView>

    {/* CONFIRM FINISH MODAL */}
    {showConfirmFinish && (
      <View style={styles.modalOverlay}>
        <Animated.View style={styles.completionModal}>
          <Text style={styles.modalTitle}>Finish Test?</Text>
          <Text style={styles.modalSubtitle}>
            Are you sure you want to submit all answers?
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: "#334155" }]}
              onPress={() => setShowConfirmFinish(false)}
            >
              <Text style={[styles.modalButtonText, { color: "#fff" }]}>
                Continue
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalButton}
              onPress={async () => {
                await supabase.rpc("test_complete", {
                  p_student_id: userId,
                  p_exam_serial: phaseData.exam_serial,
                });

                setShowConfirmFinish(false);
                setShowCompletionModal(true);
              }}
            >
              <Text style={styles.modalButtonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    )}

    {/* COMPLETION MODAL */}
    {showCompletionModal && (
      <View style={styles.modalOverlay}>
        <Animated.View style={styles.completionModal}>
          <Text style={styles.modalTitle}>🎯 Test Completed!</Text>
          <Text style={styles.modalSubtitle}>
            Your answers have been submitted successfully.
          </Text>

          <TouchableOpacity
            style={styles.modalButton}
            onPress={() => {
              setShowCompletionModal(false);
              setTestStarted(false);
              setTestEnded(false);
              setPhaseData(null);
              setCurrentMCQ(null);
            }}
          >
            <Text style={styles.modalButtonText}>Go Back</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    )}
  </SafeAreaView>
);
}

// ====================================================================
// 🎨 STYLES — FINAL
// ====================================================================

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  scrollView: { flex: 1 },
  contentContainer: { padding: 20 },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  questionInfo: { flexDirection: "row", alignItems: "center", gap: 8 },

  sectionBadge: {
    backgroundColor: "#1e293b",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4ade80",
  },
  sectionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4ade80",
  },

  questionBadge: {
    backgroundColor: "#1e293b",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  questionCounter: {
    fontSize: 12,
    fontWeight: "700",
    color: "#e2e8f0",
  },

  headerRight: { flexDirection: "row", alignItems: "center", gap: 8 },

  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },

  timer: { fontSize: 14, fontWeight: "600", color: "#4ade80" },

  navButton: {
    backgroundColor: "#1e293b",
    padding: 8,
    borderRadius: 20,
  },

  imagePlaceholder: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderRadius: 12,
  },
  imagePlaceholderText: { color: "#94a3b8" },

  questionBubble: {
    backgroundColor: "#1a1f26",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#4ade80",
  },

  optionsContainer: { gap: 12 },

  optionBubble: {
    backgroundColor: "#1a1f26",
    borderRadius: 14,
    padding: 16,
    borderWidth: 2,
    borderColor: "#2d3748",
  },

  optionSelected: {
    backgroundColor: "#1e3a28",
    borderColor: "#4ade80",
  },

  optionContent: { flexDirection: "row", gap: 12 },

  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2d3748",
    justifyContent: "center",
    alignItems: "center",
  },
  optionCircleSelected: { backgroundColor: "#4ade80" },

  optionLabel: { fontSize: 16, fontWeight: "700", color: "#94a3b8" },
  optionLabelSelected: { color: "#000" },

  optionText: { flex: 1, fontSize: 15, color: "#cbd5e1" },
  optionTextSelected: { color: "#e2e8f0" },

  // FOOTER
  footer: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#1a1f26",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },

  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    gap: 6,
  },
  skipButtonText: { color: "#94a3b8", fontWeight: "600" },

  reviewButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#334155",
  },
  reviewButtonText: { color: "#fbbf24", fontWeight: "600" },

  finishTestButton: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#ef4444",
  },
  finishTestButtonText: { color: "#fff", fontWeight: "700" },

  nextButton: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#4ade80",
    gap: 8,
  },
  nextButtonDisabled: { backgroundColor: "#334155", opacity: 0.4 },
  nextButtonText: { color: "#000", fontWeight: "700" },

  // END MODALS
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 99,
  },

  completionModal: {
    backgroundColor: "#1a1f26",
    padding: 24,
    borderRadius: 20,
    width: "80%",
    borderWidth: 1,
    borderColor: "#4ade80",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#4ade80",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#cbd5e1",
    textAlign: "center",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#4ade80",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000",
  },
});

// MARKDOWN STYLE
const markdownStyles = {
  body: { color: "#e2e8f0", fontSize: 16, lineHeight: 24 },
  strong: { color: "#f8fafc", fontWeight: "700" },
  em: { fontStyle: "italic", color: "#e2e8f0" },
  paragraph: { marginBottom: 0 },
};

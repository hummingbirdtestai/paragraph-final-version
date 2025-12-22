// app/mocktests.tsx - PRODUCTION MOCK TEST SCREEN (RPC-DRIVEN)
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
  ActivityIndicator,
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
import { Clock, ChevronRight, SkipForward, Grid3x3, Bookmark } from "lucide-react-native";
import Markdown from "react-native-markdown-display";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { MocktestDashboard } from "@/components/types/MocktestSubjectSelection";
import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import MockTestsLanding from "@/components/landing/MockTestsIntro";
import PageHeader from "@/components/common/PageHeader";
import QuestionNavigationScreen from "@/components/types/QuestionNavigationScreen";
import type { MockTest, UserMockTest } from "@/types/mock-test";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import MainLayout from "@/components/MainLayout";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Zoomable Image Component
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
    backgroundColor: "#0f172a",
    borderRadius: 12,
    overflow: "hidden",
  },
  image: { width: SCREEN_WIDTH - 40, height: "100%", borderRadius: 12 },
});

export default function MockTestsScreen() {
  const { user, loginWithOTP, verifyOTP } = useAuth();
  const isLoggedIn = !!user;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mockWindow, setMockWindow] = useState<any>(null);
  const [completedTests, setCompletedTests] = useState<UserMockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  // RPC-DRIVEN STATE
  const [testStarted, setTestStarted] = useState(false);
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [examSerial, setExamSerial] = useState<number | null>(null);
  const [currentSection, setCurrentSection] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [testEnded, setTestEnded] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [showSectionConfirm, setShowSectionConfirm] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const autoStartDone = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const userId = user?.id || null;

  // Auto-start from params
  useEffect(() => {
    if (
      !autoStartDone.current &&
      params.start === "true" &&
      params.exam_serial &&
      userId
    ) {
      autoStartDone.current = true;
      handleStartTest(String(params.exam_serial));
    }
  }, [params, userId]);

  // Profile check
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      const { data: profileRow } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      setProfile(profileRow);

      if (!profileRow || !profileRow.name || profileRow.name.trim() === "") {
        setShowRegistrationModal(true);
        return;
      }

      if (profileRow.is_active === false) {
        setShowBlockedModal(true);
        return;
      }
    };

    loadProfile();
  }, [user]);

  // Timer logic
  useEffect(() => {
    if (!testStarted || testEnded || remainingTime === null) return;
    if (typeof remainingTime !== "number" || isNaN(remainingTime)) return;

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null || typeof prev !== "number" || isNaN(prev)) {
          return null;
        }
        if (prev <= 0) {
          handleTimerExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testEnded, remainingTime]);

  const handleTimerExpired = async () => {
    console.log("⏰ TIMER EXPIRED - AUTO SUBMITTING");
    const current = mcqs[currentIndex];
    if (!current) return;

    await submitAnswer({
      student_answer: selectedOption,
      is_skipped: !selectedOption,
      is_review: false,
    });

    if (currentIndex >= mcqs.length - 1) {
      setShowSectionConfirm(true);
    }
  };

  // RPC #1: Load Section MCQs
  const loadSectionMCQs = async (exam_serial: string | number) => {
    if (!userId) return;

    try {
      console.log("📥 LOADING SECTION MCQs", { exam_serial, userId });

      const { data, error } = await supabase.rpc("get_mocktest_section_mcqs", {
        p_student_id: userId,
        p_exam_serial: Number(exam_serial),
      });

      if (error) throw error;

      console.log("✅ SECTION LOADED:", data);

      setMcqs(data.mcqs || []);
      setExamSerial(data.exam_serial);
      setCurrentSection(data.section);
      setCurrentIndex(0);
      setSelectedOption(null);
      setTestStarted(true);

      // Initialize timer
      if (data.time_left) {
        const [h, m, s] = data.time_left.split(":").map(Number);
        setRemainingTime(h * 3600 + m * 60 + s);
      } else {
        setRemainingTime(42 * 60); // Default: 42 minutes
      }

      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (err: any) {
      console.error("❌ Error loading section:", err);
      Alert.alert("Error", "Could not load questions. Please try again.");
    }
  };

  // RPC #2: Submit Answer
  const submitAnswer = async ({
    student_answer = null,
    is_skipped = false,
    is_review = false,
  }: {
    student_answer?: string | null;
    is_skipped?: boolean;
    is_review?: boolean;
  }) => {
    if (!userId || !examSerial) return;

    const current = mcqs[currentIndex];
    if (!current) return;

    try {
      const timeLeft = formatTime(remainingTime || 0);

      console.log("📤 SUBMITTING ANSWER", {
        react_order: current.react_order,
        student_answer,
        is_skipped,
        is_review,
        timeLeft,
      });

      const { error } = await supabase.rpc("submit_mocktest_answer", {
        p_student_id: userId,
        p_exam_serial: examSerial,
        p_react_order_final: current.react_order,
        p_correct_answer: current.phase_json.correct_answer,
        p_student_answer: student_answer,
        p_is_correct: student_answer === current.phase_json.correct_answer,
        p_is_skipped: is_skipped,
        p_is_review: is_review,
        p_time_left: timeLeft,
      });

      if (error) throw error;

      console.log("✅ ANSWER SUBMITTED");

      // Update local state
      const updatedMcqs = [...mcqs];
      updatedMcqs[currentIndex] = {
        ...current,
        student_answer,
        is_skipped,
        is_review,
        is_correct: student_answer === current.phase_json.correct_answer,
      };
      setMcqs(updatedMcqs);
    } catch (err: any) {
      console.error("❌ Error submitting answer:", err);
    }
  };

  // Navigation Handlers
  const handleStartTest = async (exam_serial: string) => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    await loadSectionMCQs(exam_serial);
  };

  const handleNext = async () => {
    await submitAnswer({
      student_answer: selectedOption,
      is_skipped: false,
      is_review: false,
    });

    setSelectedOption(null);

    if (currentIndex >= mcqs.length - 1) {
      setShowSectionConfirm(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleSkip = async () => {
    await submitAnswer({
      student_answer: null,
      is_skipped: true,
      is_review: false,
    });

    setSelectedOption(null);

    if (currentIndex >= mcqs.length - 1) {
      setShowSectionConfirm(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleReview = async () => {
    await submitAnswer({
      student_answer: selectedOption,
      is_skipped: false,
      is_review: true,
    });

    setSelectedOption(null);

    if (currentIndex >= mcqs.length - 1) {
      setShowSectionConfirm(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const moveToNextSection = async () => {
    setShowSectionConfirm(false);
    if (examSerial) {
      await loadSectionMCQs(examSerial);
    }
  };

  const handlePaletteJump = async (targetReactOrder: number) => {
    // Submit current before jumping
    await submitAnswer({
      student_answer: selectedOption,
      is_skipped: false,
      is_review: false,
    });

    const targetIndex = mcqs.findIndex((m) => m.react_order === targetReactOrder);
    if (targetIndex !== -1) {
      setCurrentIndex(targetIndex);
      setSelectedOption(mcqs[targetIndex].student_answer || null);
      setShowNav(false);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  const handleFinishTest = () => {
    setShowConfirmFinish(true);
  };

  const confirmFinishTest = async () => {
    await submitAnswer({
      student_answer: selectedOption,
      is_skipped: false,
      is_review: false,
    });

    setTestEnded(true);
    setShowConfirmFinish(false);
    setShowCompletionModal(true);
  };

  // Palette Data Generator
  const generatePaletteData = () => {
    if (!mcqs.length) return null;

    const answered = mcqs.filter((m) => m.student_answer && !m.is_review).length;
    const skipped = mcqs.filter((m) => m.is_skipped).length;
    const marked = mcqs.filter((m) => m.is_review).length;
    const unanswered = mcqs.filter(
      (m) => !m.student_answer && !m.is_skipped && !m.is_review
    ).length;

    return {
      questions: mcqs.map((m) => ({
        serial_number: m.section_q_number,
        react_order_final: m.react_order,
        status: m.is_review
          ? "marked"
          : m.is_skipped
          ? "skipped"
          : m.student_answer
          ? "answered"
          : "unanswered",
      })),
      stats: { answered, skipped, marked, unanswered },
    };
  };

  // Timer Formatter
  const formatTime = (seconds: number) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  // Load Dashboard Data
  const loadData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const [windowRes, completedRes] = await Promise.all([
        supabase.rpc("get_mock_test_window", { p_student_id: user.id }),
        supabase
          .from("mock_test_pointer")
          .select("*, mock_test!inner(*)")
          .eq("student_id", user.id)
          .order("last_accessed_at", { ascending: false }),
      ]);

      if (windowRes.data) {
        setMockWindow(windowRes.data);
      }

      if (completedRes.data) {
        setCompletedTests(completedRes.data as UserMockTest[]);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  // Current MCQ & Palette
  const currentMCQ = mcqs[currentIndex];
  const paletteData = generatePaletteData();

  // RENDER: Auth Modals
  if (!isLoggedIn) {
    return (
      <MainLayout>
        <View style={styles.container}>
          <MockTestsLanding onGetStarted={() => setShowLoginModal(true)} />
          <LoginModal
            visible={showLoginModal}
            onClose={() => setShowLoginModal(false)}
            onLogin={(phone) => {
              setPhoneNumber(phone);
              loginWithOTP(phone);
              setShowLoginModal(false);
              setShowOTPModal(true);
            }}
            onSwitchToRegister={() => {
              setShowLoginModal(false);
              setShowRegistrationModal(true);
            }}
          />
          <OTPModal
            visible={showOTPModal}
            onClose={() => setShowOTPModal(false)}
            onVerify={(otp) => {
              verifyOTP(phoneNumber, otp);
              setShowOTPModal(false);
            }}
            phoneNumber={phoneNumber}
          />
          <RegistrationModal
            visible={showRegistrationModal}
            onClose={() => setShowRegistrationModal(false)}
            onRegister={(phone) => {
              setPhoneNumber(phone);
              loginWithOTP(phone);
              setShowRegistrationModal(false);
              setShowOTPModal(true);
            }}
            onSwitchToLogin={() => {
              setShowRegistrationModal(false);
              setShowLoginModal(true);
            }}
          />
        </View>
      </MainLayout>
    );
  }

  // RENDER: Blocked Account
  if (showBlockedModal) {
    return (
      <MainLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.blockedTitle}>Account Inactive</Text>
          <Text style={styles.blockedText}>
            Your account is currently inactive. Please contact support.
          </Text>
        </View>
      </MainLayout>
    );
  }

  // RENDER: Test In Progress
  if (testStarted && !testEnded && currentMCQ) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <View style={styles.timerContainer}>
            <Clock size={20} color="#25D366" />
            <Text style={styles.timerText}>{formatTime(remainingTime || 0)}</Text>
          </View>
          <TouchableOpacity onPress={() => setShowNav(true)} style={styles.navButton}>
            <Grid3x3 size={24} color="#25D366" />
          </TouchableOpacity>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionHeader}>
            <Text style={styles.questionNumber}>
              Q{currentMCQ.section_q_number} of {mcqs.length}
            </Text>
            <Text style={styles.sectionLabel}>Section {currentSection}</Text>
          </View>

          {currentMCQ.is_mcq_image_type && currentMCQ.mcq_image && (
            <ZoomableImage uri={currentMCQ.mcq_image} height={280} />
          )}

          <View style={styles.questionCard}>
            <Markdown style={markdownStyles}>
              {currentMCQ.phase_json?.question || ""}
            </Markdown>
          </View>

          <View style={styles.optionsContainer}>
            {Object.entries(currentMCQ.phase_json?.options || {}).map(
              ([key, value]: [string, any]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.optionButton,
                    selectedOption === key && styles.optionButtonSelected,
                  ]}
                  onPress={() => setSelectedOption(key)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLabelContainer}>
                    <Text
                      style={[
                        styles.optionLabel,
                        selectedOption === key && styles.optionLabelSelected,
                      ]}
                    >
                      {key}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      selectedOption === key && styles.optionTextSelected,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.actionButton, styles.skipButton]}
            onPress={handleSkip}
            activeOpacity={0.8}
          >
            <SkipForward size={18} color="#FFF" />
            <Text style={styles.buttonText}>Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.reviewButton]}
            onPress={handleReview}
            activeOpacity={0.8}
          >
            <Bookmark size={18} color="#FFF" />
            <Text style={styles.buttonText}>Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.nextButton,
              !selectedOption && styles.disabledButton,
            ]}
            onPress={selectedOption ? handleNext : undefined}
            disabled={!selectedOption}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Next</Text>
            <ChevronRight size={18} color="#FFF" />
          </TouchableOpacity>
        </View>

        {showNav && paletteData && (
          <QuestionNavigationScreen
            visible={showNav}
            onClose={() => setShowNav(false)}
            questions={paletteData.questions}
            stats={paletteData.stats}
            currentQuestion={currentMCQ.react_order}
            onJump={handlePaletteJump}
            onFinish={handleFinishTest}
          />
        )}

        {showSectionConfirm && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Section Completed!</Text>
              <Text style={styles.modalText}>
                You've finished Section {currentSection}. Continue to the next section?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={moveToNextSection}
                >
                  <Text style={styles.modalButtonText}>Next Section</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => {
                    setShowSectionConfirm(false);
                    setTestEnded(true);
                    setShowCompletionModal(true);
                  }}
                >
                  <Text style={styles.modalButtonTextSecondary}>Finish Test</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {showConfirmFinish && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Finish Test?</Text>
              <Text style={styles.modalText}>
                Are you sure you want to submit and finish the test?
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={confirmFinishTest}
                >
                  <Text style={styles.modalButtonText}>Yes, Finish</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setShowConfirmFinish(false)}
                >
                  <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    );
  }

  // RENDER: Test Completion
  if (showCompletionModal) {
    return (
      <MainLayout>
        <View style={styles.centerContainer}>
          <Text style={styles.completionTitle}>Test Completed!</Text>
          <Text style={styles.completionText}>
            Your responses have been saved successfully.
          </Text>
          <TouchableOpacity
            style={styles.completionButton}
            onPress={() => {
              setShowCompletionModal(false);
              setTestStarted(false);
              setTestEnded(false);
              setMcqs([]);
              setCurrentIndex(0);
              setExamSerial(null);
              loadData();
            }}
          >
            <Text style={styles.completionButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </MainLayout>
    );
  }

  // RENDER: Dashboard
  return (
    <MainLayout>
      <View style={styles.container}>
        <PageHeader title="Mock Tests" />
        {loading ? (
          <View style={styles.centerContainer}>
            <ActivityIndicator size="large" color="#25D366" />
          </View>
        ) : (
          <MocktestDashboard
            mockWindow={mockWindow}
            completedTests={completedTests}
            onStartTest={handleStartTest}
            isLoading={loading}
          />
        )}
      </View>
    </MainLayout>
  );
}

// STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#0D1117",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#161B22",
    borderBottomWidth: 1,
    borderBottomColor: "#30363D",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  timerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#25D366",
    fontVariant: ["tabular-nums"],
  },
  navButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  questionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C9D1D9",
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#58A6FF",
    backgroundColor: "#161B22",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#30363D",
  },
  questionCard: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#30363D",
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    backgroundColor: "#161B22",
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: "#30363D",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  optionButtonSelected: {
    borderColor: "#25D366",
    backgroundColor: "#1a2f23",
  },
  optionLabelContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0D1117",
    justifyContent: "center",
    alignItems: "center",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#8B949E",
  },
  optionLabelSelected: {
    color: "#25D366",
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: "#C9D1D9",
    lineHeight: 22,
  },
  optionTextSelected: {
    color: "#E6EDF3",
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 10,
    backgroundColor: "#161B22",
    borderTopWidth: 1,
    borderTopColor: "#30363D",
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    borderRadius: 10,
  },
  skipButton: {
    backgroundColor: "#DA3633",
  },
  reviewButton: {
    backgroundColor: "#F85149",
  },
  nextButton: {
    backgroundColor: "#25D366",
  },
  disabledButton: {
    opacity: 0.4,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFF",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0D1117",
  },
  blockedTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#F85149",
    marginBottom: 12,
  },
  blockedText: {
    fontSize: 16,
    color: "#8B949E",
    textAlign: "center",
  },
  completionTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#25D366",
    marginBottom: 12,
  },
  completionText: {
    fontSize: 16,
    color: "#C9D1D9",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 24,
  },
  completionButton: {
    backgroundColor: "#25D366",
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
  },
  completionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#161B22",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 400,
    borderWidth: 1,
    borderColor: "#30363D",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#E6EDF3",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    color: "#8B949E",
    marginBottom: 24,
    lineHeight: 24,
  },
  modalButtons: {
    gap: 12,
  },
  modalButton: {
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#25D366",
  },
  modalButtonSecondary: {
    backgroundColor: "#30363D",
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  modalButtonTextSecondary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C9D1D9",
  },
});

const markdownStyles = {
  body: { color: "#E6EDF3", fontSize: 16, lineHeight: 26 },
  heading1: { color: "#E6EDF3", fontSize: 24, fontWeight: "700", marginBottom: 12 },
  heading2: { color: "#E6EDF3", fontSize: 20, fontWeight: "600", marginBottom: 10 },
  paragraph: { color: "#E6EDF3", fontSize: 16, lineHeight: 26, marginBottom: 12 },
  strong: { color: "#FFF", fontWeight: "700" },
  em: { color: "#E6EDF3", fontStyle: "italic" },
  code_inline: {
    backgroundColor: "#30363D",
    color: "#79C0FF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: "monospace",
  },
  list_item: { color: "#E6EDF3", fontSize: 16, lineHeight: 26 },
  bullet_list: { marginBottom: 12 },
  ordered_list: { marginBottom: 12 },
};

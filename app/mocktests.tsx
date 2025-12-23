// app/mocktests.tsx - PRODUCTION MOCK TEST SCcREEN (RPC-DRIVEN)
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
  useWindowDimensions,
  Pressable,
} from "react-native";
import { Clock, ChevronRight, SkipForward, Grid3x3, Bookmark, Menu, ChartBar as BarChart3, Eye } from "lucide-react-native";
import ConfettiCannon from "react-native-confetti-cannon";
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
import ZoomableImage from "@/components/common/ZoomableImage";
import type { MockTest, UserMockTest } from "@/types/mock-test";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import MainLayout from "@/components/MainLayout";
import MobileDrawer from "@/components/MobileDrawer";
import Sidebar from "@/components/Sidebar";

export default function MockTestsScreen() {
  const { user, loginWithOTP, verifyOTP } = useAuth();
  const isLoggedIn = !!user;
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mockWindow, setMockWindow] = useState<any>(null);
  const [completedTests, setCompletedTests] = useState<UserMockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [activeAction, setActiveAction] = useState<'skip' | 'review' | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
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
  const confettiRef = useRef<any>(null);
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

    console.log("⏱ TIMER STARTED WITH", remainingTime);

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev === null || prev <= 1) {
          handleTimerExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [testStarted, testEnded, remainingTime]);

  useEffect(() => {
    if (showCompletionModal && confettiRef.current) {
      setTimeout(() => {
        confettiRef.current?.start();
      }, 300);
    }
  }, [showCompletionModal]);

  useEffect(() => {
    const current = mcqs[currentIndex];
    if (!current) return;

    setSelectedOption(current.student_answer || null);
  }, [currentIndex, mcqs]);

  const handleTimerExpired = async () => {
  console.log("⏰ TIMER EXPIRED - AUTO SUBMITTING");

  const current = mcqs[currentIndex];
  if (!current) return;

  // Only submit if user actually selected something NEW
  if (
    selectedOption !== null &&
    selectedOption !== current.student_answer
  ) {
    await submitAnswer({
      student_answer: selectedOption,
      is_skipped: false,
      is_review: false,
    });
  }

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

      console.log("✅ RAW RPC RESPONSE:", data);

      // Extract payload from response array
      const payload = data?.[0]?.get_mocktest_section_mcqs || data;

      console.log("✅ SECTION LOADED:", payload);

      setMcqs(payload.mcqs || []);
      setExamSerial(payload.exam_serial);
      setCurrentSection(payload.section);
      setCurrentIndex(0);
      setTestStarted(true);

      // Initialize timer
      if (payload.time_left) {
        const [h, m, s] = payload.time_left.split(":").map(Number);
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
      const question = current.phase_json?.[0] || current.phase_json;

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
        p_correct_answer: question.correct_answer,
        p_student_answer: student_answer,
        p_is_correct: student_answer === question.correct_answer,
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
        is_correct: student_answer === question.correct_answer,
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

  const handleReviewTest = (examSerial: number) => {
    router.push(`/mockPractice?exam_serial=${examSerial}`);
  };

  const handleNext = async () => {
  const current = mcqs[currentIndex];

  // ✅ submit ONLY if changed
  if (
    selectedOption !== null &&
    selectedOption !== current?.student_answer
  ) {
    await submitAnswer({
      student_answer: selectedOption,
      is_skipped: false,
      is_review: false,
    });
  }

  if (currentIndex >= mcqs.length - 1) {
    setShowSectionConfirm(true);
  } else {
    setCurrentIndex(currentIndex + 1);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }
};


  const handleSkip = async () => {
    setActiveAction('skip');

    await submitAnswer({
      student_answer: null,
      is_skipped: true,
      is_review: false,
    });

    if (currentIndex >= mcqs.length - 1) {
      setShowSectionConfirm(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }

    setActiveAction(null);
  };

  const handleReview = async () => {
    setActiveAction('review');

    await submitAnswer({
      student_answer: selectedOption,
      is_skipped: false,
      is_review: true,
    });

    if (currentIndex >= mcqs.length - 1) {
      setShowSectionConfirm(true);
    } else {
      setCurrentIndex(currentIndex + 1);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }

    setActiveAction(null);
  };

  const moveToNextSection = async () => {
    setShowSectionConfirm(false);

    if (!userId || !examSerial || !currentSection) return;

    try {
      console.log("🔄 MOVING TO NEXT SECTION", { currentSection, examSerial });

      const { data, error } = await supabase.rpc(
        "end_section_and_load_next_section",
        {
          p_student_id: userId,
          p_exam_serial: examSerial,
          p_ended_section: currentSection,
        }
      );

      if (error) throw error;

      const payload = data?.[0]?.end_section_and_load_next_section || data;

      console.log("✅ SECTION TRANSITION RESPONSE:", payload);

      if (payload?.test_complete) {
        await supabase.rpc("mark_mock_test_complete", {
          p_student_id: userId,
          p_exam_serial: examSerial,
        });

        setTestEnded(true);
        setShowCompletionModal(true);
        return;
      }

      setMcqs(payload.mcqs || []);
      setCurrentSection(payload.section);
      setCurrentIndex(0);

      if (payload.time_left) {
        const [h, m, s] = payload.time_left.split(":").map(Number);
        setRemainingTime(h * 3600 + m * 60 + s);
      } else {
        setRemainingTime(42 * 60);
      }

      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (err) {
      console.error("❌ Failed to move to next section", err);
      Alert.alert("Error", "Unable to load next section");
    }
  };

  const handlePaletteJump = async (_sectionId: string, reactOrderFinal: number) => {
    if (!reactOrderFinal) return;

    const current = mcqs[currentIndex];

    if (
      selectedOption !== null &&
      selectedOption !== current?.student_answer
    ) {
      await submitAnswer({
        student_answer: selectedOption,
        is_skipped: false,
        is_review: false,
      });
    }

    const targetIndex = mcqs.findIndex(
      (m) => Number(m.react_order) === Number(reactOrderFinal)
    );

    if (targetIndex === -1) return;

    setCurrentIndex(targetIndex);
    setSelectedOption(mcqs[targetIndex]?.student_answer || null);
    setShowNav(false);

    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    });
  };

  const handleFinishTest = () => {
    setShowConfirmFinish(true);
  };

  const confirmFinishTest = async () => {
    const current = mcqs[currentIndex];

    if (
      selectedOption !== null &&
      selectedOption !== current?.student_answer
    ) {
      await submitAnswer({
        student_answer: selectedOption,
        is_skipped: false,
        is_review: false,
      });
    }

    await supabase.rpc("mark_mock_test_complete", {
      p_student_id: userId,
      p_exam_serial: examSerial,
    });

    setTestEnded(true);
    setShowConfirmFinish(false);
    setShowCompletionModal(true);
  };

  // Palette Data Generator
  const generatePaletteData = () => {
    if (!mcqs.length) return null;

    const paletteMcqs = mcqs.map((mcq) => {
      let status: 'answered' | 'marked' | 'skipped' | 'unanswered' = 'unanswered';

      if (mcq.student_answer) status = 'answered';
      else if (mcq.is_skipped) status = 'skipped';
      else if (mcq.is_review) status = 'marked';

      return {
        serial_number: mcq.section_q_number,
        react_order_final: mcq.react_order,
        status,
      };
    });

    const counts = paletteMcqs.reduce(
      (acc, q) => {
        acc[q.status]++;
        return acc;
      },
      {
        answered: 0,
        skipped: 0,
        marked: 0,
        unanswered: 0,
      }
    );

    return { mcqs: paletteMcqs, counts };
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
        setMockWindow({
          present: windowRes.data.present_mock_test,
          next: windowRes.data.next_mock_test,
          review: windowRes.data.review_tests,
        });
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
    const testContentView = (
      <>
        <View style={styles.header}>
          <View style={styles.timerContainer}>
            <Clock size={20} color="#25D366" />
            <Text style={styles.timerText}>{formatTime(remainingTime || 0)}</Text>
          </View>
          <View style={styles.headerActions}>
            {isMobile && (
              <TouchableOpacity onPress={() => setDrawerVisible(true)} style={styles.navButton}>
                <Menu size={24} color="#25D366" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => setShowNav(true)} style={styles.navButton}>
              <Grid3x3 size={24} color="#25D366" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          style={styles.scrollView}
          contentContainerStyle={[styles.scrollContent, !isMobile && styles.scrollContentDesktop]}
          showsVerticalScrollIndicator={false}
        >
          <View style={!isMobile && styles.desktopContentWrapper}>
            <View style={styles.questionHeader}>
              <Text style={styles.questionNumber}>
                Q{currentMCQ.section_q_number} of {mcqs.length}
              </Text>
              <Text style={styles.sectionLabel}>Section {currentSection}</Text>
            </View>

          <View style={styles.questionCard}>
            <Markdown style={markdownStyles}>
              {currentMCQ.phase_json?.[0]?.stem || currentMCQ.phase_json?.stem || ""}
            </Markdown>
          </View>

          {currentMCQ.is_mcq_image_type && currentMCQ.mcq_image && (
            <View style={{ marginBottom: 20 }}>
              <ZoomableImage uri={currentMCQ.mcq_image} height={260} />
            </View>
          )}

          <View style={styles.optionsContainer}>
            {Object.entries(
              currentMCQ.phase_json?.[0]?.options || currentMCQ.phase_json?.options || {}
            ).map(([key, value]: [string, any]) => (
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
            ))}
          </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <View style={[styles.footerContent, !isMobile && styles.footerContentDesktop]}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.skipButton,
                selectedOption && styles.disabledButton,
                activeAction === 'skip' && !selectedOption && styles.activeButton,
              ]}
              onPress={!selectedOption ? handleSkip : undefined}
              disabled={!!selectedOption}
              activeOpacity={0.8}
            >
              <SkipForward size={18} color={selectedOption ? "#8B949E" : "#FFF"} />
              <Text style={[styles.buttonText, selectedOption && styles.disabledButtonText]}>Skip</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                styles.reviewButton,
                selectedOption && styles.disabledButton,
                activeAction === 'review' && !selectedOption && styles.activeButton,
              ]}
              onPress={!selectedOption ? handleReview : undefined}
              disabled={!!selectedOption}
              activeOpacity={0.8}
            >
              <Bookmark size={18} color={selectedOption ? "#8B949E" : "#FFF"} />
              <Text style={[styles.buttonText, selectedOption && styles.disabledButtonText]}>Review</Text>
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
              <Text style={[styles.buttonText, !selectedOption && styles.disabledButtonText]}>Next</Text>
              <ChevronRight size={18} color={!selectedOption ? "#8B949E" : "#FFF"} />
            </TouchableOpacity>
          </View>
        </View>

        {showNav && paletteData && (
          <QuestionNavigationScreen
            isVisible={showNav}
            onClose={() => setShowNav(false)}
            sectionId={currentSection || "A"}
            timeLeft={remainingTime || 0}
            currentQuestion={currentMCQ.section_q_number}
            mcqs={paletteData.mcqs}
            counts={paletteData.counts}
            onSelectQuestion={handlePaletteJump}
          />
        )}

        {showSectionConfirm && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                {currentSection === 'E' ? 'Mock Test Completed 🎉' : `Section ${currentSection} Completed`}
              </Text>
              <Text style={styles.modalText}>
                {currentSection === 'E'
                  ? "You've reached the end of the mock test.\n\nYou can:\n• Review questions from Section E, or\n• Complete the mock test and view your performance."
                  : `You've reached the end of Section ${currentSection}.\n\nYou can:\n• Review questions in this section, or\n• Move ahead to the next section with a fresh 42-minute timer.`
                }
              </Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={() => setShowSectionConfirm(false)}
                >
                  <Text style={styles.modalButtonTextSecondary}>
                    {currentSection === 'E' ? 'Review Section E' : 'Review This Section'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={moveToNextSection}
                >
                  <Text style={styles.modalButtonText}>
                    {currentSection === 'E' ? 'Complete Mock Test' : 'Move to Next Section'}
                  </Text>
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

        {isMobile && (
          <MobileDrawer
            visible={drawerVisible}
            onClose={() => setDrawerVisible(false)}
            onOpenAuth={(mode) => {
              setDrawerVisible(false);
              if (mode === 'login') {
                setShowLoginModal(true);
              } else {
                setShowRegistrationModal(true);
              }
            }}
          />
        )}
      </>
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        {isMobile ? (
          testContentView
        ) : (
          <View style={styles.desktopContainer}>
            <View style={styles.desktopSidebar}>
              <Sidebar
                onOpenAuth={(mode) => {
                  if (mode === 'login') {
                    setShowLoginModal(true);
                  } else {
                    setShowRegistrationModal(true);
                  }
                }}
              />
            </View>
            <View style={styles.desktopContent}>
              {testContentView}
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
          <ConfettiCannon
            ref={confettiRef}
            count={200}
            origin={{ x: width / 2, y: 0 }}
            autoStart={false}
            fadeOut
            colors={['#25D366', '#58A6FF', '#E6EDF3', '#FFA657', '#FF7B72']}
          />
          <Text style={styles.completionTitle}>🎉 Mock Test Completed!</Text>
          <Text style={styles.completionText}>
            Great job! You've successfully completed this mock test.
          </Text>
          <Text style={styles.completionSubtext}>
            Next steps:
            {'\n'}• Visit the Review Session to revise MCQs
            {'\n'}• Visit the Analytics Session to view your score and performance insights
          </Text>

          <View style={styles.completionButtons}>
            <TouchableOpacity
              style={[styles.completionButton, styles.completionButtonPrimary]}
              onPress={() => {
                router.push(`/mockPractice?exam_serial=${examSerial}`);
              }}
            >
              <Eye size={20} color="#FFF" />
              <Text style={styles.completionButtonText}>Go to Review Session</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.completionButton, styles.completionButtonSecondary]}
              onPress={() => {
                router.push(`/analyticspage?exam_serial=${examSerial}`);
              }}
            >
              <BarChart3 size={20} color="#FFF" />
              <Text style={styles.completionButtonText}>View Analytics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.completionButton, styles.completionButtonTertiary]}
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
              <Text style={styles.completionButtonTextTertiary}>Back to Dashboard</Text>
            </TouchableOpacity>
          </View>
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
            onReviewTest={handleReviewTest}
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
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
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
  scrollContentDesktop: {
    alignItems: "center",
  },
  desktopContentWrapper: {
    width: "100%",
    maxWidth: 900,
    paddingHorizontal: 40,
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
    padding: 16,
    backgroundColor: "#0D1117",
    borderTopWidth: 1,
    borderTopColor: "#21262D",
  },
  footerContent: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  footerContentDesktop: {
    maxWidth: 900,
    alignSelf: "center",
    paddingHorizontal: 40,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  skipButton: {
    backgroundColor: "#21262D",
    borderWidth: 1.5,
    borderColor: "#30363D",
  },
  reviewButton: {
    backgroundColor: "#21262D",
    borderWidth: 1.5,
    borderColor: "#30363D",
  },
  nextButton: {
    backgroundColor: "#238636",
    borderWidth: 1,
    borderColor: "#2EA043",
  },
  activeButton: {
    borderWidth: 2,
    borderColor: "#2EA043",
  },
  disabledButton: {
    opacity: 0.35,
    backgroundColor: "#161B22",
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFF",
    letterSpacing: 0.3,
  },
  disabledButtonText: {
    color: "#8B949E",
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
    fontSize: 32,
    fontWeight: "700",
    color: "#25D366",
    marginBottom: 16,
    textAlign: "center",
  },
  completionText: {
    fontSize: 18,
    color: "#E6EDF3",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 26,
    fontWeight: "500",
  },
  completionSubtext: {
    fontSize: 15,
    color: "#8B949E",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  completionButtons: {
    width: "100%",
    maxWidth: 400,
    gap: 12,
  },
  completionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  completionButtonPrimary: {
    backgroundColor: "#25D366",
  },
  completionButtonSecondary: {
    backgroundColor: "#238636",
  },
  completionButtonTertiary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#30363D",
  },
  completionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  completionButtonTextTertiary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8B949E",
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
    marginBottom: 16,
    textAlign: "center",
  },
  modalText: {
    fontSize: 15,
    color: "#8B949E",
    marginBottom: 24,
    lineHeight: 22,
  },
  modalButtons: {
    gap: 12,
    flexDirection: "column-reverse",
  },
  modalButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  modalButtonPrimary: {
    backgroundColor: "#25D366",
  },
  modalButtonSecondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#30363D",
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
  desktopContainer: {
    flex: 1,
    flexDirection: "row",
  },
  desktopSidebar: {
    width: 280,
    backgroundColor: "#0D1117",
    borderRightWidth: 1,
    borderRightColor: "#30363D",
  },
  desktopContent: {
    flex: 1,
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
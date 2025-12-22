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

console.log("🟥 LOADED SCREEN → app/mocktests.tsx");

// ───────────────────────────────────────────────
// 🔹 MAIN MONOLITHIC MOCKTEST SCREEN
// ───────────────────────────────────────────────
export default function MockTestsScreen() {
  const { user, loginWithOTP, verifyOTP } = useAuth();
  const isLoggedIn = !!user;
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mockWindow, setMockWindow] = useState<{ present?: any; next?: any } | null>(null);
  const [completedTests, setCompletedTests] = useState<UserMockTest[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [showNav, setShowNav] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();
  const params = useLocalSearchParams();
const testTitle = params.title ? decodeURIComponent(params.title as string) : null;
const testDate = params.date ? decodeURIComponent(params.date as string) : null;
  const [paletteData, setPaletteData] = useState(null);
  const [profile, setProfile] = useState(null);
const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

const [showSectionConfirm, setShowSectionConfirm] = useState(false);
  
useEffect(() => {
  if (!autoStartDone.current &&
      params.start === "true" &&
      params.exam_serial &&
      userId) {

    autoStartDone.current = true;
    handleStartTest(params.exam_serial);
  }
}, [params, userId]);


// ───────────────────────────────────────────────
// 🔍 CHECK PROFILE → ENFORCE NAME + SUBSCRIPTION
// ───────────────────────────────────────────────
useEffect(() => {
  const loadProfile = async () => {
    if (!user) return;

    const { data: profileRow } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(profileRow);

    // 1️⃣ FORCE NAME REGISTRATION
    if (!profileRow || !profileRow.name || profileRow.name.trim() === "") {
      setShowRegistrationModal(true);
      return;
    }

    // 2️⃣ BLOCKED → NOT ACTIVE
    if (profileRow.is_active === false) {
      setShowBlockedModal(true);
      return;
    }
  };

  loadProfile();
}, [user]);


  // 💡 Monolithic test state
  const [testStarted, setTestStarted] = useState(false);
  const [phaseData, setPhaseData] = useState<any>(null);
  const [currentMCQ, setCurrentMCQ] = useState<any | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [testEnded, setTestEnded] = useState(false);

  const autoStartDone = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  console.log("🟡 PARAMS RECEIVED IN mocktests.tsx:", params);
  console.log("🟡 Current testStarted:", testStarted);

// ───────────────────────────────────────────────
// 🔥 DIRECT RPC CALL WHEN TIMER HITS ZERO (FINAL)
// ───────────────────────────────────────────────
const callTimerExpiredRPC = async (currentRO) => {
  try {
    console.log("⏰ TIMER EXPIRED — RPC ABOUT TO FIRE", {
      ro: currentRO,
      exam_serial: phaseData?.exam_serial,
      remainingTime,
      ts: new Date().toISOString(),
    });

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
      console.error("❌ [TIMER 0 RPC ERROR]", error);
      return;
    }

    const normalized = normalizePhaseData(data);

    if (normalized?.phase_json) {
      setPhaseData(normalized);
      setCurrentMCQ(normalized.phase_json[0]);
      setSelectedOption(null);
    }

    // 🔥 UI decision AFTER state is saved
    if (isSectionEnd(currentRO)) {
      setShowSectionConfirm(true);
      return;
    }

    // ⏱ reset timer only if continuing
    setRemainingTime(42 * 60);
    scrollRef.current?.scrollTo({ y: 0, animated: true });

  } catch (err) {
    console.error("🔥 [TIMER 0 RPC FAILED COMPLETELY]:", err);
  }
};


  
useEffect(() => { loadData(); }, []);
useEffect(() => {
  if (!testStarted || testEnded || remainingTime === null) return;
  if (typeof remainingTime !== "number" || isNaN(remainingTime)) return;

  const timer = setInterval(() => {
    setRemainingTime((prev) => {
      if (prev === null || typeof prev !== "number" || isNaN(prev)) {
        return prev;
      }

      if (prev > 1) {
        return prev - 1;
      }

      clearInterval(timer);
      const currentRO = Number(phaseData?.react_order_final);
      callTimerExpiredRPC(currentRO);
      return 0;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [testStarted, testEnded, remainingTime]);

const getNextSectionStart = (ro) => {
  if (ro >= 1 && ro <= 40) return 41;
  if (ro >= 41 && ro <= 80) return 81;
  if (ro >= 81 && ro <= 120) return 121;
  if (ro >= 121 && ro <= 160) return 161;
  return null; // Section E ends → complete test
};


  // 🔐 OTP / LOGIN / REGISTER
  const handleSendOTP = async (phone: string) => {
    try {
      const formatted = phone.startsWith("+91") ? phone : `+91${phone}`;
      const { error } = await loginWithOTP(formatted);
      if (error) throw error;
      setPhoneNumber(phone);
      setShowLoginModal(false);
      setShowOTPModal(true);
    } catch (err) { console.error("OTP send error:", err); }
  };

const handleVerifyOTP = async (otp: string) => {
  try {
    const data = await verifyOTP(phoneNumber, otp);

    // ❗WAIT 300ms for onAuthStateChange to update user in AuthContext
    setTimeout(async () => {
      const currentUser = supabase.auth.getUser
        ? (await supabase.auth.getUser()).data.user
        : supabase.auth.user();

      if (!currentUser) {
        console.error("❌ User not available after OTP verification");
        return;
      }

      setShowOTPModal(false);

      const { data: existing } = await supabase
        .from("users")
        .select("*")
        .eq("id", currentUser.id)
        .maybeSingle();

      if (!existing) {
        setShowRegistrationModal(true);
      }
    }, 300);
  } catch (err) {
    console.error("OTP verify error:", err);
  }
};


  const handleResendOTP = async () => {
    if (!phoneNumber) return;
    const formatted = phoneNumber.startsWith("+91") ? phoneNumber : `+91${phoneNumber}`;
    await loginWithOTP(formatted);
  };

const handleRegister = async (name: string) => {
  try {
    const { data: auth } = await supabase.auth.getUser();
    const authUser = auth?.user;

    if (!authUser?.id) {
      console.error("❌ No authenticated user during registration");
      return;
    }

    const rawPhone = authUser.phone;     // "+91XXXXXXXXXX" ALWAYS AVAILABLE
    if (!rawPhone) {
      console.error("❌ Auth phone missing — cannot register safely");
      return;
    }

    const cleanedPhone = rawPhone.replace("+91", "").trim(); // remove +91 if needed

    const { error } = await supabase.from("users").insert({
      id: authUser.id,
      name: name.trim(),
      phone: cleanedPhone,
      is_active: true,
    });

    if (error) {
      console.error("❌ Registration insert error:", error);
      return;
    }

    setShowRegistrationModal(false);
    setUserName(name.trim());
  } catch (err) {
    console.error("❌ Registration error:", err);
  }
};



  // 📡 FETCH MOCK TEST DATA
  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      setUserId(user.id);
      const { data: rpcData } = await supabase.rpc("get_mock_test_window", {
          p_student_id: user.id,
        });

      if (rpcData) {
        const parsed = rpcData?.get_mock_test_window || rpcData;
        setMockWindow({
          present: parsed.present_mock_test,
          next: parsed.next_mock_test,
          review: parsed.review_tests, // ⬅️ add this line
        });
      }
      const { data: userTests } = await supabase
        .from("user_mock_tests")
        .select("*,mock_test:mock_tests(*)")
        .eq("user_id", user.id)
        .eq("status", "completed")
        .order("completed_at", { ascending: false });
      if (userTests) setCompletedTests(userTests.map(mapToUserMockTest));
    } catch (error) { console.error("Error loading data:", error); }
    finally { setLoading(false); }
  };

  const mapToMockTest = (d: any): MockTest => ({
    id: d.id, title: d.title, description: d.description,
    totalQuestions: d.total_questions, durationMinutes: d.duration_minutes,
    isActive: d.is_active, createdAt: d.created_at,
  });
  const mapToUserMockTest = (d: any): UserMockTest => ({
    id: d.id, userId: d.user_id, mockTestId: d.mock_test_id,
    status: d.status, score: d.score, completedAt: d.completed_at,
    startedAt: d.started_at, createdAt: d.created_at,
    mockTest: d.mock_test ? mapToMockTest(d.mock_test) : undefined,
  });


  // 🔧 Normalize phase data helper (convert string → boolean)
const normalizePhaseData = (data: any) => {
  if (!data?.phase_json) return data;

  const mcqs = Array.isArray(data.phase_json)
    ? data.phase_json
    : [data.phase_json];

  const normalizedMCQs = mcqs.map((q) => ({
    ...q,
    mcq_image: data.mcq_image ?? q.mcq_image,
    is_mcq_image_type:
      typeof (data.is_mcq_image_type ?? q.is_mcq_image_type) === "string"
        ? (data.is_mcq_image_type ?? q.is_mcq_image_type) === "true"
        : Boolean(data.is_mcq_image_type ?? q.is_mcq_image_type),
  }));

  return { ...data, phase_json: normalizedMCQs };
};



const fetchPalette = async () => {
  if (!userId || !phaseData?.exam_serial) {
    console.log("⚠️ Palette fetch blocked → Missing userId or phaseData");
    return;
  }

  const ro = Number(phaseData.react_order_final);
  console.log("🎨 Fetching palette for react_order_final:", ro);

  // Determine section range
  const sectionStart =
    ro <= 40 ? 1 :
    ro <= 80 ? 41 :
    ro <= 120 ? 81 :
    ro <= 160 ? 121 : 161;

  const sectionEnd = sectionStart + 39;

  console.log("🎯 Palette range:", sectionStart, "→", sectionEnd);

const { data, error } = await supabase.rpc("palette_mocktest", {
  p_student_id: userId,
  p_exam_serial: phaseData.exam_serial,
  p_section_start: sectionStart,
  p_section_end: sectionEnd,
});
console.log("🎨 PALETTE RPC INPUT:", {
  p_student_id: userId,
  p_exam_serial: phaseData.exam_serial,
  p_section_start: sectionStart,
  p_section_end: sectionEnd,
});

if (error) {
  console.log("❌ PALETTE RPC ERROR:", error);
} else {
  console.log("🟢 PALETTE RPC SUCCESS:", data);
}


  if (error) {
    console.log("❌ Palette RPC error:", error);
    return;
  }

  console.log("🟢 Palette RPC result:", data);

 setPaletteData(data);
console.log("📦 Stored paletteData:", data);

};



  // ───────────────────────────────────────────────
  // 🧭 TEST ACTION HANDLERS  (start / next / skip)
  // ───────────────────────────────────────────────
  const handleStartTest = async (exam_serial: string) => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    // 🔒 Prevent starting future tests before their date
      if (mockWindow?.next && mockWindow.next.exam_serial === exam_serial) {
        const today = new Date();
        const testDate = new Date(mockWindow.next.exam_date);
        if (today < testDate) {
          Alert.alert("Locked", "This test will unlock on its scheduled date.");
          return;
        }
      }

console.log("📤 Calling FASTAPI start_mocktest:", {
  student_id: userId,
  exam_serial,
});

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
      console.log("🧠 Orchestrator start result:", data);
      const normalized = normalizePhaseData(data);
      console.log("📥 FASTAPI start_mocktest RESPONSE:", data);
console.log("📥 Normalized response:", normalized);
console.log("📘 Returned react_order_final:", normalized.react_order_final);
console.log("⏱ Returned time_left:", normalized.time_left);


    if (normalized?.phase_json) {
      setTestStarted(true);

setPhaseData(normalized);
setCurrentMCQ(normalized.phase_json[0]);
      scrollRef.current?.scrollTo({ y: 0, animated: true });



      setSelectedOption(null);
        // 🕒 Initialize timer to 3 hours 30 minutes
      // 🕒 Initialize timer based on backend value (resume or new)
// 🔥 FIXED TIMER LOGIC
const ro = Number(normalized.react_order_final);
console.log("⏳ INITIALIZING TIMER → react_order_final:", ro);

if ([1, 41, 81, 121, 161].includes(ro)) {
  console.log("⏳ NEW SECTION → timer start = 42:00");
  setRemainingTime(42 * 60);
} else if (normalized.time_left) {
  console.log("⏳ RESUMING TIMER FROM:", normalized.time_left);

 const [h, m, s] = normalized.time_left.split(":").map(Number);
setRemainingTime(h * 3600 + m * 60 + s);


}

      } else {
        Alert.alert("Test Completed", data?.message || "No more questions.");
      }
    } catch (error) {
      console.error("Error starting test:", error);
      Alert.alert("Error", "Could not start mock test. Please try again.");
    }
  };

// Helper function to format seconds → HH:MM:SS
const formatTime = (seconds: number) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const handleNext = async () => {
  const currentRO = Number(phaseData.react_order_final);

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
          react_order_final: currentRO,
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
      setSelectedOption(null);
    }

    // 🔥 ONLY UI DECISION AFTER SUBMIT
    if (isSectionEnd(currentRO)) {
      setShowSectionConfirm(true);
      return;
    }

    if (normalized.time_left) {
      const [h, m, s] = normalized.time_left.split(":").map(Number);
      setRemainingTime(h * 3600 + m * 60 + s);
    }

    scrollRef.current?.scrollTo({ y: 0, animated: true });

  } catch (err) {
    console.error("❌ Error in handleNext:", err);
  }
};




const handleSelectQuestion = async (targetRO: number) => {
  if (!targetRO || !phaseData?.exam_serial) return;

  const { data, error } = await supabase.rpc(
    "jump_to_specific_mcq_mocktest",
    {
      p_student_id: userId,
      p_exam_serial: phaseData.exam_serial,
      p_target_ro: targetRO,
      p_time_left: formatTime(remainingTime),
    }
  );

  if (error || !data?.phase_json) return;

  const normalized = normalizePhaseData(data);
  const mcq = normalized.phase_json[0];

  mcq.student_answer = data.student_answer ?? null;

  setSelectedOption(mcq.student_answer);
  setPhaseData(normalized);
  setCurrentMCQ(mcq);
  setShowNav(false);

  scrollRef.current?.scrollTo({ y: 0, animated: true });
};


const handleSkip = async () => {
  console.log("🚨 handleSkip CALLED", {
    ro: phaseData?.react_order_final,
    remainingTime,
    ts: new Date().toISOString(),
  });

  if (testEnded || !phaseData?.exam_serial || !phaseData?.react_order_final)
    return;

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
      const ro = Number(normalized.react_order_final);
      const previousSection = getSection(phaseData.react_order_final);
      const currentSection = getSection(ro);

      if (currentSection !== previousSection) {
        setRemainingTime(42 * 60);
      } else if (normalized.time_left) {
        const [h, m, s] = normalized.time_left.split(":").map(Number);
        setRemainingTime(h * 3600 + m * 60 + s);
      }

      setPhaseData(normalized);
      setCurrentMCQ(normalized.phase_json[0]);
      setSelectedOption(null);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } else {
      setTestEnded(true);
      setTestStarted(false);
    }
  } catch (error) {
    console.error("Error skipping question:", error);
  }
};


const handleReview = async () => {
  if (testEnded || !phaseData?.exam_serial || !phaseData?.react_order_final)
    return;

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
          time_left: formatTime(remainingTime),
          is_review: true,   // 🔥 THIS IS THE KEY
        }),
      }
    );

    const data = await response.json();
    const normalized = normalizePhaseData(data);

    if (normalized?.phase_json) {
      setTestStarted(true);
      setPhaseData(normalized);
      setCurrentMCQ(normalized.phase_json[0]);
      setSelectedOption(null);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  } catch (err) {
    console.error("Error marking review:", err);
  }
};

const handleGoToNextSection = async () => {
  const nextRO = getNextSectionStart(phaseData.react_order_final);
  if (!nextRO) return;

  const { data, error } = await supabase.rpc(
    "jump_to_specific_mcq_mocktest",
    {
      p_student_id: userId,
      p_exam_serial: phaseData.exam_serial,
      p_target_ro: nextRO,
      p_time_left: formatTime(remainingTime),
    }
  );

  if (!error && data?.phase_json) {
    const normalized = normalizePhaseData(data);
    setPhaseData(normalized);
    setCurrentMCQ(normalized.phase_json[0]);
    setRemainingTime(42 * 60);
    setSelectedOption(null);
    setShowNav(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }
};


  const sanitize = (text: string) =>
    text?.replace(/(\*\*|__|_|`|~|\*)/g, "").trim();
// 🔥 Compute Section from react_order
const getSection = (react_order: number) => {
  if (react_order >= 1 && react_order <= 40) return "A";
  if (react_order >= 41 && react_order <= 80) return "B";
  if (react_order >= 81 && react_order <= 120) return "C";
  if (react_order >= 121 && react_order <= 160) return "D";
  if (react_order >= 161 && react_order <= 200) return "E";
  return null;
};

// 🔥 Compute section question number (1–40)
const getSectionQNumber = (react_order: number) => {
  return ((react_order - 1) % 40) + 1;
};
const isSectionEnd = (ro: number) =>
  [40, 80, 120, 160].includes(Number(ro));
  
  
  // ───────────────────────────────────────────────
  // 🎨 MAIN RENDER BODY
  // ───────────────────────────────────────────────
  return (
    <MainLayout>
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
        {!isLoggedIn ? (
          <MockTestsLanding onSignUp={() => setShowLoginModal(true)} />
        ) : !testStarted ? (
          <MocktestDashboard
            userId={userId}
            mockWindow={mockWindow}
            completedTests={completedTests}
            onStartTest={(exam_serial) => router.push(`/testsections?exam_serial=${exam_serial}`)}
            onReviewTest={(exam_serial) => router.push(`/reviewmocktest?exam_serial=${exam_serial}`)}
            loading={loading}
          />
        ) : testEnded ? (
          <View style={styles.endedContainer}>
            <Text style={styles.endedTitle}>Test Ended</Text>
            <Text style={styles.endedSubtitle}>All questions completed 🎯</Text>
          </View>
        ) : currentMCQ ? (
          <>
            {/* Header inside test */}
            <View style={styles.headerTop}>
                <View style={styles.questionInfo}>
                  <View style={styles.sectionBadge}>
                    <Text style={styles.sectionText}>Section {getSection(phaseData?.react_order_final || 1)}</Text>
                  </View>
                  <View style={styles.questionBadge}>
                    <Text style={styles.questionCounter}>
                      Q {getSectionQNumber(phaseData?.react_order_final || 1)}/40
                    </Text>
                  </View>
                </View>

                <View style={styles.headerRight}>
                  <View style={styles.timerContainer}>
                    <Clock size={16} color="#4ade80" strokeWidth={2} />
                    <Text style={styles.timer}>
  {remainingTime !== null ? formatTime(remainingTime) : "--:--"}
</Text>

                  </View>
                  <TouchableOpacity
                    style={styles.navButton}
                    onPress={async () => {
  console.log("🟩 Palette icon clicked → Fetching palette...");
  await fetchPalette();
  console.log("🟩 Palette data loaded → Opening palette UI");
  setShowNav(true);
}}


                  >
                    <Grid3x3 size={18} color="#4ade80" />
                  </TouchableOpacity>
                </View>
              </View>

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
        <Text style={styles.imagePlaceholderText}>
          Image not available
        </Text>
      </View>
    )}
  </View>
)}


            <View style={styles.questionBubble}>
              <Markdown style={markdownStyles}>{currentMCQ.stem}</Markdown>
            </View>

            <View style={styles.optionsContainer}>
              {Object.entries(currentMCQ.options).map(([key, value]) => {
    const effectiveSelected =
      selectedOption ??
      currentMCQ?.student_answer ??
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
            {sanitize(value)}
          </Text>
        </View>
      </TouchableOpacity>
    );
})}

            </View>

            <View style={styles.footer}>
             <TouchableOpacity
  style={[
    styles.skipButton,
  ]}
  onPress={handleSkip}           // ← always allowed
  disabled={false}               // ← skip is never disabled
  activeOpacity={0.7}
>


                <SkipForward size={20} color="#94a3b8" strokeWidth={2} />
                <Text style={styles.skipButtonText}>Skip</Text>
              </TouchableOpacity>

              <TouchableOpacity
  style={[
    styles.reviewButton,
    selectedOption ? { opacity: 0.3 } : {}
  ]}
  onPress={selectedOption ? undefined : handleReview}  // ❌ disable
  disabled={!!selectedOption}                          // ❌ disable
  activeOpacity={0.7}
>

                <Text style={styles.reviewButtonText}>Review</Text>
              </TouchableOpacity>

{Number(phaseData?.react_order_final) >= 161 && Number(phaseData?.react_order_final) <= 200 && (
  <TouchableOpacity
    style={styles.finishTestButton}
    onPress={() => setShowConfirmFinish(true)} 
    activeOpacity={0.7}
  >
    <Text style={styles.finishTestButtonText}>Finish Test</Text>
  </TouchableOpacity>
)}

{Number(phaseData?.react_order_final) === 200 ? (
  <TouchableOpacity
    style={[
      styles.nextButton,
      !selectedOption && styles.nextButtonDisabled,
    ]}
    onPress={async () => {
      if (!selectedOption) return;

      try {
        // ✅ Send final update to backend just like "Next"
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
        console.log("✅ Final question submitted:", data);

        // 🧠 Optional: you can verify if test really ended here
        if (data?.message?.includes("completed") || !data?.phase_json) {
          setShowCompletionModal(true);
        } else {
          // fallback: still show modal
          setShowCompletionModal(true);
        }
      } catch (error) {
        console.error("❌ Error completing test:", error);
        Alert.alert("Error", "Could not submit final question.");
      }
    }}
    disabled={!selectedOption}
    activeOpacity={0.7}
  >
    <Text style={styles.nextButtonText}>Complete Test</Text>
    <ChevronRight size={20} color="#000" strokeWidth={2.5} />
  </TouchableOpacity>
) : (
  <TouchableOpacity
    style={[
      styles.nextButton,
      !selectedOption && styles.nextButtonDisabled,
    ]}
    onPress={handleNext}
    disabled={!selectedOption}
    activeOpacity={0.7}
  >
    <Text style={styles.nextButtonText}>Next</Text>
    <ChevronRight size={20} color="#000" strokeWidth={2.5} />
  </TouchableOpacity>
)}


            </View>

            {/* Question Navigation - Mobile Modal */}
            {console.log("🧭 Passing paletteData to UI:", paletteData)}

            <QuestionNavigationScreen
              isVisible={showNav}
              onClose={() => setShowNav(false)}
              onStartNextSection={handleGoToNextSection}
              currentQuestion={phaseData?.section_q_number || 1}
              mcqs={paletteData?.mcqs || []}
              counts={paletteData?.counts || { answered: 0, skipped: 0, marked: 0, unanswered: 0 }}
              sectionId={phaseData?.sections || "A"}
              timeLeft={remainingTime}
              onSelectQuestion={handleSelectQuestion}
              isSectionComplete={isSectionEnd(phaseData?.react_order_final)}
            />
          </>
        ) : (
          <Text style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
            Loading next question...
          </Text>
        )}
      </ScrollView>
            {/* 🔐 AUTH MODALS */}
      <LoginModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSendOTP={handleSendOTP}
      />
      <OTPModal
        visible={showOTPModal}
        phoneNumber={phoneNumber}
        onClose={() => setShowOTPModal(false)}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
      />
      <RegistrationModal
  visible={showRegistrationModal}
  onClose={() => {}}
  onRegister={handleRegister}
/>

{/* ⚠️ Finish Test Confirmation Modal */}
{showConfirmFinish && (
  <View style={styles.modalOverlay}>
    <Animated.View style={styles.completionModal}>
      <Text style={styles.modalTitle}>Finish Test?</Text>
      <Text style={styles.modalSubtitle}>
        Are you sure you want to submit all answers?
      </Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        
        {/* Continue Test */}
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: "#334155" }]}
          onPress={() => setShowConfirmFinish(false)}
        >
          <Text style={[styles.modalButtonText, { color: "#fff" }]}>
            Continue Test
          </Text>
        </TouchableOpacity>

        {/* Complete Test */}
        <TouchableOpacity
          style={styles.modalButton}
          onPress={async () => {
            try {
              const { data, error } = await supabase.rpc("test_complete", {
                p_student_id: userId,
                p_exam_serial: phaseData.exam_serial,
              });

              if (error) {
                Alert.alert("Error", "Could not complete test.");
                return;
              }

              setShowConfirmFinish(false);
              setShowCompletionModal(true);
            } catch (err) {
              Alert.alert("Error", "Could not complete test.");
            }
          }}
        >
          <Text style={styles.modalButtonText}>Complete Test</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </View>
)}

{/* ⚠️ Section Completion Modal */}
{showSectionConfirm && (
  <View style={styles.modalOverlay}>
    <Animated.View style={styles.completionModal}>
      <Text style={styles.modalTitle}>Section Completed</Text>
      <Text style={styles.modalSubtitle}>
        What would you like to do next?
      </Text>

      <View style={{ flexDirection: "row", gap: 12 }}>
        
        {/* Review this section */}
        <TouchableOpacity
          style={[styles.modalButton, { backgroundColor: "#334155" }]}
          onPress={() => {
            console.log("🟨 SECTION REVIEW CLICKED — NO RPC FIRED");
            
            // ✅ Just close modal
            // ✅ Stay on same question (Q40 / Q80 / Q120 / Q160)
            // ✅ Do NOT touch backend
            setShowSectionConfirm(false);
          }}
        >
          <Text style={[styles.modalButtonText, { color: "#fff" }]}>
            Review this section
          </Text>
        </TouchableOpacity>


        {/* Complete Test */}
        <TouchableOpacity
          style={styles.modalButton}
          onPress={async () => {
            try {
              setShowSectionConfirm(false);
        
const nextRO = getNextSectionStart(phaseData.react_order_final);
if (!nextRO) return;

const { data, error } = await supabase.rpc(
  "jump_to_specific_mcq_mocktest",
  {
    p_student_id: userId,
    p_exam_serial: phaseData.exam_serial,
    p_target_ro: nextRO,
    p_time_left: formatTime(remainingTime),
  }
);

if (!error && data?.phase_json) {
  const normalized = normalizePhaseData(data);
  setPhaseData(normalized);
  setCurrentMCQ(normalized.phase_json[0]);
  setRemainingTime(42 * 60);
  setSelectedOption(null);
  scrollRef.current?.scrollTo({ y: 0, animated: true });
}


            } catch (err) {
              Alert.alert("Error", "Could not complete test.");
            }
          }}
        >
          <Text style={styles.modalButtonText}>Go to Next Section</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  </View>
)}
      
      {/* ✅ Completion Modal */}
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
        activeOpacity={0.8}
      >
        <Text style={styles.modalButtonText}>Go Back</Text>
      </TouchableOpacity>
    </Animated.View>
  </View>
)}

    </SafeAreaView>
      </MainLayout>
  );
}

// ───────────────────────────────────────────────
// 💅 STYLES — (IDENTICAL TO YOUR DESIGN)
// ───────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: { fontSize: 14, color: "#888", fontWeight: "500" },
  scrollView: { flex: 1 },
  contentContainer: { padding: 20 },

  // In-test UI
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  questionInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
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
    letterSpacing: 0.5,
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
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
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
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    backgroundColor: "#1a1f26",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    overflow: "hidden",
  },
  imagePlaceholder: {
  height: 250,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#0f172a",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#334155",
},
imagePlaceholderText: {
  color: "#94a3b8",
  fontSize: 14,
  fontStyle: "italic",
},
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
  optionSelected: { backgroundColor: "#1e3a28", borderColor: "#4ade80" },
  optionContent: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  optionCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#2d3748",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  optionCircleSelected: { backgroundColor: "#4ade80" },
  optionLabel: { fontSize: 16, fontWeight: "700", color: "#94a3b8" },
  optionLabelSelected: { color: "#000" },
  optionText: { flex: 1, fontSize: 15, lineHeight: 22, color: "#cbd5e1" },
  optionTextSelected: { color: "#e2e8f0", fontWeight: "500" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    backgroundColor: "#1a1f26",
    borderTopWidth: 1,
    borderTopColor: "#2d3748",
    gap: 12,
    marginTop: 24,
    borderRadius: 12,
  },
  skipButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#1e293b",
    gap: 8,
  },
  skipButtonText: { fontSize: 16, fontWeight: "600", color: "#94a3b8" },
  reviewButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#334155",
    gap: 8,
  },
  reviewButtonText: { fontSize: 16, fontWeight: "600", color: "#fbbf24" },
  finishTestButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: "#ef4444",
    gap: 8,
  },
  finishTestButtonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  nextButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: "#4ade80",
    gap: 8,
  },
  nextButtonDisabled: { backgroundColor: "#334155", opacity: 0.5 },
  nextButtonText: { fontSize: 16, fontWeight: "700", color: "#000" },
  endedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.8)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
},
completionModal: {
  backgroundColor: "#1a1f26",
  padding: 30,
  borderRadius: 20,
  alignItems: "center",
  width: "80%",
  borderWidth: 1,
  borderColor: "#4ade80",
  shadowColor: "#4ade80",
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 10,
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
  marginBottom: 25,
},
modalButton: {
  backgroundColor: "#4ade80",
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 10,
},
modalButtonText: {
  color: "#000",
  fontWeight: "700",
  fontSize: 16,
},
  endedTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#e2e8f0",
    marginBottom: 8,
  },
  endedSubtitle: { fontSize: 16, color: "#94a3b8" },
});

// ───────────────────────────────────────────────
// Markdown text style
// ───────────────────────────────────────────────
const markdownStyles = {
  body: { color: "#e2e8f0", fontSize: 16, lineHeight: 24 },
  strong: { color: "#f8fafc", fontWeight: "700" },
  em: { fontStyle: "italic", color: "#e2e8f0" },
  paragraph: { marginBottom: 0 },
};
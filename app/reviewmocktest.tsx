// app/reviewmocktest.tsx
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import BookmarkButton from "@/components/common/BookmarkButton";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MessageInput } from "@/components/chat/MessageInput";
import { StudentBubble } from "@/components/chat/StudentBubble";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import { useRouter } from "expo-router";
import { Image } from "react-native";
import { Grid3x3 } from "lucide-react-native";
import MockTestReviewPalette from "@/components/types/MockTestReviewPalette";
import MCQCategorySelector from "@/components/common/MCQCategorySelector";
import ConfettiCannon from "react-native-confetti-cannon";
import ZoomableImage from "@/components/common/ZoomableImage";




export default function ReviewMockTest() {
  const { exam_serial } = useLocalSearchParams();
  const { user } = useAuth();
  const studentId = user?.id;
  const [currentMCQ, setCurrentMCQ] = useState<any | null>(null);
  const [phaseData, setPhaseData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [reactOrder, setReactOrder] = useState(1);
  const [lastPhase, setLastPhase] = useState<any | null>(null);
  // 💬 Chat-related states
const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
const [isSending, setIsSending] = useState(false);
  const [reviewCompleteVisible, setReviewCompleteVisible] = useState(false);
  const [paletteVisible, setPaletteVisible] = useState(false);
  const [paletteData, setPaletteData] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showConfetti, setShowConfetti] = useState(false);

  const router = useRouter();

    const ORCHESTRATOR_URL =
    "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate";

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
  if (!studentId || !exam_serial) return;
  setReactOrder(1);            // ✅ Reset to first question
  startReview();                // ✅ Always begin from Q1
}, [studentId, exam_serial]);

useEffect(() => {
  if (!currentMCQ) return;
  // 🟦 DEBUG — Log the entire MCQ object
console.log("📌 REVIEW MODE → Current MCQ Object:");
try {
  console.log("🧩 MCQ Full Object:", JSON.stringify(currentMCQ, null, 2));
} catch (e) {
  console.log("🧩 MCQ Raw:", currentMCQ);
}

console.log("🖼 is_mcq_image_type:", currentMCQ.is_mcq_image_type);
console.log("🖼 mcq_image:", currentMCQ.mcq_image);
console.log("🖼 phase_json:", currentMCQ.phase_json);
console.log("🔠 options:", currentMCQ.options);
console.log("🔑 correct_answer:", currentMCQ.correct_answer);


  const loadConversationForCurrentMCQ = async () => {
    const mcqId = currentMCQ?.mcq_id ?? currentMCQ?.uuid;


    console.log("🔍 ---- CHAT LOAD TRIGGERED ----");
    console.log("📌 currentMCQ:", currentMCQ);
    console.log("📌 mcq_id:", mcqId);
    console.log("📌 studentId:", studentId);
    console.log("📌 exam_serial:", Number(exam_serial));
    console.log("----------------------------------");

    if (!mcqId || !studentId) {
      console.log("⚠️ No mcqId or studentId → clearing chat");
      setConversation([]);
      return;
    }

    const { data, error } = await supabase
      .from("mock_test_review_conversation")
      .select("id, conversation_log, mcq_id, exam_serial, student_id")
      .eq("student_id", studentId)
      .eq("exam_serial", Number(exam_serial))
      .eq("mcq_id", mcqId)
      .maybeSingle();

    console.log("🟦 Supabase fetch result:", data);
    console.log("🟥 Supabase error:", error);

    if (data?.conversation_log) {
  console.log("✅ Loaded conversation_log (raw):", data.conversation_log);

  let parsedLog = [];
  try {
    // Defensive parse for stringified JSON
    if (typeof data.conversation_log === "string") {
      parsedLog = JSON.parse(data.conversation_log);
      if (typeof parsedLog === "string") parsedLog = JSON.parse(parsedLog); // double decode safeguard
    } else if (Array.isArray(data.conversation_log)) {
      parsedLog = data.conversation_log;
    }
  } catch (err) {
    console.error("💥 Failed to parse conversation_log:", err);
  }

  console.log("✅ Parsed conversation_log:", parsedLog);
  setConversation(parsedLog || []);
} else {
  console.log("❌ No conversation found for this MCQ");
  setConversation([]);
}

  };

  // STEP 1 — clear old chat
  console.log("🗑 Clearing previous chat...");
  setConversation([]);

  // STEP 2 — load chat
  loadConversationForCurrentMCQ();

}, [currentMCQ]);


const startReview = async () => {
  try {
    setLoading(true);

    const { data, error } = await supabase.rpc(
      "jump_to_specific_mcq_mocktest_v2",
      {
        p_student_id: studentId,
        p_exam_serial: Number(exam_serial),
        p_target_ro: reactOrder,
      }
    );

    if (error) {
      console.error("❌ startReview V2 RPC error:", error);
      return;
    }

    console.log("🧠 startReview RPC V2:", data);

    if (!data) {
      Alert.alert("End of Review", "No MCQs found.");
      return;
    }

    setPhaseData(data);
    setLastPhase(data);

    const mcq = {
      ...data,
      ...data.phase_json?.[0],
      status: data.status,
      student_answer: data.student_answer,
      is_mcq_image_type: data.is_mcq_image_type,
      mcq_image: data.mcq_image,
    };

    setCurrentMCQ(mcq);

  } catch (err) {
    console.error("❌ Review fetch error:", err);
  } finally {
    setLoading(false);
  }
};

const detectMCQCategory = (mcq: any): string => {
  if (!mcq) return 'all';

  if (mcq.is_correct === true || mcq.status === 'correct') return 'correct';
  if (mcq.is_correct === false || mcq.status === 'wrong') return 'wrong';
  if (mcq.status === 'skipped') return 'skipped';
  if (mcq.status === 'marked') return 'marked';
  if (mcq.status === 'unanswered' || !mcq.student_answer) return 'unanswered';

  return 'all';
};


  const fetchReviewPaletteData = async () => {
    if (!studentId || !exam_serial) {
      console.log("⚠️ Review palette fetch blocked → Missing studentId or exam_serial");
      return;
    }

    console.log("🎨 Fetching review palette for exam_serial:", exam_serial);

    const { data, error } = await supabase.rpc("palette_mocktest_review_enhanced_v2", {
      p_student_id: studentId,
      p_exam_serial: Number(exam_serial),
    });

    if (error) {
      console.log("❌ Review Palette RPC error:", error);
      return;
    }

    console.log("🟢 Review Palette RPC result:", data);
    const
result = data?.
palette_mocktest_review_enhanced_v2
|| data;
    setPaletteData(data);
  };

  useEffect(() => {
    if (studentId && exam_serial) {
      fetchReviewPaletteData();
    }
  }, [studentId, exam_serial]);

const handleNext = async () => {
  const currentReactOrder =
    phaseData?.react_order_final || lastPhase?.react_order_final;

  if (!currentReactOrder) return;

  // Find next MCQ in the active category
  if (activeCategory !== 'all' && paletteData?.mcqs) {
    const filteredMCQs = paletteData.mcqs.filter((mcq: any) => {
      switch (activeCategory) {
        case 'correct':
          return mcq.is_correct === true || mcq.status === 'correct';
        case 'wrong':
          return mcq.is_correct === false || mcq.status === 'wrong';
        case 'skipped':
          return mcq.status === 'skipped';
        case 'marked':
          return mcq.status === 'marked';
        case 'unanswered':
          return mcq.status === 'unanswered' || !mcq.student_answer;
        default:
          return true;
      }
    });

    const currentIndex = filteredMCQs.findIndex(
      (mcq: any) => mcq.react_order_final === currentReactOrder
    );

    if (currentIndex >= 0 && currentIndex < filteredMCQs.length - 1) {
      const nextMCQ = filteredMCQs[currentIndex + 1];
      setReactOrder(nextMCQ.react_order_final);

      // Fetch the next MCQ
      try {
        const { data, error } = await supabase.rpc(
          "jump_to_specific_mcq_mocktest_v2",
          {
            p_student_id: studentId,
            p_exam_serial: Number(exam_serial),
            p_target_ro: nextMCQ.react_order_final,
          }
        );

        if (!error && data) {
          setPhaseData(data);
          setLastPhase(data);
          const mcq = {
            ...data,
            ...data.phase_json?.[0],
            status: data.status,
            student_answer: data.student_answer,
            is_mcq_image_type: data.is_mcq_image_type,
            mcq_image: data.mcq_image,
          };
          setCurrentMCQ(mcq);
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }
      } catch (err) {
        console.error("❌ Error fetching next MCQ:", err);
      }
      return;
    } else {
  console.log("🔁 Category finished → Resetting to ALL + MCQ 1");

  // 1️⃣ Switch category to ALL mode
  setActiveCategory("all");

  // 2️⃣ Reset to first question
  setReactOrder(1);

  // 3️⃣ Fetch MCQ 1 using same V2 RPC
  try {
    const { data, error } = await supabase.rpc(
      "jump_to_specific_mcq_mocktest_v2",
      {
        p_student_id: studentId,
        p_exam_serial: Number(exam_serial),
        p_target_ro: 1,
      }
    );

    if (!error && data) {
      const mcq = {
        ...data,
        ...data.phase_json?.[0],
        status: data.status,
        student_answer: data.student_answer,
        is_mcq_image_type: data.is_mcq_image_type,
        mcq_image: data.mcq_image,
      };

      setPhaseData(data);
      setLastPhase(data);
      setCurrentMCQ(mcq);

      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  } catch (err) {
    console.error("❌ Error resetting to ALL mode:", err);
  }

  return;
}

  }

  // Default: go to next in sequence (all mode)
  const response = await fetch(ORCHESTRATOR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intent: "next_review_mocktest",
      student_id: studentId,
      exam_serial: Number(exam_serial),
      react_order: currentReactOrder,
    }),
  });

  const data = await response.json();
  console.log("➡️ Next Review Data:", data);

  // ⭐ End of review
  if (data?.message === "review_complete") {
  setReviewCompleteVisible(true);
  return;
}


  // Normal flow
  if (!data?.phase_json?.length) return;

  setPhaseData(data);
  setLastPhase(data);
  setCurrentMCQ(data.phase_json[0]);

  scrollRef.current?.scrollTo({ y: 0, animated: true });
};



const handleSelectOption = (key: string, correctAnswer: string) => {

if (key === correctAnswer) {
  setShowConfetti(true);
  setTimeout(() => setShowConfetti(false), 2500);
}
};


  // 🧠 Send message to mentor during review
const handleSendMessage = async (text: string) => {
  if (!text.trim() || !studentId || isSending) return;
  setIsSending(true);
  setConversation((prev) => [...prev, { role: "student", content: text }]);

  try {
    const mcqId =
  currentMCQ?.mcq_id ??          // if backend someday sends mcq_id
  currentMCQ?.uuid ??            // ⭐ THIS is the actual MCQ id from review RPC
  phaseData?.mcq_id ??
  phaseData?.phase_json?.[0]?.uuid ??
  null;


    const stemText =
      currentMCQ?.stem ??
      phaseData?.phase_json?.[0]?.stem ??
      "No stem found";

    const res = await fetch(ORCHESTRATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        intent: "chat_review_mocktest",
        student_id: studentId,
        exam_serial: Number(exam_serial),
        mcq_id: mcqId,
        phase_json: { stem: stemText },
        message: text,
      }),
    });

    const data = await res.json();
    console.log("💬 Review Chat Response:", data);

    if (data?.mentor_reply) {
      setConversation((prev) => [
        ...prev,
        { role: "mentor", content: data.mentor_reply },
      ]);
    }
  } catch (err) {
    console.error("💥 Chat send error:", err);
  } finally {
    setIsSending(false);
  }
};


  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator color="#25D366" size="large" />
        <Text style={{ color: "#aaa", marginTop: 8 }}>Loading review...</Text>
      </View>
    );

  if (!currentMCQ)
    return (
      <View style={styles.center}>
        <Text style={{ color: "#aaa" }}>No data found for this review.</Text>
      </View>
    );

  const isCorrect = currentMCQ.is_correct;
  const selectedAnswer = currentMCQ.student_answer;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }} edges={["top"]}>
          {/* 🔢 Header Row with Counter and Palette Button */}
    <View style={styles.headerRow}>
      <View style={styles.counterWrapperInline}>
        <Text style={styles.counterText}>
          {phaseData?.react_order_final} / 200
        </Text>
      </View>

      <Pressable style={styles.paletteButton} onPress={() => setPaletteVisible(true)}>
        <Grid3x3 size={20} color="#25D366" strokeWidth={2} />
      </Pressable>
    </View>

    {/* 📊 Category Selector */}
    {paletteData?.counts && (
      <MCQCategorySelector
        activeCategory={activeCategory as any}
        counts={{
          all: paletteData.counts.correct + paletteData.counts.wrong + paletteData.counts.skipped + paletteData.counts.unanswered + paletteData.counts.marked,
          correct: paletteData.counts.correct,
          wrong: paletteData.counts.wrong,
          skipped: paletteData.counts.skipped,
          marked: paletteData.counts.marked,
          unanswered: paletteData.counts.unanswered,
        }}
        onCategoryChange={(category) => {
          console.log("📂 Category changed:", category);
          setActiveCategory(category);
        }}
      />
    )}

{phaseData?.is_mcq_image_type && phaseData?.mcq_image && (
  <View
    style={{
      marginBottom: 16,
      paddingHorizontal: 16,
      borderRadius: 12,
      overflow: "hidden",
      backgroundColor: "#111",
    }}
  >
    <ZoomableImage uri={phaseData.mcq_image} height={300} />
  </View>
)}




      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* 🧠 Mentor intro bubble */}
        <View style={styles.mentorBubble}>
          <Text style={styles.mentorText}>
            Reviewing your test answers — observe the correct explanations carefully 👇
          </Text>
        </View>

        {/* 🧩 Question card */}
        <View style={styles.mcqCard}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.mcqStem}>{currentMCQ.stem}</Text>
            <BookmarkButton onToggle={() => {}} />
          </View>
        </View>

{(() => {
  const correctAnswer =
    currentMCQ.correct_answer ??
    phaseData?.phase_json?.[0]?.correct_answer ??
    null;

  // Show solution ONLY after user taps
  const shouldShowSolution = !!currentMCQ._tapAnswer;

  return (
    <>
      {/* OPTIONS */}
      {Object.entries(currentMCQ.options).map(([key, value]) => {
        const isCorrect = key === correctAnswer;
        const isSelected = key === currentMCQ._tapAnswer;

        let optionStyle = [styles.optionButton];

        // After tap → apply colors
        if (currentMCQ._tapAnswer) {
          if (isCorrect) optionStyle.push(styles.optionCorrect);
          if (isSelected && !isCorrect) optionStyle.push(styles.optionWrong);
        }

        return (
          <Pressable
            key={key}
            onPress={() => {
              // temporary – stays only for this MCQ
              currentMCQ._tapAnswer = key;

              // fire re-render
              setPhaseData({ ...phaseData });

              // confetti only on tap & only if correct
              if (key === correctAnswer) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2500);
              }
            }}
            style={optionStyle}
          >
            <Text style={styles.optionLabel}>{key}</Text>
            <Text style={styles.optionText}>{value}</Text>
          </Pressable>
        );
      })}

      {/* SOLUTIONS SECTION */}
      {shouldShowSolution && (
        <>
          {/* ORIGINAL EXAM ANSWER */}
          {currentMCQ.student_answer && (
            <View style={styles.correctAnswerCard}>
              <Text style={styles.correctTitle}>Your Exam Answer</Text>
              <Text style={styles.correctText}>
                {currentMCQ.student_answer} —{" "}
                {currentMCQ.options[currentMCQ.student_answer]}
              </Text>
            </View>
          )}

          {/* CORRECT ANSWER */}
          <View style={styles.correctAnswerCard}>
            <Text style={styles.correctTitle}>Correct Answer</Text>
            <Text style={styles.correctText}>
              {correctAnswer} — {currentMCQ.options[correctAnswer]}
            </Text>
          </View>

          {/* LEARNING GAP */}
          {currentMCQ.learning_gap && (
            <View style={styles.learningGapCard}>
              <Text style={styles.learningGapTitle}>Learning Gap</Text>
              <Text style={styles.learningGapText}>
                {currentMCQ.learning_gap}
              </Text>
            </View>
          )}

          {/* HIGH YIELD FACTS */}
          {currentMCQ.high_yield_facts && (
            <View style={{ marginTop: 12 }}>
              <Text style={styles.correctTitle}>High Yield Facts</Text>
              <MentorBubbleReply markdownText={currentMCQ.high_yield_facts} />
            </View>
          )}
        </>
      )}
    </>
  );
})()}


        {/* 🗨️ Mentor–Student Chat */}
{Array.isArray(conversation) &&
  conversation
    .filter((msg) => msg && typeof msg === "object" && msg.role && msg.content)
    .map((msg, idx) =>
      msg.role === "student" ? (
        <StudentBubble key={idx} text={msg.content} />
      ) : (
        <MentorBubbleReply key={idx} markdownText={msg.content} />
      )
    )}





        {/* 💬 Chat-style footer */}
        <View style={styles.nextPrompt}>
          <Text style={styles.promptText}>
            <Text style={styles.bold}>Ask Dr Murali Bharadwaj Sir</Text>{" "}
            by typing your question in the chat box, or simply click{" "}
            <Text style={styles.bold}>Next →</Text> to continue reviewing.
          </Text>

          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </Pressable>
        </View>
        
      </ScrollView>
      {/* 💬 Message input for mentor Q&A */}
<MessageInput
  placeholder={
    isSending
      ? "Waiting for mentor..."
      : "Ask your doubt about this question..."
  }
  disabled={isSending}
  onSend={handleSendMessage}
/>
{/* ⭐ Review Complete Popup */}
{reviewCompleteVisible && (
  <View style={styles.popupOverlay}>
    <View style={styles.popupCard}>
      <Text style={styles.popupTitle}>Review Complete 🎉</Text>
      <Text style={styles.popupDesc}>
        You have reviewed all 200 questions!
      </Text>

      <Pressable
  onPress={() => {
    setReviewCompleteVisible(false);
    router.back();
  }}
  style={styles.popupButton}
>
  <Text style={styles.popupButtonText}>Go Back</Text>
</Pressable>

    </View>
  </View>
)}


      {/* 🎨 Review Palette Modal */}
      <MockTestReviewPalette
        mcqs={paletteData?.mcqs || []}
        counts={paletteData?.counts || { correct: 0, wrong: 0, skipped: 0, marked: 0, unanswered: 0 }}
        onSelectQuestion={async (reactOrderFinal, category) => {
          console.log("🎯 Palette selected:", reactOrderFinal, category);
          setActiveCategory(category);
          setReactOrder(reactOrderFinal);
          setPaletteVisible(false);

        // Fetch the selected question via RPC V2
try {
  const { data, error } = await supabase.rpc(
    "jump_to_specific_mcq_mocktest_v2",
    {
      p_student_id: studentId,
      p_exam_serial: Number(exam_serial),
      p_target_ro: reactOrderFinal,
    }
  );

  if (error) {
    console.error("❌ jump_to_specific_mcq_mocktest_v2 error:", error);
    return;
  }

  console.log("🧠 Selected question via RPC V2:", data);

  if (data) {
    const mcq = {
      ...data,
      ...data.phase_json?.[0],
      status: data.status,
      student_answer: data.student_answer,
      is_mcq_image_type: data.is_mcq_image_type,
      mcq_image: data.mcq_image,
    };

    setPhaseData(data);
    setLastPhase(data);
    setCurrentMCQ(mcq);
    mcq.status = mcq.status || "unanswered";

    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }
          } catch (err) {
            console.error("❌ Error fetching selected question:", err);
          }
        }}
        isVisible={paletteVisible}
        onClose={() => setPaletteVisible(false)}
        currentReactOrder={phaseData?.react_order_final}
      />
{showConfetti && (
  <ConfettiCannon 
    count={120}
    origin={{ x: 200, y: -10 }}
    fadeOut={true}
    explosionSpeed={400}
  />
)}

      {/* 🧭 Bottom Navigation */}
      <BottomNav />
    </SafeAreaView>
  );
}

// ────────────────────────────
// 💅 Styles (Chat-style + dark theme)
// ────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  scrollContent: { padding: 16, paddingBottom: 40 },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  mentorBubble: {
    backgroundColor: "#1f1f1f",
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
    maxWidth: "85%",
  },
  mentorText: { color: "#e1e1e1", fontSize: 15, lineHeight: 22 },
  mcqCard: {
    backgroundColor: "#1a3a2e",
    borderLeftWidth: 4,
    borderLeftColor: "#25D366",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  mcqStem: { color: "#e1e1e1", fontSize: 15, lineHeight: 22 },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#2a2a2a",
    backgroundColor: "#1f1f1f",
    padding: 14,
    marginBottom: 10,
  },
  optionLabel: { color: "#25D366", fontWeight: "700", marginRight: 12 },
  optionText: { color: "#e1e1e1", flex: 1 },
  optionCorrect: { borderColor: "#25D366", backgroundColor: "#1a4d2e" },
  optionWrong: { borderColor: "#d32f2f", backgroundColor: "#4d1a1a" },
  feedbackBubble: {
    backgroundColor: "#1f1f1f",
    borderRadius: 16,
    padding: 14,
    marginTop: 8,
    marginBottom: 10,
  },
  feedbackText: { color: "#e1e1e1", fontSize: 15, lineHeight: 22 },
  learningGapCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    padding: 14,
    marginBottom: 12,
  },
  learningGapTitle: {
    color: "#888",
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 6,
    fontSize: 13,
  },
  popupOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

popupCard: {
  width: "80%",
  backgroundColor: "#1f1f1f",
  padding: 20,
  borderRadius: 16,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#333",
},
correctAnswerCard: {
  backgroundColor: "#1a4d2e",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#25D366",
  padding: 14,
  marginBottom: 12,
},

correctTitle: {
  color: "#25D366",
  fontWeight: "700",
  fontSize: 14,
  marginBottom: 6,
  textTransform: "uppercase",
},

correctText: {
  color: "#e1e1e1",
  fontSize: 15,
  lineHeight: 22,
},

popupTitle: {
  color: "#25D366",
  fontSize: 20,
  fontWeight: "700",
  marginBottom: 10,
},

popupDesc: {
  color: "#e1e1e1",
  fontSize: 14,
  textAlign: "center",
  marginBottom: 20,
},

popupButton: {
  backgroundColor: "#25D366",
  paddingVertical: 10,
  paddingHorizontal: 30,
  borderRadius: 10,
},

popupButtonText: {
  color: "#000",
  fontSize: 16,
  fontWeight: "700",
},

  learningGapText: { color: "#b0b0b0", fontSize: 14, lineHeight: 21 },
  nextPrompt: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: "#2a2a2a",
  },
    headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#000',
  },
  counterWrapperInline: {
    backgroundColor: '#1a1f26',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  counterText: {
    color: "#25D366",
    fontWeight: "700",
    fontSize: 16,
  },
  paletteButton: {
    backgroundColor: '#1a1f26',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#25D366',
  },

  promptText: {
    color: "#e1e1e1",
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  nextButton: {
    backgroundColor: "#25D366",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  bold: { fontWeight: "700" },
});

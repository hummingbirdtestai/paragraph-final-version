import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
  ScrollView,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import Markdown from "react-native-markdown-display";
import { ArrowLeft } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MotiView, AnimatePresence } from "moti";
import { useRouter } from "expo-router";
import MCQChatScreen from "@/components/types/MCQScreen";

const API_BASE_URL = "https://battlemcqs-production.up.railway.app";

export default function ReviewBattle() {
  const { title, scheduled_date } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter(); // ✅ REQUIRED
  const [mcqs, setMcqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localAttempts, setLocalAttempts] = useState<Record<string, string>>({});
  const [localResults, setLocalResults] = useState<Record<string, boolean>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAskLoading, setIsAskLoading] = useState(false);


  // ───────────────────────────────
  // 🔹 Fetch MCQs
  // ───────────────────────────────
  useEffect(() => {
    if (!user || !title || !scheduled_date) return;
    console.log("🚀 Fetching Battle MCQs for:", title, scheduled_date, user.id);
    fetchMCQs();
  }, [user, title, scheduled_date]);

  const fetchMCQs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/battle/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title,
          scheduled_date: scheduled_date,
          student_id: user?.id,
        }),
      });
      const data = await res.json();

      if (data.success && Array.isArray(data.mcqs)) {
        const normalized = data.mcqs.map((item: any) => {
          const pj = item.phase_json || {};
          return {
            ...item,
            phase_json: {
              ...pj,
              stem: pj.Stem || pj.stem || "",
              options: pj.Options || pj.options || {},
              correct_answer:
                pj["Correct Answer"] || pj.correct_answer || item.correct_answer,
            },
          };
        });
        setMcqs(normalized);
      }
    } catch (err) {
      console.error("💥 fetchMCQs error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────
  // 🔹 Local Option Selection (with feedback)
  // ───────────────────────────────
  const handleSelectOption = (mcq_id: string, optionKey: string, correct: string) => {
    const isCorrect = optionKey === correct;
    setLocalAttempts((prev) => ({ ...prev, [mcq_id]: optionKey }));
    setLocalResults((prev) => ({ ...prev, [mcq_id]: isCorrect }));
    console.log(`🎯 Local attempt: ${optionKey} → ${isCorrect ? "✅ Correct" : "❌ Wrong"}`);
  };

  const getOptionColor = (option: string): string => {
    const colors: Record<string, string> = {
      A: "#FF6B9D",
      B: "#4ECDC4",
      C: "#FFA07A",
      D: "#9B9EFF",
    };
    return colors[option] || "#888888";
  };

  const handleNext = () => {
    if (currentIndex < mcqs.length - 1) setCurrentIndex((i) => i + 1);
  };
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#00D9FF" size="large" />
        <Text style={styles.loadingText}>Loading Battle Review...</Text>
      </View>
    );
  }

  const current = mcqs[currentIndex];
  if (!current)
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>No MCQs found.</Text>
      </View>
    );

  const phase = current.phase_json || {};
  const mcq_id = current.mcq_id;
  const studentAnswer = current.student_answer || null;
  const correct = phase.correct_answer;

  const localSelected = localAttempts[mcq_id] || null;
  const localCorrect = localResults[mcq_id];

  const isAnsweredRemotely = !!studentAnswer;
  const isCorrectRemote = studentAnswer && studentAnswer === correct;
// 🔧 ADAPTER: make Battle MCQ compatible with MCQChatScreen
const phaseForMCQScreen = {
  ...phase,
  feedback: {
    correct: "",
    wrong: "",
  },
  learning_gap: "",
};
  // ───────────────────────────────
  // 🔹 Render One Question
  // ───────────────────────────────
  return (
    <View style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <ArrowLeft color="#EF4444" size={26} strokeWidth={3} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.dateText}>{scheduled_date}</Text>

        <AnimatePresence exitBeforeEnter>
          <MotiView
            key={currentIndex}
            from={{ opacity: 0, translateX: 30 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: -30 }}
            transition={{ type: "timing", duration: 300 }}
            style={styles.mcqCard}
          >
            {/* Header */}
            <View style={styles.headerRow}>
              <Text style={styles.qNumber}>
                Q{currentIndex + 1}/{mcqs.length}
              </Text>

              {/* Dynamic Badge */}
              {isAnsweredRemotely ? (
                <Text
                  style={[
                    styles.answerBadge,
                    { color: isCorrectRemote ? "#4ade80" : "#ef4444" },
                  ]}
                >
                  {isCorrectRemote ? "✅ Correct" : "❌ Wrong"}
                </Text>
              ) : localSelected ? (
                <Text
                  style={[
                    styles.answerBadge,
                    { color: localCorrect ? "#4ade80" : "#ef4444" },
                  ]}
                >
                  {localCorrect ? "✅ Correct" : "❌ Wrong"}
                </Text>
              ) : (
                <Text style={[styles.answerBadge, { color: "#9CA3AF" }]}>
                  ⏸ Not Attempted
                </Text>
              )}
            </View>

            {/* Question */}
            {typeof phase.stem === "string" && phase.stem.trim() !== "" ? (
              <LinearGradient
                colors={["#1A4D2E", "#2D5F3F"]}
                style={styles.questionBubbleGradient}
              >
                <Markdown style={markdownStyles}>{phase.stem}</Markdown>
              </LinearGradient>
            ) : (
              <Text style={{ color: "#999", marginBottom: 10 }}>
                ⚠️ No question text found.
              </Text>
            )}

            {/* Options */}
            <View style={styles.optionsContainer}>
              {phase.options &&
                Object.entries(phase.options).map(([key, value]: any) => {
                  const optionColor = getOptionColor(key);
                  const correctOption = correct === key;

                  let backgroundColor = "#1A1A1A";
                  if (isAnsweredRemotely) {
                    if (correctOption) backgroundColor = "#14532d";
                    else if (studentAnswer === key)
                      backgroundColor = "#3f1d1d";
                  } else if (localSelected) {
                    if (correctOption && localCorrect)
                      backgroundColor = "#14532d";
                    else if (localSelected === key && !localCorrect)
                      backgroundColor = "#3f1d1d";
                    else if (localSelected === key && localCorrect)
                      backgroundColor = "#14532d";
                  }

                  return (
                    <TouchableOpacity
                      key={key}
                      activeOpacity={0.7}
                      disabled={!!isAnsweredRemotely || !!localSelected}
                      onPress={() =>
                        handleSelectOption(mcq_id, key, correct)
                      }
                    >
                      <View
                        style={[
                          styles.optionButton,
                          { borderColor: optionColor, backgroundColor },
                        ]}
                      >
                        <View
                          style={[
                            styles.optionLabel,
                            { backgroundColor: optionColor },
                          ]}
                        >
                          <Text style={styles.optionLabelText}>{key}</Text>
                        </View>

                        <Text style={styles.optionText}>
                          {typeof value === "string"
                            ? value
                                .replace(/\*\*(.*?)\*\*/g, "$1")
                                .replace(/\*(.*?)\*/g, "$1")
                            : JSON.stringify(value)}
                        </Text>

                        {/* Icons */}
                        {(isAnsweredRemotely || localSelected) &&
                          correctOption && (
                            <Text style={styles.correctIcon}>✓</Text>
                          )}
                        {(isAnsweredRemotely || localSelected) &&
                          !correctOption &&
                          ((isAnsweredRemotely &&
                            studentAnswer === key) ||
                            (!isAnsweredRemotely &&
                              localSelected === key &&
                              !localCorrect)) && (
                            <Text style={styles.wrongIcon}>✗</Text>
                          )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
            </View>
            {/* 🔥 REQUIRED: Hidden MCQ engine to prepare Ask-Paragraph state */}


<View style={{ height: 0, overflow: "hidden" }}>
  <MCQChatScreen
    item={phaseForMCQScreen}
    studentId={user?.id}
    mcqId={mcq_id}
    correctAnswer={correct}
    phaseUniqueId={mcq_id}
    reviewMode={true}
    mode="review"
  />
</View>


{/* 🔥 Ask Paragraph — SAME AS PRACTICE / IMAGE / VIDEO */}
<TouchableOpacity
  style={{
    marginTop: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#0d2017",
    borderWidth: 1,
    borderColor: "#10b981",
    alignItems: "center",
    opacity: isAskLoading ? 0.6 : 1,
  }}
  disabled={isAskLoading}
  onPress={async () => {
    if (!user?.id) return;

    setIsAskLoading(true);   // ✅ ADD

    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/ask-paragraph/start`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: user.id,
            mcq_id: mcq_id,
            mcq_payload: current.phase_json,
            mode: "discussion",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API error ${response.status}`);
      }

      const data = await response.json();

      router.push({
        pathname: "/ask-paragraph",
        params: {
          session_id: data.session_id,
          student_id: user.id,
          mcq_id: mcq_id,
          mcq_json: JSON.stringify(phase),
        },
      });
    } catch (err) {
      console.error(err);
      setIsAskLoading(false);   // ✅ reset on error
    }
  }}
>
  <Text style={{ color: "#10b981", fontWeight: "700" }}>
    {isAskLoading ? "Starting discussion..." : "Ask Paragraph about this MCQ"}
  </Text>
</TouchableOpacity>


            {/* Navigation */}
            <View style={styles.navButtons}>
              {currentIndex > 0 && (
                <TouchableOpacity
                  style={[styles.navButton, { backgroundColor: "#374151" }]}
                  onPress={handlePrev}
                >
                  <Text style={styles.navButtonText}>⬅ Previous</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
  style={[styles.navButton, { backgroundColor: "#22C55E" }]}
  onPress={() => {
    if (currentIndex === mcqs.length - 1) {
      console.log("🏁 Battle Review Finished → Going Back");
      router.back();   // 👈 correct
    } else {
      handleNext();
    }
  }}
>
  <Text style={styles.navButtonText}>
    {currentIndex === mcqs.length - 1 ? "🏁 Finish" : "Next ➡"}
  </Text>
</TouchableOpacity>

            </View>
          </MotiView>
        </AnimatePresence>
      </ScrollView>
    </View>
  );
}

// ───────────────────────────────
// 🔹 Styles
// ───────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F0F" },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 16,
    zIndex: 100,
    padding: 8,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingTop: 100,
    paddingBottom: 100,
    alignItems: "center",
  },
  titleText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#AAAAAA",
    marginBottom: 20,
  },
  mcqCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#2D2D2D",
    width: "90%",
    maxWidth: 700,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  qNumber: { color: "#FFD93D", fontWeight: "800", fontSize: 16 },
  answerBadge: { fontWeight: "700", fontSize: 16 },
  questionBubbleGradient: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  optionsContainer: { gap: 10 },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 2,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  optionLabel: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  optionLabelText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "800",
  },
  optionText: {
    flex: 1,
    color: "#DDD",
    fontSize: 15,
    fontWeight: "600",
  },
  correctIcon: { color: "#4ade80", fontWeight: "800", fontSize: 16 },
  wrongIcon: { color: "#ef4444", fontWeight: "800", fontSize: 16 },
  navButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  navButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F0F0F",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  loadingText: { color: "#AAA", fontSize: 16 },
});

// ───────────────────────────────
// 🔹 Markdown Styles
// ───────────────────────────────
const markdownStyles = {
  body: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 24,
  },
  strong: {
    color: "#FFD93D",
    fontWeight: "800",
  },
  em: {
    color: "#FFD93D",
    fontStyle: "italic",
  },
};

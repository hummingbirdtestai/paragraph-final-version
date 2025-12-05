// app/reviewconcepts.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { theme } from "@/constants/theme";
import ConceptChatScreen from "@/components/types/Conceptscreen";
import MCQChatScreen from "@/components/types/MCQScreen";
import MentorIntroScreen from "@/components/types/MentorIntroScreen";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import { StudentBubble } from "@/components/chat/StudentBubble";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MessageInput } from "@/components/chat/MessageInput";
import { useRouter } from "expo-router";

export default function ReviewConceptsScreen() {
  const router = useRouter();
  const { student_id, subject_id, subject_name } = useLocalSearchParams();
  const scrollRef = useRef<ScrollView>(null);
  const [phaseData, setPhaseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [conversation, setConversation] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);  // ⭐ NEW
  const [isMCQAnswered, setIsMCQAnswered] = useState(true);
  const [showCompletedModal, setShowCompletedModal] = useState(false);


  const ORCHESTRATOR_URL =
    "https://paragraph-pg-production.up.railway.app/orchestrate";

  // ──────────────────────────────────
  // 1️⃣ Load first review phase
  // ──────────────────────────────────
  const loadFirst = async () => {
    try {
      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review_upto_start",
          student_id,
          subject_id,
        }),
      });
      const data = await res.json();
      console.log("📘 FIRST REVIEW DATA:", data);

      if (!data?.review_upto || data.review_upto.length === 0) {
        Alert.alert("Nothing to Review", "No completed concepts found.");
        return;
      }

      const row = data.review_upto[0];
      setPhaseData(row);
      setConversation(row?.conversation_log || []);
    } catch (err) {
      console.error("❌ Review Start Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFirst();
  }, []);

  // ──────────────────────────────────
  // 2️⃣ Load next review phase
  // ──────────────────────────────────
  const handleNext = async () => {
    if (!phaseData?.react_order_final) return;

    try {
      setIsSending(true);
      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review_upto_next",
          student_id,
          subject_id,
          react_order_final: phaseData.react_order_final,
        }),
      });

      const data = await res.json();
      console.log("➡️ Review Next Data:", data);

      if (!data?.review_upto || data.review_upto.length === 0) {
        setShowCompletedModal(true);
        return;
      }


      const row = data.review_upto[0];
      setPhaseData(row);
      setConversation(row?.conversation_log || []);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setIsMCQAnswered(true);
    } catch (err) {
      console.error("❌ Next Review Error:", err);
    } finally {
      setIsSending(false);
    }
  };

  // ──────────────────────────────────
  // 3️⃣ Chat send — identical to ChatScreen
  // ──────────────────────────────────
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isSending) return;

    setIsSending(true);
    setIsTyping(true);
    setConversation((prev) => [...prev, { role: "student", content: text }]);

      try {
    const res = await fetch(ORCHESTRATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "review_chat",                // ✅ changed from "chat"
        student_id,
        subject_id,
        react_order_final: phaseData.react_order_final, // ✅ added this
        message: text,
      }),
    });


      const data = await res.json();
      if (data?.mentor_reply) {
        setIsTyping(false);
        setConversation((prev) => [
          ...prev,
          { role: "assistant", content: data.mentor_reply },
        ]);
      }
    } catch (err) {
      console.error("💥 Chat send error:", err);
    } finally {
      setIsSending(false);
        setIsTyping(false);
    }
  };

  // ──────────────────────────────────
  // 4️⃣ UI — Chat + Fixed Input + Nav
  // ──────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
  <Text style={styles.headerText}>
  {subject_name || "Review Concepts"}
</Text>


  {phaseData?.seq_num && (
    <Text style={styles.progressText}>
      Concept {phaseData.seq_num} / {phaseData.total_count}
    </Text>
  )}
</View>


        <View style={styles.content}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#25D366" />
            </View>
          ) : !phaseData ? (
  <View style={styles.emptyWrapper}>
    <Text style={styles.emptyTitle}>📘 Nothing to Review</Text>
    <Text style={styles.emptySubtitle}>
      You haven’t completed any concepts in this subject yet.
    </Text>

    <Pressable
      style={styles.emptyButton}
      onPress={() => router.push("/")}
    >
      <Text style={styles.emptyButtonText}>Start Learning →</Text>
    </Pressable>
  </View>
)
 : (
            <ScrollView
              ref={scrollRef}
              style={styles.scroll}
              contentContainerStyle={{ padding: 16, paddingBottom: 220 }}
              showsVerticalScrollIndicator={false}
            >
              {phaseData?.mentor_reply?.mentor_intro && (
                <MentorIntroScreen
                  data={phaseData.mentor_reply}
                  showBookmark={false}
                />
              )}

              {phaseData.phase_type === "concept" && phaseData.phase_json && (
                <>
                  <ConceptChatScreen
                    item={phaseData.phase_json}
                    studentId={student_id}
                    isBookmarked={phaseData.is_bookmarked}
                    phaseUniqueId={phaseData.phase_json.uuid}
                  />

                  <View style={styles.nextPrompt}>
                    <Text style={styles.promptText}>
                      <Text style={styles.bold}>Ask Dr Murali Bharadwaj Sir</Text>{" "}
                      by typing your question below, or click{" "}
                      <Text style={styles.bold}>Next →</Text> to continue.
                    </Text>
                    <Pressable style={styles.nextButton} onPress={handleNext}>
                      <Text style={styles.nextButtonText}>Next →</Text>
                    </Pressable>
                  </View>
                </>
              )}

              {phaseData.phase_type === "mcq" && phaseData.phase_json && (
                <MCQChatScreen
                  item={phaseData.phase_json}
                  onNext={handleNext}
                  studentId={student_id}
                  reactOrderFinal={phaseData.react_order_final}
                  disabled={true}
                  reviewMode={true}
                  onAnswered={() => setIsMCQAnswered(true)}
                  isBookmarked={phaseData.is_bookmarked}
                  phaseUniqueId={phaseData.phase_json.id}
                />
              )}

              {conversation.map((msg, index) =>
                msg.role === "student" ? (
                  <StudentBubble key={index} text={msg.content} />
                ) : (
                  <MentorBubbleReply key={index} markdownText={msg.content} />
                )
              )}
              {isTyping && (
  <MentorBubbleReply
    markdownText={"💬 *Dr. Murali Bharadwaj is typing…*"}
  />
)}

              {conversation.length > 0 &&
                conversation[conversation.length - 1].role === "assistant" && (
                  <View style={styles.nextPrompt}>
                    <Text style={styles.promptText}>
                      <Text style={styles.bold}>Dr Murali Bharadwaj Sir</Text> has
                      finished guiding you — click{" "}
                      <Text style={styles.bold}>Next →</Text> to continue.
                    </Text>
                    <Pressable style={styles.nextButton} onPress={handleNext}>
                      <Text style={styles.nextButtonText}>Next →</Text>
                    </Pressable>
                  </View>
                )}
            </ScrollView>
          )}
        </View>

        {/* 💬 Fixed Input + BottomNav */}
        <View style={styles.fixedBottom}>
          <MessageInput
            placeholder={
              phaseData?.phase_type === "mcq" && !isMCQAnswered
                ? "🧩 Answer the MCQ to continue..."
                : isSending
                ? "Waiting for mentor..."
                : "Type your message..."
            }
            disabled={
              isSending ||
              (phaseData?.phase_type === "mcq" && !isMCQAnswered)
            }
            onSend={handleSendMessage}
          />
          <View style={styles.bottomNavContainer}>
            <BottomNav />
          </View>
        </View>
        {showCompletedModal && (
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>🎉 Review Completed!</Text>

      <Text style={styles.modalSubtitle}>
        You have reviewed all concepts up to where you studied.
      </Text>

      <Pressable
        style={styles.primaryButton}
        onPress={() => {
          setShowCompletedModal(false);
          // 👇 Navigate to home dropdowns screen
          // Example: router.push('/conceptreviewbookmark');
          // Replace with your actual screen
          router.push("/"); 
        }}
      >
        <Text style={styles.primaryButtonText}>Start Learning →</Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() => {
          setShowCompletedModal(false);
          router.back();
        }}
      >
        <Text style={styles.secondaryButtonText}>Go Back</Text>
      </Pressable>
    </View>
  </View>
)}

      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ──────────────────────────────────
// Styles — with fixed bottom nav
// ──────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerText: {
    color: theme.colors.text,
    fontSize: theme.typography.body.fontSize,
    fontWeight: "600",
  },
  content: { flex: 1 },
  scroll: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  nextPrompt: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 0.5,
    borderColor: "#222",
  },
  promptText: {
    color: "#e1e1e1",
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  bold: { fontWeight: "700", color: "#25D366" },
  nextButton: {
    backgroundColor: "#25D366",
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  nextButtonText: { color: "#000", fontWeight: "700", fontSize: 16 },

  // 💬 Fixed Input + BottomNav
  fixedBottom: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  bottomNavContainer: {
    borderTopWidth: 1,
    borderTopColor: "#222",
  },
  modalOverlay: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.7)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
  zIndex: 999,
},

modalContent: {
  backgroundColor: "#111",
  padding: 24,
  borderRadius: 16,
  width: "90%",
  borderWidth: 1,
  borderColor: "#333",
  alignItems: "center",
},

modalTitle: {
  color: "#25D366",
  fontSize: 22,
  fontWeight: "700",
  marginBottom: 10,
  textAlign: "center",
},

modalSubtitle: {
  color: "#ccc",
  fontSize: 16,
  marginBottom: 20,
  textAlign: "center",
},

primaryButton: {
  backgroundColor: "#25D366",
  paddingVertical: 12,
  paddingHorizontal: 30,
  borderRadius: 10,
  marginBottom: 12,
},

primaryButtonText: {
  color: "#000",
  fontWeight: "700",
  fontSize: 16,
},

secondaryButton: {
  paddingVertical: 8,
  paddingHorizontal: 20,
},

secondaryButtonText: {
  color: "#aaa",
  fontSize: 15,
  textDecorationLine: "underline",
},
  progressText: {
  position: "absolute",
  right: 16,
  top: "50%",
  transform: [{ translateY: -8 }],
  color: "#25D366",
  fontWeight: "700",
  fontSize: 16,
},
emptyWrapper: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
},
emptyTitle: {
  color: "#25D366",
  fontSize: 22,
  fontWeight: "700",
  marginBottom: 10,
  textAlign: "center",
},
emptySubtitle: {
  color: "#ccc",
  fontSize: 16,
  marginBottom: 20,
  textAlign: "center",
  lineHeight: 22,
},
emptyButton: {
  backgroundColor: "#25D366",
  paddingVertical: 10,
  paddingHorizontal: 26,
  borderRadius: 10,
  marginTop: 10,
},
emptyButtonText: {
  color: "#000",
  fontWeight: "700",
  fontSize: 16,
},

});
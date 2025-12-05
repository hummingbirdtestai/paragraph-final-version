// app/wrongmcqs.tsx
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
import { BottomNav } from "@/components/navigation/BottomNav";
import { MessageInput } from "@/components/chat/MessageInput";
import { StudentBubble } from "@/components/chat/StudentBubble";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import MCQChatScreen from "@/components/types/MCQScreen";
import MentorIntroScreen from "@/components/types/MentorIntroScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";


const ORCHESTRATOR_URL =
  "https://paragraph-pg-production.up.railway.app/orchestrate";

export default function WrongMCQsReview() {
  const { user } = useAuth();
  const { subject_id ,subject_name } = useLocalSearchParams();
  const scrollRef = useRef<ScrollView>(null);
const [subjectName, setSubjectName] = useState<string | null>(null);

  const [phaseData, setPhaseData] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);  // ⭐ NEW
  const [isMCQAnswered, setIsMCQAnswered] = useState(true);
  const [allCompleted, setAllCompleted] = useState(false);
  const [noWrongMCQs, setNoWrongMCQs] = useState(false);

  const router = useRouter();

useEffect(() => {
  if (subject_name) {
    setSubjectName(subject_name as string);
  }
}, [subject_name]);


  // ─────────────────────────────
  // 1️⃣ Load First Wrong MCQ
  // ─────────────────────────────
  const loadFirstWrong = async () => {
    try {
      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "wrong_mcqs_start",
          student_id: user?.id,
          subject_id,
        }),
      });
      const data = await res.json();
      console.log("📘 WRONG MCQ START:", data);

  if (!data?.wrong_mcqs || data.wrong_mcqs.length === 0) {
  console.log("🚫 No wrong MCQs for this subject");

  setNoWrongMCQs(true);   // ⭐ NEW STATE
  setPhaseData(null);
  setConversation([]);
  setLoading(false);
  return;
}


      const row = data.wrong_mcqs[0];
      const parsed =
        typeof row.phase_json === "string"
          ? JSON.parse(row.phase_json)
          : row.phase_json;

      setPhaseData({ ...row, phase_json: parsed });
      setConversation(row?.conversation_log || []);
    } catch (err) {
      console.error("❌ Wrong MCQ Start Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id && subject_id) loadFirstWrong();
  }, [user?.id, subject_id]);

  // ─────────────────────────────
  // 2️⃣ Load Next Wrong MCQ
  // ─────────────────────────────
  const handleNext = async () => {
    if (!phaseData?.react_order_final) return;

    try {
      setIsSending(true);
      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "wrong_mcqs_next",
          student_id: user.id,
          subject_id,
          react_order_final: phaseData.react_order_final,
        }),
      });

      const data = await res.json();
      console.log("➡️ NEXT WRONG MCQ:", data);

      if (!data?.wrong_mcqs || data.wrong_mcqs.length === 0) {
  console.log("🎉 All wrong MCQs completed");
  setAllCompleted(true);
  setPhaseData(null);
  return;
}


      const next = data.wrong_mcqs[0];
      const parsed =
        typeof next.phase_json === "string"
          ? JSON.parse(next.phase_json)
          : next.phase_json;

      setPhaseData({ ...next, phase_json: parsed });
      setConversation(next?.conversation_log || []);
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      setIsMCQAnswered(true);
    } catch (err) {
      console.error("❌ Next Wrong Error:", err);
    } finally {
      setIsSending(false);
    }
  };

  // ─────────────────────────────
  // 3️⃣ Chat send (like ReviewConceptsScreen)
  // ─────────────────────────────
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
        action: "review_chat",  // ✅ use review_chat
        student_id: user.id,
        subject_id,
        react_order_final: phaseData.react_order_final, // ✅ add this
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

  // ─────────────────────────────
  // 4️⃣ UI — Chat-style flow
  // ─────────────────────────────
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>

        {/* HEADER */}
        <Text style={styles.headerText}>
  ❌ Review Wrong MCQs
  {phaseData?.seq_num && phaseData?.total_count
    ? `  (${phaseData.seq_num} / ${phaseData.total_count})`
    : ""}
</Text>

        {subjectName && (
  <Text style={styles.subjectName}>{subjectName}</Text>
)}



        {/* MAIN CONTENT AREA */}
        <View style={styles.content}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#25D366" />
            </View>
      ) : noWrongMCQs ? (
  <View style={styles.centered}>
    <Text style={{ color: "#F87171", fontSize: 22, fontWeight: "700" }}>
      🚫 No Wrong MCQs Found
    </Text>

    <Text style={{ color: "#ccc", marginTop: 12, fontSize: 16, textAlign: "center", paddingHorizontal: 20 }}>
      You have not answered any MCQs wrong in this subject yet.
    </Text>

    <Pressable
      style={{
        backgroundColor: "#25D366",
        paddingVertical: 10,
        paddingHorizontal: 26,
        borderRadius: 10,
        marginTop: 30,
      }}
      onPress={() => router.push("/")}
    >
      <Text style={{ color: "#000", fontWeight: "700", fontSize: 16 }}>
        ← Back to Subjects
      </Text>
    </Pressable>
  </View>

          ) : !phaseData && allCompleted ? (
  <View style={styles.centered}>
    <Text style={{ color: "#25D366", fontSize: 22, fontWeight: "700" }}>
      🎉 All Wrong MCQs Completed!
    </Text>

    <Text style={{ color: "#ccc", marginTop: 12, fontSize: 16, textAlign: "center", paddingHorizontal: 20 }}>
      Great job! You have reviewed all wrong MCQs in this subject.
    </Text>

    <Pressable
      style={{
        backgroundColor: "#25D366",
        paddingVertical: 10,
        paddingHorizontal: 26,
        borderRadius: 10,
        marginTop: 30,
      }}
      onPress={() => {
  router.back(); // <-- your dropdown page route
}}

    >
      <Text style={{ color: "#000", fontWeight: "700", fontSize: 16 }}>
        ← Back to Subjects
      </Text>
    </Pressable>
  </View>
) : !phaseData ? (
  <View style={styles.centered}>
    <Text style={{ color: "#fff" }}>No wrong MCQs found.</Text>
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

              <MCQChatScreen
                item={phaseData.phase_json}
                onNext={handleNext}
                studentId={user.id}
                reactOrderFinal={phaseData.react_order_final}
                disabled={true}
                reviewMode={true}
                onAnswered={() => setIsMCQAnswered(true)}
                isBookmarked={phaseData.is_bookmarked}
                studentSelected={phaseData.student_answer}
                phaseUniqueId={phaseData.phase_json.id}
                progress={{
                  seq: phaseData.seq_num,
                  total: phaseData.total_count
                }}
              />

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
                      <Text style={styles.bold}>Dr Murali Bharadwaj Sir</Text>{" "}
                      has finished guiding you — click{" "}
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

        {/* 💬 Fixed Input + Nav */}
        <View style={styles.fixedBottom}>
          <MessageInput
            placeholder={
              isSending
                ? "Waiting for mentor..."
                : phaseData?.phase_type === "mcq" && !isMCQAnswered
                ? "🧩 Answer the MCQ to continue..."
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
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// ─────────────────────────────
// STYLES
// ─────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
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
  content: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
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
  subjectName: {
  color: "#ccc",
  fontSize: 15,
  fontWeight: "600",
  textAlign: "center",
  marginTop: 6,
},

});

import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { theme } from "@/constants/theme";
import FlashcardScreen from "@/components/types/FlashcardScreen";
import ConceptChatScreen from "@/components/types/Conceptscreen";
import MentorIntroScreen from "@/components/types/MentorIntroScreen";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import { MessageInput } from "@/components/chat/MessageInput";
import { BottomNav } from "@/components/navigation/BottomNav";
import { StudentBubble } from "@/components/chat/StudentBubble";
import { useRouter } from "expo-router";


export default function ReviewFlashcards() {
  const { user } = useAuth();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const params = useLocalSearchParams();
  const subject_id = params.subject_id as string;
  const student_id = user?.id;

  const [phaseData, setPhaseData] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(false);
const [noBookmarksAtAll, setNoBookmarksAtAll] = useState(false);


  const API_URL =
    "https://flashcard-orchestra-production.up.railway.app/flashcard_orchestrate";

  // ---------------------------------------------------------
  // 1️⃣ START REVIEW (Backend-driven)
  // ---------------------------------------------------------
  const startReview = async () => {
    if (!student_id || !subject_id) return;

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review_completed_start_flashcard",
          student_id,
          subject_id,
        }),
      });

      const data = await res.json();
      console.log("🔰 START REVIEW:", data);
      setPhaseData(data?.review_item || null);
      setConversation(data?.review_item?.conversation_log || []);
      setReviewCompleted(data?.review_completed || false);
      setNoBookmarksAtAll(data?.no_bookmarks || false);

      console.log("🟨 Raw review_item from backend:", data?.review_item);

if (!data?.review_item) {
  console.log("❌ No review_item key returned → NULL (no bookmarks)");
} else if (Object.keys(data.review_item).length === 0) {
  console.log("❌ EMPTY object returned → {} → No bookmarks");
} else {
  console.log("✅ Valid review_item keys:", Object.keys(data.review_item));
}

console.log("📦 Stored phaseData:", data?.review_item || null);

    } catch (e) {
      console.error("Start review error:", e);
    }
    setLoading(false);
  };

  useEffect(() => {
    startReview();
  }, []);

  // ---------------------------------------------------------
  // 2️⃣ NEXT FLASHCARD IN REVIEW MODE
  // ---------------------------------------------------------
  const handleNext = async () => {
    if (!phaseData?.react_order_final) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review_completed_next_flashcard",
          student_id,
          subject_id,
          react_order_final: phaseData.react_order_final,
        }),
      });

      const data = await res.json();
      console.log("➡ NEXT REVIEW:", data);

      setReviewCompleted(data?.review_completed || false);

if (data?.review_completed) {
  // no more flashcards to review
  setPhaseData(null);
  return;
}

setPhaseData(data?.review_item || null);
setConversation(data?.review_item?.conversation_log || []);
scrollRef.current?.scrollTo({ y: 0, animated: true });

    } catch (e) {
      console.error("Next review error:", e);
    }
  };

  // ---------------------------------------------------------
  // 3️⃣ CHAT WITH MENTOR DURING REVIEW MODE
  // ---------------------------------------------------------
  const handleChat = async (text: string) => {
    if (!text.trim()) return;

    setIsSending(true);
    setConversation((prev) => [...prev, { role: "student", content: text }]);

    try {
      const res = await fetch(API_URL, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    action: "chat_review_completed_flashcard",
    student_id,
    subject_id,
    react_order_final: phaseData?.react_order_final,
    message: text,
  }),
});


      const data = await res.json();
      console.log("💬 Review chat:", data);

      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: data?.mentor_reply || "⚠️ No reply" },
      ]);
    } catch (e) {
      console.error("Chat review error:", e);
    }

    setIsSending(false);
  };


  console.log("📌 FINAL phaseData BEFORE RENDER:", phaseData);
console.log("📌 phaseData keys:", phaseData ? Object.keys(phaseData) : "null");

const noBookmarks =
  !loading &&
  (
    !phaseData ||
    phaseData.error || // 🧠 Handles RPC failure {error: "..."}
    Object.keys(phaseData).length === 0 ||
    (
      !phaseData.concept &&
      !phaseData.phase_json &&
      !phaseData.mentor_reply &&
      !phaseData.seq_num
    )
  );

console.log("🟩 noBookmarks computed:", noBookmarks);


  // ---------------------------------------------------------
  // 4️⃣ UI
  // ---------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
  <Text style={styles.headerText}>Review Flashcards</Text>

  {phaseData?.seq_num && phaseData?.total_count && (
    <Text style={styles.progressCount}>
      {phaseData.seq_num} / {phaseData.total_count}
    </Text>
  )}
</View>


      <ScrollView
        ref={scrollRef}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={{ padding: 40, alignItems: "center" }}>
            <ActivityIndicator size="large" color="#25D366" />
          </View>
        )}

{/* CASE 1 — No bookmarks ever */}
{/* CASE 1 — No bookmarks ever */}
{noBookmarksAtAll && (
  <View style={styles.emptyWrapper}>
    <Text style={styles.emptyTitle}>📘 Nothing to Review</Text>

    <Text style={styles.emptySubtitle}>
      You have no  flashcards to review in this subject yet.
    </Text>

    <Pressable
      style={styles.emptyButton}
      onPress={() => router.push("/flashcards")}
    >
      <Text style={styles.emptyButtonText}>Start Learning →</Text>
    </Pressable>
  </View>
)}


{/* CASE 2 — Completed review */}
{!noBookmarksAtAll && reviewCompleted && (
  <View style={{ padding: 40, alignItems: "center" }}>
    <Text style={{ color: "#ccc", fontSize: 18, textAlign: "center", lineHeight: 26 }}>
      🎉 You have reviewed all flashcards!{"\n"}
      Continue learning.
    </Text>
    <Pressable
      style={styles.emptyButton}
      onPress={() => router.push("/flashcards")}
    >
      <Text style={styles.emptyButtonText}>Start Learning →</Text>
    </Pressable>
  </View>
)}

{/* CASE 3 — Normal review mode */}
{!noBookmarksAtAll && !reviewCompleted && phaseData && (
  <>
    {/* 💬 Concept or Mentor Intro */}
    {phaseData?.concept && (
      <MentorBubbleReply markdownText={phaseData.concept} />
    )}

    {phaseData?.mentor_reply?.mentor_intro && (
      <MentorIntroScreen
        data={phaseData.mentor_reply}
        showBookmark={true}
        bookmarks={phaseData?.bookmarks}
      />
    )}

    {phaseData?.phase_json && (
      <FlashcardScreen
        key={phaseData.seq_num}
        item={phaseData.phase_json}
        studentId={student_id}
        bookmarks={phaseData?.bookmarks}
      />
    )}

    {/* 💬 Ask or Next */}
    {/* Show this only when there is NO conversation */}
{conversation.length === 0 && (
  <View style={styles.nextPrompt}>
    <Text style={styles.promptText}>
      <Text style={styles.bold}>Ask Dr Murali Bharadwaj Sir</Text> or click{" "}
      <Text style={styles.bold}>Next →</Text> to continue reviewing.
    </Text>

    <Pressable style={styles.nextButton} onPress={handleNext}>
      <Text style={styles.nextButtonText}>Next →</Text>
    </Pressable>
  </View>
)}

  </>
)}


        {/* Student ↔ Mentor Chat below */}
{/* Student ↔ Mentor Chat below */}
{conversation
  .filter(msg => typeof msg.content === "string")
  .map((msg, i) =>
    msg.role === "student" ? (
      <StudentBubble key={i} text={msg.content} />
    ) : (
      <MentorBubbleReply key={i} markdownText={msg.content} />
    )
  )}
        {/* ⭐ Next button shown after mentor reply */}
{!reviewCompleted &&
 !noBookmarksAtAll &&
 conversation.length > 0 &&
 conversation[conversation.length - 1].role === "assistant" && (
    <View style={styles.nextPrompt}>
      <Text style={styles.promptText}>
        <Text style={styles.bold}>Dr Murali Bharadwaj Sir</Text> has guided you — click{" "}
        <Text style={styles.bold}>Next →</Text> to continue.
      </Text>

      <Pressable style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Next →</Text>
      </Pressable>
    </View>
)}




      </ScrollView>

      <MessageInput
        disabled={!phaseData || isSending}
        placeholder={isSending ? "Please wait..." : "Ask a doubt..."}
        onSend={handleChat}
      />

      <BottomNav />
    </SafeAreaView>
  );
}

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
    fontWeight: "500",
  },
  progressCount: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -8 }],
    color: "#25D366",
    fontWeight: "700",
    fontSize: 16,
  },
  completeText: {
    textAlign: "center",
    marginTop: 40,
    color: "#999",
    fontSize: 18,
  },
  nextPrompt: {
    marginTop: 12,
    alignItems: "center",
    paddingVertical: 10,
    borderTopWidth: 0.5,
    borderColor: "#333",
  },
  promptText: {
    color: "#e1e1e1",
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
  nextButtonText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 16,
  },
  emptyWrapper: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 20,
  marginTop: 40,
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

// app/bookmarkflashcards.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { theme } from "@/constants/theme";
import { useLocalSearchParams } from "expo-router";
import { BottomNav } from "@/components/navigation/BottomNav";
import { MentorBubble } from "@/components/chat/MentorBubble";
import MentorIntroScreen from "@/components/types/MentorIntroScreen";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import FlashcardScreen from "@/components/types/FlashcardScreen";
import { StudentBubble } from "@/components/chat/StudentBubble";
import { MessageInput } from "@/components/chat/MessageInput";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";

// 🔍 Global Debug Logger
function log(...args: any[]) {
  console.log("🟦 FLASHCARD DEBUG →", ...args);
}

// 🧩 Helper to safely parse conversation_log from backend
function parseConversationLog(raw: any) {
  if (!raw) return [];
  try {
    if (typeof raw === "string") {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    }
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}
// 🔍 Wrapped Fetch Logger
async function debugFetch(url: string, body: any) {
  log("📡 API CALL:", url);
  log("📨 Sent Payload:", JSON.stringify(body, null, 2));

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const raw = await res.text();
  log("📥 Raw Response:", raw);

  let parsed;
  try {
    parsed = JSON.parse(raw);
    log("📦 Parsed JSON:", parsed);
  } catch (e) {
    log("❌ JSON Parse Error:", e);
  }

  return parsed;
}


export default function BookmarkFlashcardsChatScreen() {
  const { student_id, subject_id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();

  const [phaseData, setPhaseData] = useState<any>(null);
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [noBookmarksAtAll, setNoBookmarksAtAll] = useState(false);
const [completedBookmarks, setCompletedBookmarks] = useState(false);



  

  // Auto-load on mount once user + subject_id are ready
  useEffect(() => {
    if (user?.id && subject_id) {
      console.log("🚀 Auto-loading bookmarks for:", {
        student_id: user.id,
        subject_id,
      });
      fetchInitial();
    }
  }, [user?.id, subject_id]);

  // ───────────────────────────────────────────────
  // 1️⃣ Fetch first bookmarked flashcard
  // ───────────────────────────────────────────────
  const fetchInitial = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
     console.log("📡 Calling start_bookmarked_revision →", subject_id);
const data = await debugFetch(
  "https://flashcard-orchestra-production.up.railway.app/flashcard_orchestrate",
  {
    action: "start_bookmarked_revision",
    student_id: user.id,
    subject_id,
  }
);




let item = Array.isArray(data) ? data[0] : data;

// CASE A → No bookmarks at all
if (!item) {
  setNoBookmarksAtAll(true);
  setPhaseData(null);
  setLoading(false);
  return;
}

if (item.type === "flashcard" && !item.flashcard_json) {
  setNoBookmarksAtAll(true);
  setPhaseData(null);
  setLoading(false);
  return;
}





      // Parse JSON safely
      if (item?.flashcard_json && typeof item.flashcard_json === "string") {
        try {
          item.flashcard_json = JSON.parse(item.flashcard_json);
        } catch (e) {
          console.warn("⚠️ Failed to parse flashcard_json:", e);
        }
      }
      if (item?.mentor_reply && typeof item.mentor_reply === "string") {
        try {
          item.mentor_reply = JSON.parse(item.mentor_reply);
        } catch (e) {
          console.warn("⚠️ Failed to parse mentor_reply:", e);
        }
      }

      console.log("🧩 Final parsed item:", item);

      setPhaseData(item);
      log("🧩 Phase Keys:", Object.keys(item || {}));
log("🔍 type:", item?.type);
log("🔍 flashcard_json:", item?.flashcard_json);
log("🔍 mentor_reply:", item?.mentor_reply);
log("🔍 updated_time:", item?.updated_time);


      const parsedConvo = Array.isArray(item?.conversation_log)
  ? item.conversation_log
  : parseConversationLog(item?.conversation_log);

if (parsedConvo.length > 0) {
  console.log("💬 Loaded conversation_log:", parsedConvo);
}
setConversation(parsedConvo);

    } catch (err) {
      console.error("💥 Error loading bookmarked flashcards:", err);
    } finally {
      setLoading(false);
    }
  };

const handleNext = async () => {
  if (!user?.id || !phaseData?.updated_time) return;
  setLoading(true);

  log("➡️ NEXT CLICK | updated_time:", phaseData?.updated_time);

  try {
    const data = await debugFetch(
      "https://flashcard-orchestra-production.up.railway.app/flashcard_orchestrate",
      {
        action: "next_bookmarked_flashcard",
        student_id: user.id,
        subject_id,
        last_updated_time: phaseData.updated_time,
      }
    );

    // 🛑 CASE 1: API returns null → No more bookmarks
   // CASE B → Completed all bookmarks
if (!data) {
  console.log("📌 Bookmark review completed.");
  setCompletedBookmarks(true);
  setPhaseData(null);
  setConversation([]);
  setLoading(false);
  return;
}


    // 🧠 CASE 2: Normal bookmark available
    setPhaseData(data);

    const parsedNextConvo = parseConversationLog(data?.conversation_log);
    if (parsedNextConvo.length > 0) {
      console.log("💬 Loaded chat for next card:", parsedNextConvo);
    }
    setConversation(parsedNextConvo);

  } catch (err) {
    console.error("💥 [Next] Exception:", err);
  } finally {
    setLoading(false);
  }
};


  // ───────────────────────────────────────────────
  // 3️⃣ Message Sending with Logging
  // ───────────────────────────────────────────────
  const handleSend = async (text: string) => {
    if (!text.trim() || !phaseData?.updated_time) return;
    console.log("📨 Sending message:", text);

    setIsSending(true);
    setIsTyping(true);
    setConversation((prev) => [...prev, { role: "student", content: text }]);
    

    try {
      const res = await fetch(
        "https://flashcard-orchestra-production.up.railway.app/flashcard_orchestrate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
        action: "chat_review_flashcard_bookmarks",
        student_id: user?.id,
        subject_id,
        flashcard_id:
  phaseData?.flashcard_json?.id ||
  phaseData?.element_id ||
  phaseData?.id ||
  null,

flashcard_updated_time:
  phaseData?.updated_time ||
  phaseData?.flashcard_json?.updated_time ||
  null,

        message: text,
      }),
        }
      );

      const data = await res.json();
      console.log("💬 [Chat Review Reply Raw]:", JSON.stringify(data, null, 2));

      const reply =
        typeof data?.mentor_reply === "string"
          ? data.mentor_reply
          : JSON.stringify(data.mentor_reply, null, 2);

      console.log("🧠 Mentor Reply:", reply);

      setConversation((prev) => [
        ...prev,
        { role: "assistant", content: reply || "Got it 👍" },
      ]);
    } catch (err) {
      console.error("💥 Review Chat error:", err);
    } finally {
      setIsSending(false);
    }
  };

  // ───────────────────────────────────────────────
  // 4️⃣ UI
  // ───────────────────────────────────────────────
return (
  <SafeAreaView style={styles.container}>

    <View style={styles.header}>
      <Text style={styles.headerText}>Bookmarked Flashcards</Text>
      {phaseData?.seq_num && phaseData?.total_count && (
        <Text style={styles.progressCount}>
          {phaseData.seq_num} / {phaseData.total_count}
        </Text>
      )}
    </View>

    {/* 👇 Hide ScrollView entirely if popup is showing */}
    {noBookmarksAtAll || completedBookmarks ? null : (
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <ActivityIndicator color="#25D366" size="large" />
        ) : phaseData ? (
          <>
            {/* 🧠 Mentor reply phase */}
            {phaseData?.type === "mentor_reply" && (
              <>
                {phaseData?.concept && (
                  <MentorBubbleReply markdownText={phaseData.concept} />
                )}
                {phaseData?.mentor_reply?.mentor_intro && (
                  <MentorIntroScreen
                    data={phaseData.mentor_reply}
                    showBookmark={true}
                  />
                )}
              </>
            )}

            {/* 🎴 Flashcard phase */}
            {phaseData?.type === "flashcard" && phaseData?.flashcard_json && (
              <FlashcardScreen
                item={{
                  flashcards: [
                    {
                      id: phaseData.flashcard_json.id,
                      Question:
                        phaseData.flashcard_json.Question ||
                        phaseData.flashcard_json.question,
                      Answer:
                        phaseData.flashcard_json.Answer ||
                        phaseData.flashcard_json.answer,
                      mentor_reply: phaseData.flashcard_json.mentor_reply,
                      isBookmarked:
                        phaseData.flashcard_json?.is_bookmarked === true ||
                        phaseData.flashcard_json?.is_bookmark === true ||
                        phaseData.is_bookmark === true,
                    },
                  ],
                  subject: phaseData.subject_name,
                  subject_id: subject_id,
                }}
                studentId={student_id as string}
                subjectId={subject_id}
                subjectName={phaseData.subject_name}
              />
            )}

            {/* 💬 Conversation History */}
            {conversation.length > 0 && (
              <>
                <Text
                  style={{
                    color: "#aaa",
                    textAlign: "center",
                    marginTop: 20,
                    marginBottom: 10,
                  }}
                >
                  — Conversation History —
                </Text>
                {conversation.map((msg, i) =>
                  msg.role === "student" ? (
                    <StudentBubble key={i} text={msg.content} />
                  ) : (
                    <MentorBubbleReply key={i} markdownText={msg.content} />
                  )
                )}
              </>
            )}

            {/* ➡️ Next Section */}
            <View style={styles.nextPrompt}>
              <Text style={styles.promptText}>
                <Text style={styles.bold}>Ask Dr Murali Bharadwaj Sir</Text>{" "}
                your doubt below, or click{" "}
                <Text style={styles.bold}>Next →</Text> to continue reviewing.
              </Text>

              <Pressable
                style={styles.nextButton}
                onPress={handleNext}
                disabled={loading}
              >
                <Text style={styles.nextButtonText}>Next →</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text
            style={{ color: "#999", textAlign: "center", marginTop: 100 }}
          >
            ⚠️ No bookmarked flashcards found for this subject.
          </Text>
        )}
      </ScrollView>
    )}

    {/* ⭐ Popup Overlay (blocks everything else) */}
 {noBookmarksAtAll && (
  <View style={styles.popupWrapper}>
    <View style={styles.popupCard}>
      <Text style={styles.popupTitle}>No Bookmarks Found</Text>

      <Text style={styles.popupMessage}>
        There are no bookmarked flashcards for this subject.
      </Text>

      <Pressable
        style={styles.popupButton}
        onPress={() => {
          setNoBookmarksAtAll(false);
          router.push("/flashcards");
        }}
      >
        <Text style={styles.popupButtonText}>Okay</Text>
      </Pressable>
    </View>
  </View>
)}
{completedBookmarks && (
  <View style={styles.popupWrapper}>
    <View style={styles.popupCard}>
      <Text style={styles.popupTitle}>You Completed the Bookmarks</Text>

      <Text style={styles.popupMessage}>
        You Completed Revising All Bookmarked Flashcards
      </Text>

      <Pressable
        style={styles.popupButton}
        onPress={() => {
          setCompletedBookmarks(false);
          router.push("/flashcards");
        }}
      >
        <Text style={styles.popupButtonText}>Okay</Text>
      </Pressable>
    </View>
  </View>
)}

    <View style={styles.fixedBottom}>
  <MessageInput
    placeholder={
      isSending ? "Waiting for mentor..." : "Type your message..."
    }
    disabled={isSending}
    onSend={handleSend}
  />
</View>


    <View style={styles.bottomNavWrapper}>
  <BottomNav />
</View>

  </SafeAreaView>
);


}

// ───────────────────────────────────────────────
// 💅 Styles identical to app/flashcards.tsx
// ───────────────────────────────────────────────
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
    fontWeight: "400",
  },
  scroll: { flex: 1 },
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
  bottomNavWrapper: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
},
  fixedBottom: {
  position: "absolute",
  bottom: 56,     // height of bottom nav
  left: 0,
  right: 0,
  backgroundColor: theme.colors.background,
  borderTopWidth: 1,
  borderTopColor: "#222",
  paddingVertical: 4,
  zIndex: 900,
},

  nextButtonText: { color: "#000", fontWeight: "700", fontSize: 16 },
  progressCount: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -8 }],
    color: "#25D366",
    fontWeight: "700",
    fontSize: 16,
  },
  popupWrapper: {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0,0,0,0.55)",
  justifyContent: "center",
  alignItems: "center",
  paddingHorizontal: 30,
  zIndex: 999,
},

popupCard: {
  width: "100%",
  backgroundColor: "#1e1e1e",
  padding: 22,
  borderRadius: 16,
  alignItems: "center",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.08)",
},

popupTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#ffffff",
  marginBottom: 10,
},

popupMessage: {
  fontSize: 15,
  color: "#cccccc",
  textAlign: "center",
  marginBottom: 20,
  lineHeight: 22,
},

popupButton: {
  backgroundColor: "#25D366",
  paddingVertical: 10,
  paddingHorizontal: 26,
  borderRadius: 8,
},

popupButtonText: {
  color: "#000",
  fontWeight: "700",
  fontSize: 16,
},

});

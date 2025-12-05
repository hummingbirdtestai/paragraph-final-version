// app/conceptreviewbookmark.tsx
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
import { theme } from "@/constants/theme";
import { MentorBubble } from "@/components/chat/MentorBubble";
import ConceptChatScreen from "@/components/types/Conceptscreen";
import MCQChatScreen from "@/components/types/MCQScreen";
import { MessageInput } from "@/components/chat/MessageInput";
import { BottomNav } from "@/components/navigation/BottomNav";
import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { StudentBubble } from "@/components/chat/StudentBubble";
import MentorIntroScreen from "@/components/types/MentorIntroScreen";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import ChatSubjectSelection from "@/components/types/ChatSubjectSelection";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";


export default function ConceptReviewBookmark() {
  const scrollRef = useRef<ScrollView>(null);
  const { user, loginWithOTP, verifyOTP } = useAuth();
  const isLoggedIn = !!user;
  const params = useLocalSearchParams();

  const [canType, setCanType] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phaseData, setPhaseData] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // ⭐ NEW
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [allBookmarksCompleted, setAllBookmarksCompleted] = useState(false);
  const [noBookmarks, setNoBookmarks] = useState(false);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
  if (params?.subject_name) {
    setSelectedSubjectName(params.subject_name as string);
  }
}, [params?.subject_name]);


  const ORCHESTRATOR_URL = "https://paragraph-pg-production.up.railway.app/orchestrate";

  // -----------------------------------------------------------------------
  // OTP FLOW
  // -----------------------------------------------------------------------
  const handleSendOTP = async (phone: string) => {
    try {
      const formatted = phone.startsWith("+91") ? phone : `+91${phone}`;
      const { error } = await loginWithOTP(formatted);
      if (error) throw error;
      setPhoneNumber(phone);
      setShowLoginModal(false);
      setShowOTPModal(true);
    } catch (err) {
      console.error("OTP send error:", err);
    }
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



  // -----------------------------------------------------------------------
  // LOAD PREVIOUS CHAT
  // -----------------------------------------------------------------------
  const loadPreviousConversation = async (
  studentId,
  subjectId,
  reactOrderFinal
) => {
    try {
      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "review_chat",
          student_id: studentId,
          subject_id: subjectId,
          react_order_final: reactOrderFinal,
          message: "",
        }),
      });

      const data = await res.json();
      setConversation(data?.existing_conversation || []);
    } catch (err) {
      console.error("⚠️ Failed loading chat:", err);
    }
  };

  // -----------------------------------------------------------------------
  // START FLOW
  // -----------------------------------------------------------------------
  const handleStart = async (subjectId: string) => {
    if (!user?.id) return;

    try {
      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bookmark_review",
          student_id: user.id,
          subject_id: subjectId,
        }),
      });

      const data = await res.json();

      const first = Array.isArray(data.bookmarked_concepts)
        ? data.bookmarked_concepts[0]
        : data.bookmarked_concepts;

      if (!first) {
  setNoBookmarks(true);
  return;
}


      const parsed = typeof first.phase_json === "string"
        ? JSON.parse(first.phase_json)
        : first.phase_json;

      setPhaseData({ ...first, phase_json: parsed });
      await loadPreviousConversation(
        user.id,
        subjectId,
        first.react_order_final
      );

      setCanType(true);
      setSelectedSubject(subjectId);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    } catch (err) {
      console.error("❌ Bookmark review error:", err);
    }
  };

  // -----------------------------------------------------------------------
  // NEXT FLOW — **IDENTICAL VISUAL BEHAVIOUR TO reviewconcepts.tsx**
  // -----------------------------------------------------------------------
  const handleNext = async () => {
    if (!user?.id || !phaseData) return;

    try {
      setIsSending(true);

      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "bookmark_review_next",
          student_id: user.id,
          subject_id: selectedSubject,
          bookmark_updated_time: phaseData.bookmark_updated_time,
        }),
      });

      const data = await res.json();

      if (!data?.bookmarked_concepts || data.bookmarked_concepts.length === 0) {
        setAllBookmarksCompleted(true);
        setPhaseData(null);
        return;
      }

      const next = Array.isArray(data.bookmarked_concepts)
        ? data.bookmarked_concepts[0]
        : data.bookmarked_concepts;

      const parsed = typeof next.phase_json === "string"
        ? JSON.parse(next.phase_json)
        : next.phase_json;

      setPhaseData({ ...next, phase_json: parsed });
      setConversation([]);

      await loadPreviousConversation(
        user.id,
        selectedSubject!,
        next.react_order_final
      );


      scrollRef.current?.scrollTo({ y: 0, animated: true });
    } catch (err) {
      console.error("💥 Next error:", err);
    } finally {
      setIsSending(false);
    }
  };

  // -----------------------------------------------------------------------
  // AUTO START IF subject_id COMES FROM ROUTER
  // -----------------------------------------------------------------------
  useEffect(() => {
    if (params?.subject_id && user?.id && !phaseData) {
      handleStart(params.subject_id as string);
    }
  }, [params?.subject_id, user?.id]);

  // -----------------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------------
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
  <Text style={styles.headerText}>🔖 My Bookmarked Concepts</Text>

  {phaseData?.seq_num && phaseData?.total_count && (
    <Text style={styles.progressCount}>
      {`Concept ${phaseData.seq_num} / ${phaseData.total_count}`}
    </Text>
  )}
</View>
        {selectedSubjectName && (
  <Text style={styles.subjectName}>{selectedSubjectName}</Text>
)}



        {/* SUBJECT PICKER OR COMPLETION */}
        {!isLoggedIn ? (
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            <MentorBubble>
              <Text style={styles.loginText}>
                Hey hi! Please sign in to start NEET PG learning.
              </Text>
              <Pressable
                style={styles.signInButton}
                onPress={() => setShowLoginModal(true)}
              >
                <Text style={styles.signInText}>Sign In</Text>
              </Pressable>
            </MentorBubble>
          </ScrollView>
        ) : allBookmarksCompleted ? (
          <ScrollView contentContainerStyle={{ padding: 40 }}>
            <View style={styles.completionCard}>
              <Text style={styles.completionTitle}>
                🎯 All Bookmarked Concepts Reviewed
              </Text>
              <Text style={styles.completionSubtitle}>
                Great job revising your saved high-yield topics!
              </Text>
              <Pressable
                style={styles.doneButton}
                onPress={() => router.replace("/")}
              >
                <Text style={styles.doneButtonText}>Back to Subjects</Text>
              </Pressable>
            </View>
          </ScrollView>
        ) : noBookmarks ? (
  <ScrollView contentContainerStyle={{ padding: 40 }}>
    <View style={styles.completionCard}>
      <Text style={styles.completionTitle}>
        🚫 No Bookmarks Found
      </Text>

      <Text style={styles.completionSubtitle}>
        You have not bookmarked any concepts for this subject.
      </Text>

      <Pressable
        style={styles.doneButton}
        onPress={() => router.replace("/")}
      >
        <Text style={styles.doneButtonText}>Back to Subjects</Text>
      </Pressable>
    </View>
  </ScrollView>
) : !phaseData ? (
  <ChatSubjectSelection
  studentId={user.id}
  onSubjectSelect={(studentId, subjectId, subjectName, intent) => {
    if (intent === "bookmark_review") {
      setSelectedSubject(subjectId);
      setSelectedSubjectName(subjectName);   // ⭐ NEW
      handleStart(subjectId);
    }
  }}
/>

        ) : (
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            contentContainerStyle={{ padding: 16, paddingBottom: 200 }}
            showsVerticalScrollIndicator={false}
          >
            {/* MENTOR INTRO */}
            {phaseData?.mentor_reply?.mentor_intro && (
              <MentorIntroScreen
                data={phaseData.mentor_reply}
                showBookmark={false}
              />
            )}

            {/* CONCEPT PHASE */}
            {phaseData.phase_type === "concept" && (
              <>
                <ConceptChatScreen
                  key={phaseData.react_order_final}
                  item={phaseData.phase_json}
                  studentId={user.id}
                  isBookmarked={phaseData.is_bookmarked}
                  reviewMode={true}
                  phaseUniqueId={phaseData.phase_json.uuid}
                />

                {/* ⭐ SAME NEXT BLOCK AS reviewconcepts.tsx */}
                <View style={styles.nextPrompt}>
                  <Text style={styles.promptText}>
                    <Text style={styles.bold}>Ask Dr Murali Bharadwaj Sir</Text>{" "}
                    by typing below, or click{" "}
                    <Text style={styles.bold}>Next →</Text> to continue.
                  </Text>
                  <Pressable style={styles.nextButton} onPress={handleNext}>
                    <Text style={styles.nextButtonText}>Next →</Text>
                  </Pressable>
                </View>
              </>
            )}

            {/* MCQ PHASE */}
            {phaseData.phase_type === "mcq" && (
              <MCQChatScreen
                key={phaseData.react_order_final}
                item={phaseData.phase_json}
                onNext={handleNext}
                studentId={user.id}
                reactOrderFinal={phaseData.react_order_final}
                hideInternalNext={false}
                isBookmarked={phaseData.is_bookmarked}
                reviewMode={true}
                phaseUniqueId={phaseData.phase_json.id}
              />
            )}

            {/* CHAT HISTORY */}
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


            {/* ⭐ NEXT AFTER MENTOR REPLY */}
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

        {/* FIXED INPUT */}
        <View style={styles.fixedBottom}>
          <MessageInput
            placeholder={
              isSending ? "Waiting for mentor..." : "Type your message..."
            }
            disabled={!canType || isSending}
            onSend={async (text) => {
              if (!text.trim() || !user?.id || isSending) return;
              setIsSending(true);
              setIsTyping(true);
              setConversation((p) => [...p, { role: "student", content: text }]);

              try {
                const res = await fetch(ORCHESTRATOR_URL, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    action: "review_chat",
                    student_id: user.id,
                    subject_id: selectedSubject,
                    react_order_final: phaseData.react_order_final,
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
                console.error("Chat send error:", err);
              } finally {
                setIsSending(false);
                setIsTyping(false);
              }
            }}
          />

          <View style={styles.bottomNavContainer}>
            <BottomNav />
          </View>
        </View>

        {/* MODALS */}
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
        />
        <RegistrationModal
          visible={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          onRegister={handleRegister}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

// -----------------------------------------------------------------------
// STYLES
// -----------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerText: { color: theme.colors.text, fontSize: 16, fontWeight: "600" },
  scroll: { flex: 1 },

  loginText: { color: theme.colors.text, fontSize: 15, marginBottom: 8 },
  signInButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  signInText: { color: "#fff", fontSize: 14, fontWeight: "600" },

  nextPrompt: {
    marginTop: 10,
    alignItems: "center",
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

  completionCard: {
    backgroundColor: "#1a3a2e",
    borderWidth: 1,
    borderColor: "#25D366",
    borderRadius: 16,
    paddingVertical: 30,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  completionTitle: {
    color: "#25D366",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 10,
  },
  completionSubtitle: {
    color: "#e1e1e1",
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: "#25D366",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  doneButtonText: { color: "#000", fontWeight: "700", fontSize: 16 },

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
  header: {
  paddingHorizontal: theme.spacing.lg,
  paddingVertical: theme.spacing.md,
  borderBottomWidth: 1,
  borderBottomColor: theme.colors.border,
  flexDirection: "row",
  justifyContent: "space-between", // 👈 ensures title on left, counter on right
  alignItems: "center",
},

progressCount: {
  color: "#25D366",
  fontSize: 15,
  fontWeight: "600",
},
  subjectName: {
  color: "#ccc",
  fontSize: 15,
  fontWeight: "600",
  textAlign: "center",
  marginTop: 6,
},

});

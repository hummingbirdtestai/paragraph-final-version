//app/flashcards.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
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
import FlashcardSubjectSelection from "@/components/types/FlashcardSubjectSelection";
import FlashcardScreen from "@/components/types/FlashcardScreen";
import { Bookmark, Filter } from "lucide-react-native";
import FlashcardsScreen from "@/components/landing/FlashcardIntro";
import PageHeader from "@/components/common/PageHeader";

export default function FlashcardsChatScreen() {
  const { user, loginWithOTP, verifyOTP } = useAuth();
  const isLoggedIn = !!user;
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [canType, setCanType] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phaseData, setPhaseData] = useState<any>(null);
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [profile, setProfile] = useState(null);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [containersVisible, setContainersVisible] = useState(true);
  const [hasScrolled, setHasScrolled] = useState(false);


  // ───────────────────────────────────────────────
// CHECK PROFILE AFTER LOGIN / REFRESH
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

    // 1️⃣ If no profile → force registration
    if (!profileRow || !profileRow.name || profileRow.name.trim() === "") {
      setShowRegistrationModal(true);
      return;
    }

    // 2️⃣ If inactive → block access
    if (profileRow.is_active === false) {
      setShowBlockedModal(true);
    }
  };

  loadProfile();
}, [user]);



  // ───────────────────────────────────────────────
  // OTP / LOGIN / REGISTER
  // ───────────────────────────────────────────────
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


  const handleResendOTP = async () => {
  console.log("-------------------------------------------------");
  console.log("[A] handleResendOTP triggered 🔁");

  try {
    console.log("[B] Current phoneNumber:", phoneNumber);

    if (!phoneNumber) {
      console.error("[C] ❌ No phone number in state — resend will abort!");
      return;
    }

    const formattedPhone = phoneNumber.startsWith("+91")
      ? phoneNumber
      : `+91${phoneNumber}`;
    console.log("[D] formattedPhone for resend:", formattedPhone);

    const { error } = await loginWithOTP(formattedPhone);
    console.log("[E] Supabase resend response:", { error });

    if (error) throw error;

    console.log("[F] ✅ OTP resent successfully");
  } catch (err) {
    console.error("[G] ❌ Resend OTP Error:", err);
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



  // ───────────────────────────────────────────────
// NEXT HANDLER
// ───────────────────────────────────────────────
const handleNext = async () => {
  console.log("🟢 [Next] Button clicked!");

  if (!user?.id) {
    console.warn("⚠️ [Next] No user ID found — please login first.");
    return;
  }

  if (!phaseData) {
    console.warn("⚠️ [Next] No phaseData present.");
    return;
  }

  console.log("🔍 [Next] phaseData keys:", Object.keys(phaseData));
  console.log("📦 [Next] Current phaseData:", phaseData);
  console.log("👤 user.id:", user.id);
  console.log("📘 subject_id:", phaseData.subject_id);
  console.log("🔢 react_order_final:", phaseData.react_order_final);

  // 🩹 Fallback patch — ensure subject_id exists before proceeding
if (!phaseData.subject_id && phaseData.subject) {
  phaseData.subject_id = phaseData.subject; // if backend returned only "subject"
  console.warn("⚠️ Patched missing subject_id from subject name:", phaseData.subject);
}


  if (!phaseData.subject_id) {
    console.error("❌ [Next] subject_id is missing! Cannot proceed.");
    return;
  }

  try {
    const res = await fetch(
      "https://flashcard-orchestra-production.up.railway.app/flashcard_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "next_flashcard",
          student_id: user.id,
          subject_id: phaseData.subject_id,
          react_order_final: phaseData.react_order_final,
        }),
      }
    );

  const data = await res.json();   // <-- ADD THIS LINE
  // ✅ Check if flow is finished
if (data.completed) {
  console.log("🎉 All flashcards completed");
  setAllCompleted(true);
  setPhaseData(null);
  setCanType(false);
  return;
}


    console.log("📨 [Next] Raw backend data:", data);

    if (!res.ok) {
      console.error("💥 [Next] HTTP error:", res.statusText);
      return;
    }
    if (data.error) {
      console.error("💥 [Next] Backend error:", data.error);
      return;
    }

    // 🧩 Normalize backend response
    const parsed = {
      ...data,
      mentor_reply:
        typeof data.mentor_reply === "string"
          ? JSON.parse(data.mentor_reply)
          : data.mentor_reply,
      phase_json:
        typeof data.phase_json === "string"
          ? JSON.parse(data.phase_json)
          : data.phase_json,
      element_id: data.element_id,
  is_bookmark: data.is_bookmark,
    };

    // 🔧 Patch subject_id if backend omitted or camelCased it
    parsed.subject_id =
      data.subject_id || data.subjectId || phaseData?.subject_id;

    console.log("✅ [Next] Parsed data ready:", parsed);

    if (data.concept && !parsed.mentor_reply?.concept) {
      parsed.mentor_reply = {
        ...parsed.mentor_reply,
        concept: data.concept,
      };
    }

    setPhaseData(parsed);
    setConversation([]);
    scrollViewRef.current?.scrollTo({ y: 0, animated: true }); // 👈 reset scroll position
    console.log("🎯 [Next] Phase updated successfully!");
  } catch (err) {
    console.error("💥 [Next] Exception caught:", err);
  }
};

  // ───────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>

      {(containersVisible || !isMobile) && (
        <PageHeader title="Flashcards">
          {phaseData?.seq_num && phaseData?.total_count ? (
            <Text style={styles.progressCount}>
              {phaseData.seq_num} / {phaseData.total_count}
            </Text>
          ) : null}
        </PageHeader>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => {
          const offsetY = e.nativeEvent.contentOffset.y;

          if (isMobile && offsetY > 10) {
            if (!hasScrolled) {
              setHasScrolled(true);
            }
            if (containersVisible) {
              setContainersVisible(false);
            }
          }
        }}
        scrollEventThrottle={16}
      >
  {/* 🗨️ Render live chat messages */}
  {!isLoggedIn ? (
  <FlashcardsScreen onSignUp={() => setShowLoginModal(true)} />
): !phaseData && allCompleted ? (
  /* 🎉 ALL COMPLETED SCREEN */
  <View style={{ paddingTop: 100, alignItems: "center" }}>
    <Text
      style={{
        color: "#25D366",
        fontSize: 22,
        fontWeight: "700",
        marginBottom: 12,
      }}
    >
      🎉 All Flashcards Completed!
    </Text>

    <Text
      style={{
        color: "#ccc",
        fontSize: 16,
        textAlign: "center",
        paddingHorizontal: 20,
        lineHeight: 24,
        marginBottom: 30,
      }}
    >
      Excellent work! You have completed all flashcards in this subject.
      {"\n\n"}
      Select another subject to continue learning.
    </Text>

    <Pressable
      onPress={() => {
        setAllCompleted(false);
        setPhaseData(null);
        setCanType(false);
      }}
      style={{
        backgroundColor: "#25D366",
        paddingVertical: 10,
        paddingHorizontal: 26,
        borderRadius: 10,
      }}
    >
      <Text
        style={{
          color: "#000",
          fontWeight: "700",
          fontSize: 16,
        }}
      >
        ← Back to Subjects
      </Text>
    </Pressable>
  </View>

): !phaseData ? (
    <FlashcardSubjectSelection
  studentId={user?.id}
  onSubjectSelect={async (studentId, subjectId, intent) => {
  if (!studentId) return;

  try {
    const res = await fetch(
      "https://flashcard-orchestra-production.up.railway.app/flashcard_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start_flashcard",
          student_id: studentId,
          subject_id: subjectId,
        }),
      }
    );

   const data = await res.json();
console.log("📥 start_flashcard response:", data);

// ✅ SAFE COMPLETION DETECTOR
// ⭐ Detect backend completion signal
if (data.completed === true) {
  console.log("🎉 All flashcards completed (backend response)");
  setAllCompleted(true);
  setPhaseData(null);
  setCanType(false);
  return;
}



// ❌ 2. Handle other backend errors
if (!res.ok || data.error) {
  console.error("💥 Backend error:", data.error || res.statusText);
  return;
}

console.log("✅ Flashcard phase loaded:", data);


    const parsed = {
      ...data,
      mentor_reply:
        typeof data.mentor_reply === "string"
          ? JSON.parse(data.mentor_reply)
          : data.mentor_reply,
      phase_json:
        typeof data.phase_json === "string"
          ? JSON.parse(data.phase_json)
          : data.phase_json,
      element_id: data.element_id,
  is_bookmark: data.is_bookmark,
    };
    // 🩹 Ensure subject_id is stored (important for NEXT call)
parsed.subject_id = data.subject_id || subjectId;


    // 🧠 Inject concept into mentor_reply for unified rendering
    if (data.concept && !parsed.mentor_reply?.concept) {
      parsed.mentor_reply = {
        ...parsed.mentor_reply,
        concept: data.concept,
      };
    }

    setPhaseData(parsed);
    setCanType(true);
  } catch (err) {
    console.error("💥 Error starting flashcards:", err);
  }
}}

/>
  ) : (
    <>
      {/* 💬 1️⃣ Concept bubble */}
      {/* 🧩 1️⃣ Concept (main concept explanation) */}
{phaseData?.phase_json?.concept_json ? (
  <ConceptChatScreen
    item={phaseData.phase_json.concept_json}
    studentId={phaseData.student_id}
  />
) : phaseData?.mentor_reply?.concept ? (
  <MentorBubbleReply markdownText={phaseData.mentor_reply.concept} />
) : null}

{/* 💬 2️⃣ Mentor reply / motivational intro */}
{phaseData?.mentor_reply?.mentor_intro && (
  <View>
    {/* 🧠 Actual mentor intro content */}
   <MentorIntroScreen data={phaseData.mentor_reply} showBookmark={true} />

  </View>
)}



{/* 🎴 3️⃣ Flashcard deck */}
{phaseData?.phase_json && (
  <FlashcardScreen
    key={phaseData.seq_num}
    item={phaseData.phase_json}
    studentId={phaseData.student_id}

    // ⭐ REQUIRED FOR BOOKMARK UI
    isBookmarked={phaseData?.is_bookmark}
    elementId={phaseData?.element_id}
    subjectId={phaseData?.subject_id}
    subjectName={phaseData?.subject}
  />
)}



      {/* ➡️ Same “Next →” section as ChatScreen */}
      <View style={styles.nextPrompt}>
        <Text style={styles.promptText}>
          <Text style={styles.bold}>Ask Dr Murali Bharadwaj Sir</Text>{" "}
          by typing your question below, or click{" "}
          <Text style={styles.bold}>Next →</Text> to continue learning.
        </Text>

        <Pressable style={styles.nextButton} onPress={handleNext}>
  <Text style={styles.nextButtonText}>Next →</Text>
</Pressable>

      </View>
    </>
  )}
  {/* 🗨️ Render chat messages BELOW the phase UI */}
  {conversation.map((msg, index) => {
  // 🟢 Student message
  if (msg.role === "student") {
    return (
      <React.Fragment key={index}>
        <StudentBubble text={msg.content} />

        {/* ⭐ Typing indicator appears right after student message */}
        {isTyping && (
          <MentorBubbleReply markdownText={"💬 *Dr. Murali Bharadwaj is typing…*"} />
        )}
      </React.Fragment>
    );
  }

  // 🟢 Mentor message
  if (msg.role === "assistant") {
    return (
      <React.Fragment key={index}>
        <MentorBubbleReply markdownText={msg.content} />

        <View style={styles.nextPrompt}>
          <Text style={styles.promptText}>
            <Text style={styles.bold}>Ask Dr Murali Bharadwaj Sir</Text>{" "}
            by typing your question below, or click{" "}
            <Text style={styles.bold}>Next →</Text> to continue learning.
          </Text>

          <Pressable style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next →</Text>
          </Pressable>
        </View>
      </React.Fragment>
    );
  }

  return null;
})}

</ScrollView>

{isLoggedIn && phaseData && !allCompleted && (
  <MessageInput
    placeholder={isSending ? "Waiting for mentor..." : "Type your message..."}
    disabled={!canType || isSending}
    onSend={async (text) => {
      if (!text.trim() || !user?.id || isSending) return;

      setIsSending(true);
      setIsTyping(true);

      // local student echo
      setConversation((prev) => [...prev, { role: "student", content: text }]);

      try {
        const res = await fetch(
          "https://flashcard-orchestra-production.up.railway.app/flashcard_orchestrate",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "chat_flashcard",
              student_id: user.id,
              message: text,
            }),
          }
        );

        const data = await res.json();

        if (data?.mentor_reply) {
          setIsTyping(false);

          let replyText = data.mentor_reply;

          if (typeof replyText === "object" && replyText !== null) {
            replyText =
              replyText.mentor_intro ||
              replyText.concept ||
              replyText.message ||
              JSON.stringify(replyText, null, 2);
          }

          setConversation((prev) => [
            ...prev,
            { role: "assistant", content: replyText },
          ]);
        }
      } catch (err) {
        console.error("💥 Chat send error:", err);
      } finally {
        setIsSending(false);
        setIsTyping(false);
      }
    }}
  />
)}

      <BottomNav />

      {isMobile && !containersVisible && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setContainersVisible(true)}
        >
          <Filter size={24} color="#fff" />
        </TouchableOpacity>
      )}

      {/* AUTH MODALS */}
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


      {showBlockedModal && (
  <View
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.9)",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      zIndex: 99999,
    }}
  >
    <Text style={{ color: "#fff", fontSize: 24, fontWeight: "700", marginBottom: 12 }}>
      Subscription Required
    </Text>
    <Text style={{ color: "#ccc", fontSize: 16, textAlign: "center", marginBottom: 20 }}>
      Your account is inactive.  
      Contact our helpline to activate your subscription.
    </Text>
    <Text style={{ color: "#25D366", fontSize: 20, fontWeight: "700" }}>
      +91-XXXXXXXXXX
    </Text>
  </View>
)}

    </SafeAreaView>
  );
}

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
    fontWeight: "400",
  },
  scroll: {
    flex: 1,
  },
  signInButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    alignSelf: "flex-start",
  },
  signInText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  nextPrompt: {
  marginTop: 8,          // ⬅️ reduced from 20 → 8 (tighten space above)
  alignItems: "center",
  justifyContent: "center",
  paddingTop: 8,          // ⬅️ smaller top padding
  paddingBottom: 12,      // ⬅️ balanced bottom
  borderTopWidth: 0.5,    // ⬅️ thinner divider
  borderColor: "#222",    // ⬅️ slightly darker line for subtle separation
},
  promptText: {
    color: "#e1e1e1",
    fontSize: 15,
    marginBottom: 10,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  bold: {
    fontWeight: "700",
    color: "#25D366", // green highlight
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
  progressCount: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: [{ translateY: -8 }],
    color: "#25D366",
    fontWeight: "700",
    fontSize: 16,
  },

  fab: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#25D366",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});
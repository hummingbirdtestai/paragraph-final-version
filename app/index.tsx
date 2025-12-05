// app/index.tsx
import React, { useState,useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ScrollView,
  Alert,
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
import PracticeIntro from "@/components/landing/PracticeIntro";
import LogoHeader from "@/components/common/LogoHeader";
import { useRouter } from "expo-router";



export default function ChatScreen() {
  const { user, loginWithOTP, verifyOTP } = useAuth();
  const router = useRouter();
  const [profileLoaded, setProfileLoaded] = useState(false);
  const isLoggedIn = !!user;
  const [canType, setCanType] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phaseData, setPhaseData] = useState<any>(null);
  const [conversation, setConversation] = useState<
    { role: string; content: string }[]
  >([]);
  const [isSending, setIsSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false); // ⭐ NEW
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [lastPhase, setLastPhase] = useState<any>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [currentMCQ, setCurrentMCQ] = useState<any>(null);
  const [isMCQAnswered, setIsMCQAnswered] = useState(false);
  const [allCompleted, setAllCompleted] = useState(false);
  const [selectedSubjectName, setSelectedSubjectName] = useState<string | null>(null);


 

React.useEffect(() => {
  const checkProfile = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    if (!profile || !profile.name || profile.name.trim() === "") {
      setShowRegistrationModal(true);
    }

    setProfileLoaded(true);
  };

  checkProfile();
}, [user]);



  // ───────────────────────────────────────────────
  // AUTH: OTP / REGISTER
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

    const { error } = await supabase.from("users").update({
  name: name.trim(),
  phone: cleanedPhone,
  is_active: true,
})
.eq("id", authUser.id);


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
  // BACKEND CALLS — NORMAL FLOW ONLY
  // ───────────────────────────────────────────────
  const ORCHESTRATOR_URL =
    "https://paragraph-pg-production.up.railway.app/orchestrate";

  /** 🚀 Start normal concept learning flow */
  const handleStart = async (subjectId: string) => {
    if (!user?.id) return;
    console.log("🚀 handleStart() → normal learning flow");

    try {
      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          student_id: user.id,
          subject_id: subjectId,
        }),
      });
      const data = await res.json();

      if (data?.phase_type && data?.phase_json) {
  setPhaseData({ ...data, source: "start" });
  setCanType(true);
  setSelectedSubject(subjectId);
} else {
  console.warn("⚠️ No more concepts — showing completion screen");

  setAllCompleted(true);
  setPhaseData(null);
  setSelectedSubject(subjectId);
}

    } catch (err) {
      console.error("❌ Orchestrator error:", err);
    }
  };

const handleNext = async () => {
  const currentReactOrder =
    phaseData?.react_order_final || lastPhase?.react_order_final;

  if (!currentReactOrder || !user?.id) return;

  try {
    setIsSending(true);
    const response = await fetch(ORCHESTRATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "next",
        student_id: user.id,
        subject_id: selectedSubject,
        react_order: currentReactOrder,
      }),
    });

    const data = await response.json();
    console.log("➡️ Next Review Data:", data);

   if (!data?.phase_json) {
  setAllCompleted(true);   // 🔥 show final screen
  setPhaseData(null);      // remove old content
  return;
}


    setConversation([]);
    setPhaseData({ ...data, refreshedAt: Date.now() }); // 🔥 ensures new render
    setLastPhase(data);
    setCurrentMCQ(data.phase_json[0]);
    setIsMCQAnswered(false); // ✅ reset for next MCQ
    requestAnimationFrame(() => {
  requestAnimationFrame(() => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  });
});
  } catch (err) {
    console.error("❌ Next review fetch error:", err);
  } finally {
    setIsSending(false);
  }
};




  // ───────────────────────────────────────────────
  // UI
  // ───────────────────────────────────────────────
return (
  <SafeAreaView style={styles.container}>

    <View style={styles.headerWrapper}>
  <LogoHeader />

  {selectedSubjectName && (
    <Text style={styles.subjectTitle}>{selectedSubjectName}</Text>
  )}

  {phaseData?.seq_num && phaseData?.total_count && (
    <View style={styles.progressFloating}>
      <Text style={styles.progressFloatingText}>
        {phaseData?.phase_type === "mcq" ? "🧩 MCQ" : "🧠 Concept"}{" "}
        {phaseData.seq_num} / {phaseData.total_count}
      </Text>
    </View>
  )}
</View>


    <ScrollView
      ref={scrollRef}
      style={styles.scroll}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {!isLoggedIn ? (
        <PracticeIntro onSignUp={() => setShowLoginModal(true)} />
      ) : (!phaseData && !allCompleted) ? (
        <ChatSubjectSelection
          studentId={user.id}
          onSubjectSelect={(studentId, subjectId,subjectName, intent) => {
            if (intent === "start_concept") {
              setSelectedSubject(subjectId);
              setSelectedSubjectName(subjectName); 
              handleStart(subjectId);
            }
          }}
        />
      ) : (
        <>
          {/* 🎉 When all concepts are completed */}
          {allCompleted && (
            <View style={{ paddingTop: 100, alignItems: "center" }}>
              <Text
                style={{
                  color: "#25D366",
                  fontSize: 22,
                  fontWeight: "700",
                  marginBottom: 12,
                }}
              >
                🎉 All Concepts Completed!
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
                Excellent work! You have completed all concepts in this subject.
                {"\n\n"}
                You can return and select another subject anytime.
              </Text>

              <Pressable
                onPress={() => router.push("/")}

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
          )}

          {/* SHOW NORMAL FLOW ONLY IF NOT COMPLETED */}
          {!allCompleted && (
            <>
              {phaseData?.mentor_reply?.mentor_intro && (
                <MentorIntroScreen
                  data={phaseData.mentor_reply}
                  showBookmark={false}
                />
              )}

              {/* 🧠 Concept phase */}
              {phaseData?.phase_type === "concept" && phaseData?.phase_json && (
                <>
                  <ConceptChatScreen
  item={phaseData.phase_json}
  studentId={phaseData.student_id}
  isBookmarked={phaseData?.is_bookmarked ?? false}     // ⭐ NEW
  phaseUniqueId={phaseData?.pointer_id?.toString()}     // ⭐ NEW
  reviewMode={false}                                     // ⭐ NEW
/>

                  <View style={styles.nextPrompt}>
                    <Text style={styles.promptText}>
                      <Text style={styles.bold}>
                        Ask Dr Murali Bharadwaj Sir
                      </Text>{" "}
                      by typing your question below, or click{" "}
                      <Text style={styles.bold}>Next →</Text> to continue.
                    </Text>
                    <Pressable style={styles.nextButton} onPress={handleNext}>
                      <Text style={styles.nextButtonText}>Next →</Text>
                    </Pressable>
                  </View>
                </>
              )}

              {/* 🧩 MCQ phase */}
              {phaseData?.phase_type === "mcq" && phaseData?.phase_json && (
                <MCQChatScreen
  item={phaseData.phase_json}
  onNext={handleNext}
  studentId={phaseData.student_id}
  reactOrderFinal={phaseData.react_order_final}
  onAnswered={() => setIsMCQAnswered(true)}
  
  isBookmarked={phaseData?.is_bookmarked ?? false}       // ⭐ NEW
  phaseUniqueId={phaseData?.pointer_id?.toString()}       // ⭐ NEW
  reviewMode={false}                                      // ⭐ NEW
/>

              )}
            </>
          )}
        </>
      )}
        {/* 🗨️ Chat Messages */}
        {conversation.map((msg, index) =>
          msg.role === "student" ? (
            <StudentBubble key={index} text={msg.content} />
          ) : (
            <MentorBubbleReply key={index} markdownText={msg.content} />
          )
        )}
        {conversation.length > 0 &&
        conversation[conversation.length - 1].role === "assistant" && (
          <View style={styles.nextPrompt}>
            <Text style={styles.promptText}>
              <Text style={styles.bold}>Dr Murali Bharadwaj Sir</Text> has finished
              guiding you — click <Text style={styles.bold}>Next →</Text> to continue.
            </Text>
            <Pressable style={styles.nextButton} onPress={handleNext}>
              <Text style={styles.nextButtonText}>Next →</Text>
            </Pressable>
          </View>
        )}
      {isTyping && (
  <MentorBubbleReply
    markdownText={"💬 *Dr. Murali Bharadwaj is typing…*"}
  />
)}

      </ScrollView>

      {/* 💬 Message input */}
      <MessageInput
 placeholder={
  phaseData?.phase_type === "mcq" && !isMCQAnswered
    ? "🧩 Answer the MCQ to continue..."
    : isSending
    ? "Waiting for mentor..."
    : "Type your message..."
}
 disabled={
  !canType ||
  isSending ||
  (phaseData?.phase_type === "mcq" && !isMCQAnswered)
}
  onSend={async (text) => {
    if (
      !text.trim() ||
      !user?.id ||
      isSending ||
      (phaseData?.phase_type === "mcq" && !isMCQAnswered) // 🚫 Block send action too
    )
      return;

    setIsSending(true);
    setIsTyping(true);
    setConversation((prev) => [
      ...prev,
      { role: "student", content: text },
    ]);

    try {
      const res = await fetch(ORCHESTRATOR_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "chat",
          student_id: user.id,
          subject_id: selectedSubject,
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
  }}
/>

      <BottomNav />

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

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  headerWrapper: {
    position: 'relative',
  },
  scroll: { flex: 1 },
  signInButton: {
    backgroundColor: theme.colors.accent,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: theme.borderRadius.md,
    alignSelf: "flex-start",
  },
  signInText: { color: "#fff", fontSize: 14, fontWeight: "600" },
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
  progressFloating: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "#25D366",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    zIndex: 999,
    shadowColor: "#25D366",
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  progressFloatingText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 13,
  },
  subjectTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#fff",
  textAlign: "center",
  marginTop: 8,
},

});
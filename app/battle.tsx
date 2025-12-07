// app/battle.tsx
import React, { useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import BattleIntroScreen from "@/components/landing/BattleIntro";
import BattleSubjectSelection from "@/components/battle/BattleSubjectSelection";
import BattleListScreen from "@/components/battle/BattleListScreen";
import BattleWaitingRoom from "@/app/BattleWaitingRoom";
import WarRoom from "@/app/WarRoom";
import MainLayout from "@/components/MainLayout";


export default function BattleScreen() {
  const { user, loginWithOTP, verifyOTP } = useAuth();
  const isLoggedIn = !!user;

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  // 🔹 Flow control
  const [phase, setPhase] = useState<"selection" | "list" | "waiting" | "war">("selection");
  const [selectedBattleKey, setSelectedBattleKey] = useState<string | null>(null);
  const [selectedBattle, setSelectedBattle] = useState<any>(null);
  const [profile, setProfile] = useState(null);
const [showBlockedModal, setShowBlockedModal] = useState(false);


  // ───────────────────────────────────────────────
// 🔍 CHECK PROFILE → ENFORCE NAME + SUBSCRIPTION
// ───────────────────────────────────────────────
React.useEffect(() => {
  const loadProfile = async () => {
    if (!user) return;

    const { data: profileRow } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(profileRow);

    // 1️⃣ No name → show Registration Modal
    if (!profileRow || !profileRow.name || profileRow.name.trim() === "") {
      setShowRegistrationModal(true);
      return;
    }

    // 2️⃣ is_active = FALSE → BLOCK ACCESS
    if (profileRow.is_active === false) {
      setShowBlockedModal(true);
      return;
    }
  };

  loadProfile();
}, [user]);


  // ───────────────────────────────────────────────
  // 🔐 LOGIN / OTP FLOW
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
  // 🔹 FLOW CONTROL HANDLERS
  // ───────────────────────────────────────────────
  const handleJoinBattle = (battle: any) => {
    console.log("🎯 Joined battle:", battle.title);
    setSelectedBattle(battle);
    setPhase("waiting");
  };

  const handleBattleStart = () => {
    console.log("🚀 Battle started");
    setPhase("war");
  };

  const handleExitWarRoom = () => {
    console.log("⬅️ Exiting war room → back to selection");
    setPhase("selection");
    setSelectedBattle(null);
    setSelectedBattleKey(null);
  };

  // ───────────────────────────────────────────────
  // 🔹 MAIN RENDER FLOW
  // ───────────────────────────────────────────────
  return (
    <MainLayout>
    <SafeAreaView style={styles.container}>
      {!isLoggedIn ? (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
          <BattleIntroScreen onJoinBattle={() => setShowLoginModal(true)} />
        </ScrollView>
      ) : (
        <>
          {phase === "selection" && (
            <BattleSubjectSelection
              onSelectBattleList={(battle_key) => {
                console.log("➡️ Selected battle category:", battle_key);
                setSelectedBattleKey(battle_key);
                setPhase("list");
              }}
            />
          )}

          {phase === "list" && (
            <BattleListScreen
              onJoinBattle={handleJoinBattle}
              onBack={() => setPhase("selection")}
            />
          )}

          {phase === "waiting" && selectedBattle && (
            <BattleWaitingRoom battle={selectedBattle} onBattleStart={handleBattleStart} />
          )}

          {phase === "war" && selectedBattle && (
            <WarRoom battle={selectedBattle} onExit={handleExitWarRoom} />
          )}
        </>
      )}

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
      />
      <RegistrationModal
  visible={showRegistrationModal}
  onClose={() => {}}
  onRegister={handleRegister}
/>

    </SafeAreaView>
      </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0a0e1a" },
  scroll: { flex: 1 },
});

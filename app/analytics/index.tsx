// app/analytics/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import { BottomNav } from "@/components/navigation/BottomNav";
import AnalyticsLanding from "@/components/landing/AnalyticsLanding";
import PageHeader from "@/components/common/PageHeader";


import {
  TrendingUp,
  BookOpen,
  Target,
  Brain,
  GraduationCap,
  Swords,
  ClipboardCheck,
  Zap,
  BarChart3,
  Activity,
  Users,
} from "lucide-react-native";

// -------------------------------------------------------------------------
// Dashboard menu cards
// -------------------------------------------------------------------------
const menuCards = [
  { id: "1", title: "Focus", icon: TrendingUp, route: "/analytics", color: "#25D366", category: "Practice" },
  { id: "2", title: "Progress", icon: BookOpen, route: "/analytics/progress", color: "#3B82F6", category: "Practice" },
  { id: "3", title: "Accuracy", icon: Target, route: "/analytics/accuracy", color: "#F59E0B", category: "Practice" },

  { id: "4", title: "Learning Gap", icon: Brain, route: "/analytics/learning-gap", color: "#8B5CF6", category: "Flashcards" },
  { id: "5", title: "Mastery", icon: GraduationCap, route: "/analytics/mastery", color: "#10B981", category: "Flashcards" },

  { id: "6", title: "Test Results", icon: ClipboardCheck, route: "/analytics/test-results", color: "#06B6D4", category: "Mock Tests" },
  { id: "7", title: "Performance", icon: Zap, route: "/analytics/mock-analysis", color: "#F43F5E", category: "Mock Tests" },
  { id: "9", title: "Leaderboard", icon: BarChart3, route: "/analytics/leaderboard", color: "#06B6D4", category: "Mock Tests" },

  { id: "8", title: "Battle Stats", icon: Swords, route: "/analytics/battle-analytics", color: "#EC4899", category: "Battles" },
  { id: "10", title: "Battle Performance", icon: Activity, route: "/analytics/battle-summary", color: "#8B5CF6", category: "Battles" },
  { id: "11", title: "Battle Leaderboard", icon: Users, route: "/analytics/battle-leaderboard", color: "#F59E0B", category: "Battles" },
];

const categories = ["Practice", "Flashcards", "Mock Tests", "Battles"];

// -------------------------------------------------------------------------
// MAIN SCREEN
// -------------------------------------------------------------------------
export default function AnalyticsIndexScreen() {
  const { user, loginWithOTP, verifyOTP } = useAuth();
  const isLoggedIn = !!user;

  const router = useRouter();
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  // AUTH STATE
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile, setProfile] = useState(null);
const [showBlockedModal, setShowBlockedModal] = useState(false);


  // ───────────────────────────────────────────────
// 🔍 CHECK PROFILE: NAME + SUBSCRIPTION
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

    // 1️⃣ If user record missing OR no name → force registration
    if (!profileRow || !profileRow.name || profileRow.name.trim() === "") {
      setShowRegistrationModal(true);
      return;
    }

    // 2️⃣ If inactive → block Analytics access
    if (profileRow.is_active === false) {
      setShowBlockedModal(true);
      return;
    }
  };

  loadProfile();
}, [user]);


  // -----------------------------------------------------------------------
  // AUTH FUNCTIONS
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
      console.error(err);
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
  // RENDER: DASHBOARD
  // -----------------------------------------------------------------------
  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      {/* HEADER */}
      <PageHeader title="Analytics" subtitle="Select a module" />

      {/* GRID */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.mainContainer, isDesktop && styles.mainContainerDesktop]}>
          {categories.map((category) => {
            const cards = menuCards.filter((c) => c.category === category);

            return (
              <View key={category} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{category}</Text>
                  <View style={styles.sectionDivider} />
                </View>

                <View
                  style={[
                    styles.cardsGrid,
                    isDesktop && styles.cardsGridDesktop,
                    isDesktop && category === "Battles" && styles.cardsGridCentered,
                  ]}
                >
                  {cards.map((card) => {
                    const Icon = card.icon;
                    return (
                      <Pressable
                        key={card.id}
                        style={({ pressed }) => [
                          styles.card,
                          isDesktop && styles.cardDesktop,
                          pressed && styles.cardPressed,
                        ]}
                        onPress={() => router.push(card.route)}
                      >
                        <View
                          style={[
                            styles.iconContainer,
                            isDesktop && styles.iconContainerDesktop,
                            { backgroundColor: card.color + "20" },
                          ]}
                        >
                          <Icon
                            size={isDesktop ? 48 : 28}
                            color={card.color}
                            strokeWidth={2}
                          />
                        </View>

                        <Text
                          style={[
                            styles.cardTitle,
                            isDesktop && styles.cardTitleDesktop,
                          ]}
                        >
                          {card.title}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );

  // -----------------------------------------------------------------------
  // RENDER: LANDING PAGE
  // -----------------------------------------------------------------------
  const renderLanding = () => (
  <AnalyticsLanding
    onSignUp={() => setShowLoginModal(true)}
    onSignIn={() => setShowLoginModal(true)}
    onShowAnalytics={() => setShowLoginModal(true)}
  />
);


  // -----------------------------------------------------------------------
  // FINAL RETURN (LANDING OR DASHBOARD)
  // -----------------------------------------------------------------------
  return (
    <SafeAreaView style={styles.container}>
      {!isLoggedIn ? renderLanding() : renderDashboard()}

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
      />

      <RegistrationModal
  visible={showRegistrationModal}
  onClose={() => {}}
  onRegister={handleRegister}
/>

    </SafeAreaView>
  );
}

// -------------------------------------------------------------------------
// STYLES
// -------------------------------------------------------------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  // Landing
  landingTitle: { fontSize: 26, color: "#fff", marginBottom: 20, fontWeight: "bold" },
  primaryCTA: {
    backgroundColor: "#00ff88",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  primaryCTAText: { color: "#000", fontSize: 18, fontWeight: "bold" },
  secondaryCTA: {
    borderWidth: 2,
    borderColor: "#00ff88",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  secondaryCTAText: { color: "#00ff88", fontSize: 17, fontWeight: "bold" },

  // Dashboard
  dashboardContainer: { flex: 1, backgroundColor: "#0d0d0d" },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
    backgroundColor: "#0d0d0d",
  },
  headerDesktop: { paddingTop: 32 },
  headerContent: {},
  headerContentDesktop: {
    maxWidth: 1200,
    marginHorizontal: "auto",
  },
  headerTitle: { fontSize: 30, fontWeight: "700", color: "#fff" },
  headerSubtitle: { fontSize: 13, color: "#94A3B8" },

  scrollView: { flex: 1 },
  mainContainer: { padding: 16 },
  mainContainerDesktop: {
    maxWidth: 1300,
    marginHorizontal: "auto",
  },

  // Sections
  section: { marginBottom: 32 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  sectionTitle: { fontSize: 18, color: "#fff", fontWeight: "700" },
  sectionDivider: { flex: 1, height: 1, backgroundColor: "#334155" },

  // Cards grid
  cardsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  cardsGridDesktop: { gap: 24 },
  cardsGridCentered: { justifyContent: "center" },

  card: {
    width: "31%",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#2a2a2a",
    alignItems: "center",
  },
  cardDesktop: { width: 220, height: 220 },
  cardPressed: { opacity: 0.7 },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 10,
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
  },
  iconContainerDesktop: { width: 80, height: 80, borderRadius: 40 },

  cardTitle: { color: "#fff", fontSize: 14, textAlign: "center" },
  cardTitleDesktop: { fontSize: 16, fontWeight: "700" },
});

export {};

//settings.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { CreditCard, Key, LogOut, LogIn } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/constants/theme';
import { ProfileCard } from '@/components/settings/ProfileCard';
import { SettingsButton } from '@/components/settings/SettingsButton';
import { SettingsLink } from '@/components/settings/SettingsLink';
import { LogoutModal } from '@/components/settings/LogoutModal';
import { LoginModal } from '@/components/auth/LoginModal';
import { OTPModal } from '@/components/auth/OTPModal';
import { RegistrationModal } from '@/components/auth/RegistrationModal';
import { Toast } from '@/components/common/Toast';
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import PageHeader from "@/components/common/PageHeader";
import MainLayout from "@/components/MainLayout";


export default function SettingsScreen() {
  const router = useRouter();
  const { user, loginWithOTP, verifyOTP, logout } = useAuth();
  const isLoggedIn = !!user;
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [profile, setProfile] = useState(null);
const [showBlockedModal, setShowBlockedModal] = useState(false);

  

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user?.id) return;

      console.log("🔄 Fetching user profile for:", user.id);

      const { data, error } = await supabase
        .from("users")
        .select("name, phone")
        .eq("id", user.id)
        .single();

      if (error) {
        console.warn("⚠️ Error loading user profile:", error.message);
        return;
      }

      if (data) {
        console.log("✅ Loaded profile:", data);
        setUserName(data.name || '');
        setUserPhone(data.phone || '');
      }
    };

    loadUserProfile();
  }, [user?.id]);

  // ───────────────────────────────────────────────
// 🔍 CHECK PROFILE: NAME + SUBSCRIPTION
// ───────────────────────────────────────────────
useEffect(() => {
  const loadProfile = async () => {
    if (!user?.id) return;

    const { data: profileRow } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(profileRow);

    // 1️⃣ No name → force registration
    if (!profileRow || !profileRow.name || profileRow.name.trim() === "") {
      setShowRegistrationModal(true);  // Cannot close
      return;
    }

    // 2️⃣ Not active → block screen
    if (profileRow.is_active === false) {
      setShowBlockedModal(true);
      return;
    }
  };

  loadProfile();
}, [user]);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);


  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ visible: true, message, type });
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

const handleSendOTP = async (phone: string) => {
  try {
    console.log("[1] handleSendOTP triggered with:", phone);

    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    console.log("[2] formattedPhone:", formattedPhone);

    setPhoneNumber(phone); // ✅ keep this ABOVE OTP call
    console.log("[3] setPhoneNumber done. State phoneNumber should now be:", phone);

    const { error } = await loginWithOTP(formattedPhone);
    console.log("[4] Supabase loginWithOTP returned:", { error });

    if (error) throw error;

    console.log("[5] ✅ OTP sent successfully — opening OTP modal");
    setShowLoginModal(false);
    setShowOTPModal(true);
    showToast("OTP sent successfully!", "success");
  } catch (err) {
    console.error("[❌] OTP Send Error:", err);
    showToast("Failed to send OTP. Please try again.", "error");
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
    console.log("[B] Current state phoneNumber:", phoneNumber);

    if (!phoneNumber) {
      console.error("[C] ❌ No phone number in state — resend will abort!");
      showToast("Phone number missing. Please reopen login.", "error");
      return;
    }

    const formattedPhone = phoneNumber.startsWith("+91")
      ? phoneNumber
      : `+91${phoneNumber}`;
    console.log("[D] formattedPhone for resend:", formattedPhone);

    console.log("[E] Calling Supabase loginWithOTP...");
    const { data, error } = await loginWithOTP(formattedPhone);
    console.log("[F] Supabase resend response:", { data, error });

    if (error) {
      console.error("[G] ❌ Supabase returned error on resend:", error);
      throw error;
    }

    console.log("[H] ✅ OTP resent request accepted by Supabase");
    showToast("OTP resent successfully!", "success");
  } catch (err) {
    console.error("[I] ❌ Resend OTP Error:", err);
    showToast("Failed to resend OTP. Please try again.", "error");
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




  const handleManageSubscription = () => {
    router.push('/manage-subscription');
  };


  const handleLogout = () => {
    setShowLogoutModal(true);
  };

const confirmLogout = async () => {
  try {
    await logout();
    setShowLogoutModal(false);
    setUserName("");
    setUserPhone("");
    showToast("Logged out successfully", "success");
  } catch (err) {
    console.error("Logout Error:", err);
    showToast("Failed to logout", "error");
  }
};


  const handlePrivacyPolicy = () => {
    router.push('/privacy-policy');
  };

  const handleTerms = () => {
    router.push('/terms');
  };

  const handleAbout = () => {
    router.push('/about');
  };

  const handleHelp = () => {
    router.push('/help');
  };

  const getSubscriptionStatus = () => {
    if (!profile) return "inactive";

    const now = new Date();

    const hasValidTrial =
      profile.trial_expires_at &&
      new Date(profile.trial_expires_at) > now;

    const hasValidSubscription =
      profile.is_paid === true &&
      profile.subscription_end_at &&
      new Date(profile.subscription_end_at) > now;

    return hasValidTrial || hasValidSubscription ? "active" : "inactive";
  };

  return (
    <MainLayout>
    <SafeAreaView style={styles.container}>
      <PageHeader title="Settings" showLogo={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {isLoggedIn ? (
          <>
            <ProfileCard
              name={userName}
              contact={userPhone}
              subscriptionStatus={getSubscriptionStatus()}
            />

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account</Text>
              <SettingsButton
                label="Manage Subscription"
                onPress={handleManageSubscription}
                Icon={CreditCard}
              />
              <SettingsButton
                label="Logout"
                onPress={handleLogout}
                Icon={LogOut}
                variant="danger"
              />
            </View>
          </>
        ) : (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <SettingsButton
              label="Login"
              onPress={handleLogin}
              Icon={LogIn}
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Information</Text>
          <View style={styles.linksContainer}>
            <SettingsLink label="Privacy Policy" onPress={handlePrivacyPolicy} />
            <SettingsLink label="Terms & Conditions" onPress={handleTerms} />
            <SettingsLink label="About Paragraph" onPress={handleAbout} />
            <SettingsLink label="Help & Support" onPress={handleHelp} />
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 1.0.3</Text>
          <Text style={styles.footerText}>Build: 2025-11-25</Text>
          <Text style={styles.footerText}>© 2025 Paragraph Mentor</Text>
        </View>
      </ScrollView>

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
  onClose={() => {}}   // ❌ cannot exit without entering name
  onRegister={handleRegister}
/>

      <LogoutModal
        visible={showLogoutModal}
        onConfirm={confirmLogout}
        onCancel={() => setShowLogoutModal(false)}
      />

      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
    </SafeAreaView>
      </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerText: {
    color: theme.colors.text,
    fontSize: theme.typography.heading.fontSize,
    fontWeight: '400',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xxl,
  },
  section: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.bodySmall.fontSize,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: theme.spacing.md,
  },
  linksContainer: {
    backgroundColor: theme.colors.mentorBubble,
    borderRadius: theme.borderRadius.lg,
    paddingHorizontal: theme.spacing.lg,
  },
  footer: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.typography.caption.fontSize,
    marginBottom: theme.spacing.xs,
  },
});

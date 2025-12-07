import React, { useState } from 'react';
import { View, StyleSheet, useWindowDimensions, Platform } from 'react-native';
import Sidebar from './Sidebar';
import MobileDrawer from './MobileDrawer';
import AppHeader from './AppHeader';
import AuthModal from "@/components/auth/AuthModal";

interface MainLayoutProps {
  children: React.ReactNode;
}

const SIDEBAR_WIDTH = 340;
const MOBILE_BREAKPOINT = 768;

const handleSendOTP = async (phone: string) => {
  try {
    const formatted = phone.startsWith("+91") ? phone : `+91${phone}`;
    await loginWithOTP(formatted);

    setPhoneNumber(phone);
    setShowLoginModal(false);
    setShowOTPModal(true);
  } catch (err) {
    console.error("OTP Send Error", err);
  }
};

const handleVerifyOTP = async (otp: string) => {
  try {
    await verifyOTP(phoneNumber, otp);

    setTimeout(async () => {
      const { data } = await supabase.auth.getUser();
      const authUser = data?.user;
      if (!authUser) return;

      setShowOTPModal(false);

      const { data: existing } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (!existing) {
        setShowRegistrationModal(true);
      }
    }, 300);
  } catch (err) {
    console.error("OTP verify error", err);
  }
};

const handleRegister = async (name: string) => {
  try {
    await registerUser(name, phoneNumber);
    setShowRegistrationModal(false);
  } catch (err) {
    console.error("Registration error", err);
  }
};

export default function MainLayout({ children }: MainLayoutProps) {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup" | null>(null);
  const [authVisible, setAuthVisible] = useState(false);
  // AUTH MODAL STATES
const [showLoginModal, setShowLoginModal] = useState(false);
const [showOTPModal, setShowOTPModal] = useState(false);
const [showRegistrationModal, setShowRegistrationModal] = useState(false);

const [phoneNumber, setPhoneNumber] = useState("");


  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  return (
    <View style={styles.container}>
      {isMobile ? (
        <>
          <AppHeader onMenuPress={openDrawer} showMenu />

          <View style={styles.mobileContent}>{children}</View>

          <MobileDrawer
            visible={drawerVisible}
            onClose={closeDrawer}
            onOpenAuth={(mode) => {
              closeDrawer();
              setAuthMode(mode);
              setAuthVisible(true);
            }}
          />
        </>
      ) : (
        <View style={styles.desktopLayout}>
          <View style={styles.sidebarContainer}>
            <Sidebar
  onOpenAuth={() => {
    setShowLoginModal(true);
  }}
/>

          </View>

          <View style={styles.desktopContent}>{children}</View>
        </View>
      )}

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
  onResend={() => handleSendOTP(phoneNumber)}
/>

<RegistrationModal
  visible={showRegistrationModal}
  onClose={() => {}}
  onRegister={handleRegister}
/>

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',
  },
  desktopLayout: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebarContainer: {
    width: SIDEBAR_WIDTH,
    height: '100%',
  },
  desktopContent: {
    flex: 1,
  },
  mobileContent: {
    flex: 1,
  },
});

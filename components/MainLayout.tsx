// MainLayout.tsx
import React, { useState } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";
import Sidebar from "./Sidebar";
import MobileDrawer from "./MobileDrawer";
import AppHeader from "./AppHeader";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";

const SIDEBAR_WIDTH = 340;
const MOBILE_BREAKPOINT = 768;

export default function MainLayout({ children }) {
  const { loginWithOTP, verifyOTP, registerUser } = useAuth();

  const [drawerVisible, setDrawerVisible] = useState(false);

  // Auth modal state
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState("");

  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  // Inject auth trigger into all children (important!)
  const injectedChild = React.cloneElement(children, {
    onOpenAuth: () => {
      setShowLoginModal(true);
    },
  });

  // OTP FLOW
  const handleSendOTP = async (phone: string) => {
    try {
      const formatted = phone.startsWith("+91") ? phone : `+91${phone}`;
      await loginWithOTP(formatted);

      setPhoneNumber(phone);
      setShowLoginModal(false);
      setShowOTPModal(true);
    } catch (err) {
      console.error("OTP send error:", err);
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

        // Check if profile exists
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
      console.error("OTP verify error:", err);
    }
  };

  const handleRegister = async (name: string) => {
    try {
      await registerUser(name, phoneNumber);
      setShowRegistrationModal(false);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };

  return (
    <View style={styles.container}>
      {isMobile ? (
        <>
          <AppHeader
  onMenuPress={openDrawer}
  onOpenAuth={() => setShowLoginModal(true)}
/>


          <View style={styles.mobileContent}>{injectedChild}</View>

          <MobileDrawer
            visible={drawerVisible}
            onClose={closeDrawer}
            onOpenAuth={() => {
              closeDrawer();
              setShowLoginModal(true);
            }}
          />
        </>
      ) : (
        <View style={styles.desktopLayout}>
          <View style={styles.sidebarContainer}>
            <Sidebar
              onOpenAuth={() => setShowLoginModal(true)}
            />
          </View>

          <View style={styles.desktopContent}>{injectedChild}</View>
        </View>
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
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  desktopLayout: { flex: 1, flexDirection: "row" },
  sidebarContainer: { width: SIDEBAR_WIDTH, height: "100%" },
  desktopContent: { flex: 1 },
  mobileContent: { flex: 1 },
});
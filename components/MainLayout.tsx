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
import { useEffect } from "react";
import CelebrationPopup from "@/components/CelebrationPopup";

const SIDEBAR_WIDTH = 340;
const MOBILE_BREAKPOINT = 768;

export default function MainLayout({ children }) {
const { loginWithOTP, verifyOTP, registerUser, user } = useAuth();
const [drawerVisible, setDrawerVisible] = useState(false);
 const [showLoginModal, setShowLoginModal] = useState(false);
const [showOTPModal, setShowOTPModal] = useState(false);
const [showRegistrationModal, setShowRegistrationModal] = useState(false);
const [notif, setNotif] = useState(null);
const [showCelebration, setShowCelebration] = useState(false);
     useEffect(() => {
      if (!user?.id) return;  // ✅ FIXED: do nothing until logged in
    
      const channel = supabase
        .channel("student_notifications_channel")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "student_notifications",
            filter: `student_id=eq.${user.id}`, // ❗ no ? needed
          },
          (payload) => {
            console.log("🔔 Notification received:", payload.new);
    
            setNotif(payload.new);
            setShowCelebration(true);
          }
        )
        .subscribe();
    
      return () => supabase.removeChannel(channel);
    }, [user?.id]);


  const [phoneNumber, setPhoneNumber] = useState("");

  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);

  const injectedChild = React.cloneElement(children, {
    onOpenAuth: () => setShowLoginModal(true),
  });

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
 const isLoggedIn = !!user;
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
          {!isLoggedIn && (
            <AppHeader
              onMenuPress={() => {}}
              onOpenAuth={() => setShowLoginModal(true)}
            />
          )}

          <View style={styles.desktopLayoutContent}>
            {isLoggedIn && (
              <View style={styles.sidebarContainer}>
                <Sidebar onOpenAuth={() => setShowLoginModal(true)} />
              </View>
            )}

            <View style={styles.desktopContent}>{injectedChild}</View>
          </View>
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
        <CelebrationPopup
            visible={showCelebration}
            onClose={() => setShowCelebration(false)}
            message={notif?.message}
            gifUrl={notif?.gif_url}
          />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D0D" },
  desktopLayout: { flex: 1 },
  desktopLayoutContent: { flex: 1, flexDirection: "row" },
  sidebarContainer: { width: SIDEBAR_WIDTH, height: "100%" },
  desktopContent: { flex: 1 },
  mobileContent: { flex: 1 },
});

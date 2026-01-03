// MainLayout.tsx
import React, { useState, useEffect } from "react";
import { View, StyleSheet, useWindowDimensions } from "react-native";

import Sidebar from "./Sidebar";
import MobileDrawer from "./MobileDrawer";
import AppHeader from "./AppHeader";

import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";

import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import CelebrationPopup from "@/components/CelebrationPopup";

const SIDEBAR_WIDTH = 340;
const MOBILE_BREAKPOINT = 768;

export default function MainLayout({ children, isHeaderHidden = false }) {
  const { loginWithOTP, verifyOTP, registerUser, user } = useAuth();

  // UI STATE
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const isAuthLocked = showOTPModal || showRegistrationModal;
  const [notif, setNotif] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  // 🌟 DEBUG
  console.log("🔵 MainLayout rendered. Current user:", user?.id);

  // REALTIME LISTENER
  useEffect(() => {
    console.log("🟡 useEffect fired. user?.id =", user?.id);

    if (!user?.id) {
      console.log("⛔ No user yet → NOT subscribing to realtime.");
      return;
    }

    console.log("🟢 Setting up realtime channel for student_id:", user.id);

    let isMounted = true;

    const channel = supabase
      .channel("student_notifications_channel")
      .on(
        "postgres_changes",
        {
          event: "insert",
          schema: "public",
          table: "student_notifications",
          filter: `student_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("🔥 REALTIME EVENT RECEIVED:", payload);

          if (!isMounted) {
            console.log("⚠ Component unmounted → ignoring event.");
            return;
          }

          console.log("✨ Showing popup with:", payload.new);
          console.log("🎉 Setting showCelebration = true NOW!");

          setNotif(payload.new);
          setShowCelebration(true);

          setTimeout(() => {
            console.log("⏳ After 100ms (fresh read) → showCelebration SHOULD be true");
          }, 100);
        }
      )
      .subscribe((status) => {
        console.log("📡 Subscription status:", status);
      });

    return () => {
      console.log("🔻 Cleaning up realtime channel");
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // DEBUG — log when showCelebration actually changes (REAL value)
  useEffect(() => {
    console.log("🎉 Celebration state CHANGED →", showCelebration);
  }, [showCelebration]);

  // DEVICE TYPE
  const { width } = useWindowDimensions();
  const isMobile = width < MOBILE_BREAKPOINT;

  // DRAWER
  const openDrawer = () => setDrawerVisible(true);
  const closeDrawer = () => setDrawerVisible(false);
  const onOpenAuth = (mode?: "login" | "signup") => {
    setShowLoginModal(true);
  };

  // Inject auth into child components
  const injectedChild = React.isValidElement(children)
    ? React.cloneElement(children as React.ReactElement<any>, { onOpenAuth })
    : children;

  // OTP HANDLERS
  const handleSendOTP = async (phone) => {
    try {
      await loginWithOTP(phone);

      setPhoneNumber(phone);
      setShowLoginModal(false);
      setShowOTPModal(true);
    } catch (err) {
      console.error("OTP send error:", err);
    }
  };

  const handleVerifyOTP = async (otp) => {
    try {
      await verifyOTP(phoneNumber, otp);

      setTimeout(async () => {
        const { data } = await supabase.auth.getUser();
        const authUser = data?.user;

        if (!authUser) return;

      setShowOTPModal(false);
      setDrawerVisible(false); // ✅ MOBILE FIX: close drawer first
      
const { data: profile, error } = await supabase
  .from("users")
  .select("is_profile_complete")
  .eq("id", authUser.id)
  .maybeSingle();

if (!profile || profile.is_profile_complete === false) {
  setShowRegistrationModal(true);
}




      }, 300);
    } catch (err) {
      console.error("OTP verify error:", err);
    }
  };

const handleRegister = async (name) => {
  try {
    await registerUser(name, phoneNumber);
    setShowRegistrationModal(false);
  } catch (err) {
    console.error("Registration error:", err);
  }
};



  // LOGIN CHECK
  const isLoggedIn = !!user;
  console.log("🎯 showCelebration STATE =", showCelebration);

  return (
    <View style={styles.container}>
      {/* MOBILE */}
      {isMobile ? (
        <>
          {!isHeaderHidden && (
            <AppHeader
              onMenuPress={openDrawer}
              onOpenAuth={() => {
                if (!isAuthLocked) setShowLoginModal(true);
              }}
            />
          )}

          <View style={styles.mobileContent}>{injectedChild}</View>

          <MobileDrawer
            visible={drawerVisible}
            onClose={closeDrawer}
            onOpenAuth={() => {
              if (isAuthLocked) return;   // ✅ FINAL MOBILE FIX
              closeDrawer();
              setShowLoginModal(true);
            }}
          />
        </>
      ) : (
        /* DESKTOP/WEB */
        <>
          {!isLoggedIn && (
            <AppHeader
              onMenuPress={() => {}}
              onOpenAuth={() => {
                if (!isAuthLocked) setShowLoginModal(true);
              }}
            />
          )}

          <View style={styles.desktopLayout}>
            {isLoggedIn && (
              <View style={styles.sidebarContainer}>
                <Sidebar onOpenAuth={() => setShowLoginModal(true)} />
              </View>
            )}

            <View style={styles.desktopContent}>{injectedChild}</View>
          </View>
        </>
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

      {/* CELEBRATION POPUP - WORKS ON BOTH MOBILE AND WEB */}
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
  desktopLayout: { flex: 1, flexDirection: "row" },
  sidebarContainer: { width: SIDEBAR_WIDTH, height: "100%" },
  desktopContent: { flex: 1 },
  mobileContent: { flex: 1 },
});

import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import HomeScreenStatic from "@/components/HomeScreenStatic";
import HomeScreen from "@/components/HomeScreen";
import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";

export default function Index() {
  const router = useRouter();
  const { loginWithOTP, verifyOTP, registerUser, user, loading } = useAuth();

  const [authStep, setAuthStep] = useState<
    null | "login" | "otp" | "register"
  >(null);

  const [phone, setPhone] = useState("");

  useEffect(() => {
    const handler = (e: any) => {
      setAuthStep("login");
    };

    if (typeof window !== "undefined") {
      window.addEventListener("open-auth", handler);
      return () => window.removeEventListener("open-auth", handler);
    }
  }, []);

  const images = {
    img1: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img1.webp",
    img2: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img2.webp",
    img3: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img3.webp",
    img4: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img4.webp",
    img5: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img5.webp",
    img6: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img6.webp",
    img7: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img7.webp",
    img8: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img8.webp",
    img9: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img9.webp",
    img10: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img10.webp",
    img11: "https://paragraph.b-cdn.net/battle/Home%20page%20images/img11.webp",
  };

  if (loading) {
    return null;
  }

  if (user) {
    return (
      <MainLayout>
        <HomeScreen images={images} />
      </MainLayout>
    );
  }

  return (
    <>
      <HomeScreenStatic
        images={images}
        isLoggedIn={false}
        onOpenAuth={(mode) => setAuthStep(mode)}
      />

      <LoginModal
        visible={authStep === "login"}
        onClose={() => setAuthStep(null)}
        onSendOTP={async (phone) => {
          await loginWithOTP(phone);
          setPhone(phone);
          setAuthStep("otp");
        }}
      />

      <OTPModal
        visible={authStep === "otp"}
        phoneNumber={phone}
        onClose={() => setAuthStep(null)}
        onVerify={async (otp) => {
          const res = await verifyOTP(phone, otp);
          if (res?.isNewUser) {
            setAuthStep("register");
          } else {
            setAuthStep(null);
            router.replace("/");
          }
        }}
        onResend={() => loginWithOTP(phone)}
      />

      <RegistrationModal
        visible={authStep === "register"}
        onClose={() => {}}
        onRegister={async (name) => {
          await registerUser(name, phone);
          setAuthStep(null);
          router.replace("/");
        }}
      />
    </>
  );
}

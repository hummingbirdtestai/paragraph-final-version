//AUTHMODALCONTROLLER.TSX
import { useEffect, useState } from "react";
import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";
import { useAuth } from "@/contexts/AuthContext";

type Step = "login" | "otp" | "register" | null;

export default function AuthModalController() {
  const { loginWithOTP, verifyOTP, registerUser } = useAuth();

  const [step, setStep] = useState<Step>(null);
  const [phone, setPhone] = useState("");
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    console.log("[AUTH MODAL] mounted");

    const handler = (e: any) => {
      console.log("[AUTH MODAL] OPEN_AUTH_MODAL received");
      const mode = e.detail;
      console.log("[AUTH MODAL] mode =", mode);

      if (mode === "signup") {
        setStep("login");
      } else {
        setStep("login");
      }
    };

    window.addEventListener("OPEN_AUTH_MODAL", handler);
    return () => window.removeEventListener("OPEN_AUTH_MODAL", handler);
  }, []);

  const handleSendOTP = async (phoneNumber: string) => {
    setPhone(phoneNumber);
    await loginWithOTP(phoneNumber);
    setStep("otp");
  };

  const handleVerifyOTP = async (otp: string) => {
    const res = await verifyOTP(phone, otp);
    setIsNewUser(res?.isNewUser);

    if (res?.isNewUser) {
      setStep("register");
    } else {
      setStep(null);
    }
  };

  const handleRegister = async (name: string) => {
    await registerUser(name, phone);
    setStep(null);
  };

  return (
    <>
      <LoginModal
        visible={step === "login"}
        onClose={() => setStep(null)}
        onSendOTP={handleSendOTP}
      />

      <OTPModal
        visible={step === "otp"}
        phoneNumber={phone}
        onClose={() => setStep(null)}
        onVerify={handleVerifyOTP}
        onResend={() => loginWithOTP(phone)}
      />

      <RegistrationModal
        visible={step === "register"}
        onClose={() => {}}
        onRegister={handleRegister}
      />
    </>
  );
}

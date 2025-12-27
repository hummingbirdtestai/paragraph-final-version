import React, { useState } from "react";
import HomeScreenStatic from "@/components/HomeScreenStatic";

import { LoginModal } from "@/components/auth/LoginModal";
import { OTPModal } from "@/components/auth/OTPModal";
import { RegistrationModal } from "@/components/auth/RegistrationModal";

export default function Index() {
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

  // 🔑 AUTH STATE (THIS WAS MISSING)
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  return (
    <>
      <HomeScreenStatic
        images={images}
        onOpenAuth={(mode) => {
          setAuthMode(mode);
          setShowLoginModal(true);
        }}
      />

      {/* AUTH MODALS */}
      <LoginModal
        visible={showLoginModal}
        defaultMode={authMode}
        onClose={() => setShowLoginModal(false)}
        onSendOTP={() => {
          setShowLoginModal(false);
          setShowOTPModal(true);
        }}
      />

      <OTPModal
        visible={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerified={() => {
          setShowOTPModal(false);
          setShowRegistrationModal(true);
        }}
      />

      <RegistrationModal
        visible={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
      />
    </>
  );
}

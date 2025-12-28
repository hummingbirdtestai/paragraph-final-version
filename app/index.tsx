import React, { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import HomeScreen from "@/components/HomeScreen";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";

export default function App() {
  const { user, loading } = useAuth();
  const params = useLocalSearchParams();

  useEffect(() => {
    console.log("[APP] params =", params);
    console.log("[APP] typeof params.auth =", typeof params.auth);
    console.log("[APP] params.auth =", params.auth);

    const auth = Array.isArray(params.auth) ? params.auth[0] : params.auth;

    console.log("[APP] normalized auth =", auth);

    if (auth === "login" || auth === "signup") {
      console.log("[APP] Dispatching OPEN_AUTH_MODAL");
      window.dispatchEvent(
        new CustomEvent("OPEN_AUTH_MODAL", { detail: auth })
      );
    }
  }, [params]);

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

  return (
    <MainLayout>
      <HomeScreen images={images} />
    </MainLayout>
  );
}

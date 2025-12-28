//home index.tsx
import React from "react";
import HomeScreenStatic from "@/components/HomeScreenStatic";
import HomeScreen from "@/components/HomeScreen";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/components/MainLayout";

export default function Index() {
  const { user, loading } = useAuth();

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
    <HomeScreenStatic
      images={images}
      isLoggedIn={false}
      onOpenAuth={(mode) => {
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("open-auth", {
              detail: mode,
            })
          );
        }
      }}
    />
  );
}

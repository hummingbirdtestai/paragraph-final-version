import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import "./global.css";

import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  useFrameworkReady();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 🐰 Bunny Player (already correct)
    if (!(window as any).BunnyPlayer) {
      const bunnyScript = document.createElement("script");
      bunnyScript.src = "https://player.bunny.net/js/bunny-player.min.js";
      bunnyScript.async = true;
      document.body.appendChild(bunnyScript);
    }

    // 💳 Cashfree SDK (THIS IS MISSING)
    if (!(window as any).Cashfree) {
      const cashfreeScript = document.createElement("script");
      cashfreeScript.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      cashfreeScript.async = true;
      document.body.appendChild(cashfreeScript);
    }
  }, []);

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="privacy-policy" />
        <Stack.Screen name="terms" />
        <Stack.Screen name="about" />
        <Stack.Screen name="help" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </AuthProvider>
  );
}

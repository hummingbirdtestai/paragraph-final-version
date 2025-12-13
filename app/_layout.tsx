import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import "./global.css";

import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout() {
  useFrameworkReady();

  // 🔥 THIS IS THE ONLY ADDITION — LOAD BUNNY PLAYER (WEB ONLY)
  useEffect(() => {
    if (typeof window === "undefined") return;

    // prevent double-load
    if ((window as any).BunnyPlayer) return;

    const script = document.createElement("script");
    script.src = "https://player.bunny.net/js/bunny-player.min.js";
    script.async = true;
    document.body.appendChild(script);
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

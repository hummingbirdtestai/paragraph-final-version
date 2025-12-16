// app/_layout.tsx
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { AuthProvider } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import "./global.css";

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      {/* ✅ Load Cashfree SDK in HEAD (MANDATORY for Expo Web) */}
      <Helmet>
        <script
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          type="text/javascript"
        />
      </Helmet>

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
    </>
  );
}

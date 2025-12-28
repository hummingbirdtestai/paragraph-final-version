// app/_layout.tsx
import { Stack, Slot, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Helmet } from "react-helmet";
import "./global.css";

function AuthGate() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user && params.auth) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("open-auth", {
            detail: params.auth,
          })
        );
      }
    }

    if (user && params.auth) {
      router.replace("/");
    }
  }, [params.auth, user, loading]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handler = (e: any) => {
      const mode = e.detail?.mode;
      if (!mode) return;

      window.dispatchEvent(
        new CustomEvent("open-auth", {
          detail: mode,
        })
      );
    };

    window.addEventListener("OPEN_AUTH_MODAL", handler);
    return () => window.removeEventListener("OPEN_AUTH_MODAL", handler);
  }, []);

  return <Slot />;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Helmet>
        <script
          id="cashfree-sdk"
          src="https://sdk.cashfree.com/js/v3/cashfree.js"
          type="text/javascript"
          defer
        />
      </Helmet>

      <AuthProvider>
        <AuthGate />

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

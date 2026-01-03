// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  profileComplete: boolean | null; // 🔥 ADD
  loginWithOTP: (phone: string) => Promise<any>;
  verifyOTP: (phone: string, token: string) => Promise<any>;
  registerUser: (name: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  profileComplete: null,
  loginWithOTP: async () => {},
  verifyOTP: async () => {},
  registerUser: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState<boolean | null>(null); // 🔥 ADD

  // 🔍 Load profile completion status
  const loadProfileStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("is_profile_complete")
      .eq("id", userId)
      .single();

    if (error) {
      // No profile row yet → first-time user
      setProfileComplete(false);
      return;
    }

    setProfileComplete(data.is_profile_complete);
  };

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;

      setSession(data.session);
      setUser(data.session?.user ?? null);

      if (data.session?.user?.id) {
        await loadProfileStatus(data.session.user.id);
      } else {
        setProfileComplete(null);
      }

      setLoading(false);
    };

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!active) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user?.id) {
          await loadProfileStatus(session.user.id);
        } else {
          setProfileComplete(null);
        }

        setLoading(false);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // ⭐ REGISTER USER (RPC – unchanged logic, now authoritative)
  const registerUser = async (name: string, phone: string) => {
    try {
      const cleanedPhone = phone.startsWith("+91")
        ? phone.substring(3)
        : phone;

      const { error } = await supabase.rpc("register_user_profile", {
        p_name: name,
        p_phone: cleanedPhone,
      });

      if (error) {
        console.error("❌ register_user_profile RPC error:", error);
        return false;
      }

      // Immediately reflect completion in UI
      setProfileComplete(true);

      return true;
    } catch (err) {
      console.error("❌ Registration error:", err);
      return false;
    }
  };

  const loginWithOTP = async (phone: string) => {
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    if (error) throw error;
    return data;
  };

  const verifyOTP = async (phone: string, token: string) => {
    const formattedPhone = phone.startsWith("+91") ? phone : `+91${phone}`;
    const { data, error } = await supabase.auth.verifyOtp({
      phone: formattedPhone,
      token,
      type: "sms",
    });
    if (error) throw error;
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfileComplete(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        profileComplete, // 🔥 EXPOSED
        loginWithOTP,
        verifyOTP,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

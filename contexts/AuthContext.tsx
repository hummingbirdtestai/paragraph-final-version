// contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextType {
  user: any | null;
  session: any | null;
  loading: boolean;
  loginWithOTP: (phone: string) => Promise<any>;
  verifyOTP: (phone: string, token: string) => Promise<any>;
  registerUser: (name: string, phone: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
  loginWithOTP: async () => {},
  verifyOTP: async () => {},
  registerUser: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!active) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      setLoading(false);
    };
    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!active) return;
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // ⭐ REGISTER USER (centralized)
  const registerUser = async (name: string, phone: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser();

      if (!authUser?.user?.id) {
        console.error("❌ Cannot register — user not authenticated yet");
        return false;
      }

      const cleanedPhone = phone.startsWith("+91")
        ? phone.substring(3)
        : phone;

     const { error } = await supabase.from("users").update({
  phone: cleanedPhone,
  name,
  is_active: true,
})
.eq("id", authUser.user.id);


      if (error) {
        console.error("❌ Supabase registration insert error:", error);
        return false;
      }

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
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
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
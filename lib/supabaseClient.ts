import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import localForage from "localforage";

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// 🚨 ADD THESE LOGS — EXACT POSITION 🚨
console.log("🔍 Loaded ENV Variables:");
console.log("   SUPABASE_URL =", SUPABASE_URL);
console.log("   SUPABASE_ANON_KEY (first 10) =", SUPABASE_ANON_KEY?.slice(0, 10));

console.log("   typeof window:", typeof window);
console.log("   Using storage:", typeof window !== "undefined" ? "localForage (web)" : "AsyncStorage (native)");
// -------------------------------------------------------------

// 🧠 Detect platform — use localForage for web
const storage =
  typeof window !== "undefined" ? localForage : AsyncStorage;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

console.log("✅ Supabase client initialized with", typeof window !== "undefined" ? "localForage (web)" : "AsyncStorage (native)");

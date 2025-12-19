//useUserProfile.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    let cancelled = false;

    const fetchProfile = async () => {
      const { data } = await supabase
        .from("users")
        .select(`
          is_active,
          is_paid,
          trial_started_at,
          trial_expires_at,
          subscription_start_at,
          subscription_end_at,
          paid_activated_at,
          purchased_package
        `)
        .eq("id", userId)
        .maybeSingle();

      if (!cancelled) {
        setProfile(data ?? null);
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return profile;
}

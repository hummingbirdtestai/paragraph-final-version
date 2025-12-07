import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function usePracticeData(subject: string | null = null) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);   // ⭐ MISSING STATE ADDED

  const LIMIT = 20;

  const fetchPhases = async (currentOffset = 0) => {
    if (!subject) {
      setPhases([]);
      setLoading(false);
      return;
    }

    let query = supabase
      .from("concept_phase_final")
      .select(`
        id,
        subject,
        subject_id,
        phase_type,
        phase_json,
        react_order_final,
        total_count,
        image_url
      `)
      .eq("subject", subject)
      .order("react_order_final", { ascending: true })
      .limit(LIMIT)
      .range(currentOffset, currentOffset + LIMIT - 1);

    const { data, error } = await query;

    if (!error) {
      if (currentOffset === 0) {
        setPhases(data || []);
      } else {
        setPhases((prev) => [...prev, ...(data || [])]);
      }
    }

    setLoading(false);
    setRefreshing(false);
    setIsLoadingMore(false);  // ⭐ FIXED
  };

  // 🔥 Fetch when subject changes
  useEffect(() => {
    setOffset(0);
    setLoading(true);
    fetchPhases(0);
  }, [subject]);

  // Pull-to-refresh
  const refresh = async () => {
    setRefreshing(true);
    await fetchPhases(0);
  };

  // Infinite Scroll / Load more
  const loadMore = async () => {
    if (isLoadingMore || loading) return;

    setIsLoadingMore(true);

    const newOffset = offset + LIMIT;
    setOffset(newOffset);

    await fetchPhases(newOffset);
  };

  return {
    phases,
    loading,
    refreshing,
    refresh,
    loadMore,
    isLoadingMore,   // ⭐ NOW DEFINED
  };
}

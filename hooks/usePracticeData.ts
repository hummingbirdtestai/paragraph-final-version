import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function usePracticeData(subject: string | null = null, userId: string | null = null) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const LIMIT = 20;

  const fetchPhases = async (currentOffset = 0) => {
    if (!subject || !userId) {
      setPhases([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.rpc(
      "get_concept_practice_feed_v14",
      {
        p_subject: subject,
        p_student_id: userId,
        p_filter: "all",          // UI filters still work in PracticeScreen
        p_limit: LIMIT,
        p_offset: currentOffset
      }
    );

    if (!error) {
      if (currentOffset === 0) {
        setPhases(data || []);
      } else {
        setPhases((prev) => [...prev, ...(data || [])]);
      }
    }

    setLoading(false);
    setRefreshing(false);
    setIsLoadingMore(false);
  };

  // 🔥 Reload when subject changes OR user logs in
  useEffect(() => {
    setOffset(0);
    setLoading(true);
    fetchPhases(0);
  }, [subject, userId]);

  // Pull-to-refresh
  const refresh = async () => {
    setRefreshing(true);
    await fetchPhases(0);
  };

  // Infinite scroll / Load more
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
    isLoadingMore,
  };
}

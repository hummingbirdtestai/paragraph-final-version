import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function usePracticeData(
  subject = null,
  userId = null,
  category = "unviewed"
) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // ⭐ NEW — STOP LOAD MORE WHEN DATA FINISHES
  const [hasMoreData, setHasMoreData] = useState(true);

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
        p_filter: category,
        p_limit: LIMIT,
        p_offset: currentOffset
      }
    );

    if (error) {
      console.log("RPC Error", error);
      return;
    }

    // ⭐ If NO new records → no more pagination
    if (!data || data.length === 0) {
      setHasMoreData(false);
      setIsLoadingMore(false);
      return;
    }

    if (currentOffset === 0) {
      setPhases(data);
    } else {
      setPhases((prev) => [...prev, ...data]);
    }

    setIsLoadingMore(false);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    setOffset(0);
    setHasMoreData(true);   // ⭐ RESET WHEN SUBJECT/CATEGORY CHANGE
    setLoading(true);
    fetchPhases(0);
  }, [subject, userId, category]);

  const refresh = async () => {
    setRefreshing(true);
    setOffset(0);
    setHasMoreData(true);  
    await fetchPhases(0);
  };

  const loadMore = async () => {
    if (!hasMoreData) return;         // ⭐ STOP LOADING
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
    hasMoreData,       // Optional, if UI needs to show “No more items”
  };
}

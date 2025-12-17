// hooks/useVideoData.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useVideoData(
  subject = null,
  userId = null,
  category = "unviewed"
) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // ⭐ STOP LOAD MORE WHEN DATA FINISHES
  const [hasMoreData, setHasMoreData] = useState(true);

  const LIMIT = 20;

  const fetchPhases = async (currentOffset = 0) => {
    if (!subject || !userId) {
      setPhases([]);
      setLoading(false);
      return;
    }

    // ⭐ Replace with your RPC name
    const { data, error } = await supabase.rpc("get_video_feed_v1", {
      p_subject: subject,
      p_student_id: userId,
      p_filter: category,
      p_limit: LIMIT,
      p_offset: currentOffset,
    });

    if (error) {
      console.log("Video RPC Error", error);
      return;
    }

    // ⭐ If NO new records → stop pagination
    if (!data || data.length === 0) {
      setHasMoreData(false);
      setIsLoadingMore(false);
      return;
    }

    // ⭐ If first load or refresh
    if (currentOffset === 0) {
      setPhases(data);
    } else {
      setPhases((prev) => [...prev, ...data]);
    }

    setIsLoadingMore(false);
    setLoading(false);
    setRefreshing(false);
  };

  // ⭐ RUN WHEN subject / userId / category changes
      useEffect(() => {
        setPhases([]);          // 🔥 CLEAR OLD SUBJECT / CATEGORY DATA
        setOffset(0);
        setHasMoreData(true);
        setIsLoadingMore(false);
        setLoading(true);
        fetchPhases(0);
      }, [subject, userId, category]);


  // ⭐ Pull-to-refresh
  const refresh = async () => {
    setRefreshing(true);
    setOffset(0);
    setHasMoreData(true);
    await fetchPhases(0);
  };

  // ⭐ Scroll-to-bottom loading
  const loadMore = async () => {
    if (!hasMoreData) return;
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
    hasMoreData,
  };
}

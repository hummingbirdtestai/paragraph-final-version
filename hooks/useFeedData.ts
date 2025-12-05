import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useFeedData(subject: string | null = null) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
const [isLoadingMore, setIsLoadingMore] = useState(false);
const LIMIT = 20;


  // -----------------------
  // 🔥 DEBUG: track subject
  // -----------------------
  console.log("🔵 useFeedData() — subject =", subject);

  const fetchFeed = async (currentOffset = 0) => {
  const { data, error } = await supabase.rpc("get_feed_v7", {
    p_subject: subject,
    p_limit: LIMIT,
    p_offset: currentOffset,
  });

  if (!error) {
    if (currentOffset === 0) {
      setPosts(data || []);
    } else {
      setPosts(prev => [...prev, ...(data || [])]);
    }
  }

  setLoading(false);
  setRefreshing(false);
  setIsLoadingMore(false);
};


  useEffect(() => {
    console.log("🟣 subject changed → fetching feed");
    setOffset(0);
fetchFeed(0);

  }, [subject]);

  const refresh = async () => {
    console.log("🔵 PULL-TO-REFRESH triggered");
    setRefreshing(true);
    await fetchFeed();
    setRefreshing(false);
  };
  const loadMore = async () => {
  if (isLoadingMore || loading) return;

  setIsLoadingMore(true);
  const newOffset = offset + LIMIT;
  setOffset(newOffset);

  await fetchFeed(newOffset);
};


  return {
  posts,
  loading,
  refreshing,
  refresh,
  loadMore,
  isLoadingMore,
};

}

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function usePracticeData(
  subject: string | null = null,
  userId: string | null = null,
  category: "unviewed" | "viewed" | "bookmarked" | "all" = "unviewed"
) {
  const [phases, setPhases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [offset, setOffset] = useState(0);          // 🔥 NEW — required for pagination
  const [isLoadingMore, setIsLoadingMore] = useState(false); // 🔥 NEW — prevents spam load

  const LIMIT = 20;                                 // 🔁 MODIFIED — earlier hook had no pagination limit

  // ------------------------------------------------------
  // FETCH FUNCTION — ⭐ MAJOR CHANGES
  // ------------------------------------------------------
  const fetchPhases = async (currentOffset = 0) => { // 🔁 MODIFIED — now accepts offset
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
        p_filter: category,              // 🔁 MODIFIED — ensures UI filter works 
        p_limit: LIMIT,               // 🔥 NEW — pagination added
        p_offset: currentOffset       // 🔥 NEW — dynamic offset
      }
    );

    // -------------------------------------------
    // Append OR Replace logic — 🔥 NEW
    // -------------------------------------------
    if (!error) {
      if (currentOffset === 0) {       // first load OR refresh
        setPhases(data || []);         // 🔁 MODIFIED — replaces fully
      } else {
        setPhases((prev) => [...prev, ...(data || [])]);  // 🔥 NEW — append for loadMore()
      }
    }

    setLoading(false);
    setRefreshing(false);
    setIsLoadingMore(false);
  };

  // ------------------------------------------------------
  // SUBJECT CHANGE / USER CHANGE — reset offset
  // ------------------------------------------------------
  useEffect(() => {
    setOffset(0);                       // 🔥 NEW — reset for new subject/user
    setLoading(true);
    fetchPhases(0);                     // 🔁 MODIFIED — force first page
  }, [subject, userId, category]);

  // ------------------------------------------------------
  // PULL-TO-REFRESH — also resets pagination
  // ------------------------------------------------------
  const refresh = async () => {
    setRefreshing(true);
    await fetchPhases(0);               // 🔁 MODIFIED — resets offset
  };

  // ------------------------------------------------------
  // LOAD MORE — ⭐ NEW IMPORTANT PART
  // ------------------------------------------------------
  const loadMore = async () => {
    if (isLoadingMore || loading) return;   // 🔥 NEW — prevents double calls

    setIsLoadingMore(true);

    const newOffset = offset + LIMIT;       // 🔥 NEW — calculate next page
    setOffset(newOffset);

    await fetchPhases(newOffset);           // 🔥 NEW — fetch appended results
  };

  return {
    phases,
    loading,
    refreshing,
    refresh,
    loadMore,                                // 🔥 NEW — must be used in FlatList
    isLoadingMore,                           // 🔥 NEW
  };
}

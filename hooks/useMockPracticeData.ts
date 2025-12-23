// hooks/useMockPracticeData.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useMockPracticeData(
  examSerial: number | null,
  userId: string | null
) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!examSerial || !userId) {
      setRows([]);
      setLoading(false);
      return;
    }

    const fetch = async () => {
      setLoading(true);

      const { data, error } = await supabase.rpc(
        "get_mock_test_feed_v2",
        {
          p_student_id: userId,
          p_exam_serial: examSerial,
        }
      );

      if (error) {
        console.error("❌ get_mock_test_feed_v2 error", error);
        setRows([]);
      } else {
        setRows(data || []);
      }

      setLoading(false);
    };

    fetch();
  }, [examSerial, userId]);

  /* ---------------------------------
     GROUP BY SUBJECT (FRONTEND)
  --------------------------------- */
  const subjectBuckets = rows.reduce<Record<string, any[]>>(
    (acc, row) => {
      const subject = row.subject_name || "Unknown";
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(row);
      return acc;
    },
    {}
  );

  return {
    loading,
    rows,
    subjectBuckets, // 👈 THIS replaces subject-based RPC calls
  };
}

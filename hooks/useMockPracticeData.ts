// hooks/useMockPracticeData.ts
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

function normalizeMockRows(rows: any[]) {
  return rows.flatMap((row) => {
    const phases = [];

    const isWrong = row.is_correct === false;

    if (row.concept_json) {
      phases.push({
        id: `${row.id}-concept`,
        phase_type: "concept",
        subject: row.subject_name,
        phase_json: row.concept_json,
        react_order_final: row.react_order,
        total_count: rows.length,
        is_wrong: isWrong,
        is_bookmarked: false,
      });
    }

    const mcq = row.mcq_json?.[0];

    if (mcq) {
      phases.push({
        id: row.id,
        phase_type: "mcq",
        subject: row.subject_name,

        // ✅ FLATTENED MCQ OBJECT (FINAL SHAPE)
        phase_json: {
          ...mcq,
          is_mcq_image_type: row.is_mcq_image_type,
          mcq_image: row.mcq_image,
        },

        react_order_final: row.react_order,
        total_count: rows.length,

        student_answer: row.student_answer,
        correct_answer: mcq.correct_answer,
        is_correct_latest: row.is_correct,
        is_wrong: isWrong,
        is_bookmarked: row.is_bookmarked ?? false,
      });
    }

    return phases;
  });
}

export function useMockPracticeData(
  examSerial: number | null,
  userId: string | null
) {
  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const refetch = () => {
    setRefreshKey((prev) => prev + 1);
  };

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
        setRows(normalizeMockRows(data || []));
      }

      setLoading(false);
    };

    fetch();
  }, [examSerial, userId, refreshKey]);

  const subjectBuckets = rows.reduce<Record<string, any[]>>(
    (acc, row) => {
      const subject = row.subject || "Unknown";
      if (!acc[subject]) acc[subject] = [];
      acc[subject].push(row);
      return acc;
    },
    {}
  );

  return {
    loading,
    rows,
    subjectBuckets,
    refetch,
  };
}

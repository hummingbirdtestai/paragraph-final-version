// Imagecard.tsx — FINAL (SURGICAL, PROD-READY)

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import ImageMCQScreen from "@/components/types/ImageMCQScreen";

import { TouchableOpacity } from "react-native";
import { Bookmark } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import FlashcardScreen from "@/components/types/FlashcardScreen";
import ZoomableImage from "@/components/common/ZoomableImage";


export function ImageCard({ phase, refresh }) {
  const isFlashcard = phase.phase_type === "concept";
  const isMCQ = phase.phase_type === "mcq";
  const isImage = phase.phase_type === "image";

  const { user } = useAuth();




  // ORIGINAL bookmark for concept/mcq
  const [isBookmarked, setIsBookmarked] = React.useState(phase.is_bookmarked);
React.useEffect(() => {
  setIsBookmarked(!!phase.is_bookmarked);

  console.log("🔁 ImageCard bookmark SYNC", {
    phase_id: phase.id,
    phase_type: phase.phase_type,
    phase_is_bookmarked_prop: phase.is_bookmarked,
  });
}, [phase.id, phase.is_bookmarked]);


  
  // DEBUG LOGS — UNTOUCHED
  React.useEffect(() => {
    if (isMCQ) {
      console.log("📘 MCQ Loaded", {
        mcq_id: phase.id,
        concept_before: phase.concept_id_before_this_mcq,
        correct_answer: phase.phase_json?.correct_answer,
      });
    }
  }, [phase]);

  const router = useRouter();

  return (
 <View style={styles.card}>
<Text style={styles.subject}>{phase.subject}</Text>
        {/* 🔝 TOP BAR — SAME AS PRACTICE */}
          {(isImage || isMCQ) && (
  <View style={styles.topBar}>

            {/* Progress */}
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {isMCQ ? "🧩 MCQ" : "🖼 Image"} {phase.react_order_final} / {phase.total_count}
              </Text>
            </View>
        
            {/* Bookmark */}
<TouchableOpacity
  onPress={async () => {
    if (!user?.id) return;

    const { data, error } = await supabase.rpc(
      "toggle_image_bookmark_v1",
      {
        p_student_id: user.id,
        p_image_phase_id: phase.id,
        p_subject: phase.subject,
      }
    );
    console.log("✅ TOP BAR BOOKMARK RPC RESULT", {
  data,
  error,
});

    if (error) {
      console.error("toggle_image_bookmark_v1 failed", error);
      return;
    }

    if (data?.is_bookmark !== undefined) {
  setIsBookmarked(data.is_bookmark);
  refresh?.();   // 🔥 ADD THIS LINE
}
  }}
>
  <Bookmark
    size={22}
    color="#10b981"
    strokeWidth={2}
    fill={isBookmarked ? "#10b981" : "transparent"}
  />
</TouchableOpacity>
 </View>
        )}

{isImage && phase.image_url && (
  <ZoomableImage
    uri={phase.image_url_supabase || phase.image_url}
    height={220}
  />
)}

{isFlashcard && (
  <FlashcardScreen
    item={phase.phase_json}
    studentId={user?.id}
    subjectName={phase.subject}
    elementId={phase.id}
    isBookmarked={phase.is_bookmarked}
  />
)}

{isMCQ && (
  <View style={{ paddingBottom: 20 }}>
    <ImageMCQScreen
      item={phase.phase_json}
      mcqId={phase.id}
      phaseUniqueId={phase.id}
      studentId={user?.id}
      correctAnswer={phase.phase_json?.correct_answer}
      reviewMode={false}
    />

    <AskParagraphButton
      studentId={user?.id}
      mcqId={phase.id}
      phaseJson={phase.phase_json}
    />
  </View>
)}

          </View>
  );
}
function AskParagraphButton({
  studentId,
  mcqId,
  phaseJson,
}: {
  studentId: string | undefined;
  mcqId: string;
  phaseJson: any;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAskParagraph = async () => {
    if (!studentId) return;

    setIsLoading(true);

    try {
      const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

  const response = await fetch(
  `${API_BASE_URL}/ask-paragraph/start`,
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      student_id: studentId,
      mcq_id: mcqId,
      mcq_payload: phaseJson,
        mode: "discussion",              // ✅ THIS IS THE MAGIC
    }),
  }
);

if (!response.ok) {
  throw new Error(`API error ${response.status}`);
}


      const data = await response.json();

      router.push({
        pathname: "/ask-paragraph",
        params: {
          session_id: data.session_id,
          student_id: studentId,
          mcq_id: mcqId,
          mcq_json: JSON.stringify(phaseJson),
        },
      });
    } catch (err) {
      console.error(err);
      alert("Failed to start discussion");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={{
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#0d2017",
        borderWidth: 1,
        borderColor: "#10b981",
        alignItems: "center",
        opacity: isLoading ? 0.6 : 1,
      }}
      onPress={handleAskParagraph}
      disabled={isLoading}
    >
      <Text style={{ color: "#10b981", fontWeight: "700" }}>
        {isLoading ? "Starting discussion..." : "Ask Paragraph about this MCQ"}
      </Text>
    </TouchableOpacity>
  );
}

// ============================================================================
// STYLES — ONLY videoWrapper ADDED (SURGICAL)
// ============================================================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111b21",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    position: "relative", // ✅ ADD THIS
  },
  subject: {
    color: "#25D366",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
    topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

        progressRow: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#0d2017",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#25D36655",
  },

  progressText: {
    color: "#25D366",
    fontSize: 13,
    fontWeight: "700",
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 12,
  },

});

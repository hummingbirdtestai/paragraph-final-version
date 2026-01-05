// Videocard.tsx — FINAL (SURGICAL, PROD-READY)

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import ConceptChatScreen from "@/components/types/Conceptscreen";
import VideoMCQScreen from "@/components/types/VideoMCQScreen";
import { useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";
import { Bookmark, Heart } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import VimeoPlayer from "@/components/video/VimeoPlayer";

export function VideoCard({ phase, refresh }) {
  const isConcept = phase.phase_type === "concept";
  const isMCQ = phase.phase_type === "mcq";
  const isVideo = phase.phase_type === "video";

  const { user } = useAuth();
  
  // ORIGINAL bookmark for concept/mcq
  const [isBookmarked, setIsBookmarked] = React.useState(phase.is_bookmarked);
React.useEffect(() => {
  setIsBookmarked(!!phase.is_bookmarked);

  console.log("🔁 VideoCard bookmark SYNC", {
    phase_id: phase.id,
    phase_type: phase.phase_type,
    phase_is_bookmarked_prop: phase.is_bookmarked,
  });
}, [phase.id, phase.is_bookmarked]);


  // ⭐ VIDEO STATE ONLY
  const [videoState, setVideoState] = React.useState({
    is_liked: phase.is_liked ?? false,
    like_count: phase.like_count ?? 0,
  });
  const hasMarkedCompleted = React.useRef(false);
  const lastSentPercent = React.useRef(0);   // ✅ ADD HERE

  React.useEffect(() => {
  hasMarkedCompleted.current = false;
  lastSentPercent.current = 0;   // ✅ ADD
}, [phase.id]);
React.useEffect(() => {
  console.log("🟢 VideoCard MOUNT", phase.id);

  return () => {
    console.log("🔴 VideoCard UNMOUNT", phase.id);
  };
}, []);
  
  // DEBUG LOGS — UNTOUCHED
  React.useEffect(() => {
    if (isConcept) {
      console.log("📗 Concept Loaded", { concept_id: phase.id });
    }
    if (isMCQ) {
      console.log("📘 MCQ Loaded", {
        mcq_id: phase.id,
        concept_before: phase.concept_id_before_this_mcq,
        correct_answer: phase.phase_json?.correct_answer,
      });
    }
    if (isVideo) {
      console.log("🎬 Video Loaded", {
        video_id: phase.id,
        vimeo_id: phase.phase_json?.vimeo_video_id,
      });
    }
  }, [phase]);


  return (
    <View style={[styles.card, isConcept && styles.cardConcept]}>
      {/* SUBJECT */}
      {!isVideo && (
        <Text style={[styles.subject, isConcept && styles.subjectConcept]}>
          {phase.subject}
        </Text>
      )}
        {/* 🔝 TOP BAR — SAME AS PRACTICE */}
          {(isConcept || isMCQ) && (
  <View style={[styles.topBar, isConcept && styles.topBarConcept]}>

            {/* Progress */}
            <View style={styles.progressRow}>
              <Text style={styles.progressText}>
                {isMCQ ? "🧩 MCQ" : "🧠 Concept"} {phase.react_order_final} / {phase.total_count}
              </Text>
            </View>
        
            {/* Bookmark */}
<TouchableOpacity
  onPress={async () => {
    if (!user?.id) return;

    const { data, error } = await supabase.rpc(
      "toggle_video_bookmark_v2",
      {
        p_student_id: user.id,
        p_videocard_id: phase.id,
        p_subject: phase.subject,
      }
    );
    console.log("✅ TOP BAR BOOKMARK RPC RESULT", {
  data,
  error,
});

    if (error) {
      console.error("toggle_video_bookmark_v2 failed", error);
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



      {/* ⭐⭐⭐ VIDEO BLOCK — SURGICAL & SAFE ⭐⭐⭐ */}
      {isVideo && phase.phase_json?.vimeo_video_id ? (
        <View
  style={[
    styles.videoWrapper,
    {
      aspectRatio:
        phase.phase_json?.aspect_ratio === "portrait" ? 9 / 16 : 16 / 9,
    },
  ]}
>
          {/* 🎥 VIDEO HEADER OVERLAY */}
<View style={styles.videoHeaderContainer}>
  {/* Subject Line */}
  <Text style={styles.videoSubject}>{phase.subject}</Text>

  {/* Progress and Bookmark Bar */}
  <View style={styles.videoTopBar}>
    <View style={styles.progressRow}>
      <Text style={styles.progressText}>
        🎬 Video {phase.react_order_final} / {phase.total_count}
      </Text>
    </View>

    <TouchableOpacity
      onPress={async () => {
        if (!user?.id) return;

        const { data } = await supabase.rpc("toggle_video_bookmark_v2", {
          p_student_id: user.id,
          p_videocard_id: phase.id,
          p_subject: phase.subject,
        });

        if (data?.is_bookmark !== undefined) {
          setIsBookmarked(data.is_bookmark);
          refresh?.();
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
</View>

          <VimeoPlayer
  vimeoId={phase.phase_json.vimeo_video_id}
  onProgress={async (current, duration) => {
    if (!user?.id) return;
    if (!duration || duration === 0) return;

    const percent = Math.floor((current / duration) * 100);

    if (percent - lastSentPercent.current >= 5) {
      lastSentPercent.current = percent;

      supabase.rpc("update_video_progress_v1", {
        p_student_id: user.id,
        p_phase_id: phase.id,
        p_progress_percent: percent,
      });

      if (
        percent >= 90 &&
        !phase.is_viewed &&
        !hasMarkedCompleted.current
      ) {
        hasMarkedCompleted.current = true;

        await supabase.rpc("mark_video_completed_v1", {
          p_student_id: user.id,
          p_phase_id: phase.id,
        });

        refresh?.();
      }
    }
  }}
  onEnded={() => {
    if (!user?.id) return;
    if (hasMarkedCompleted.current) return;

    hasMarkedCompleted.current = true;

    supabase.rpc("mark_video_completed_v1", {
      p_student_id: user.id,
      p_phase_id: phase.id,
    });

    refresh?.();
  }}
/>
          {/* WATCHED BADGE */}
          {phase.is_viewed && (
            <View style={styles.watchedBadge}>
              <Text style={styles.watchedText}>Watched</Text>
            </View>
          )}

          {/* PROGRESS BAR */}
        {phase.progress_percent > 0 && phase.progress_percent < 100 && (
  <View style={styles.progressBarOuter}>
    <View
      style={[
        styles.progressBarInner,
        { width: `${phase.progress_percent}%` },
      ]}
    />
  </View>
)}


          {/* LIKE + BOOKMARK */}
          <View style={styles.videoActions}>
            <TouchableOpacity
              style={styles.likeRow}
              onPress={async () => {
                if (!user?.id) return;

                const { data } = await supabase.rpc("toggle_video_like_v1", {
                  p_student_id: user.id,
                  p_video_id: phase.id,
                });

                if (data) {
                  setVideoState((prev) => ({
                    ...prev,
                    is_liked: data.is_liked,
                    like_count: data.like_count,
                  }));
                }
              }}
            >
              <Heart
                size={22}
                color={videoState.is_liked ? "#ff4d4d" : "#888"}
                fill={videoState.is_liked ? "#ff4d4d" : "transparent"}
              />
              <Text style={styles.likeCount}>{videoState.like_count}</Text>
            </TouchableOpacity>

          </View>
        </View>
      ) : null}
     
      {/* CONCEPT — UNTOUCHED */}
      {isConcept && (
        <ConceptChatScreen
          item={phase.phase_json}
          studentId={"practice-view"}
          isBookmarked={false}
          reviewMode={true}
          hideInternalNext={true}
          phaseUniqueId={phase.id}
        />
      )}
      
  {isMCQ && (
  <>
    <VideoMCQScreen
      item={phase.phase_json}
      conceptId={phase.concept_id_before_this_mcq}
      mcqId={phase.id}
      correctAnswer={phase.phase_json?.correct_answer}
      studentId={user?.id}
      reviewMode={false}
      hideInternalNext={true}
      phaseUniqueId={phase.id}
      onAnswered={() => {
        refresh?.();
      }}
    />

    {/* 🔥 Ask Paragraph — DITTO PRACTICE CARD */}
<AskParagraphButton
  studentId={user?.id}
  mcqId={phase.id}
  phaseJson={phase.phase_json}
/>
  </>
)}


      {phase.image_url && (
        <Image source={{ uri: phase.image_url }} style={styles.image} />
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

      const response = await fetch(`${API_BASE_URL}/ask-paragraph/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          mcq_id: mcqId,
          mcq_payload: phaseJson,
        }),
      });

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
  cardConcept: {
    paddingHorizontal: 0,
  },
  subject: {
    color: "#25D366",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  subjectConcept: {
    paddingHorizontal: 16,
  },
    topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  topBarConcept: {
    paddingHorizontal: 16, // aligns with PracticeCard concept layout
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

  /* ⭐ SURGICAL ADDITION */
videoWrapper: {
  width: "100%",
  backgroundColor: "black",
},

  watchedBadge: {
    position: "absolute",
    top: 10,
    right: 16,
    backgroundColor: "#25D366",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  watchedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#000",
  },
  progressBarOuter: {
    marginTop: 10,
    height: 4,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarInner: {
    height: 4,
    backgroundColor: "#25D366",
  },
  videoActions: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  likeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  likeCount: {
    color: "#aaa",
    marginLeft: 6,
    fontSize: 13,
  },
  videoHeaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: "rgba(0,0,0,0.75)",
    paddingTop: 12,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  videoSubject: {
    color: "#25D366",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
  },
  videoTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});

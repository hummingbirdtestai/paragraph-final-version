// Videocard.tsx — FINAL (SURGICAL, PROD-READY)

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import ConceptChatScreen from "@/components/types/Conceptscreen";
import VideoMCQScreen from "@/components/types/VideoMCQScreen";
import { StudentBubble } from "@/components/chat/StudentBubble";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import { MessageInput } from "@/components/chat/MessageInput";

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

  const [conversation, setConversation] = React.useState([]);
  const [isSending, setIsSending] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

  // ORIGINAL bookmark for concept/mcq
  const [isBookmarked, setIsBookmarked] = React.useState(phase.is_bookmarked);
React.useEffect(() => {
  console.log("🔁 VideoCard bookmark state INIT / UPDATE", {
    phase_id: phase.id,
    phase_type: phase.phase_type,
    phase_is_bookmarked_prop: phase.is_bookmarked,
    local_isBookmarked_state: isBookmarked,
  });
}, [phase.is_bookmarked]);

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

  const ORCHESTRATOR_URL =
    "https://paragraph-pg-production.up.railway.app/orchestrate";

  return (
    <View style={[styles.card, isConcept && styles.cardConcept]}>
      {/* SUBJECT */}
      <Text style={[styles.subject, isConcept && styles.subjectConcept]}>
        {phase.subject}
      </Text>
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
                  { width: `${phase.progress_percent * 100}%` },
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
console.log("🚀 VIDEO ACTION BOOKMARK CLICK", {
  source: "video_actions",
  student_id: user?.id,
  phase_id: phase.id,
  phase_type: phase.phase_type,
  subject: phase.subject,
  local_before: isBookmarked,
});      
                if (error) {
                  console.error("toggle_video_bookmark_v2 failed", error);
                  return;
                }
            
                if (data?.is_bookmark !== undefined) {
                  setIsBookmarked(data.is_bookmark);
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
      
      {/* MCQ — UNTOUCHED */}
      {isMCQ && (
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
          refresh?.();   // ✅ ADD THIS LINE
        }}
      />
    )}


      {/* CHAT — UNTOUCHED */}
      {conversation.map((msg, index) =>
        msg.role === "student" ? (
          <StudentBubble key={index} text={msg.content} />
        ) : (
          <MentorBubbleReply key={index} markdownText={msg.content} />
        )
      )}

      {isTyping && (
        <MentorBubbleReply markdownText={"💬 *Dr. Murali Bharadwaj is typing…*"} />
      )}

      {phase.image_url && (
        <Image source={{ uri: phase.image_url }} style={styles.image} />
      )}

      <MessageInput
        placeholder={isSending ? "Waiting for mentor..." : "Ask your doubt..."}
        disabled={isSending}
        onSend={async (text) => {
          if (!text.trim()) return;

          setConversation((prev) => [
            ...prev,
            { role: "student", content: text },
          ]);
          setIsSending(true);
          setIsTyping(true);

          try {
            const res = await fetch(ORCHESTRATOR_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "chat",
                student_id: user?.id,
                subject_id: phase.subject_id,
                message: text,
              }),
            });

            const data = await res.json();

            if (data?.mentor_reply) {
              setConversation((prev) => [
                ...prev,
                { role: "assistant", content: data.mentor_reply },
              ]);
            }
          } finally {
            setIsSending(false);
            setIsTyping(false);
          }
        }}
      />
    </View>
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
  marginHorizontal: -16, // cancels card padding
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
});

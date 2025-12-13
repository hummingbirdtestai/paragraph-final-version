//Videocard.tsx — FINAL WITH VIDEO ADDED WITHOUT TOUCHING EXISTING CODE
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import ConceptChatScreen from "@/components/types/Conceptscreen";
import MCQChatScreen from "@/components/types/MCQScreen";
import UnifiedVideoPlayer from "@/components/video/UnifiedVideoPlayer";

import { StudentBubble } from "@/components/chat/StudentBubble";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import { MessageInput } from "@/components/chat/MessageInput";

import { TouchableOpacity } from "react-native";
import { Bookmark, Heart } from "lucide-react-native";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { Platform } from "react-native";


export function VideoCard({ phase }) {
  const isConcept = phase.phase_type === "concept";
  const isMCQ = phase.phase_type === "mcq";
  const isVideo = phase.phase_type === "video";

  const { user } = useAuth();

  const [conversation, setConversation] = React.useState([]);
  const [isSending, setIsSending] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  
  // ORIGINAL bookmark for concept/mcq
  const [isBookmarked, setIsBookmarked] = React.useState(phase.is_bookmarked);

  // ⭐ NEW LOCAL STATE FOR VIDEO ONLY (SEPARATE FROM CONCEPT/MCQ BOOKMARK)
  const [videoState, setVideoState] = React.useState({
    is_liked: phase.is_liked ?? false,
    like_count: phase.like_count ?? 0,
    is_bookmarked: phase.is_video_bookmarked ?? false,
  });

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
        url: phase.phase_json?.videoUrl,
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

      {/* ORIGINAL BOOKMARK (Concept/MCQ only) */}
      {/* ⭐⭐⭐ VIDEO BLOCK (Clean, no hover) ⭐⭐⭐ */}
{isVideo && (
  <View>
    {/* 🎬 VIDEO */}
    <UnifiedVideoPlayer
      videoUrl={phase.phase_json?.videoUrl}
      posterUrl={phase.phase_json?.posterUrl}
      onProgress={(current, duration) => {
        const percent = Math.floor((current / duration) * 100);
    
        supabase.rpc("update_video_progress_v1", {
          p_student_id: user.id,
          p_phase_id: phase.id,
          p_progress_percent: percent,
        });
    
        if (percent >= 90) {
          supabase.rpc("mark_video_completed_v1", {
            p_student_id: user.id,
            p_phase_id: phase.id,
          });
        }
      }}
    />


    {/* WATCHED BADGE */}
    {phase.is_viewed && (
      <View
        style={{
          position: "absolute",
          top: 10,
          right: 16,
          backgroundColor: "#25D366",
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 6,
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "700", color: "#000" }}>
          Watched
        </Text>
      </View>
    )}

    {/* PROGRESS BAR */}
    {phase.progress_percent > 0 && phase.progress_percent < 1 && (
      <View
        style={{
          marginTop: 10,
          height: 4,
          backgroundColor: "#333",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${phase.progress_percent * 100}%`,
            height: 4,
            backgroundColor: "#25D366",
          }}
        />
      </View>
    )}

    {/* LIKE + VIDEO BOOKMARK */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
      }}
    >
      {/* ❤️ LIKE */}
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginRight: 16,
        }}
        onPress={async () => {
          if (!user?.id) return;

          const { data, error } = await supabase.rpc(
            "toggle_video_like_v1",
            {
              p_student_id: user.id,
              p_video_id: phase.id,
            }
          );

          if (!error) {
            setVideoState((prev) => ({
              ...prev,
              is_liked: data?.is_liked,
              like_count: data?.like_count,
            }));
          }
        }}
      >
        <Heart
          size={22}
          color={videoState.is_liked ? "#ff4d4d" : "#888"}
          fill={videoState.is_liked ? "#ff4d4d" : "transparent"}
        />
        <Text style={{ color: "#aaa", marginLeft: 6, fontSize: 13 }}>
          {videoState.like_count}
        </Text>
      </TouchableOpacity>

      {/* 🔖 VIDEO BOOKMARK */}
      <TouchableOpacity
        onPress={async () => {
          if (!user?.id) return;

          const { data, error } = await supabase.rpc(
            "toggle_video_bookmark_v1",
            {
              p_student_id: user.id,
              p_video_id: phase.id,
            }
          );

          if (!error) {
            setVideoState((prev) => ({
              ...prev,
              is_bookmarked: data?.is_bookmarked,
            }));
          }
        }}
      >
        <Bookmark
          size={22}
          color={videoState.is_bookmarked ? "#25D366" : "#888"}
          fill={videoState.is_bookmarked ? "#25D366" : "transparent"}
        />
      </TouchableOpacity>
    </View>
  </View>
)}
      {/* END OF VIDEO BLOCK */}


      {/* ⭐⭐⭐ ORIGINAL CONCEPT BLOCK — UNTOUCHED ⭐⭐⭐ */}
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

      {/* ⭐⭐⭐ ORIGINAL MCQ BLOCK — UNTOUCHED ⭐⭐⭐ */}
      {isMCQ && (
        <MCQChatScreen
          item={phase.phase_json}
          conceptId={phase.concept_id_before_this_mcq}
          mcqId={phase.id}
          correctAnswer={phase.phase_json?.correct_answer}
          studentId={user?.id}
          reviewMode={false}
          hideInternalNext={true}
          phaseUniqueId={phase.id}
          onAnswered={(selected) => {
            console.log("🧠 [PracticeCard] MCQ answered", {
              mcq_id: phase.id,
              concept_before: phase.concept_id_before_this_mcq,
              selected,
              correct: phase.phase_json?.correct_answer,
            });
          }}
        />
      )}

      {/* ⭐⭐⭐ CHAT BUBBLES — UNTOUCHED ⭐⭐⭐ */}
      {conversation.map((msg, index) =>
        msg.role === "student" ? (
          <StudentBubble key={index} text={msg.content} />
        ) : (
          <MentorBubbleReply key={index} markdownText={msg.content} />
        )
      )}

      {/* TYPING STATE — UNTOUCHED */}
      {isTyping && (
        <MentorBubbleReply markdownText={"💬 *Dr. Murali Bharadwaj is typing…*"} />
      )}

      {/* IMAGE (IF ANY) — UNTOUCHED */}
      {phase.image_url && (
        <Image source={{ uri: phase.image_url }} style={styles.image} />
      )}

      {/* ⭐⭐⭐ MESSAGE INPUT — UNTOUCHED ⭐⭐⭐ */}
      <MessageInput
        placeholder={isSending ? "Waiting for mentor..." : "Ask your doubt..."}
        disabled={isSending}
        onSend={async (text) => {
          if (!text.trim()) return;

          setConversation((prev) => [...prev, { role: "student", content: text }]);
          setIsSending(true);
          setIsTyping(true);

          const payload = {
            action: "chat",
            student_id: user?.id,
            subject_id: phase.subject_id,
            message: text,
          };

          try {
            const res = await fetch(ORCHESTRATOR_URL, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
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
//                               STYLES — UNTOUCHED
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
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 12,
  },
  bookmarkRow: {
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 999,
  },
  bookmarkRowConcept: {
    right: 16,
  },
  progressRow: {
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#0d2017",
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#25D3665",
  },
  progressRowConcept: {
    marginHorizontal: 16,
  },
  progressText: {
    color: "#25D366",
    fontSize: 13,
    fontWeight: "700",
  },
});

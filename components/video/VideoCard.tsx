// PracticeCard.tsx — FINAL WITH VIDEO ADDED WITHOUT TOUCHING EXISTING CODE
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import ConceptChatScreen from "@/components/types/Conceptscreen";
import MCQChatScreen from "@/components/types/MCQScreen";
import VideoScreen from "@/components/types/VideoScreen";    // ⭐ ADDED ONLY

import { StudentBubble } from "@/components/chat/StudentBubble";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import { MessageInput } from "@/components/chat/MessageInput";
import { TouchableOpacity } from "react-native";
import { Bookmark } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";

import { useAuth } from "@/contexts/AuthContext";


export function PracticeCard({ phase }) {
  const isConcept = phase.phase_type === "concept";
  const isMCQ = phase.phase_type === "mcq";
  const isVideo = phase.phase_type === "video";              // ⭐ ADDED ONLY

  const [conversation, setConversation] = React.useState([]);
  const [isSending, setIsSending] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);
  const { user } = useAuth();

  const [isBookmarked, setIsBookmarked] =
    React.useState(phase.is_bookmarked);

  // 🔵 DEBUG LOGS — ORIGINAL CODE UNTOUCHED
  React.useEffect(() => {
    if (phase.phase_type === "concept") {
      console.log("📗 [PracticeCard] Concept Loaded", {
        concept_id: phase.id,
      });
    }

    if (phase.phase_type === "mcq") {
      console.log("📘 [PracticeCard] MCQ Loaded", {
        mcq_id: phase.id,
        concept_before: phase.concept_id_before_this_mcq,
        correct_answer: phase.phase_json?.correct_answer,
      });
    }

    if (phase.phase_type === "video") {                     // ⭐ ADDED ONLY
      console.log("🎬 [PracticeCard] Video Loaded", {
        video_id: phase.id,
        url: phase.phase_json?.video_url,
      });
    }
  }, [phase]);

  const ORCHESTRATOR_URL =
    "https://paragraph-pg-production.up.railway.app/orchestrate";

  return (
    <View style={[styles.card, isConcept && styles.cardConcept]}>
      {/* SUBJECT NAME — ORIGINAL */}
      <Text style={[styles.subject, isConcept && styles.subjectConcept]}>
        {phase.subject}
      </Text>

      {/* BOOKMARK — ORIGINAL */}
      <View style={[styles.bookmarkRow, isConcept && styles.bookmarkRowConcept]}>
        <TouchableOpacity
          onPress={async () => {
            if (!user?.id) return;

            console.log("🔖 Toggle practice bookmark", {
              practicecard_id: phase.id,
              subject: phase.subject,
            });

            const { data, error } = await supabase.rpc(
              "toggle_practice_bookmark_v1",
              {
                p_student_id: user.id,
                p_practicecard_id: phase.id,
                p_subject: phase.subject,
              }
            );

            if (error) return;

            const newState = data?.is_bookmark ?? !isBookmarked;
            setIsBookmarked(newState);
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

      {/* PROGRESS COUNTER — ORIGINAL, NOT EDITED */}
      <View style={[styles.progressRow, isConcept && styles.progressRowConcept]}>
        <Text style={styles.progressText}>
          {isMCQ ? "🧩 MCQ" : "🧠 Concept"} {phase.react_order_final} /{" "}
          {phase.total_count}
        </Text>
      </View>

      {/* ⭐⭐⭐ INSERTED VIDEO BLOCK — NOTHING ELSE TOUCHED ⭐⭐⭐ */}
      {isVideo && (
        <VideoScreen
          videoUrl={phase.phase_json?.video_url}
          posterUrl={phase.phase_json?.poster_url}
          speedControls={true}
          phaseUniqueId={phase.id}
        />
      )}
      {/* END OF VIDEO BLOCK */}

      {/* FULL VIEW RENDER — ORIGINAL UNTOUCHED */}
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

      {/* CHAT — ORIGINAL */}
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

      {/* MESSAGE INPUT — ORIGINAL */}
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

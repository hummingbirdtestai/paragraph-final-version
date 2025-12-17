// Imagecard.tsx — FINAL (SURGICAL, PROD-READY)

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import ConceptChatScreen from "@/components/types/Conceptscreen";
import VideoMCQScreen from "@/components/types/VideoMCQScreen";
import { StudentBubble } from "@/components/chat/StudentBubble";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import { MessageInput } from "@/components/chat/MessageInput";

import { TouchableOpacity } from "react-native";
import { Bookmark } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import FlashcardScreenDB from "@/components/types/flashcardscreen";


export function ImageCard({ phase, refresh }) {
  const isFlashcard = phase.phase_type === "flashcard";
  const isMCQ = phase.phase_type === "mcq";
  const isImage = phase.phase_type === "image";

  const { user } = useAuth();

  const [conversation, setConversation] = React.useState([]);
  const [isSending, setIsSending] = React.useState(false);
  const [isTyping, setIsTyping] = React.useState(false);

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
  }, [phase]);

  const router = useRouter();
  const ORCHESTRATOR_URL =
    "https://paragraph-pg-production.up.railway.app/orchestrate";

  return (
    <View style={[styles.card, isConcept && styles.cardConcept]}>
      {/* SUBJECT */}
 {/* ✅ NEW */}
<Text style={styles.subject}>{phase.subject}</Text>
        {/* 🔝 TOP BAR — SAME AS PRACTICE */}
          {(isImage || isMCQ) && (
  <View style={[styles.topBar, isConcept && styles.topBarConcept]}>

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



{isImage && phase.image_url && (
  <TouchableOpacity
    activeOpacity={0.9}
    onPress={() =>
      router.push({
        pathname: "/media-viewer",
        params: {
          url: phase.image_url_supabase || phase.image_url,
        },
      })
    }
  >
    <Image
      source={{ uri: phase.image_url_supabase || phase.image_url }}
      style={styles.image}
      resizeMode="contain"
    />
  </TouchableOpacity>
)}
{isFlashcard && (
  <FlashcardScreenDB
    item={phase.phase_json}
    studentId={user?.id}
    subjectName={phase.subject}
    elementId={phase.id}
    isBookmarked={phase.is_bookmarked}
  />
)}
     
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

});

import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import ConceptChatScreen from "@/components/types/Conceptscreen";
import MCQChatScreen from "@/components/types/MCQScreen";
import { StudentBubble } from "@/components/chat/StudentBubble";
import MentorBubbleReply from "@/components/types/MentorBubbleReply";
import { MessageInput } from "@/components/chat/MessageInput";

import { useAuth } from "@/contexts/AuthContext";


export function PracticeCard({ phase }) {
  const isConcept = phase.phase_type === "concept";
  const isMCQ = phase.phase_type === "mcq";
  const [conversation, setConversation] = React.useState([]);
const [isSending, setIsSending] = React.useState(false);
const [isTyping, setIsTyping] = React.useState(false);
  const { user } = useAuth();

  

const ORCHESTRATOR_URL =
  "https://paragraph-pg-production.up.railway.app/orchestrate";


  return (
    <View style={styles.card}>
      {/* SUBJECT NAME */}
      <Text style={styles.subject}>{phase.subject}</Text>

      {/* 🔥 NEW — Progress Counter */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>
          {isMCQ ? "🧩 MCQ" : "🧠 Concept"} {phase.react_order_final} / {phase.total_count}
        </Text>
      </View>

      {/* FULL VIEW RENDER */}
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
          studentId={null} // ✔ prevents Supabase RPC call
          isBookmarked={false}
          reviewMode={false} // ✔ allow answering in practice
          hideInternalNext={true} // ✔ no "Next" button
          phaseUniqueId={phase.id}
          onAnswered={(selected) => {
            console.log("🧠 Stored locally in practice:", {
              mcq_id: phase.id,
              selected,
            });
          }}
        />
      )}
      {/* 🗨 Chat Conversation Bubbles */}
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
      {/* 💬 Message Input */}
<MessageInput
  placeholder={
    isSending ? "Waiting for mentor..." : "Ask your doubt..."
  }
  disabled={isSending}
 onSend={async (text) => {
  console.log("🟦 [PRACTICE] Sending chat");

  if (!text.trim()) return;

  setConversation(prev => [...prev, { role: "student", content: text }]);
  setIsSending(true);
  setIsTyping(true);

  const payload = {
  action: "chat",
  student_id: user?.id,
  subject_id: phase.subject_id,
  message: text,
};


  console.log("🟦 Payload:", payload);

  try {
    const res = await fetch(ORCHESTRATOR_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    console.log("🟧 status:", res.status);

    const data = await res.json();
    console.log("🟩 Received:", data);

    if (data?.mentor_reply) {
      setConversation(prev => [
        ...prev,
        { role: "assistant", content: data.mentor_reply },
      ]);
    }
  } catch (err) {
    console.log("💥 ERROR:", err);
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
  subject: {
    color: "#25D366",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    marginTop: 12,
  },

  progressRow: {
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: "#0d2017",
    borderRadius: 12,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#25D3665", // faint green
  },

  progressText: {
    color: "#25D366",
    fontSize: 13,
    fontWeight: "700",
  },
});

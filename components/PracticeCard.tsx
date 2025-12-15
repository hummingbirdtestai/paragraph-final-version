//practicecard.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

import ConceptChatScreen from "@/components/types/Conceptscreen";
import MCQChatScreen from "@/components/types/MCQScreen";
import { TouchableOpacity } from "react-native";
import { Bookmark } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";


export function PracticeCard({ phase }) {
  const isConcept = phase.phase_type === "concept";
  const isMCQ = phase.phase_type === "mcq";
  const { user } = useAuth();
  const router = useRouter();
  // Local bookmark state (like FlashcardCard)
const [isBookmarked, setIsBookmarked] = React.useState(phase.is_bookmarked);


  // 🔵 DEBUG: Log concept/mcq IDs when card loads
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
  }, [phase]);

  return (
    <View style={[styles.card, isConcept && styles.cardConcept]}>
      {/* SUBJECT NAME */}
      <Text style={[styles.subject, isConcept && styles.subjectConcept]}>{phase.subject}</Text>
      {/* 🔖 Inline bookmark icon (same as flashcards) */}
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

      if (error) {
        console.log("❌ Bookmark toggle error:", error);
        return;
      }

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


      {/* 🔥 NEW — Progress Counter */}
      <View style={[styles.progressRow, isConcept && styles.progressRowConcept]}>
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
  <>
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
          correct: phase.phase_json?.correct_answer
        });
      }}
    />

    <TouchableOpacity
      style={{
        marginTop: 12,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: "#0d2017",
        borderWidth: 1,
        borderColor: "#10b981",
        alignItems: "center",
      }}
      onPress={() =>
        router.push({
          pathname: "/ask-paragraph",
          params: {
            subject_id: phase.subject_id,
            mcq_id: phase.id,
            react_order: phase.react_order_final,
          },
        })
      }
    >
      <Text style={{ color: "#10b981", fontWeight: "700" }}>
        Ask Paragraph about this MCQ
      </Text>
    </TouchableOpacity>
  </>
)}
  
      {phase.image_url && (
        <Image source={{ uri: phase.image_url }} style={styles.image} />
      )}
   
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

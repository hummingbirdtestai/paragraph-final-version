//MockPracticecard.tsx
import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useWindowDimensions } from "react-native";
import ConceptChatScreen from "@/components/types/Conceptscreen";
import MCQChatScreen from "@/components/types/MocktestMCQScreen";
import { TouchableOpacity } from "react-native";
import { Bookmark } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";


export function MockPracticeCard({
  phase,
  examSerial,
  onBookmarkToggle,
}: {
  phase: any;
  examSerial: number;
  onBookmarkToggle: (reactOrder: number, newState: boolean) => void;
}) {
   const { width } = useWindowDimensions();
  const isWeb = width >= 1024;
  const isConcept = phase.phase_type === "concept";
  const isMCQ = phase.phase_type === "mcq";
  const { user } = useAuth();
  const router = useRouter();

  const isBookmarked = phase.is_bookmarked;




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

      const { data, error } = await supabase.rpc("toggle_mocktest_bookmark_v1", {
        p_exam_serial: examSerial,
        p_react_order_final: phase.react_order_final,
        p_subject: phase.subject,
      });

      if (error) {
        console.log("❌ Bookmark toggle error:", error);
        return;
      }

      const newState = data?.is_bookmark ?? !isBookmarked;
      onBookmarkToggle(phase.react_order_final, newState);
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
  <View style={isWeb ? styles.webConstrained : undefined}>
    <MCQChatScreen
      item={phase.phase_json}
      mcqId={phase.id}
      studentId={user?.id}
      correctAnswer={phase.phase_json.correct_answer}
      reviewMode={false}
      hideInternalNext={true}
      phaseUniqueId={phase.id}
    />

    <AskParagraphButton
      studentId={user?.id}
      mcqId={phase.id}
      subjectName={phase.subject}
      phaseJson={phase.phase_json}
      reactOrder={phase.react_order_final}
    />
  </View>
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
  subjectName,
  phaseJson,
  reactOrder,
}: {
  studentId: string | undefined;
  mcqId: string;
  subjectName: string;
  phaseJson: any;
  reactOrder: number;
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
      headers: {
        "Content-Type": "application/json",
      },
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
         mcq_json: JSON.stringify(phaseJson),   // ✅ ADD THIS
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
        {isLoading ? 'Starting discussion...' : 'Ask Paragraph about this MCQ'}
      </Text>
    </TouchableOpacity>
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
  webConstrained: {          // 👈 ADD HERE
  maxWidth: 860,
  alignSelf: "center",
  width: "100%",
},

});

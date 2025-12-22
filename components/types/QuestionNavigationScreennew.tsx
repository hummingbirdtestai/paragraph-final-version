// QuestionNavigationScreennew.tsx
import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
} from "react-native";
import {
  Grid3x3,
  CheckCircle,
  Circle,
  BookmarkIcon,
  XCircle,
  Clock,
} from "lucide-react-native";

/* ------------------------------------------------------------------ */
/* 🔑 STATUS DERIVATION — BACKEND IS SOURCE OF TRUTH                  */
/* ------------------------------------------------------------------ */

export type QuestionStatus =
  | "answered"
  | "review"
  | "skipped"
  | "unvisited";

export const getQuestionStatus = (mcq: any): QuestionStatus => {
  if (mcq?.is_review === true) return "review";
  if (mcq?.is_skipped === true) return "skipped";
  if (mcq?.student_answer != null) return "answered";
  return "unvisited";
};

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

export interface PaletteMCQ {
  react_order_final: number;
  section_q_number: number;
  student_answer: string | null;
  is_skipped: boolean;
  is_review: boolean;
  is_correct: boolean | null;
}

interface PaletteCounts {
  answered: number;
  skipped: number;
  marked: number;
  unanswered: number;
}

interface Props {
  isVisible: boolean;
  onClose: () => void;
  mcqs: PaletteMCQ[];
  counts: PaletteCounts;
  sectionId: string;
  currentQuestion: number;
  timeLeft: number;
  onSelectQuestion: (react_order_final: number) => void;
  onStartNextSection?: () => void;
  isSectionComplete?: boolean;
}

/* ------------------------------------------------------------------ */
/* COMPONENT                                                           */
/* ------------------------------------------------------------------ */

export default function QuestionNavigationScreennew({
  isVisible,
  onClose,
  mcqs,
  counts,
  sectionId,
  currentQuestion,
  timeLeft,
  onSelectQuestion,
  onStartNextSection,
  isSectionComplete,
}: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeFilter, setActiveFilter] = useState<
    "all" | "answered" | "marked" | "skipped" | "unanswered"
  >("all");

  /* ------------------------------------------------------------------ */
  /* 🧠 ENRICH MCQS WITH STATUS                                          */
  /* ------------------------------------------------------------------ */

  const enrichedMCQs = useMemo(() => {
    return mcqs.map((mcq) => ({
      ...mcq,
      status: getQuestionStatus(mcq),
    }));
  }, [mcqs]);

  /* ------------------------------------------------------------------ */
  /* 🔍 FILTER LOGIC                                                     */
  /* ------------------------------------------------------------------ */

  const filteredMCQs = useMemo(() => {
    if (activeFilter === "all") return enrichedMCQs;

    return enrichedMCQs.filter((q) => {
      if (activeFilter === "answered") return q.status === "answered";
      if (activeFilter === "marked") return q.status === "review";
      if (activeFilter === "skipped") return q.status === "skipped";
      if (activeFilter === "unanswered") return q.status === "unvisited";
      return true;
    });
  }, [activeFilter, enrichedMCQs]);

  /* ------------------------------------------------------------------ */
  /* ⏱ TIME FORMAT                                                       */
  /* ------------------------------------------------------------------ */

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  /* ------------------------------------------------------------------ */
  /* 🎨 STATUS ICON                                                      */
  /* ------------------------------------------------------------------ */

  const renderStatusIcon = (status: QuestionStatus) => {
    switch (status) {
      case "answered":
        return <CheckCircle size={10} color="#10b981" />;
      case "review":
        return <BookmarkIcon size={10} color="#f59e0b" />;
      case "skipped":
        return <XCircle size={10} color="#ef4444" />;
      default:
        return <Circle size={10} color="#64748b" />;
    }
  };

    /* ------------------------------------------------------------------ */
  /* UI                                                                  */
  /* ------------------------------------------------------------------ */

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            !isMobile && styles.modalContentDesktop,
          ]}
        >
          <View style={styles.modalHandle} />

          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.timerContainer}>
              <Clock size={14} color="#3b82f6" />
              <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
            </View>

            <View style={styles.countsRow}>
              <Text style={styles.countText}>🟢 {counts.answered}</Text>
              <Text style={styles.countText}>🟡 {counts.marked}</Text>
              <Text style={styles.countText}>🔴 {counts.skipped}</Text>
              <Text style={styles.countText}>⚪ {counts.unanswered}</Text>
            </View>
          </View>

          {/* FILTERS */}
          <View style={styles.filtersRow}>
            {["all", "answered", "marked", "skipped", "unanswered"].map(
              (f) => (
                <TouchableOpacity
                  key={f}
                  style={[
                    styles.filterChip,
                    activeFilter === f && styles.filterChipActive,
                  ]}
                  onPress={() => setActiveFilter(f as any)}
                >
                  <Text
                    style={[
                      styles.filterText,
                      activeFilter === f && styles.filterTextActive,
                    ]}
                  >
                    {f.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </View>

          {/* GRID */}
          <ScrollView>
            <View style={styles.grid}>
              {filteredMCQs.map((mcq) => {
                const isCurrent =
                  mcq.section_q_number === currentQuestion;

                return (
                  <TouchableOpacity
                    key={mcq.react_order_final}
                    style={[
                      styles.questionBubble,
                      isCurrent && styles.currentQuestion,
                    ]}
                    onPress={() =>
                      onSelectQuestion(mcq.react_order_final)
                    }
                  >
                    <Text style={styles.questionNumber}>
                      {mcq.section_q_number}
                    </Text>
                    <View style={styles.iconCorner}>
                      {renderStatusIcon(mcq.status)}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          {/* FOOTER */}
          {isSectionComplete && onStartNextSection && (
            <TouchableOpacity
              style={styles.nextSectionBtn}
              onPress={onStartNextSection}
            >
              <Text style={styles.nextSectionText}>
                Go to Next Section
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* STYLES — 100% UNCHANGED                                              */
/* ------------------------------------------------------------------ */

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#000",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 16,
    maxHeight: "90%",
  },
  modalContentDesktop: {
    maxWidth: 520,
    alignSelf: "center",
    width: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#374151",
    borderRadius: 2,
    alignSelf: "center",
    marginVertical: 10,
  },
  header: {
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  timerContainer: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  timerText: {
    color: "#3b82f6",
    fontWeight: "700",
  },
  countsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  countText: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
  },
  filtersRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  filterChip: {
    backgroundColor: "#1e293b",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  filterChipActive: {
    backgroundColor: "#10b981",
  },
  filterText: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "600",
  },
  filterTextActive: {
    color: "#000",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    paddingHorizontal: 12,
  },
  questionBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#374151",
    justifyContent: "center",
    alignItems: "center",
  },
  currentQuestion: {
    borderColor: "#10b981",
    borderWidth: 2,
  },
  questionNumber: {
    color: "#e5e7eb",
    fontWeight: "700",
  },
  iconCorner: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
  nextSectionBtn: {
    backgroundColor: "#10b981",
    margin: 12,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  nextSectionText: {
    color: "#000",
    fontWeight: "700",
  },
  closeBtn: {
    backgroundColor: "#1e293b",
    marginHorizontal: 12,
    marginTop: 4,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  closeText: {
    color: "#fff",
    fontWeight: "600",
  },
});

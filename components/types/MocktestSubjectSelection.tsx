//MocktestSubjectSelection.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import { ChevronDown, ChevronRight, FlaskConical, BookOpen, TrendingUp } from "lucide-react-native";
import { MockTestCard } from "@/components/types/MockTestCard";
import type { UserMockTest } from "@/types/mock-test";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MocktestDashboardProps {
   mockWindow?: {
    present?: any;
    next?: any;
    review?: any[];
  } | null;
  completedTests: UserMockTest[];
  onStartTest: (testId: string) => void;
  onReviewTest: (testId: string) => void;
  loading?: boolean;
}

export function MocktestDashboard({
  mockWindow,
  completedTests,
  onStartTest,
  onReviewTest,
  loading = false,
}: MocktestDashboardProps) {
  const router = useRouter();
  const { user } = useAuth();
const userId = user?.id;


  const [expandedSection, setExpandedSection] = useState<string | null>("present");

  const handleToggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      {/* ─────────────── PRESENT TESTS ─────────────── */}
      <Accordion
        title="Start Mock Test"
        icon={<FlaskConical color="#25D366" size={22} />}
        isExpanded={expandedSection === "present"}
        onToggle={() => handleToggleSection("present")}
      >
        {loading ? (
          <Text style={styles.emptyText}>Loading mock tests...</Text>
        ) : mockWindow ? (
          <>
            {mockWindow.present && (
              <MockTestCard
                key={mockWindow.present.exam_serial}
                title={mockWindow.present.exam_title}
                date={formatDate(mockWindow.present.exam_date)}
                buttonText="Start Test"
                buttonVariant="filled"
               onPress={async () => {
  if (!userId) {
    Alert.alert("Login Required", "Please log in first");
    return;
  }

  console.log("🟢 USER CLICKED START TEST for exam:", mockWindow.present.exam_serial, "student:", userId);

  try {
    const response = await fetch(
      "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "start_mocktest",
          student_id: userId,
          exam_serial: mockWindow.present.exam_serial,
        }),
      }
    );

    const data = await response.json();
    console.log("🟢 FASTAPI start_mocktest RAW RESPONSE:", data);
    console.log("🟢 react_order_final received:", data.react_order_final);
    console.log("🟢 time_left received:", data.time_left);

    console.log("🟢 Navigating → /mocktests with exam_serial:", mockWindow.present.exam_serial);

    router.push(
  `/mocktests?start=true&exam_serial=${mockWindow.present.exam_serial}
   &title=${encodeURIComponent(mockWindow.present.exam_title)}
   &date=${encodeURIComponent(mockWindow.present.exam_date)}`
);


  } catch (err) {
    console.error("Start Test Error:", err);
  }
}}


              />
            )}
            {mockWindow.next && (() => {
              const isLocked = new Date(mockWindow.next.exam_date) > new Date();
            
              return (
                <MockTestCard
                  key={mockWindow.next.exam_serial}
                  title={mockWindow.next.exam_title}
                  date={formatDate(mockWindow.next.exam_date)}
                  buttonText={isLocked ? "Locked Until Date" : "Start Test"}
                  buttonVariant={isLocked ? "disabled" : "outlined"}
                  onPress={async () => {
  if (!userId) {
    Alert.alert("Login Required", "Please log in first");
    return;
  }

  try {
    const response = await fetch(
      "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "start_mocktest",
          student_id: userId,
          exam_serial: mockWindow.present.exam_serial,
        }),
      }
    );

    const data = await response.json();
    console.log("🔥 Start Test Response:", data);

    const ro = Number(data.react_order_final);
router.push(`/mocktests?start=true&exam_serial=${mockWindow.present.exam_serial}`);

  } catch (err) {
    console.error("Start Test Error:", err);
  }
}}

                />
              );
            })()}
          </>
        ) : (
          <Text style={styles.emptyText}>No mock tests available.</Text>
        )}
      </Accordion>

      {/* ─────────────── REVIEW TESTS ─────────────── */}
      <Accordion
          title="Review Previous Mock Tests"
          icon={<BookOpen color="#25D366" size={22} />}
          isExpanded={expandedSection === "review"}
          onToggle={() => handleToggleSection("review")}
        >
          {mockWindow?.review && mockWindow.review.length > 0 ? (
            mockWindow.review.map((test: any) => (
              <MockTestCard
  key={test.exam_serial}
  title={test.exam_title}
  date={formatDate(test.exam_date)}
  buttonText="Review"
  buttonVariant="outlined"
  onPress={() => onReviewTest(test.exam_serial)}   // ✅ this line
/>

            ))
          ) : (
            <Text style={styles.emptyText}>No past tests to review yet.</Text>
          )}
        </Accordion>
    </View>
  );
}

/** 🔹 Reusable Accordion Block */
function Accordion({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionContainer}>
      <TouchableOpacity
        style={[styles.header, isExpanded && styles.headerExpanded]}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.headerLeft}>
          {icon}
          <Text style={styles.headerText}>{title}</Text>
        </View>
        {isExpanded ? (
          <ChevronDown color="#25D366" size={24} />
        ) : (
          <ChevronRight color="#888" size={24} />
        )}
      </TouchableOpacity>

      {isExpanded && <View style={styles.content}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  sectionContainer: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#1a1a1a",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    backgroundColor: "#1a1a1a",
  },
  headerExpanded: {
    borderBottomWidth: 1,
    borderBottomColor: "#2a2a2a",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 12,
  },
  content: {
    padding: 16,
    paddingTop: 12,
  },
  emptyText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    paddingVertical: 20,
  },
  analyticsContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  analyticsEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  analyticsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    marginBottom: 8,
  },
  analyticsSubtext: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

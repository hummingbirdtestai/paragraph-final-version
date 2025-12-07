//practice.tsx
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Eye, EyeOff, Bookmark } from "lucide-react-native";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { SubjectFilterBubble } from "@/components/SubjectFilterBubble";
import { PracticeCard } from "@/components/PracticeCard";
import { usePracticeData } from "@/hooks/usePracticeData";
import MainLayout from "@/components/MainLayout";
import { supabase } from "@/lib/supabaseClient";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function PracticeScreen() {
  // ------------------------------
  // DEVICE WIDTH / HEADER ANIMATION
  // ------------------------------
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const headerOffset = useSharedValue(0);
  const { direction, onScroll } = useScrollDirection();

  useEffect(() => {
    if (!isMobile) return;
    headerOffset.value = withTiming(direction === "down" ? -140 : 0, { duration: 220 });
  }, [direction]);

  // ------------------------------
  // SUBJECTS
  // ------------------------------
  const subjects = [
    "Anatomy",
    "Anesthesia",
    "Biochemistry",
    "Community Medicine",
    "Dermatology",
    "ENT",
    "Forensic Medicine",
    "General Medicine",
    "General Surgery",
    "Microbiology",
    "Obstetrics and Gynaecology",
    "Ophthalmology",
    "Orthopedics",
    "Pathology",
    "Pediatrics",
    "Pharmacology",
    "Physiology",
    "Psychiatry",
    "Radiology",
  ];

  const [selectedSubject, setSelectedSubject] = useState("General Medicine");
  const [selectedCategory, setSelectedCategory] =
    useState<"unviewed" | "viewed" | "bookmarked">("unviewed");
  const [userId, setUserId] = useState<string | null>(null);

  // ------------------------------
  // LOAD USER (LOGIN REQUIRED)
  // ------------------------------
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    loadUser();
  }, []);

  // ------------------------------
  // FETCH PHASES
  // ------------------------------
  const practiceData = usePracticeData(userId ? selectedSubject : null);
  const { phases, loading, refreshing, refresh } = practiceData;

  // ------------------------------
  // CATEGORY FILTERING
  // ------------------------------
  const filteredPhases = phases.filter((phase) => {
    switch (selectedCategory) {
      case "viewed":
        return phase.is_viewed;
      case "unviewed":
        return !phase.is_viewed;
      case "bookmarked":
        return phase.is_bookmarked;
      default:
        return true;
    }
  });

  // ------------------------------
  // UI RENDER
  // ------------------------------
  return (
    <MainLayout>
      <View style={styles.container}>
        {/* SUBJECT + CATEGORY FILTER */}
        <Animated.View style={[styles.subjectsWrapper, { transform: [{ translateY: headerOffset }] }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.subjectsContainer}
            style={styles.subjectsScroll}
          >
            {subjects.map((subj) => (
              <SubjectFilterBubble
                key={subj}
                subject={subj}
                selected={selectedSubject === subj}
                onPress={() => setSelectedSubject(subj)}
              />
            ))}
          </ScrollView>

          <View style={styles.categoryContainer}>
            <TouchableOpacity
              style={[styles.categoryIcon, selectedCategory === "unviewed" && styles.categoryIconSelected]}
              onPress={() => setSelectedCategory("unviewed")}
            >
              <EyeOff
                size={20}
                color={selectedCategory === "unviewed" ? "#fff" : "#10b981"}
                strokeWidth={2}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryIcon, selectedCategory === "viewed" && styles.categoryIconSelected]}
              onPress={() => setSelectedCategory("viewed")}
            >
              <Eye
                size={20}
                color={selectedCategory === "viewed" ? "#fff" : "#10b981"}
                strokeWidth={2}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.categoryIcon, selectedCategory === "bookmarked" && styles.categoryIconSelected]}
              onPress={() => setSelectedCategory("bookmarked")}
            >
              <Bookmark
                size={20}
                color={selectedCategory === "bookmarked" ? "#fff" : "#10b981"}
                fill={selectedCategory === "bookmarked" ? "#fff" : "transparent"}
              />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* CONTENT */}
        {!userId ? (
          <View style={{ padding: 40 }}>
            <Text style={{ color: "#bbb", fontSize: 16, textAlign: "center" }}>
              Please sign in to view concepts.
            </Text>
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={styles.cardsWrapper}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refresh}
                tintColor="#10b981"
              />
            }
            onScroll={isMobile ? onScroll : undefined}
            scrollEventThrottle={16}
          >
            {filteredPhases.length === 0 ? (
              <Text style={{ textAlign: "center", color: "#666", marginTop: 40 }}>
                No concepts available.
              </Text>
            ) : (
              filteredPhases.map((phase) => <PracticeCard key={phase.id} phase={phase} />)
            )}
          </ScrollView>
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b141a" },

  subjectsWrapper: {
    paddingTop: 60,
    ...(Platform.OS === "web" && {
      maxWidth: 760,
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
    }),
  },

  subjectsScroll: { marginBottom: 16 },

  subjectsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    flexWrap: "wrap",
  },

  cardsWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    ...(Platform.OS === "web" && {
      maxWidth: 760,
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
    }),
  },

  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#0d0d0d",
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#10b981",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  categoryIconSelected: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },
});

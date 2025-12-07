// app/practice.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Eye, EyeOff, Bookmark } from "lucide-react-native";
import { SubjectFilterBubble } from "@/components/SubjectFilterBubble";
import { PracticeCard } from "@/components/PracticeCard";
import { usePracticeData } from "@/hooks/usePracticeData";
import MainLayout from "@/components/MainLayout";
import { supabase } from "@/lib/supabaseClient";
import { useEffect } from "react";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { useScrollDirection } from "@/hooks/useScrollDirection";

export default function PracticeScreen() {
const { width } = useWindowDimensions();
const isMobile = width < 768;

const headerOffset = useSharedValue(0);
const { direction, onScroll } = useScrollDirection();

useEffect(() => {
  if (!isMobile) return;

  headerOffset.value = withTiming(direction === "down" ? -140 : 0, { duration: 220 });
}, [direction]);


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
  "Radiology"
];


export default function PracticeScreen() {
  const [selectedSubject, setSelectedSubject] = useState<string>("General Medicine");
  const [selectedCategory, setSelectedCategory] = useState<'unviewed' | 'viewed' | 'bookmarked'>('unviewed');
const [userId, setUserId] = useState<string | null>(null);

useEffect(() => {
  const loadUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserId(session.user.id);
    } else {
      setUserId(null);
    }
  };

  loadUser();
}, []);

  
const practiceData = usePracticeData(userId ? selectedSubject : null);

const phases = practiceData.phases;
const loading = practiceData.loading;
const refreshing = practiceData.refreshing;
const refresh = practiceData.refresh;



  // Filter phases based on selected category
  const getFilteredPhases = () => {
    return phases.filter((phase) => {
      switch (selectedCategory) {
        case 'viewed':
          return phase.is_viewed;
        case 'unviewed':
          return !phase.is_viewed;
        case 'bookmarked':
          return phase.is_bookmarked;
        default:
          return true;
      }
    });
  };

  const filteredPhases = getFilteredPhases();

  return (
    <MainLayout>
    <View style={styles.container}>
      {/* SUBJECT FILTER — Same as Feed */}
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

        {/* CATEGORY FILTER BAR */}
        <View style={styles.categoryContainer}>
          <TouchableOpacity
            style={[
              styles.categoryIcon,
              selectedCategory === 'unviewed' && styles.categoryIconSelected,
            ]}
            onPress={() => setSelectedCategory('unviewed')}
          >
            <EyeOff
              size={20}
              color={selectedCategory === 'unviewed' ? '#ffffff' : '#10b981'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryIcon,
              selectedCategory === 'viewed' && styles.categoryIconSelected,
            ]}
            onPress={() => setSelectedCategory('viewed')}
          >
            <Eye
              size={20}
              color={selectedCategory === 'viewed' ? '#ffffff' : '#10b981'}
              strokeWidth={2}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.categoryIcon,
              selectedCategory === 'bookmarked' && styles.categoryIconSelected,
            ]}
            onPress={() => setSelectedCategory('bookmarked')}
          >
            <Bookmark
              size={20}
              color={selectedCategory === 'bookmarked' ? '#ffffff' : '#10b981'}
              strokeWidth={2}
              fill={selectedCategory === 'bookmarked' ? '#ffffff' : 'transparent'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* CONTENT */}
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
      refreshControl={...}
      onScroll={isMobile ? onScroll : undefined}
      scrollEventThrottle={16}
    >
    }
  >
    {filteredPhases.length === 0 ? (
      <Text style={{ textAlign: "center", color: "#666", marginTop: 40 }}>
        No concepts available.
      </Text>
    ) : (
      filteredPhases.map((phase) => (
        <PracticeCard key={phase.id} phase={phase} />
      ))
    )}
  </ScrollView>
)}

    </View>
      </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b141a",
  },

  subjectsWrapper: {
    paddingTop: 60,
    ...(Platform.OS === "web" && {
      maxWidth: 760,
      marginLeft: "auto",
      marginRight: "auto",
      width: "100%",
    }),
  },

  subjectsScroll: {
    marginBottom: 16,
    ...(Platform.OS === "web" && {
      flexWrap: "wrap",
    }),
  },

  subjectsContainer: {
    paddingHorizontal: 16,
    gap: 8,
    ...(Platform.OS === "web" && {
      flexWrap: "wrap",
    }),
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
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0d0d0d',
  },

  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  categoryIconSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
});

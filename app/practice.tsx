// app/practice.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Platform,
} from "react-native";
import { SubjectFilterBubble } from "@/components/SubjectFilterBubble";
import { PracticeCard } from "@/components/PracticeCard";
import { usePracticeData } from "@/hooks/usePracticeData";
import { BottomNav } from "@/components/navigation/BottomNav";

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

  const { phases, loading, refreshing, refresh } =
    usePracticeData(selectedSubject);

  return (
    <View style={styles.container}>
      {/* SUBJECT FILTER — Same as Feed */}
      <View style={styles.subjectsWrapper}>
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
      </View>

      {/* CONTENT */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.cardsWrapper}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor="#25D366"
            colors={["#25D366"]}
          />
        }
      >
        {phases.map((phase) => (
          <PracticeCard key={phase.id} phase={phase} />
        ))}
      </ScrollView>

      <BottomNav />
    </View>
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
});

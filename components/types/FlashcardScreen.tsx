//flashcardscreen.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform, StatusBar, ScrollView } from "react-native";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  runOnJS,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { Bookmark, ChevronLeft, ChevronRight, Lightbulb } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { supabase } from "@/lib/supabaseClient";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const CARD_WIDTH = Math.min(SCREEN_WIDTH - 40, 420);
const SWIPE_THRESHOLD = CARD_WIDTH * 0.25;

interface Flashcard {
  id: string;
  Question: string;
  Answer: string;
  mentor_reply?: string;
}

function formatText(text: string | undefined, isFront: boolean) {
  if (!text) return null;
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={isFront ? styles.emphasisStrongFront : styles.emphasisStrongBack}>
          {part.slice(2, -2)}
        </Text>
      );
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <Text key={index} style={isFront ? styles.emphasisFront : styles.emphasisBack}>
          {part.slice(1, -1)}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
}

export default function FlashcardScreenDB({
  item,
  studentId,
  subjectId,
  subjectName,
  isBookmarked = false,
  elementId,
}: {
  item: any;
  studentId: string;
  subjectId?: string;
  subjectName?: string;
  isBookmarked?: boolean;
  elementId?: string;
}) { 
  const user = { id: studentId }; // ✅ Mock a local user object

  /** Normalize deck from DB */
  
  const flashcards: Flashcard[] = Array.isArray(item?.flashcards || item)
  ? (item.flashcards || item).map((c: any, i: number) => ({
      id: c.id || `card-${i}`,
      Question: c.Question || c.question || c.q || "",
      Answer: c.Answer || c.answer || c.a || "",
      mentor_reply: c.mentor_reply || c.tip || c.hint || "",
      isBookmarked: c.isBookmarked ?? false,   // ✅ carry through bookmark flag
    }))
  : [];


  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState({ position: 0, contentHeight: 0, viewHeight: 0 });
  const scrollbarTimeout = useRef<NodeJS.Timeout | null>(null);

  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const scrollbarOpacity = useSharedValue(0);
const [bookmarked, setBookmarked] = useState<Set<string>>(() => {
  const s = new Set<string>();
  if (isBookmarked && elementId) {
    s.add(elementId);
  }
  return s;
});




  const currentCard = flashcards[currentIndex];
  const showScrollbar = () => (scrollbarOpacity.value = withTiming(1, { duration: 150 }));
  const hideScrollbar = () => (scrollbarOpacity.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.ease) }));

  const handleScroll = (e: any) => {
    const { contentOffset, contentSize, layoutMeasurement } = e.nativeEvent;
    setScrollMetrics({
      position: contentOffset.y,
      contentHeight: contentSize.height,
      viewHeight: layoutMeasurement.height,
    });
    showScrollbar();
    if (scrollbarTimeout.current) clearTimeout(scrollbarTimeout.current);
    scrollbarTimeout.current = setTimeout(hideScrollbar, 800);
  };

  const hasScrollableContent = scrollMetrics.contentHeight > scrollMetrics.viewHeight + 10;
  const scrollProgress = hasScrollableContent
    ? scrollMetrics.position / (scrollMetrics.contentHeight - scrollMetrics.viewHeight)
    : 0;
  const scrollbarHeight = hasScrollableContent
    ? Math.max((scrollMetrics.viewHeight / scrollMetrics.contentHeight) * scrollMetrics.viewHeight, 40)
    : 0;
  const scrollbarTop = scrollProgress * (scrollMetrics.viewHeight - scrollbarHeight);

  const flipCard = () => {
    rotation.value = withTiming(rotation.value + 180, { duration: 400, easing: Easing.bezier(0.4, 0, 0.2, 1) });
    setIsFlipped(!isFlipped);
  };

  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsFlipped(false);
      rotation.value = 0;
      translateX.value = SCREEN_WIDTH;
      translateX.value = withSpring(0, { damping: 18, stiffness: 100 });
    }
  };
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsFlipped(false);
      rotation.value = 0;
      translateX.value = -SCREEN_WIDTH;
      translateX.value = withSpring(0, { damping: 18, stiffness: 100 });
    }
  };
    // 👇 Add this block inside FlashcardScreenDB component
  useEffect(() => {
    // When a new deck arrives, reset to the first card
    setCurrentIndex(0);
    setIsFlipped(false);
    rotation.value = 0;
    translateX.value = 0;
    console.log("🔄 Deck changed — resetting to card 1/10");
  }, [item]);


const toggleBookmark = async () => {
  if (!currentCard?.id || !user?.id) {
    console.warn("⚠️ Missing card ID or user ID — cannot bookmark.");
    return;
  }

  const isBookmarked = bookmarked.has(currentCard.id);
  const newStatus = !isBookmarked;

  // 🔄 Update UI immediately
  setBookmarked((prev) => {
    const newSet = new Set(prev);
    if (newStatus) newSet.add(currentCard.id);
    else newSet.delete(currentCard.id);
    return newSet;
  });

  try {
    // ⭐ Save subject + flashcard_json properly (NO RPC!)
    const { data, error } = await supabase
      .from("student_flashcard_bookmark")
      .upsert(
        {
          student_id: user.id,
          element_id: currentCard.id,
          type: "flashcard",
          is_bookmark: newStatus,

          // ⭐ KEY FIXES
          subject_id: subjectId || item?.subject_id || null,
          subject_name: subjectName || item?.subject || null,

          flashcard_json: currentCard,
          concept: currentCard.Question || null,
          mentor_reply: currentCard.mentor_reply || null,
          updated_time: new Date().toISOString(),
        },
        { onConflict: "student_id,element_id,type" }
      );

    if (error) console.error("❌ Bookmark error:", error);
    else console.log("✅ Bookmark saved:", data);

  } catch (err) {
    console.error("💥 toggleBookmark exception:", err);
  }
};




  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .failOffsetY([-20, 20])
    .onUpdate((e) => (Math.abs(e.translationY) < 30 ? (translateX.value = e.translationX) : null))
    .onEnd((e) => {
      if (Math.abs(e.translationY) > 30) return (translateX.value = withSpring(0));
      if (e.translationX < -SWIPE_THRESHOLD && currentIndex < flashcards.length - 1) runOnJS(goToNext)();
      else if (e.translationX > SWIPE_THRESHOLD && currentIndex > 0) runOnJS(goToPrevious)();
      else translateX.value = withSpring(0);
    });

  const tapGesture = Gesture.Tap().onEnd(() => runOnJS(flipCard)());
  const composedGesture = Gesture.Simultaneous(tapGesture, panGesture);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { perspective: 1200 }],
  }));
  const frontAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [0, 180])}deg` }],
    backfaceVisibility: "hidden",
  }));
  const backAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${interpolate(rotation.value, [0, 180], [180, 360])}deg` }],
    backfaceVisibility: "hidden",
  }));
  const animatedScrollbarStyle = useAnimatedStyle(() => ({ opacity: scrollbarOpacity.value }));

  if (!flashcards.length)
    return (
      <View style={styles.container}>
        <Text style={{ color: "#aaa", textAlign: "center", marginTop: 100 }}>⚠️ No flashcards available.</Text>
      </View>
    );

  return (
    <LinearGradient colors={["#0e0e0e", "#1a1a1a", "#1a1a1a"]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Lightbulb size={22} color="#facc15" strokeWidth={2} fill="#facc15" />
          <Text style={styles.title}>{item?.subject || "NEETPG Rapid Recall Flashcards"}</Text>
        </View>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>{currentIndex + 1} / {flashcards.length}</Text>
        </View>
      </View>

      {/* Card */}
      <View style={styles.cardContainer}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.card, cardAnimatedStyle]}>
            {/* Front */}
            <Animated.View style={[styles.cardFace, styles.cardFront, frontAnimatedStyle]}>
              {currentCard.mentor_reply ? (
                <View style={styles.mentorTipContainer}>
                  <LinearGradient
                    colors={["rgba(16,185,129,0.08)", "rgba(16,185,129,0.03)"]}
                    style={styles.mentorTipGradient}
                  >
                    <View style={styles.mentorTipHeader}>
                      <Lightbulb size={14} color="#facc15" strokeWidth={2.5} />
                      <Text style={styles.mentorTipLabel}>MENTOR TIP</Text>
                    </View>
                    <Text style={styles.mentorTipText}>{formatText(currentCard.mentor_reply, false)}</Text>
                  </LinearGradient>
                </View>
              ) : null}

              <View style={styles.cardContentFront}>
                <Text style={styles.cardLabel}>QUESTION</Text>
                <View style={styles.questionWrapper}>
                  <Text style={styles.cardTextFront}>{formatText(currentCard.Question, true)}</Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.tapHint}>Tap to reveal answer</Text>
              </View>
            </Animated.View>

            {/* Back */}
            <Animated.View style={[styles.cardFace, styles.cardBack, backAnimatedStyle]}>
              <View style={styles.cardContent}>
                <Text style={styles.cardLabelBack}>ANSWER</Text>
                <View style={styles.scrollAreaWrapper}>
                  <ScrollView
                    nestedScrollEnabled
                    showsVerticalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    style={styles.cardScroll}
                    contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
                  >
                    <Text style={styles.cardTextBack}>{formatText(currentCard.Answer, false)}</Text>
                  </ScrollView>
                </View>
              </View>
              <View style={styles.cardFooter}>
                <Text style={styles.tapHintBack}>Tap to return</Text>
              </View>
            </Animated.View>
          </Animated.View>
        </GestureDetector>

        <TouchableOpacity
          style={[styles.bookmarkButton, bookmarked.has(currentCard.id) && styles.bookmarkButtonActive]}
          onPress={toggleBookmark}
        >
          <Bookmark
            size={20}
            color={bookmarked.has(currentCard.id) ? "#facc15" : "#6b7280"}
            fill={bookmarked.has(currentCard.id) ? "#facc15" : "transparent"}
          />
        </TouchableOpacity>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <View style={styles.dotsContainer}>
          {flashcards.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
                bookmarked.has(flashcards[i].id) && styles.dotBookmarked,
              ]}
            />
          ))}
        </View>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={goToPrevious} disabled={currentIndex === 0} style={styles.navHalf}>
            <ChevronLeft size={20} color={currentIndex === 0 ? "#3a3a3a" : "#9ca3af"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={goToNext} disabled={currentIndex === flashcards.length - 1} style={styles.navHalf}>
            <ChevronRight size={20} color={currentIndex === flashcards.length - 1 ? "#3a3a3a" : "#9ca3af"} />
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 50,
    paddingHorizontal: 24,
    paddingBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  title: { fontSize: 18, fontWeight: "600", color: "#f3f4f6" },
  progressBadge: {
    backgroundColor: "rgba(96,165,250,0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.2)",
  },
  progressText: { color: "#60a5fa", fontWeight: "500" },
  cardContainer: { alignItems: "center", paddingHorizontal: 20, paddingVertical: 20 },
  card: { width: CARD_WIDTH },
  cardFace: {
    width: "100%",
    backfaceVisibility: "hidden",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 12,
  },
  cardFront: {
    backgroundColor: "#1f1f1f",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    position: "relative",
  },
  cardBack: {
    backgroundColor: "#122b2b",
    borderWidth: 1,
    borderColor: "rgba(16,185,129,0.15)",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    minHeight: "100%",
  },
  cardContentFront: {
    paddingVertical: 10,
    flexShrink: 1,
  },
  cardContent: { flex: 1, paddingVertical: 10 },
  cardLabel: { fontSize: 11, color: "#60a5fa", textTransform: "uppercase", marginBottom: 16 },
  cardLabelBack: { fontSize: 11, color: "#34d399", textTransform: "uppercase" },
  scrollAreaWrapper: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    borderRadius: 16,
    marginTop: 10,
    marginBottom: 10,
  },
  questionWrapper: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  cardScroll: { flex: 1, paddingRight: 8 },
  cardTextFront: { fontSize: 18, lineHeight: 28, color: "#ffffff", textAlign: "center" },
  cardTextBack: { fontSize: 20, lineHeight: 32, color: "#d1fae5", textAlign: "center" },
  emphasisFront: { fontWeight: "500", color: "#93c5fd" },
  emphasisBack: { fontWeight: "500", color: "#6ee7b7" },
  emphasisStrongFront: { fontWeight: "700", color: "#60a5fa" },
  emphasisStrongBack: { fontWeight: "700", color: "#34d399" },
  cardFooter: { alignItems: "center", borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.04)", marginTop: 12, paddingTop: 12 },
  tapHint: { color: "#6b7280", fontSize: 12 },
  tapHintBack: { color: "#6ee7b7", fontSize: 12 },
  mentorTipContainer: { marginBottom: 16, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(16,185,129,0.25)" },
  mentorTipGradient: { padding: 14 },
  mentorTipHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  mentorTipLabel: { fontSize: 10, color: "#10b981", fontWeight: "600" },
  mentorTipText: { fontSize: 14, color: "#a7f3d0" },
  scrollbar: { position: "absolute", right: 4, width: 4, backgroundColor: "rgba(96,165,250,0.8)", borderRadius: 3 },
  controls: { paddingHorizontal: 20, paddingBottom: 20, gap: 10 },
  dotsContainer: { flexDirection: "row", justifyContent: "center", gap: 8, paddingVertical: 8 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#2a2a2a" },
  dotActive: { backgroundColor: "#60a5fa", width: 20 },
  dotBookmarked: { backgroundColor: "#facc15" },
  navigation: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  navHalf: {
    flex: 1,
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
   bookmarkButton: {
    position: "absolute",
    top: 20,
    right: 20,
    width: 48,
    height: 48,
    borderRadius: 24, // ✅ missing value added
    backgroundColor: "rgba(31,31,31,0.95)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  bookmarkButtonActive: {
    backgroundColor: "rgba(250,204,21,0.12)",
    borderColor: "rgba(250,204,21,0.3)",
  },
  bookmarkGlow: {
    position: "absolute",
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(250,204,21,0.2)",
    opacity: 0.6,
  },
});


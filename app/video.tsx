// video.tsx
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
import { Eye, EyeOff, Bookmark, XCircle, ArrowUp, ArrowDown } from "lucide-react-native";
import { SubjectFilterBubble } from "@/components/SubjectFilterBubble";
import { PracticeCard } from "@/components/PracticeCard";
import VimeoPlayer from "@/components/video/VimeoPlayer";
import { VideoCard } from "@/components/video/VideoCard";
import { useVideoData } from "@/hooks/useVideoData";
import MainLayout from "@/components/MainLayout";
import { supabase } from "@/lib/supabaseClient";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { FlatList } from "react-native";   // 🔥 REQUIRED FOR PAGINATION
import HighYieldFactsScreen from "@/components/types/HighYieldFactsScreen";

export default function VideoScreen() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  // Scroll detection
  const { direction, onScroll } = useScrollDirection();
  const isHidden = isMobile && direction === "down";

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
    useState<"unviewed" | "viewed" | "bookmarked" | "wrong">("unviewed");
  const [userId, setUserId] = useState<string | null>(null);
  const [showScrollControls, setShowScrollControls] = useState(false);
   // ✅ FIX 1 — declare ref BEFORE scroll effect
  const listRef = React.useRef<FlatList>(null);
   const isWeb = Platform.OS === "web";

  
  useEffect(() => {
    const loadUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUserId(session?.user?.id ?? null);
    };
    loadUser();
  }, []);

  const practiceData = useVideoData(selectedSubject, userId, selectedCategory);
 const {
  phases,
  loading,
  refreshing,
  refresh,
  loadMore,
  isLoadingMore,
  hasMoreData
} = practiceData;
  const PAGE_LIMIT = 20;
 // ✅ FIX 2 — scroll to top when subject/category changes
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [selectedCategory, selectedSubject, phases.length]);


  return (
    <MainLayout isHeaderHidden={isHidden}>
      <View style={styles.container}>

        {/* ⭐ SUBJECT + CATEGORY HIDE ON SCROLL (mobile only) */}
        {!isHidden && (
          <View style={styles.headerBlock}>
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
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.categoryIcon, selectedCategory === "viewed" && styles.categoryIconSelected]}
                onPress={() => setSelectedCategory("viewed")}
              >
                <Eye
                  size={20}
                  color={selectedCategory === "viewed" ? "#fff" : "#10b981"}
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

              <TouchableOpacity
                style={[styles.categoryIcon, selectedCategory === "wrong" && styles.categoryIconSelected]}
                onPress={() => setSelectedCategory("wrong")}
              >
                <XCircle
                  size={20}
                  color={selectedCategory === "wrong" ? "#fff" : "#10b981"}
                />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* CONTENT */}
        {!userId ? (
          <View style={{ padding: 40 }}>
            <Text style={{ color: "#bbb", fontSize: 16, textAlign: "center" }}>
              Please sign in to view concepts.
            </Text>
          </View>
        ) : (
   <FlatList
  ref={listRef}
  data={phases}
  keyExtractor={(item) => item.id}
  renderItem={({ item, index }) => {
    console.log("📦 renderItem", {
      index,
      id: item.id,
      type: item.phase_type,
    });
  
    if (item.phase_type === "video") {
      const vimeoId = item.phase_json?.vimeo_video_id;
      if (!vimeoId) return null;
    
      const content = (
        <View
          style={[
            styles.videoFeedItem,
            {
              aspectRatio:
                item.phase_json?.aspect_ratio === "portrait" ? 9 / 16 : 16 / 9,
            },
          ]}
        >
          <VimeoPlayer vimeoId={vimeoId} />
        </View>
      );
    
      return isWeb ? (
        <View style={styles.webFeedColumn}>{content}</View>
      ) : (
        content
      );
    }
  
    if (item.phase_type === "concept") {
      const content = (
        <HighYieldFactsScreen
          topic={item.phase_json?.topic ?? "Concept"}
          conceptMarkdown={item.phase_json?.concept ?? ""}
        />
      );

      return isWeb ? (
        <View style={styles.webFeedColumn}>{content}</View>
      ) : (
        content
      );
    }
  
    const content = <PracticeCard phase={item} />;
    
    return isWeb ? (
      <View style={styles.webFeedColumn}>{content}</View>
    ) : (
      content
    );
  }}
  contentContainerStyle={styles.cardsWrapper}
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#10b981" />
  }
  onScroll={(event) => {
    if (isMobile) onScroll(event);
    const offsetY = event.nativeEvent.contentOffset.y;
    setShowScrollControls(offsetY > 100);
  }}
  scrollEventThrottle={16}

  initialNumToRender={8}
  maxToRenderPerBatch={6}
  windowSize={10}
removeClippedSubviews={false}


  onEndReached={() => {
    if (
      hasMoreData &&
      !isLoadingMore &&
      !loading &&
      phases.length >= PAGE_LIMIT       // ⭐ REQUIRED FIX FOR WEB FLICKER
    ) {
      loadMore();
    }
  }}
  onEndReachedThreshold={hasMoreData ? 0.5 : 0.01}

  ListFooterComponent={
    isLoadingMore ? (
      <View style={{ padding: 20 }}>
        <Text style={{ textAlign: "center", color: "#999" }}>Loading more…</Text>
      </View>
    ) : null
  }
/>
        )}

        {showScrollControls && (
          <View style={styles.scrollControlsWrapper}>
            <TouchableOpacity
              style={styles.scrollBtn}
              onPress={() =>
                listRef?.current?.scrollToOffset({
                  offset: 0,
                  animated: true
                })
              }
            >
              <ArrowUp size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scrollBtn}
              onPress={() =>
                listRef?.current?.scrollToEnd({
                  animated: true
                })
              }
            >
              <ArrowDown size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </MainLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0b141a" },

  headerBlock: {
    paddingTop: 60,
    backgroundColor: "#0b141a",
    zIndex: 10,
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
  },
// 🎬 VIDEO FEED ITEM (ADD THIS)
videoFeedItem: {
  width: "100%",
  backgroundColor: "#000",
  marginBottom: 16,
},
  categoryContainer: {
    flexDirection: "row",
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
  },

  categoryIconSelected: {
    backgroundColor: "#10b981",
    borderColor: "#10b981",
  },

  scrollControlsWrapper: {
    position: "absolute",
    bottom: 30,
    right: 20,
    alignItems: "center",
    zIndex: 999,
  },

  scrollBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#10b981",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },

    webFeedColumn: {
    alignSelf: "center",
    width: "100%",
    maxWidth: 420,        // 🔥 phone-like width (LinkedIn magic)
  },

    webFeedShell: {
    width: "100%",
    paddingHorizontal: 24,   // 👈 reduces excessive dark sides
    alignItems: "center",
  },
});

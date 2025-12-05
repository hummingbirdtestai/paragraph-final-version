import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import Animated, {
  FadeInDown,
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { Sword, Trophy, ChevronDown, ArrowLeft } from "lucide-react-native";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "expo-router";
import PageHeader from "@/components/common/PageHeader";

type AccordionTab = "review" | null;

interface BattleCategory {
  title: string;
  battle_key: string;
}

const BATTLE_CATEGORIES: BattleCategory[] = [
  { title: "Anato-Physio Dangal 💪⚡", battle_key: "anato_physio" },
  { title: "Biochem Bazaar ⚗️🎯", battle_key: "biochem_bazaar" },
  { title: "Patho Premier League 🔬🏆", battle_key: "patho_premier" },
  { title: "Pharma Dhamaka 💊🔥", battle_key: "pharma_dhamaka" },
  { title: "Medicine Mahayudh 🩺⚡", battle_key: "medicine_maha" },
  { title: "Surgical League ⚔️🏥", battle_key: "surgical_league" },
  { title: "ENT-Ophthal Adda 👂👁️🎮", battle_key: "ent_ophthal" },
  { title: "Derma-Radio Showdown 📸⚔️", battle_key: "derma_radio" },
  { title: "Ob-Gyn Mahasangram 👶💃", battle_key: "obgyn_maha" },
  { title: "Forensic Face-Off 🔍⚡", battle_key: "forensic_faceoff" },
];

// ───────────────────────────────
// Accordion Component
// ───────────────────────────────
function AccordionItem({ icon, title, isOpen, onToggle, children }: any) {
  const rotation = useSharedValue(0);
  React.useEffect(() => {
    rotation.value = withTiming(isOpen ? 180 : 0, { duration: 300 });
  }, [isOpen]);
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity
        style={[styles.accordionHeader, isOpen && styles.accordionHeaderActive]}
        onPress={onToggle}
      >
        <View style={styles.accordionHeaderLeft}>
          {icon}
          <Text
            style={[styles.accordionTitle, isOpen && styles.accordionTitleActive]}
          >
            {title}
          </Text>
        </View>

        <Animated.View style={chevronStyle}>
          <ChevronDown
            size={20}
            color={isOpen ? "#25D366" : "#e0e0e0"}
            strokeWidth={1.5}
          />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && (
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={styles.accordionContent}
        >
          {children}
        </Animated.View>
      )}
    </View>
  );
}

// ───────────────────────────────
// Main Component
// ───────────────────────────────
export default function BattleSubjectSelection() {
  const [openTab, setOpenTab] = useState<AccordionTab>(null);
  const [selectedBattle, setSelectedBattle] = useState<string | null>(null);
  const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
  const [completedDates, setCompletedDates] = useState<any[]>([]);
  const [loading, setLoading] = useState<string | null>(null);
  const { width } = useWindowDimensions();
  const router = useRouter();

  const getColumns = () => {
    if (width >= 1024) return 6;
    if (width >= 768) return 4;
    return 2;
  };
  const columns = getColumns();
  const cardWidth = `${100 / columns - 2}%`;

  // ───────────────────────────────
  // Fetch completed dates for battle
  // ───────────────────────────────
  const handleBattlePress = async (battle_key: string, title: string) => {
    setSelectedBattle(battle_key);
    setSelectedTitle(title);
    setLoading(battle_key);

    try {
      const { data, error } = await supabase.rpc("get_completed_dates_by_title", {
        title_input: title,
      });
      if (error) setCompletedDates([]);
      else setCompletedDates(data || []);
    } catch {
      setCompletedDates([]);
    }
    setLoading(null);
  };

  // ───────────────────────────────
  // Reset view to show all battles
  // ───────────────────────────────
  const handleBack = () => {
    setSelectedBattle(null);
    setCompletedDates([]);
  };

  // ───────────────────────────────
  // Render grid of battles
  // ───────────────────────────────
  const renderBattleGrid = () => (
    <View style={styles.grid}>
      {BATTLE_CATEGORIES.map((battle) => (
        <TouchableOpacity
          key={battle.battle_key}
          style={[styles.gridCard, { width: cardWidth }]}
          onPress={() => handleBattlePress(battle.battle_key, battle.title)}
          disabled={loading === battle.battle_key}
        >
          {loading === battle.battle_key ? (
            <ActivityIndicator size="small" color="#25D366" />
          ) : (
            <Text style={styles.gridText}>{battle.title}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  // ───────────────────────────────
  // Render list of completed dates (grid boxes)
  // ───────────────────────────────
  const renderCompletedDates = () => (
    <View style={{ paddingVertical: 10 }}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        activeOpacity={0.8}
      >
        <ArrowLeft size={18} color="#25D366" />
        <Text style={styles.backText}>Back to Battles</Text>
      </TouchableOpacity>

      <Text style={styles.datesTitle}>📅 {selectedTitle}</Text>

      {completedDates.length === 0 ? (
        <Text style={styles.noDatesText}>No completed battles</Text>
      ) : (
        <View style={styles.grid}>
          {completedDates.map((d, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.gridCard, { width: cardWidth }]}
              onPress={() =>
                router.push({
                  pathname: "/reviewbattle",
                  params: {
                    title: selectedTitle,
                    scheduled_date: d.scheduled_date,
                  },
                })
              }
              activeOpacity={0.8}
            >
              <Text style={styles.gridText}>{d.scheduled_date}</Text>
              {d.scheduled_time && (
                <Text style={styles.subText}>🕒 {d.scheduled_time}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header with Logo */}
      <PageHeader title="Battle Arena" subtitle="Hourly competitive quizzes" />

      <ScrollView style={styles.scrollContent} contentContainerStyle={styles.contentContainer}>
        {/* Main Battles Button */}
      <TouchableOpacity style={styles.fakeAccordionItem} activeOpacity={0.8} onPress={() => router.push("/battlelist")}>
        <View style={styles.accordionHeaderLeft}>
          <Sword size={22} color="#25D366" strokeWidth={1.5} />
          <Text style={[styles.accordionTitle, styles.joinTitle]}>
              Join Todays Battles
            </Text>

        </View>
      </TouchableOpacity>

      {/* Review Completed Battles */}
      <AccordionItem
        icon={<Trophy size={22} color={openTab === "review" ? "#25D366" : "#e0e0e0"} />}
        title="Review Completed Battles"
        isOpen={openTab === "review"}
        onToggle={() => setOpenTab(openTab === "review" ? null : "review")}
      >
        {selectedBattle ? renderCompletedDates() : renderBattleGrid()}
      </AccordionItem>
      </ScrollView>
    </View>
  );
}

// ───────────────────────────────
// Styles
// ───────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d0d0d" },
  scrollContent: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 40 },

fakeAccordionItem: {
  marginBottom: 12,
  backgroundColor: "#1e2a1e",   // <<< SAME AS accordionHeaderActive
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#2a2a2a",
  padding: 18,
  flexDirection: "row",
  alignItems: "center",
},


  accordionItem: {
    marginBottom: 12,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#2a2a2a",
  },

  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 18,
    alignItems: "center",
  },
  accordionHeaderActive: { backgroundColor: "#1e2a1e" },
  accordionHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  accordionTitle: { fontSize: 16, color: "#e0e0e0", fontWeight: "500" },
  accordionTitleActive: { color: "#25D366", fontWeight: "600" },
  accordionContent: { backgroundColor: "#141414", padding: 20 },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  gridCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 0.5,
    borderColor: "#3a3a3a",
    minHeight: 90,
  },

  gridText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#e0e0e0",
    textAlign: "center",
  },
joinTitle: {
  color: "#ffffff",       // <<< white text
  fontWeight: "600",
},
  subText: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
    textAlign: "center",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  backText: { color: "#25D366", fontSize: 15, fontWeight: "500" },

  datesTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e0e0e0",
    marginBottom: 8,
  },
  noDatesText: {
    fontSize: 13,
    color: "#ff5555",
    textAlign: "center",
    marginTop: 5,
  },
});

// ───────────────────────────────
// NEW HEADER STYLE (ONLY ADDITION)
// ───────────────────────────────
const headerStyles = StyleSheet.create({
  headerContainer: {
    marginBottom: 20,
    paddingBottom: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#1f1f1f",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#e0e0e0",
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9e9e9e",
    marginTop: -2,
  },
});

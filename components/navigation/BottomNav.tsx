import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  useWindowDimensions,
  Platform,
} from "react-native";
import {
  BookOpen,
  FileText,
  ClipboardList,
  Swords,
  BarChart3,
  Trophy,
  Settings,
  MoreHorizontal,
  Newspaper,
} from "lucide-react-native";
import { useRouter, usePathname } from "expo-router";
import { theme } from "@/constants/theme";

interface BottomNavProps {
  activeTab?: string;
  onTabPress?: (tab: string) => void;
}

export function BottomNav({ activeTab, onTabPress }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { width } = useWindowDimensions();
  const [moreVisible, setMoreVisible] = useState(false);

  // Responsive breakpoint
  const isWideView = width >= 768; // tablets & web show all tabs

const currentTab =
  activeTab ||
  (pathname.includes("/feed") ? "feed"
    : pathname.includes("/flashcards") ? "flashcards"
    : pathname.includes("/flashcard-feed-demo") ? "flash"      // ⭐ NEW
    : pathname.includes("/mocktests") ? "mocktests"
    : pathname.includes("/battle") ? "battle"
    : pathname.includes("/analytics") ? "analytics"
    : pathname.includes("/settings") ? "settings"
    : pathname.includes("/concept") ? "concept"
    : "practice");

const allTabs = [
  { id: "practice", label: "Practice", Icon: BookOpen },
  { id: "concept", label: "Concept", Icon: FileText },
  { id: "flash", label: "Flash", Icon: FileText },        // ⭐ ADDED
  { id: "flashcards", label: "Flashcards", Icon: FileText },
  { id: "mocktests", label: "Mock Tests", Icon: ClipboardList },
  { id: "battle", label: "Battle", Icon: Swords },
  { id: "analytics", label: "Analytics", Icon: BarChart3 },
  { id: "settings", label: "Settings", Icon: Settings },
  { id: "feed", label: "Feed", Icon: Newspaper },
];



  // Split for mobile
  const mainTabs = allTabs.slice(0, 4);
  const moreTabs = allTabs.slice(4);

const handleTabPress = (tab: string) => {
  if (onTabPress) onTabPress(tab);
  else {
    if (tab === "feed") router.push("/feed");
    else if (tab === "practice") router.push("/");
    else if (tab === "concept") router.push("/practice");
    else if (tab === "flash") router.push("/flashcard-feed-demo");   // ⭐ NEW ROUTE
    else router.push(`/${tab}`);
  }
  setMoreVisible(false);
};

  return (
    <>
      {/* Bottom Navigation */}
      <View style={[styles.container, isWideView && styles.containerWide]}>
        {(isWideView ? allTabs : mainTabs).map(({ id, label, Icon }) => {
          const isActive = currentTab === id;
          return (
            <TouchableOpacity
              key={id}
              style={styles.tab}
              onPress={() => handleTabPress(id)}
              activeOpacity={0.7}
            >
              <Icon
                size={22}
                color={isActive ? "#4FE3CE" : theme.colors.textSecondary}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* ⋯ Only on Mobile */}
        {!isWideView && (
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setMoreVisible(true)}
            activeOpacity={0.7}
          >
            <MoreHorizontal
              size={22}
              color={theme.colors.textSecondary}
              strokeWidth={2}
            />
            <Text style={styles.label}>More</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal for More Tabs (only mobile) */}
      {!isWideView && (
        <Modal
          visible={moreVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setMoreVisible(false)}
        >
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setMoreVisible(false)}
          >
            <View style={styles.modalContainer}>
              {moreTabs.map(({ id, label, Icon }) => (
                <TouchableOpacity
                  key={id}
                  style={styles.modalItem}
                  onPress={() => handleTabPress(id)}
                >
                  <Icon size={20} color="#00ff88" style={styles.modalIcon} />
                  <Text style={styles.modalLabel}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.colors.background,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xs,
  },
  containerWide: {
    justifyContent: "space-around",
    paddingVertical: theme.spacing.md,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    marginTop: theme.spacing.xs,
    fontSize: theme.typography.caption.fontSize,
    color: theme.colors.textSecondary,
  },
 labelActive: {
  color: "#4FE3CE",
  fontWeight: "600",
},
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#0a0e1a",
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: "#1a2332",
  },
  modalItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1a2332",
  },
  modalIcon: {
    marginRight: 10,
  },
  modalLabel: {
    fontSize: 16,
    color: "#e1e1e1",
  },
});

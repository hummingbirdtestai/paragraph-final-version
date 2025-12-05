import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, CheckCircle, Clock, PlayCircle, ChevronRight } from 'lucide-react-native';
import LogoHeader from '@/components/common/LogoHeader';
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";


type SectionStatus = 'not_started' | 'in_progress' | 'completed' | 'locked';

interface Section {
  id: string;
  title: string;
  status: SectionStatus;
  completed: number;
  total: number;
  timeLeft: number;
}
const getSectionFromReactOrder = (ro: number) => {
  if (ro <= 40) return "A";
  if (ro <= 80) return "B";
  if (ro <= 120) return "C";
  if (ro <= 160) return "D";
  return "E";
};

export default function TestSectionsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { exam_serial } = params;
  const { user } = useAuth();
const userId = user?.id;


  const [sections, setSections] = useState<Section[]>([
    { id: 'A', title: 'Section A', status: 'not_started', completed: 0, total: 40, timeLeft: 42 * 60 },
    { id: 'B', title: 'Section B', status: 'locked', completed: 0, total: 40, timeLeft: 42 * 60 },
    { id: 'C', title: 'Section C', status: 'locked', completed: 0, total: 40, timeLeft: 42 * 60 },
    { id: 'D', title: 'Section D', status: 'locked', completed: 0, total: 40, timeLeft: 42 * 60 },
    { id: 'E', title: 'Section E', status: 'locked', completed: 0, total: 40, timeLeft: 42 * 60 },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSections(prev => prev.map(section => {
        if (section.status === 'in_progress' && section.timeLeft > 0) {
          return { ...section, timeLeft: section.timeLeft - 1 };
        }
        return section;
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
useEffect(() => {
  console.log("PARAMS RECEIVED:", params);

  const ro = Number(params.react_order_final);
  if (!ro) return;   // protects against undefined

  const unlocked = getSectionFromReactOrder(ro);
  console.log("🔥 Unlocking section:", unlocked);

  setSections(prev =>
    prev.map(s =>
      s.id === unlocked
        ? { ...s, status: "not_started" }
        : { ...s, status: "locked" }
    )
  );
}, [params.react_order_final]);



  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };



const handleSectionPress = async (section: Section) => {
  console.log("🔥 handleSectionPress fired for:", section.id);

  if (section.status === "locked") {
    console.log("⛔ Section locked. Not calling backend.");
    return;
  }

  if (!userId) {
    console.log("❌ No userId found");
    return;
  }

  try {
    console.log("📡 Sending START request → FastAPI", {
      intent: "start_mocktest",
      student_id: userId,
      exam_serial
    });

    const res = await fetch(
      "https://mocktest-orchestra-production.up.railway.app/mocktest_orchestrate",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          intent: "start_mocktest",
          student_id: userId,
          exam_serial,
        }),
      }
    );

    console.log("📥 Response status:", res.status);

    const data = await res.json();
    console.log("🔥 SECTION START RESPONSE:", data);

    router.push(
    `/mocktests?section=${section.id}&start=true&exam_serial=${exam_serial}&react_order_final=${data.react_order_final}`
  );

  } catch (e) {
    console.error("❌ Section Start Error:", e);
  }
};





  const getButtonText = (status: SectionStatus) => {
    switch (status) {
      case 'not_started': return 'Start Section';
      case 'in_progress': return 'Continue';
      case 'completed': return 'Review Section';
      case 'locked': return 'Locked';
      default: return 'Start';
    }
  };

  const getStatusIcon = (status: SectionStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={20} color="#10b981" />;
      case 'in_progress':
        return <Clock size={20} color="#3b82f6" />;
      case 'locked':
        return <Lock size={20} color="#4b5563" />;
      default:
        return <PlayCircle size={20} color="#6b7280" />;
    }
  };

  const getStatusColor = (status: SectionStatus) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#3b82f6';
      case 'not_started': return '#6b7280';
      case 'locked': return '#4b5563';
      default: return '#6b7280';
    }
  };

  const getStatusText = (status: SectionStatus) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in_progress': return 'In Progress';
      case 'not_started': return 'Not Started';
      case 'locked': return 'Locked';
      default: return 'Not Started';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#000' }]}>
      <StatusBar barStyle="light-content" />

      <LogoHeader />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Mock Test Sections</Text>
          <Text style={styles.subtitle}>Complete each section to unlock the next</Text>
        </View>

        <View style={styles.sectionsContainer}>
          {sections.map((section, index) => (
            <TouchableOpacity
              key={section.id}
              onPress={() => {
  console.log("👉 Section clicked:", section.id, "status:", section.status);
  handleSectionPress(section);
}}

              disabled={section.status === 'locked'}
              activeOpacity={0.7}
              style={styles.sectionCard}
            >
              <LinearGradient
                colors={
                  section.status === 'locked'
                    ? ['#111111', '#1a1a1a'] 
                    : section.status === 'completed'
                    ? ['#111111', '#1a1a1a'] 
                    : section.status === 'in_progress'
                    ? ['#111111', '#1a1a1a'] 
                    : ['#111111', '#1a1a1a'] 
                }
                style={styles.cardGradient}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.titleRow}>
                    <Text style={styles.sectionTitle}>{section.title}</Text>
                    {getStatusIcon(section.status)}
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={[styles.statusText, { color: getStatusColor(section.status) }]}>
                      {getStatusText(section.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>MCQs:</Text>
                    <Text style={styles.infoValue}>
                      {section.completed}/{section.total}
                    </Text>
                  </View>

                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Time Used:</Text>
                    <Text style={styles.infoValue}>
                      {42 - Math.floor(section.timeLeft / 60)} / 42 min
                    </Text>
                  </View>

                  {section.status === 'in_progress' && (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Time Left:</Text>
                      <Text style={styles.timerValue}>{formatTime(section.timeLeft)}</Text>
                    </View>
                  )}

                  <View style={styles.progressBarContainer}>
                    <View style={styles.progressBarBg}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${(section.completed / section.total) * 100}%`,
                            backgroundColor: getStatusColor(section.status)
                          }
                        ]}
                      />
                    </View>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View
                    style={[
                      styles.actionButton,
                      section.status === 'locked' && styles.actionButtonLocked
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionButtonText,
                        section.status === 'locked' && styles.actionButtonTextLocked
                      ]}
                    >
                      {getButtonText(section.status)}
                    </Text>
                    {section.status !== 'locked' && (
                      <ChevronRight size={18} color="#fff" />
                    )}
                  </View>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
  },
  sectionsContainer: {
    gap: 16,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardGradient: {
    padding: 20,
    borderRadius: 16,
  },
  cardHeader: {
    marginBottom: 16,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    marginBottom: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#94a3b8',
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  timerValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
  },
  progressBarContainer: {
    marginTop: 6,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  cardFooter: {
    marginTop: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  actionButtonTextLocked: {
    color: '#4b5563',
  },
});

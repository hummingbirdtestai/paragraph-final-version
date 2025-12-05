import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Edit3, Bookmark, TrendingUp, ChevronDown } from 'lucide-react-native';
import { useRouter } from "expo-router";


interface Subject {
  subject: string;
  subject_id: string;
}

const SUBJECTS: Subject[] = [
  { subject: 'Anatomy', subject_id: '2884ede5-ebdc-4dd7-be0d-cce07fd54c05' },
  { subject: 'Anesthesia', subject_id: 'ebc4ef0f-46dd-4a4e-acca-1e53c7d6f127' },
  { subject: 'Biochemistry', subject_id: '4df2c8b9-d9c0-480c-aecc-61563fa616ce' },
  { subject: 'Community Medicine', subject_id: '78f794bb-90b5-4bb5-b5d6-d57381175e52' },
  { subject: 'Dermatology', subject_id: '832bb0b0-30ef-453d-914b-1484ad455959' },
  { subject: 'ENT', subject_id: '4e5a1bd4-18de-4975-bed3-28d428cda51c' },
  { subject: 'Forensic Medicine', subject_id: '6b9abcfa-9ac0-4930-a42f-f390c6be04c4' },
  { subject: 'General Medicine', subject_id: '3cd6242a-51be-4e93-98f2-b42268a8175a' },
  { subject: 'Gynaecology', subject_id: '3a684f78-662d-468f-8c53-13303a4a953c' },
  { subject: 'Microbiology', subject_id: '5d3c2d0a-8718-4964-baaa-7ffc664f072c' },
  { subject: 'Obstetrics', subject_id: '1a993bae-384b-4b8e-afe5-5575f634c36b' },
  { subject: 'Ophthalmology', subject_id: 'be03e32f-c62a-431b-97d8-88be27a24175' },
  { subject: 'Orthopedics', subject_id: 'fbbafd10-ba0f-4113-ad24-8192f40aa60d' },
  { subject: 'Pathology', subject_id: 'aed84226-be65-43a3-bae9-06ab57ab48bf' },
  { subject: 'Pediatrics', subject_id: '6268d53e-9ed5-45ae-833b-59dd88b3af74' },
  { subject: 'Pharmacology', subject_id: '59665c8f-6277-4e17-9c92-18257d2fc1f2' },
  { subject: 'Physiology', subject_id: 'cde00973-d19a-4ad2-9683-08f79f219603' },
  { subject: 'Psychiatry', subject_id: '2f599bf5-e471-4705-b183-55e44bd93c92' },
  { subject: 'Radiology', subject_id: 'fb0c84ba-9eb1-4274-b4ef-2af5ce56cff5' },
  { subject: 'Surgery', subject_id: '74b507c3-523f-4623-827e-7ae3c258f655' }
];



type AccordionTab = 'start' | 'bookmark' | 'analyse' | null;

interface FlashcardSubjectSelectionProps {
  studentId: string;
  onSubjectSelect: (studentId: string, subjectId: string, intent: string) => void;
  onAnalyse: (studentId: string, intent: string) => void;
}

interface AccordionItemProps {
  icon: React.ReactNode;
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children?: React.ReactNode;
}

function AccordionItem({ icon, title, isOpen, onToggle, children }: AccordionItemProps) {
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
        activeOpacity={0.7}
      >
        <View style={styles.accordionHeaderLeft}>
          {icon}
          <Text style={[styles.accordionTitle, isOpen && styles.accordionTitleActive]}>{title}</Text>
        </View>
        <Animated.View style={chevronStyle}>
          <ChevronDown size={20} color={isOpen ? '#25D366' : '#e0e0e0'} strokeWidth={1.5} />
        </Animated.View>
      </TouchableOpacity>

      {isOpen && children && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.accordionContent}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

export default function FlashcardSubjectSelection({
  studentId,
  onSubjectSelect,
  onAnalyse,
}: FlashcardSubjectSelectionProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [openTab, setOpenTab] = useState<AccordionTab>(null);
  const { width } = useWindowDimensions();
  const router = useRouter();

const handleSubjectClick = async (subjectId: string, intent: string) => {
  setLoading(subjectId + intent);
  try {
    if (intent === "bookmark_revision_flashcards") {
      // 👉 Navigate to the bookmark review screen
      router.push({
        pathname: "/bookmarkflashcards",
        params: {
          student_id: studentId,
          subject_id: subjectId,
        },
      });
    } 
      if (intent === "review_flashcards") {
  router.push({
    pathname: "/reviewflashcards",
    params: {
      student_id: studentId,
      subject_id: subjectId,
    },
  });
  return;
}
    else {
      // 👉 Normal start flow
      await onSubjectSelect(studentId, subjectId, intent);
    }
  } finally {
    setLoading(null);
  }
};


  const handleAnalyseClick = async () => {
    setLoading('analyse');
    try {
      await onAnalyse(studentId, 'analyse_flashcards');
    } finally {
      setLoading(null);
    }
  };

  const toggleTab = (tab: AccordionTab) => {
    setOpenTab(openTab === tab ? null : tab);
  };

  const getGridColumns = () => {
    if (width >= 1024) return 6;
    if (width >= 768) return 4;
    return 2;
  };

  const columns = getGridColumns();
  const cardWidth = `${(100 / columns) - 2}%`;

const renderSubjectGrid = (
  intent: 'start_flashcards' | 'bookmark_revision_flashcards' | 'review_flashcards'
) => (
    <View style={styles.grid}>
      {SUBJECTS.map((subject, index) => (
        <View key={subject.subject_id} style={[styles.subjectCardWrapper, { width: cardWidth }]}>
          <TouchableOpacity
            style={styles.subjectCard}
            onPress={() => handleSubjectClick(subject.subject_id, intent)}
            activeOpacity={0.8}
            disabled={loading === subject.subject_id + intent}
          >
            {loading === subject.subject_id + intent ? (
              <ActivityIndicator size="small" color="#25D366" />
            ) : (
              <Text style={styles.subjectText}>{subject.subject}</Text>
            )}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <AccordionItem
        icon={<Edit3 size={22} color={openTab === 'start' ? '#25D366' : '#e0e0e0'} strokeWidth={1.5} />}
        title="Start Flashcards"
        isOpen={openTab === 'start'}
        onToggle={() => toggleTab('start')}
      >
        {renderSubjectGrid('start_flashcards')}
      </AccordionItem>

      <AccordionItem
        icon={<Bookmark size={22} color={openTab === 'bookmark' ? '#25D366' : '#e0e0e0'} strokeWidth={1.5} />}
        title="My Bookmarked Flashcards"
        isOpen={openTab === 'bookmark'}
        onToggle={() => toggleTab('bookmark')}
      >
        {renderSubjectGrid('bookmark_revision_flashcards')}
      </AccordionItem>
      <AccordionItem
          icon={
            <TrendingUp
              size={22}
              color={openTab === 'analyse' ? '#25D366' : '#e0e0e0'}
              strokeWidth={1.5}
            />
          }
          title="Review Flashcards"
          isOpen={openTab === 'analyse'}
          onToggle={() => toggleTab('analyse')}
        >
          {renderSubjectGrid('review_flashcards')}
        </AccordionItem>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  accordionItem: {
    marginBottom: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    backgroundColor: '#1a1a1a',
  },
  accordionHeaderActive: {
    backgroundColor: '#1e2a1e',
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#e0e0e0',
    letterSpacing: 0.3,
  },
  accordionTitleActive: {
    color: '#25D366',
    fontWeight: '600',
  },
  accordionContent: {
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#141414',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  subjectCardWrapper: {
    marginBottom: 0,
  },
  subjectCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 10,
    minHeight: 72,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#3a3a3a',
  },
  subjectText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e0e0e0',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  analyseContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  analyseButton: {
    backgroundColor: '#25D366',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minWidth: 200,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  analyseButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0d0d0d',
    letterSpacing: 0.3,
  },
});

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, useWindowDimensions } from 'react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming, useSharedValue } from 'react-native-reanimated';
import { Edit3, Bookmark, ChevronDown } from 'lucide-react-native';
import { useRouter } from "expo-router";

interface Subject {
  subject: string;
  subject_id: string;
}

const SUBJECTS: Subject[] = [
  { subject: 'Anatomy', subject_id: '2884ede5-ebdc-4dd7-be0d-cce07fd54c05' },
  { subject: 'Anesthesiology', subject_id: 'ebc4ef0f-46dd-4a4e-acca-1e53c7d6f127' },
  { subject: 'Biochemistry', subject_id: '4df2c8b9-d9c0-480c-aecc-61563fa616ce' },
  { subject: 'Community Medicine', subject_id: '78f794bb-90b5-4bb5-b5d6-d57381175e52' },
  { subject: 'Dermatology', subject_id: '832bb0b0-30ef-453d-914b-1484ad455959' },
  { subject: 'ENT', subject_id: '4e5a1bd4-18de-4975-bed3-28d428cda51c' },
  { subject: 'Forensic Medicine', subject_id: '6b9abcfa-9ac0-4930-a42f-f390c6be04c4' },
  { subject: 'General Medicine', subject_id: '3cd6242a-51be-4e93-98f2-b42268a8175a' },
  { subject: 'General Surgery', subject_id: 'aebf4b8b-446d-4a67-a325-ee8d1c7f05ca' },
  { subject: 'Microbiology', subject_id: '5d3c2d0a-8718-4964-baaa-7ffc664f072c' },
  { subject: 'Obstetrics and Gynecology', subject_id: '8c9c6b8c-bd2f-404b-8e58-d5a7a722650b' },
  { subject: 'Ophthalmology', subject_id: 'be03e32f-c62a-431b-97d8-88be27a24175' },
  { subject: 'Orthopedics', subject_id: 'fbbafd10-ba0f-4113-ad24-8192f40aa60d' },
  { subject: 'Pathology', subject_id: 'aed84226-be65-43a3-bae9-06ab57ab48bf' },
  { subject: 'Pediatrics', subject_id: '6268d53e-9ed5-45ae-833b-59dd88b3af74' },
  { subject: 'Pharmacology', subject_id: '59665c8f-6277-4e17-9c92-18257d2fc1f2' },
  { subject: 'Physiology', subject_id: 'cde00973-d19a-4ad2-9683-08f79f219603' },
  { subject: 'Psychiatry', subject_id: '2f599bf5-e471-4705-b183-55e44bd93c92' },
  { subject: 'Radiology', subject_id: 'fb0c84ba-9eb1-4274-b4ef-2af5ce56cff5' },
];

type AccordionTab = 'start' | 'bookmark' | 'wrongmcqs' | 'reviewconcepts' | null;


interface ConceptSubjectSelectionProps {
  studentId: string;
  onSubjectSelect: (
    studentId: string,
    subjectId: string,
    subjectName: string,
    intent: string
  ) => void;
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
      {isOpen && (
        <Animated.View entering={FadeInDown.duration(400)} style={styles.accordionContent}>
          {children}
        </Animated.View>
      )}
    </View>
  );
}

export default function ChatSubjectSelection({ studentId, onSubjectSelect }: ConceptSubjectSelectionProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [openTab, setOpenTab] = useState<AccordionTab>(null);
  const { width } = useWindowDimensions();
  const router = useRouter();

const handleSubjectClick = async (
  subjectId: string,
  subjectName: string,
  intent: string
) => {
  setLoading(subjectId + intent);

  try {
    if (intent === "bookmark_review") {
      router.push({
        pathname: "/conceptreviewbookmark",
        params: {
          student_id: studentId,
          subject_id: subjectId,
          subject_name: subjectName, 
        },
      });
    }
    else if (intent === "wrongmcqs") {
      router.push({
        pathname: "/wrongmcqs",
        params: {
          student_id: studentId,
          subject_id: subjectId,
          subject_name: subjectName,
        },
      });
    }
    else if (intent === "reviewconcepts") {
      router.push({
        pathname: "/reviewconcepts",
        params: {
          student_id: studentId,
          subject_id: subjectId,
          subject_name: subjectName,
        },
      });
    }
    else {
      await onSubjectSelect(studentId, subjectId, subjectName, intent);
    }
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
  intent: 'start_concept' | 'bookmark_review' | 'wrongmcqs' | 'reviewconcepts'
) => (
    <View style={styles.grid}>
      {SUBJECTS.map((subject) => (
        <View key={subject.subject_id} style={[styles.subjectCardWrapper, { width: cardWidth }]}>
          <TouchableOpacity
            style={styles.subjectCard}
            onPress={() => handleSubjectClick(subject.subject_id, subject.subject, intent)}
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
      {/* 🧠 Start Concept Learning */}
      <AccordionItem
        icon={<Edit3 size={22} color={openTab === 'start' ? '#25D366' : '#e0e0e0'} strokeWidth={1.5} />}
        title="Start Concept Learning"
        isOpen={openTab === 'start'}
        onToggle={() => toggleTab('start')}
      >
        {renderSubjectGrid('start_concept')}
      </AccordionItem>

      {/* 🔖 Review My Bookmarked Concepts */}
      <AccordionItem
        icon={<Bookmark size={22} color={openTab === 'bookmark' ? '#25D366' : '#e0e0e0'} strokeWidth={1.5} />}
        title="My Bookmarked Concepts"
        isOpen={openTab === 'bookmark'}
        onToggle={() => toggleTab('bookmark')}
      >
        {renderSubjectGrid('bookmark_review')}
      </AccordionItem>

      {/* ❌ My Wrong MCQs */}
      <AccordionItem
        icon={<Edit3 size={22} color={openTab === 'wrongmcqs' ? '#25D366' : '#e0e0e0'} strokeWidth={1.5} />}
        title="My Wrong MCQs"
        isOpen={openTab === 'wrongmcqs'}
        onToggle={() => toggleTab('wrongmcqs')}
      >
        {renderSubjectGrid('wrongmcqs')}
      </AccordionItem>

      {/* 📘 Review Concepts */}
      <AccordionItem
        icon={<Edit3 size={22} color={openTab === 'reviewconcepts' ? '#25D366' : '#e0e0e0'} strokeWidth={1.5} />}
        title="Review Concepts"
        isOpen={openTab === 'reviewconcepts'}
        onToggle={() => toggleTab('reviewconcepts')}
      >
        {renderSubjectGrid('reviewconcepts')}
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
});

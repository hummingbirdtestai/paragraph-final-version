import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bookmark } from 'lucide-react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const SUBJECTS = [
  { subject: 'Anatomy' },
  { subject: 'Anesthesia' },
  { subject: 'Biochemistry' },
  { subject: 'Community Medicine' },
  { subject: 'Dermatology' },
  { subject: 'ENT' },
  { subject: 'Forensic Medicine' },
  { subject: 'General Medicine' },
  { subject: 'General Surgery' },
  { subject: 'Microbiology' },
  { subject: 'Obstetrics and Gynaecology' },
  { subject: 'Ophthalmology' },
  { subject: 'Orthopedics' },
  { subject: 'Pathology' },
  { subject: 'Pediatrics' },
  { subject: 'Pharmacology' },
  { subject: 'Physiology' },
  { subject: 'Psychiatry' },
  { subject: 'Radiology' },
];

const PSYCHIATRY_FLASHCARDS = [
  {
    id: 'b8c3a6c2-1c4e-4e4e-8e3a-2208e6f3a111',
    Question:
      'Elderly woman (68 y) with advanced metastatic disease, progressive breathlessness, and poor functional status.\nWhat is the ethical next step?',
    Answer: 'Family meeting → goals-of-care',
  },
  {
    id: '0e7dd1e1-5f42-4a99-92e2-02ab5fa54212',
    Question:
      'Middle-aged man (55 y) with end-stage COPD, repeated ICU admissions, cachexia, CO₂ narcosis, and poor prognosis.\nWhat should the clinician prioritize?',
    Answer: 'Honor prior wishes',
  },
  {
    id: '6b9d13f4-d2e7-4da8-9edb-923f248aef13',
    Question:
      'Elderly patient (72 y) with advanced dementia, recurrent aspiration pneumonia, and bedbound status.\nWhat is the best ethical approach?',
    Answer: 'Discuss prognosis & limits',
  },
];

interface MarkupTextRendererProps {
  text: string;
  style?: any;
}

const MarkupTextRenderer: React.FC<MarkupTextRendererProps> = ({ text, style }) => {
  const parseMarkup = (input: string) => {
    const parts: Array<{ text: string; bold?: boolean; italic?: boolean }> = [];
    const regex = /\*\*\*(.*?)\*\*\*|\*\*(.*?)\*\*|\*(.*?)\*/g;
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ text: input.slice(lastIndex, match.index) });
      }

      if (match[1]) {
        parts.push({ text: match[1], bold: true, italic: true });
      } else if (match[2]) {
        parts.push({ text: match[2], bold: true });
      } else if (match[3]) {
        parts.push({ text: match[3], italic: true });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < input.length) {
      parts.push({ text: input.slice(lastIndex) });
    }

    return parts;
  };

  const parts = parseMarkup(text);

  return (
    <Text style={style}>
      {parts.map((part, index) => {
        const partStyle: any = {};
        if (part.bold) partStyle.fontWeight = 'bold';
        if (part.italic) partStyle.fontStyle = 'italic';

        return (
          <Text key={index} style={partStyle}>
            {part.text}
          </Text>
        );
      })}
    </Text>
  );
};

interface FlashcardCardProps {
  item: {
    id: string;
    Question: string;
    Answer: string;
  };
  index: number;
}

const FlashcardCard: React.FC<FlashcardCardProps> = ({ item, index }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState(200);
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const frontHeightRef = useRef(200);
  const backHeightRef = useRef(200);

  const isOddCard = index % 2 === 0;
  const borderColors = isOddCard
    ? ['#1e3a8a', '#3b82f6', '#60a5fa']
    : ['#065f46', '#10b981', '#34d399'];

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * 100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleFlip = () => {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 180,
      useNativeDriver: true,
      tension: 50,
      friction: 8,
    }).start();
    setIsFlipped(!isFlipped);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 3,
    }).start();
  };

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [1, 1, 0, 0],
  });

  const backOpacity = flipAnim.interpolate({
    inputRange: [0, 89, 90, 180],
    outputRange: [0, 0, 1, 1],
  });

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  const handleFrontLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    frontHeightRef.current = height;
    const maxHeight = Math.max(frontHeightRef.current, backHeightRef.current);
    if (maxHeight > cardHeight) {
      setCardHeight(maxHeight);
    }
  };

  const handleBackLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    backHeightRef.current = height;
    const maxHeight = Math.max(frontHeightRef.current, backHeightRef.current);
    if (maxHeight > cardHeight) {
      setCardHeight(maxHeight);
    }
  };

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <View style={styles.cardWrapper}>
        <Animated.View style={[styles.leftBorder, { opacity: shimmerOpacity }]}>
          <LinearGradient
            colors={borderColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.leftBorderGradient}
          />
        </Animated.View>

        <TouchableWithoutFeedback
          onPress={handleFlip}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <View style={[styles.cardTouchable, { height: cardHeight }]}>
            <Animated.View
              onLayout={handleFrontLayout}
              style={[
                styles.cardFace,
                styles.cardFront,
                {
                  opacity: frontOpacity,
                  transform: [{ rotateY: frontInterpolate }],
                },
              ]}
            >
              <LinearGradient
                colors={['#1a1a1a', '#141414', '#0f0f0f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.topShine} />

                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <LinearGradient
                      colors={['#3b82f6', '#2563eb', '#1d4ed8']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.badge}
                    >
                      <Text style={styles.badgeLetter}>Q</Text>
                    </LinearGradient>
                    <Text style={styles.badgeLabel}>QUESTION</Text>
                  </View>
                  <Bookmark size={20} color="#3b82f6" strokeWidth={2} />
                </View>

                <View style={styles.textBorderContainer}>
                  <LinearGradient
                    colors={['rgba(59, 130, 246, 0.3)', 'rgba(16, 185, 129, 0.3)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.textBorder}
                  >
                    <View style={styles.textContent}>
                      <MarkupTextRenderer text={item.Question} style={styles.questionText} />
                    </View>
                  </LinearGradient>
                </View>

                <Text style={styles.tapHint}>Tap to reveal answer</Text>
              </LinearGradient>
            </Animated.View>

            <Animated.View
              onLayout={handleBackLayout}
              style={[
                styles.cardFace,
                styles.cardBack,
                {
                  opacity: backOpacity,
                  transform: [{ rotateY: backInterpolate }],
                },
              ]}
            >
              <LinearGradient
                colors={['#1a1a1a', '#141414', '#0f0f0f']}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.topShine} />

                <View style={styles.cardHeader}>
                  <View style={styles.badgeRow}>
                    <LinearGradient
                      colors={['#10b981', '#059669', '#047857']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.badge}
                    >
                      <Text style={styles.badgeLetter}>A</Text>
                    </LinearGradient>
                    <Text style={styles.badgeLabel}>ANSWER</Text>
                  </View>
                  <Bookmark size={20} color="#10b981" strokeWidth={2} fill="#10b981" />
                </View>

                <View style={[styles.textBorderContainer, styles.answerContainer]}>
                  <LinearGradient
                    colors={['rgba(16, 185, 129, 0.4)', 'rgba(5, 150, 105, 0.4)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.textBorder}
                  >
                    <View style={[styles.textContent, styles.answerBackground]}>
                      <MarkupTextRenderer text={item.Answer} style={styles.answerText} />
                    </View>
                  </LinearGradient>
                </View>

                <Text style={styles.tapHint}>Tap to see question</Text>
              </LinearGradient>
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </Animated.View>
  );
};

const FlashcardFeed: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState('Psychiatry');

  const getFlashcardsForSubject = (subject: string) => {
    if (subject === 'Psychiatry') {
      return PSYCHIATRY_FLASHCARDS;
    }
    return [];
  };

  const flashcards = getFlashcardsForSubject(selectedSubject);
  const hasFlashcards = flashcards.length > 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flashcard Feed</Text>
        <Text style={styles.headerSubtitle}>
          {hasFlashcards ? `${flashcards.length} cards` : 'Select a subject'}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.subjectScrollContent}
        style={styles.subjectScrollContainer}
      >
        {SUBJECTS.map((item) => (
          <TouchableOpacity
            key={item.subject}
            style={[
              styles.subjectBubble,
              selectedSubject === item.subject && styles.subjectBubbleSelected,
            ]}
            onPress={() => setSelectedSubject(item.subject)}
          >
            <Text
              style={[
                styles.subjectBubbleText,
                selectedSubject === item.subject && styles.subjectBubbleTextSelected,
              ]}
            >
              {item.subject}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {hasFlashcards ? (
        <FlatList
          data={flashcards}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <FlashcardCard item={item} index={index} />}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={Platform.OS === 'android'}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>
            No flashcards available for this subject.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#0d0d0d',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#eaeaea',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#888',
  },
  listContent: {
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  cardContainer: {
    marginBottom: 48,
  },
  cardWrapper: {
    position: 'relative',
    flexDirection: 'row',
  },
  leftBorder: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    borderRadius: 3,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: -2, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '-2px 0 12px rgba(59, 130, 246, 0.5)',
      },
    }),
  },
  leftBorderGradient: {
    flex: 1,
    width: '100%',
  },
  cardTouchable: {
    flex: 1,
    marginLeft: 16,
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 6px 20px rgba(0, 0, 0, 0.5)',
      },
    }),
  },
  cardFront: {
    zIndex: 2,
  },
  cardBack: {
    zIndex: 1,
  },
  cardGradient: {
    padding: 24,
    paddingTop: 20,
  },
  topShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
      },
    }),
  },
  badgeLetter: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  badgeLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1.2,
  },
  textBorderContainer: {
    marginBottom: 20,
  },
  textBorder: {
    borderRadius: 12,
    padding: 2,
  },
  textContent: {
    backgroundColor: 'rgba(20, 20, 20, 0.8)',
    borderRadius: 10,
    padding: 18,
  },
  answerContainer: {},
  answerBackground: {
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#eaeaea',
  },
  answerText: {
    fontSize: 19,
    lineHeight: 30,
    color: '#10b981',
    fontWeight: '600',
  },
  tapHint: {
    fontSize: 13,
    color: '#555',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  subjectScrollContainer: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  subjectScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },
  subjectBubble: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#10b981',
    backgroundColor: 'transparent',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subjectBubbleSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  subjectBubbleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
    textAlign: 'center',
    lineHeight: 16,
  },
  subjectBubbleTextSelected: {
    color: '#ffffff',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default FlashcardFeed;

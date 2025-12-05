import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FLASHCARD_DATA = [
  {
    id: 'b8c3a6c2-1c4e-4e4e-8e3a-2208e6f3a111',
    Question:
      'Elderly woman (68 y) with advanced metastatic disease, progressive breathlessness, and poor functional status. She is alert but anxious. Aggressive therapy offers no benefit; family demands maximal care.\nWhat is the ethical next step?',
    Answer: 'Family meeting → goals-of-care',
  },
  {
    id: '0e7dd1e1-5f42-4a99-92e2-02ab5fa54212',
    Question:
      'Middle-aged man (55 y) with end-stage COPD, repeated ICU admissions, now arrives with severe dyspnea, cachexia, CO₂ narcosis, and poor prognosis.\nWhat should the clinician prioritize?',
    Answer: 'Honor prior wishes',
  },
  {
    id: '6b9d13f4-d2e7-4da8-9edb-923f248aef13',
    Question:
      'Elderly patient (72 y) with advanced dementia, recurrent aspiration pneumonia, and bedbound status becomes febrile and hypoxic.\nWhat is the best ethical approach?',
    Answer: 'Discuss prognosis & limits',
  },
  {
    id: 'db3cf98a-93f4-4dfd-9f6f-0f0c1fcd5e14',
    Question:
      'Cancer patient (65 y) with widespread metastases arrives with intractable pain and poor performance status.\nWhat should the physician focus on?',
    Answer: 'Palliative symptom control',
  },
  {
    id: 'c2b8fb2d-3f77-4be7-a8b3-ddf3167d9f15',
    Question:
      'Young woman (32 y) with end-stage heart failure awaiting transplant deteriorates rapidly. She previously signed DNR.\nWhich directive takes priority?',
    Answer: "Patient's DNR autonomy",
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
  const flipAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

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
      <TouchableWithoutFeedback
        onPress={handleFlip}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.cardTouchable}>
          <Animated.View
            style={[
              styles.cardFace,
              styles.cardFront,
              {
                opacity: frontOpacity,
                transform: [{ rotateY: frontInterpolate }],
              },
            ]}
          >
            <View style={styles.labelContainer}>
              <Text style={styles.labelText}>QUESTION</Text>
            </View>
            <MarkupTextRenderer text={item.Question} style={styles.questionText} />
            <Text style={styles.tapHint}>Tap to reveal answer</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.cardFace,
              styles.cardBack,
              {
                opacity: backOpacity,
                transform: [{ rotateY: backInterpolate }],
              },
            ]}
          >
            <View style={[styles.labelContainer, styles.answerLabelContainer]}>
              <Text style={[styles.labelText, styles.answerLabelText]}>ANSWER</Text>
            </View>
            <MarkupTextRenderer text={item.Answer} style={styles.answerText} />
            <Text style={styles.tapHint}>Tap to flip back</Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
};

const FlashcardFeed: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Flashcard Feed</Text>
        <Text style={styles.headerSubtitle}>{FLASHCARD_DATA.length} cards</Text>
      </View>

      <FlatList
        data={FLASHCARD_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <FlashcardCard item={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        removeClippedSubviews={Platform.OS === 'android'}
        maxToRenderPerBatch={5}
        windowSize={5}
      />
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
    paddingBottom: 16,
    backgroundColor: '#0d0d0d',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#eaeaea',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
  },
  listContent: {
    paddingVertical: 12,
  },
  cardContainer: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
  cardTouchable: {
    position: 'relative',
    width: '100%',
    minHeight: 200,
  },
  cardFace: {
    position: 'absolute',
    width: '100%',
    minHeight: 200,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
    padding: 24,
    backfaceVisibility: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  cardFront: {
    justifyContent: 'center',
  },
  cardBack: {
    justifyContent: 'center',
  },
  labelContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginBottom: 16,
  },
  labelText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#888',
    letterSpacing: 1,
  },
  answerLabelContainer: {
    backgroundColor: '#1a4d2e',
  },
  answerLabelText: {
    color: '#25D366',
  },
  questionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#eaeaea',
    marginBottom: 16,
  },
  answerText: {
    fontSize: 18,
    lineHeight: 28,
    color: '#25D366',
    fontWeight: '600',
    marginBottom: 16,
  },
  tapHint: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default FlashcardFeed;

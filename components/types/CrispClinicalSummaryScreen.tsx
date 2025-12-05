//CrispClinicalSummaryScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';

const MENTOR_MESSAGE = `Sure — there are *two main types* of respiratory failure, based on arterial blood gas (ABG) abnormality:

*Types of Respiratory Failure*
• *Type I (Hypoxemic):* ↓PaO₂ < 60 mmHg, with normal or ↓PaCO₂ → e.g., pneumonia, ARDS, pulmonary edema
• *Type II (Hypercapnic):* ↑PaCO₂ > 50 mmHg, often with ↓PaO₂ → e.g., COPD, asthma, neuromuscular weakness

*Mnemonic:*
🩺 "I for Insufficient oxygen, II for Inadequate ventilation."`;

export default function CrispClinicalSummaryScreen({ data }: { data: string }) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <MentorAnswerBubble message={data} />
      </ScrollView>
    </View>
  );
}

function MentorAnswerBubble({ message }: { message: string }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.mentorBubble, { opacity: fadeAnim }]}>
      {renderMarkupText(message, styles.mentorText)}
    </Animated.View>
  );
}

function renderMarkupText(content: string, baseStyle: any) {
  const lines = content.split('\n');

  return (
    <Text style={baseStyle}>
      {lines.map((line, lineIndex) => {
        const isMnemonicOrHeading = line.includes('') && line.trim().endsWith('');
        const isListItem = line.trim().startsWith('•') || line.trim().startsWith('→');

        return (
          <React.Fragment key={lineIndex}>
            {isMnemonicOrHeading ? (
              <Text style={styles.heading}>{parseInlineMarkup(line)}</Text>
            ) : isListItem ? (
              <Text style={styles.listItem}>{parseInlineMarkup(line)}</Text>
            ) : (
              parseInlineMarkup(line)
            )}
            {lineIndex < lines.length - 1 && '\n'}
          </React.Fragment>
        );
      })}
    </Text>
  );
}

function parseInlineMarkup(text: string) {
  const parts: React.ReactNode[] = [];
  let key = 0;

  const regex = /(\*_[^_]+_\*|\*[^*]+\*|_[^_]+_)/g;
  const segments = text.split(regex);

  segments.forEach((segment) => {
    if (segment.startsWith("*_") && segment.endsWith("_*")) {
      parts.push(
        <Text key={key++} style={styles.boldItalic}>
          {segment.slice(2, -2)}
        </Text>
      );
    } else if (segment.startsWith("*") && segment.endsWith("*")) {
      parts.push(
        <Text key={key++} style={styles.bold}>
          {segment.slice(1, -1)}
        </Text>
      );
    } else if (segment.startsWith("_") && segment.endsWith("_")) {
      parts.push(
        <Text key={key++} style={styles.italic}>
          {segment.slice(1, -1)}
        </Text>
      );
    } else {
      parts.push(<Text key={key++}>{segment}</Text>);
    }
  });

  return <>{parts}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  mentorBubble: {
    maxWidth: '90%',
    alignSelf: 'flex-start',
    backgroundColor: '#1f1f1f',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mentorText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e1e1e1',
  },
  heading: {
    color: '#25D366',
    fontWeight: '600',
  },
  listItem: {
    marginLeft: 8,
  },
  bold: {
    fontWeight: '700',
    color: '#ffffff',
  },
  italic: {
    fontStyle: 'italic',
  },
  boldItalic: {
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#ffffff',
  },
});

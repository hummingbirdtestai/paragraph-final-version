//AlgorithmFlowScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';

const MENTOR_MESSAGE = `*Approach to Respiratory Failure*

🩸 *Step 1:* Check ABG → PaO₂ < 60 ?
 → Yes → Possible failure.

⚙ *Step 2:* Examine PaCO₂:
 • Normal / low → Type I
 • High → Type II

💡 *Step 3:* Find the cause:
 Type I → Lung pathology (V/Q mismatch)
 Type II → Pump failure (hypoventilation)`;

export default function AlgorithmFlowScreen({ data }: { data: string }){
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
        const isMainHeading = line.trim().startsWith('') && line.trim().endsWith('') && !line.includes(':');
        const isStepHeading = /^[🩸⚙💡]/.test(line.trim());
        const isIndented = line.startsWith(' ');

        return (
          <React.Fragment key={lineIndex}>
            {isMainHeading ? (
              <Text style={styles.mainHeading}>{parseInlineMarkup(line)}</Text>
            ) : isStepHeading ? (
              <Text style={styles.stepHeading}>{parseInlineMarkup(line)}</Text>
            ) : isIndented ? (
              <Text style={styles.indented}>{parseInlineMarkup(line)}</Text>
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

  // Replace *bold*, _italic_, and *_bolditalic_*
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
  mainHeading: {
    color: '#25D366',
    fontWeight: '700',
    fontSize: 16,
  },
  stepHeading: {
    marginTop: 4,
  },
  indented: {
    marginLeft: 16,
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

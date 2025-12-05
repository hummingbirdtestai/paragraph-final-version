//HighYieldFactSheetScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';

export default function HighYieldFactSheetScreen({ data }: { data: string }) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <MentorFactSheetBubble message={data} />
      </ScrollView>
    </View>
  );
}


function MentorFactSheetBubble({ message }: { message: string }) {
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
        const isMainHeading = line.trim().startsWith('') && line.includes('High-Yield');
        const isBulletPoint = line.trim().startsWith('🔹');
        const isIndented = line.startsWith('  ') && !isBulletPoint;

        return (
          <React.Fragment key={lineIndex}>
            {isMainHeading ? (
              <Text style={styles.mainHeading}>{parseInlineMarkup(line)}</Text>
            ) : isBulletPoint ? (
              <Text style={styles.bulletPoint}>{parseInlineMarkup(line)}</Text>
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
    borderRadius: 18,
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
    marginBottom: 4,
  },
  bulletPoint: {
    marginTop: 6,
  },
  indented: {
    marginLeft: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#25D366',
  },
  italic: {
    fontStyle: 'italic',
    color: '#d4d4d4',
  },
  boldItalic: {
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#25D366',
  },
});

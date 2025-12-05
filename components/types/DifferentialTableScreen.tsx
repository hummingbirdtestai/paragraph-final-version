//DifferentialTableScreen.tsx
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
} from 'react-native';

interface TableRow {
  feature: string;
  typeI: string;
  typeII: string;
}

const TABLE_DATA: TableRow[] = [
  {
    feature: 'PaO₂',
    typeI: '↓ (< 60 mmHg)',
    typeII: '↓ (< 60 mmHg)',
  },
  {
    feature: 'PaCO₂',
    typeI: 'Normal or ↓',
    typeII: '↑ (> 50 mmHg)',
  },
  {
    feature: 'A–a Gradient',
    typeI: 'Increased',
    typeII: 'Normal or increased',
  },
  {
    feature: 'Mechanism',
    typeI: 'V/Q mismatch, shunt',
    typeII: 'Alveolar hypoventilation',
  },
  {
    feature: 'Examples',
    typeI: 'ARDS, pneumonia',
    typeII: 'COPD, opioid overdose',
  },
];

const BOTTOM_LINE = '*Bottom line:*\nType I = oxygenation problem; Type II = ventilation problem.';

export default function DifferentialTableScreen({ data }: { data: string }) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        horizontal={false}
      >
        <MentorTableBubble dataText={data} />
      </ScrollView>
    </View>
  );
}


function MentorTableBubble({ dataText }: { dataText: string }) {
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
      {renderMarkupText(dataText)}
    </Animated.View>
  );
}


function renderMarkupText(content: string) {
  const lines = content.split('\n');

  return (
    <Text style={styles.bottomLineText}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={lineIndex}>
          {parseInlineMarkup(line)}
          {lineIndex < lines.length - 1 && '\n'}
        </React.Fragment>
      ))}
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
    maxWidth: '100%',
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: '#25D366',
    borderRadius: 8,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#1a3a2e',
  },
  dataRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
    minHeight: 44,
  },
  headerCell: {
    borderRightWidth: 1,
    borderRightColor: '#25D366',
  },
  dataCell: {
    borderRightWidth: 1,
    borderRightColor: '#2a2a2a',
  },
  firstColumn: {
    width: 120,
  },
  middleColumn: {
    width: 160,
  },
  lastColumn: {
    width: 160,
    borderRightWidth: 0,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#25D366',
    lineHeight: 20,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    lineHeight: 22,
  },
  dataText: {
    fontSize: 15,
    color: '#e1e1e1',
    lineHeight: 22,
  },
  bottomLineContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2a2a2a',
  },
  bottomLineText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e1e1e1',
  },
  bold: {
    fontWeight: '700',
    color: '#25D366',
  },
  italic: {
    fontStyle: 'italic',
  },
  boldItalic: {
    fontWeight: '700',
    fontStyle: 'italic',
    color: '#25D366',
  },
});

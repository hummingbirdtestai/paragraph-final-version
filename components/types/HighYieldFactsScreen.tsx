//HighYieldFactsScreen.tsx
import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Bookmark } from 'lucide-react-native';


interface HighYieldFactsScreenProps {
  topic: string;
  conceptMarkdown: string;

  // 🔝 Top bar metadata (OPTIONAL)
  subject?: string;
  reactOrder?: number;
  totalCount?: number;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
}
const HighYieldFactsScreen: React.FC<HighYieldFactsScreenProps> = ({
  topic,
  conceptMarkdown,
  subject,
  reactOrder,
  totalCount,
  isBookmarked,
  onToggleBookmark,
}) => {
const [localBookmarked, setLocalBookmarked] = React.useState(!!isBookmarked);

React.useEffect(() => {
  setLocalBookmarked(!!isBookmarked);
}, [isBookmarked]);



  const extractFacts = (markdown: string): string[] => {
    const lines = markdown.split('\n');
    const facts: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();

      // Skip empty lines
      if (!trimmed) continue;

      // Skip markdown code fences
      if (trimmed === '```') continue;

      // Skip headings
      if (trimmed.startsWith('#')) continue;

      // Skip table rows
      if (trimmed.startsWith('|')) continue;

      // Strip leading bullets, numbers, dots, emojis
      const cleanedLine = trimmed.replace(/^[•\-*➤🔹◦▪︎▫︎‣⁃]+\s*/, '')
                                 .replace(/^\d+\.\s*/, '')
                                 .replace(/^[\u{1F300}-\u{1F9FF}]\s*/u, '');

      if (cleanedLine) {
        facts.push(cleanedLine);
      }
    }

    return facts;
  };

  const renderMarkdownText = (text: string) => {
    const parts: React.ReactNode[] = [];
    let currentIndex = 0;
    let key = 0;

    // Pattern to match **bold** and *italic*
    const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
    let match;

    while ((match = pattern.exec(text)) !== null) {
      // Add text before the match
      if (match.index > currentIndex) {
        parts.push(
          <Text key={key++} style={styles.factText}>
            {text.substring(currentIndex, match.index)}
          </Text>
        );
      }

      const matched = match[0];

      // Check if it's bold or italic
      if (matched.startsWith('**') && matched.endsWith('**')) {
        const content = matched.slice(2, -2);
        parts.push(
          <Text key={key++} style={[styles.factText, styles.boldText]}>
            {content}
          </Text>
        );
      } else if (matched.startsWith('*') && matched.endsWith('*')) {
        const content = matched.slice(1, -1);
        parts.push(
          <Text key={key++} style={[styles.factText, styles.italicText]}>
            {content}
          </Text>
        );
      }

      currentIndex = match.index + matched.length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <Text key={key++} style={styles.factText}>
          {text.substring(currentIndex)}
        </Text>
      );
    }

    return parts;
  };

  const facts = extractFacts(conceptMarkdown);

  const borderColors = [
    '#3b82f6', // blue
    '#8b5cf6', // purple
    '#ec4899', // pink
    '#f59e0b', // amber
    '#10b981', // emerald
    '#06b6d4', // cyan
    '#f97316', // orange
    '#14b8a6', // teal
  ];

  const getBorderStyle = (index: number) => {
    const color = borderColors[index % borderColors.length];
    const isLeft = index % 2 === 0;

    return {
      borderLeftWidth: isLeft ? 4 : 0,
      borderLeftColor: isLeft ? color : 'transparent',
      borderRightWidth: isLeft ? 0 : 4,
      borderRightColor: isLeft ? 'transparent' : color,
    };
  };

  return (
    <View style={styles.container}>
      {/* 🔝 TOP BAR — CONCEPT ONLY */}
{reactOrder !== undefined && totalCount !== undefined && (
  <View style={styles.topBar}>
    <View>
  <Text style={styles.subjectText}>{subject}</Text>
  <View style={styles.progressRow}>
    <Text style={styles.progressText}>
          🧠 Concept {reactOrder} / {totalCount}
        </Text>
      </View>
    </View>


  {onToggleBookmark && (
    <TouchableOpacity
      style={{ marginRight: 12 }}   // 👈 ADD THIS LINE
      onPress={() => {
        setLocalBookmarked((prev) => !prev);
        onToggleBookmark();
      }}
    >
      <Bookmark
        size={22}
        color="#10b981"
        strokeWidth={2}
        fill={localBookmarked ? "#10b981" : "transparent"}
      />
    </TouchableOpacity>
  )}
  </View>
)}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.outerBox}>
          <View style={styles.topicCard}>
            <Text style={styles.topicLabel}>Topic</Text>
            <Text style={styles.topicText}>{topic}</Text>
          </View>

          {facts.map((fact, index) => (
            <View key={index} style={[styles.factCard, getBorderStyle(index)]}>
              <Text style={styles.factTextContainer}>
                {renderMarkdownText(fact)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
 outerBox: {
  backgroundColor: '#1a1a1a',
  padding: 16,
},
  topicCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 6,
    borderLeftColor: '#fbbf24',
    borderRightWidth: 6,
    borderRightColor: '#fbbf24',
    shadowColor: '#fbbf24',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  topicLabel: {
    color: '#fbbf24',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  topicText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 32,
    letterSpacing: 0.5,
  },
  factCard: {
    backgroundColor: '#242424',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  factTextContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  factText: {
    color: '#e5e5e5',
    fontSize: 16,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: '700',
    color: '#F4E4C1',
  },
  italicText: {
    fontStyle: 'italic',
    color: '#d4d4d4',
  },
  topBar: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 12,
},

progressRow: {
  paddingVertical: 4,
  paddingHorizontal: 10,
  backgroundColor: "#0d2017",
  borderRadius: 12,
  borderWidth: 1,
  borderColor: "#25D36655",
},

progressText: {
  color: "#25D366",
  fontSize: 13,
  fontWeight: "700",
},
  subjectText: {
  color: "#25D366",
  fontSize: 15,
  fontWeight: "700",
  marginBottom: 4,
},
});


export default HighYieldFactsScreen;

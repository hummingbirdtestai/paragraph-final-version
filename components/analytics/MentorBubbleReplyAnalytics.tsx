import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Animated, { FadeInLeft } from 'react-native-reanimated';
import MarkdownText from "@/components/types/MarkdownText";

interface MentorBubbleProps {
  markdownText: string;
}

function preprocessSections(raw: string): string {
  if (!raw || typeof raw !== 'string') return raw;

  let processed = raw.trim();

  // Remove greeting/salutation at the start
  processed = processed.replace(/^Dear [^,]+,\s*\n*/i, '');

  // Add main heading
  processed = `# Mentor Insights\n\n${processed}`;

  // Auto-detect major sections and add subheadings
  const sectionPatterns = [
    { keyword: /\n\n(As I reflect|Let me reflect|Reflecting on)/i, heading: '## Current Progress Analysis' },
    { keyword: /\n\n(You've made|You have made|Your progress shows)/i, heading: '## Performance Overview' },
    { keyword: /\n\n(Your current stage|You are currently|At this stage)/i, heading: '## Current Stage Assessment' },
    { keyword: /\n\n(Let me share|I recall|One of my students)/i, heading: '## Learning from Experience' },
    { keyword: /\n\n(To enhance|I recommend|Here are|Moving forward|Action plan)/i, heading: '## Recommended Action Steps' },
    { keyword: /\n\n(Remember|Keep in mind|As you|Embrace)/i, heading: '## Final Thoughts' },
  ];

  sectionPatterns.forEach(({ keyword, heading }) => {
    const match = processed.match(keyword);
    if (match && match.index !== undefined) {
      const matchedText = match[1];
      processed = processed.replace(keyword, `\n\n${heading}\n\n${matchedText}`);
    }
  });

  // Remove closing signature
  processed = processed.replace(/\n\n(With [^,]+,|Warmly,|Best regards,|Sincerely,)\s*\n*Your Mentor\s*$/i, '');

  return processed;
}

export default function MentorBubbleReplyAnalytics({ markdownText }: MentorBubbleProps) {
  let content;

  try {
    if (!markdownText || typeof markdownText !== "string")
      throw new Error("Invalid markdownText");

    const processed = preprocessSections(markdownText);
    content = <MarkdownText>{processed}</MarkdownText>;
  } catch (e) {
    console.log("🔥 MentorBubbleReply render failed:", e, markdownText);
    content = <Text style={{ color: "#e1e1e1" }}>{String(markdownText)}</Text>;
  }

 return (
  <Animated.View entering={FadeInLeft.duration(400)} style={styles.container}>
    <View style={styles.tail} />

    <View style={styles.bubble}>
      <ScrollView
        showsVerticalScrollIndicator={true}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        className="custom-scroll"
      >
        {content}
      </ScrollView>
    </View>

  </Animated.View>
);

}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  tail: {
    width: 0,
    height: 0,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: '#1e1e1e',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    position: 'absolute',
    left: 16,
    top: 18,
  },
  bubble: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    borderRightWidth: 3,
    borderRightColor: '#25D366',
    padding: 18,
    width: '100%',
    marginLeft: 8,
    maxHeight: 600,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 8,
  },
});

//CONCEPTSCREEN.TSX
import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { supabase } from '@/lib/supabaseClient';
import Markdown from 'react-native-markdown-display';
import AdaptiveTableRenderer from '@/components/common/AdaptiveTableRenderer';

function removeTablesAndHeadings(markdown: string): string {
  const lines = markdown.split("\n");
  const output: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();

    // 1️⃣ Remove ANY heading that mentions Rapid / Revision / Reckoner
    if (/^#{1,6}\s.*(Rapid|Revision|Reckoner|Table)/i.test(trimmed)) {
      continue;
    }

    // 2️⃣ Remove any heading just before a table
    if (/^#{1,6}\s/.test(trimmed) && lines[i + 1]?.trim().startsWith("|")) {
      continue;
    }

    // 3️⃣ Remove table rows
    if (trimmed.startsWith("|")) continue;

    output.push(lines[i]);
  }

  return output.join("\n");
}


function extractMarkdownFromConcept(conceptField: string): string {
  if (!conceptField) return '';

  let cleaned = conceptField.trim();

  // AGGRESSIVE FENCE REMOVAL
  // Method 1: Remove lines that are only backticks (with optional language identifier)
  cleaned = cleaned.split('\n')
    .filter(line => {
      const trimmed = line.trim();
      // Skip lines that are just backticks with optional language
      return !(/^`{3,}\s*[a-zA-Z]*\s*$/.test(trimmed));
    })
    .join('\n');

  // Method 2: Remove leading/trailing fence blocks
  cleaned = cleaned.replace(/^`{3,}[a-zA-Z]*\s*\n/gm, '');
  cleaned = cleaned.replace(/\n?`{3,}\s*$/gm, '');

  // Method 3: Clean up any fence artifacts at start/end
  while (cleaned.startsWith('```') || cleaned.startsWith('`')) {
    if (cleaned.startsWith('```')) {
      const firstNewline = cleaned.indexOf('\n');
      if (firstNewline > 0) {
        cleaned = cleaned.substring(firstNewline + 1);
      } else {
        cleaned = cleaned.substring(3);
      }
    } else {
      cleaned = cleaned.substring(1);
    }
    cleaned = cleaned.trim();
  }

  while (cleaned.endsWith('```') || cleaned.endsWith('`')) {
    if (cleaned.endsWith('```')) {
      const lastNewline = cleaned.lastIndexOf('\n', cleaned.length - 4);
      if (lastNewline > 0) {
        cleaned = cleaned.substring(0, lastNewline);
      } else {
        cleaned = cleaned.substring(0, cleaned.length - 3);
      }
    } else {
      cleaned = cleaned.substring(0, cleaned.length - 1);
    }
    cleaned = cleaned.trim();
  }

  return cleaned.trim();
}

// Common emoji bullets used in medical content
const EMOJI_BULLETS = [
  '🔷', '🔶', '🔹', '🔸',  // Diamonds
  '🔺', '🔻', '▪️', '▫️',  // Triangles and squares
  '◾', '◽', '●', '○',      // Circles
  '✔️', '✅', '❌', '✖️',  // Checkmarks
  '⭐', '💡', '🎯', '📌',  // Other common bullets
  '➡️', '→', '•', '◆', '◇', // Arrows and shapes
];

// Check if text starts with an emoji bullet
function startsWithEmojiBullet(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();

  // Check for any emoji or special character at the start
  // This catches emojis that might not be in our list
  const emojiRegex = /^[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{25A0}-\u{25FF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;

  if (emojiRegex.test(trimmed)) {
    return true;
  }

  // Also check our explicit list
  return EMOJI_BULLETS.some(emoji => trimmed.startsWith(emoji));
}

// Extract text content from React nodes - improved version
function getTextContent(children: any): string {
  if (!children) return '';

  if (typeof children === 'string') {
    return children;
  }

  if (Array.isArray(children)) {
    return children.map(child => getTextContent(child)).join('');
  }

  if (React.isValidElement(children)) {
    // Handle React elements
    const element = children as React.ReactElement;
    if (element.props && element.props.children) {
      return getTextContent(element.props.children);
    }
  }

  if (typeof children === 'object' && children !== null) {
    // Handle plain objects with children
    if ('props' in children && children.props && children.props.children) {
      return getTextContent(children.props.children);
    }
    // Handle objects with children property
    if ('children' in children) {
      return getTextContent(children.children);
    }
  }

  return '';
}

// Custom markdown rules to handle emoji bullets
const customMarkdownRules = {
  // Custom bullet_list_item rendering
  bullet_list_item: (node: any, children: any, parent: any, styles: any) => {
    // Try multiple methods to get the text content
    let textContent = '';

    // Method 1: Try node content directly
    if (node && node.content) {
      textContent = node.content;
    }

    // Method 2: Extract from children if no direct content
    if (!textContent) {
      textContent = getTextContent(children);
    }

    // Method 3: Check if first child is text with emoji
    if (!textContent && Array.isArray(children) && children.length > 0) {
      const firstChild = children[0];
      if (firstChild && typeof firstChild === 'object' && firstChild.props) {
        textContent = getTextContent(firstChild);
      }
    }

    const hasEmojiBullet = startsWithEmojiBullet(textContent);

    return (
      <View key={node.key} style={styles.list_item}>
        {!hasEmojiBullet && (
          <Text style={styles.bullet_list_icon}>•</Text>
        )}
        <View style={styles.list_item_content}>
          {children}
        </View>
      </View>
    );
  },

  // Custom ordered_list_item rendering
  ordered_list_item: (node: any, children: any, parent: any, styles: any) => {
    // Try multiple methods to get the text content
    let textContent = '';

    if (node && node.content) {
      textContent = node.content;
    }

    if (!textContent) {
      textContent = getTextContent(children);
    }

    if (!textContent && Array.isArray(children) && children.length > 0) {
      const firstChild = children[0];
      if (firstChild && typeof firstChild === 'object' && firstChild.props) {
        textContent = getTextContent(firstChild);
      }
    }

    const hasEmojiBullet = startsWithEmojiBullet(textContent);

    return (
      <View key={node.key} style={styles.list_item}>
        {!hasEmojiBullet && (
          <Text style={styles.ordered_list_icon}>{node.index + 1}.</Text>
        )}
        <View style={styles.list_item_content}>
          {children}
        </View>
      </View>
    );
  },
};

export default function ConceptChatScreen({
  item,
  studentId,
  isBookmarked = false,
  reviewMode = false,
  phaseUniqueId
}: {
  item: any;
  studentId: string;
  isBookmarked?: boolean;
  reviewMode?: boolean;
  phaseUniqueId: string;
}) {


  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  let conceptContent = extractMarkdownFromConcept(
  item?.Concept || item?.concept || ''
);
  
  if (isMobile) {
    conceptContent = removeTablesAndHeadings(conceptContent);
  }

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.conceptDocumentContainer,
            isMobile ? styles.conceptDocumentMobile : styles.conceptDocumentWeb,
            { opacity: fadeAnim },
          ]}
        >
          <View style={isMobile ? styles.markdownContentMobile : styles.markdownContentWeb}>
            <AdaptiveTableRenderer
              markdown={conceptContent}
              markdownStyles={isMobile ? markdownStylesMobile : markdownStylesWeb}
              markdownRules={customMarkdownRules}
              isMobile={isMobile}
            />
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}




const markdownStylesMobile = StyleSheet.create({
  body: {
    color: '#e1e1e1',
    fontSize: 15,
    lineHeight: 20,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  heading1: {
    display: 'none',
    height: 0,
    margin: 0,
    padding: 0,
  },
  heading2: {
    display: 'none',
    height: 0,
    margin: 0,
    padding: 0,
  },
  heading3: {
    display: 'none',
    height: 0,
    margin: 0,
    padding: 0,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
    color: '#e1e1e1',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  strong: {
    fontWeight: '700',
    color: '#ffffff',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  em: {
    fontStyle: 'italic',
    color: '#d1d1d1',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  bullet_list: {
    marginTop: 6,
    marginBottom: 10,
  },
  ordered_list: {
    marginTop: 6,
    marginBottom: 10,
  },
  list_item: {
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  list_item_content: {
    flex: 1,
    flexDirection: 'column',
  },
  bullet_list_icon: {
    color: '#10b981',
    fontSize: 16,
    marginRight: 8,
    lineHeight: 20,
  },
  ordered_list_icon: {
    color: '#3b82f6',
    fontSize: 14,
    marginRight: 8,
    lineHeight: 20,
  },
  table: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    marginVertical: 14,
    backgroundColor: '#1a1a1a',
  },
  thead: {
    backgroundColor: '#0f0f0f',
  },
  tbody: {},
  tr: {
    borderBottomWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
  },
  th: {
    padding: 12,
    minWidth: 100,
    fontWeight: '700',
    color: '#10b981',
    fontSize: 14,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  td: {
    padding: 12,
    minWidth: 100,
    color: '#e1e1e1',
    fontSize: 13,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  code_inline: {
    backgroundColor: '#1a1a1a',
    color: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  code_block: {
    backgroundColor: '#1a1a1a',
    color: '#10b981',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    marginVertical: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fence: {
    backgroundColor: '#1a1a1a',
    color: '#e1e1e1',
    padding: 12,
    borderRadius: 8,
    fontSize: 13,
    marginVertical: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  blockquote: {
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
    paddingLeft: 12,
    paddingVertical: 10,
    marginVertical: 12,
    fontStyle: 'italic',
  },
  hr: {
    backgroundColor: '#333',
    height: 1,
    marginVertical: 18,
  },
  text: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});

const markdownStylesWeb = StyleSheet.create({
  body: {
    color: '#e1e1e1',
    fontSize: 16,
    lineHeight: 26,
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  heading1: {
    display: 'none',
    height: 0,
    margin: 0,
    padding: 0,
  },
  heading2: {
    display: 'none',
    height: 0,
    margin: 0,
    padding: 0,
  },
  heading3: {
    display: 'none',
    height: 0,
    margin: 0,
    padding: 0,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 16,
    fontSize: 16,
    lineHeight: 26,
    color: '#e1e1e1',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  strong: {
    fontWeight: '700',
    color: '#ffffff',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  em: {
    fontStyle: 'italic',
    color: '#d1d1d1',
    flexShrink: 1,
    flexWrap: 'wrap',
  },
  bullet_list: {
    marginTop: 12,
    marginBottom: 18,
  },
  ordered_list: {
    marginTop: 12,
    marginBottom: 18,
  },
  list_item: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  list_item_content: {
    flex: 1,
    flexDirection: 'column',
  },
  bullet_list_icon: {
    color: '#10b981',
    fontSize: 18,
    marginRight: 10,
    lineHeight: 26,
  },
  ordered_list_icon: {
    color: '#3b82f6',
    fontSize: 16,
    marginRight: 10,
    lineHeight: 26,
  },
  table: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    marginVertical: 18,
    backgroundColor: '#1a1a1a',
  },
  thead: {
    backgroundColor: '#0f0f0f',
  },
  tbody: {},
  tr: {
    borderBottomWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
  },
  th: {
    flex: 1,
    padding: 14,
    fontWeight: '700',
    color: '#10b981',
    fontSize: 15,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  td: {
    flex: 1,
    padding: 14,
    color: '#e1e1e1',
    fontSize: 15,
    borderRightWidth: 1,
    borderColor: '#333',
  },
  code_inline: {
    backgroundColor: '#1a1a1a',
    color: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 5,
    fontSize: 15,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  code_block: {
    backgroundColor: '#1a1a1a',
    color: '#10b981',
    padding: 16,
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  fence: {
    backgroundColor: '#1a1a1a',
    color: '#e1e1e1',
    padding: 16,
    borderRadius: 10,
    fontSize: 14,
    marginVertical: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  blockquote: {
    backgroundColor: '#1a1a1a',
    borderLeftWidth: 5,
    borderLeftColor: '#3b82f6',
    paddingLeft: 16,
    paddingVertical: 12,
    marginVertical: 16,
    fontStyle: 'italic',
  },
  hr: {
    backgroundColor: '#333',
    height: 1,
    marginVertical: 24,
  },
  text: {
    flexShrink: 1,
    flexWrap: 'wrap',
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d0d',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  conceptDocumentContainer: {
    backgroundColor: 'transparent',
    paddingVertical: 20,
  },
  conceptDocumentMobile: {
    width: '100%',
  },
  conceptDocumentWeb: {
    width: '100%',
    maxWidth: 1000,
    alignSelf: 'center',
    paddingHorizontal: 32,
  },
  markdownContentMobile: {
    width: '100%',
  },
  markdownContentWeb: {
    width: '100%',
  },
});

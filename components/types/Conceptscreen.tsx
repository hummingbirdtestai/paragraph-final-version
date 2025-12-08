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

function extractMarkdownFromConcept(conceptField: string): string {
  if (!conceptField) return '';

  let cleaned = conceptField.trim();

  // Remove leading fenced code blocks with various formats
  // Handles: ```markdown, ```md, ```, with optional whitespace
  cleaned = cleaned.replace(/^```\s*(markdown|md)?\s*\n?/i, '');

  // Remove trailing fenced code blocks
  cleaned = cleaned.replace(/\n?\s*```\s*$/g, '');

  // Handle cases where there might be multiple fence markers
  // (in case content was double-wrapped)
  cleaned = cleaned.replace(/^```\s*(markdown|md)?\s*\n?/i, '');
  cleaned = cleaned.replace(/\n?\s*```\s*$/g, '');

  return cleaned.trim();
}

// Common emoji bullets used in medical content
const EMOJI_BULLETS = ['🔷', '🔶', '🔹', '🔸', '✔️', '✅', '⭐', '💡', '🎯', '📌', '▪️', '▫️', '◾', '◽', '●', '○'];

// Check if text starts with an emoji bullet
function startsWithEmojiBullet(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  return EMOJI_BULLETS.some(emoji => trimmed.startsWith(emoji));
}

// Extract text content from React nodes
function getTextContent(children: any): string {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(getTextContent).join('');
  }
  if (children.props && children.props.children) {
    return getTextContent(children.props.children);
  }
  return '';
}

// Custom markdown rules to handle emoji bullets
const customMarkdownRules = {
  // Custom bullet_list_item rendering
  bullet_list_item: (node: any, children: any, parent: any, styles: any) => {
    const textContent = getTextContent(children);
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
    const textContent = getTextContent(children);
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
  const conceptContent = extractMarkdownFromConcept(item?.Concept || '');
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
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
    lineHeight: 24,
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
    marginBottom: 14,
    fontSize: 15,
    lineHeight: 24,
    color: '#e1e1e1',
  },
  strong: {
    fontWeight: '700',
    color: '#ffffff',
  },
  em: {
    fontStyle: 'italic',
    color: '#d1d1d1',
  },
  bullet_list: {
    marginTop: 8,
    marginBottom: 14,
  },
  ordered_list: {
    marginTop: 8,
    marginBottom: 14,
  },
  list_item: {
    marginBottom: 8,
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
    lineHeight: 24,
  },
  ordered_list_icon: {
    color: '#3b82f6',
    fontSize: 14,
    marginRight: 8,
    lineHeight: 24,
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
});

const markdownStylesWeb = StyleSheet.create({
  body: {
    color: '#e1e1e1',
    fontSize: 16,
    lineHeight: 26,
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
  },
  strong: {
    fontWeight: '700',
    color: '#ffffff',
  },
  em: {
    fontStyle: 'italic',
    color: '#d1d1d1',
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

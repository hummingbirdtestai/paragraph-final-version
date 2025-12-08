import React, { useRef, useEffect } from 'react';
import {
  View,
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

  if (cleaned.startsWith('```markdown\n')) {
    cleaned = cleaned.replace(/^```markdown\n/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\n?/, '');
  }

  if (cleaned.endsWith('```')) {
    cleaned = cleaned.replace(/```$/, '');
  }

  return cleaned.trim();
}

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
  },
  bullet_list_icon: {
    color: '#10b981',
    fontSize: 16,
    marginRight: 8,
  },
  ordered_list_icon: {
    color: '#3b82f6',
    fontSize: 14,
    marginRight: 8,
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
  },
  bullet_list_icon: {
    color: '#10b981',
    fontSize: 18,
    marginRight: 10,
  },
  ordered_list_icon: {
    color: '#3b82f6',
    fontSize: 16,
    marginRight: 10,
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

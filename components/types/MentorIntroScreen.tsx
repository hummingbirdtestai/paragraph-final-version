import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Bookmark } from 'lucide-react-native';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface MentorIntroScreenProps {
  data: {
    mentor_intro: string;
    id?: string;
    subject_id?: string;
  };
  showBookmark?: boolean; // 👈 NEW PROP
}

export default function MentorIntroScreen({ data, showBookmark = false }: MentorIntroScreenProps) {
  const { user } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);

  const elementId = data?.id || data?.subject_id;

  // ✨ Animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();
  }, []);

  // 🟢 Fetch initial bookmark only if enabled
  useEffect(() => {
    if (!showBookmark || !user?.id || !elementId) {
      setLoading(false);
      return;
    }

    const fetchBookmark = async () => {
      try {
        const { data, error } = await supabase
          .from('student_flashcard_bookmark')
          .select('is_bookmark')
          .eq('student_id', user.id)
          .eq('element_id', elementId)
          .eq('type', 'mentor_reply')
          .maybeSingle();

        if (error) throw error;
        setIsBookmarked(!!data?.is_bookmark);
      } catch (err) {
        console.error('⚠️ Fetch bookmark failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmark();
  }, [showBookmark, user?.id, elementId]);

  // 🔄 Toggle bookmark only if enabled
  const toggleBookmark = async () => {
    console.log("🟢 toggleBookmark clicked:", { user: user?.id, elementId, isBookmarked });

    if (!showBookmark || !user?.id || !elementId) return;

    const newStatus = !isBookmarked;
    setIsBookmarked(newStatus);

    try {
      const { data, error } = await supabase.rpc('toggle_flashcard_bookmark', {
        p_student_id: user.id,
        p_element_id: elementId,
        p_type: 'mentor_reply',
        p_is_bookmark: newStatus,
      });

      if (error) throw error;
      console.log('✅ Bookmark toggled:', data);
    } catch (err) {
      console.error('💥 toggleBookmark failed:', err);
      setIsBookmarked(!newStatus);
    }
  };

  return (
    <Animated.View
      style={[
        styles.mentorBubble,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {/* 🔖 Bookmark icon (only if enabled) */}
      {showBookmark && (
        <Pressable onPress={toggleBookmark} style={styles.bookmarkButton}>
          {loading ? (
            <ActivityIndicator size="small" color="#999" />
          ) : (
            <Bookmark
              size={20}
              color={isBookmarked ? '#facc15' : '#6b7280'}
              fill={isBookmarked ? '#facc15' : 'transparent'}
            />
          )}
        </Pressable>
      )}

      {renderMarkupText(data?.mentor_intro || '', styles.mentorText)}
    </Animated.View>
  );
}

// 🧠 Text Parser (unchanged)
function renderMarkupText(content: string, baseStyle: any) {
  const lines = (content || '').split('\n');
  return (
    <Text style={baseStyle}>
      {lines.map((line, idx) => (
        <React.Fragment key={idx}>
          {parseInlineMarkup(line)}
          {idx < lines.length - 1 && '\n'}
        </React.Fragment>
      ))}
    </Text>
  );
}

function parseInlineMarkup(text: string) {
  const parts: React.ReactNode[] = [];
  let key = 0;
  const patterns = [
    { regex: /\*\*_(.+?)_\*\*/g, style: styles.boldItalic },
    { regex: /\*\*(.+?)\*\*/g, style: styles.bold },
    { regex: /_(.+?)_/g, style: styles.italic },
    { regex: /\*(.+?)\*/g, style: styles.italic },
  ];

  let remaining = text;
  while (remaining.length > 0) {
    let earliest = null;
    let matchData: RegExpMatchArray | null = null;
    let style = null;

    for (const p of patterns) {
      const m = p.regex.exec(remaining);
      if (m && (earliest === null || m.index < earliest)) {
        earliest = m.index;
        matchData = m;
        style = p.style;
      }
      p.regex.lastIndex = 0;
    }

    if (matchData && earliest !== null && earliest > -1) {
      if (earliest > 0)
        parts.push(<Text key={key++}>{remaining.substring(0, earliest)}</Text>);
      parts.push(
        <Text key={key++} style={style}>
          {matchData[1]}
        </Text>
      );
      remaining = remaining.substring(earliest + matchData[0].length);
    } else {
      parts.push(<Text key={key++}>{remaining}</Text>);
      break;
    }
  }
  return <>{parts}</>;
}

// 🎨 Styles (same)
const styles = StyleSheet.create({
  mentorBubble: {
    alignSelf: 'flex-start',
    maxWidth: '85%',
    backgroundColor: '#1a3a2e',
    borderRadius: 16,
    borderTopLeftRadius: 4,
    borderWidth: 1.5,
    borderColor: '#25D366',
    padding: 14,
    marginVertical: 8,
    shadowColor: '#25D366',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
    position: 'relative',
  },
  mentorText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e1e1e1',
  },
  bold: { fontWeight: '700', color: '#ffffff' },
  italic: { fontStyle: 'italic', color: '#d4d4d4' },
  boldItalic: { fontWeight: '700', fontStyle: 'italic', color: '#ffffff' },
bookmarkButton: {
  position: 'absolute',
  top: 10,
  right: 10,
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: 'rgba(30,30,30,0.8)',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,              // ✅ add this
  elevation: 10,           // ✅ for Android
},
});

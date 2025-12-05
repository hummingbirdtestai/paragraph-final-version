import { View, Text, StyleSheet, Modal, Pressable, ActivityIndicator } from 'react-native';
import { Sparkles, X, Check } from 'lucide-react-native';
import { useState, useEffect } from 'react';

interface AIRewriteSuggestionProps {
  visible: boolean;
  onClose: () => void;
  originalContent: string;
  onAccept: (rewrittenContent: string) => void;
}

export default function AIRewriteSuggestion({
  visible,
  onClose,
  originalContent,
  onAccept,
}: AIRewriteSuggestionProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [improvements, setImprovements] = useState<string[]>([]);

  useEffect(() => {
    if (visible && originalContent) {
      generateRewrite();
    }
  }, [visible, originalContent]);

  const generateRewrite = () => {
    setIsGenerating(true);

    setTimeout(() => {
      const mockRewrite = improveContent(originalContent);
      setRewrittenContent(mockRewrite);
      setImprovements([
        'Improved clarity and conciseness',
        'Enhanced professional tone',
        'Better grammar and structure',
      ]);
      setIsGenerating(false);
    }, 1500);
  };

  const improveContent = (content: string): string => {
    const improvements = [
      { from: /\bi'm\b/gi, to: "I'm" },
      { from: /\bim\b/gi, to: "I'm" },
      { from: /\bdont\b/gi, to: "don't" },
      { from: /\bcant\b/gi, to: "can't" },
      { from: /\bwont\b/gi, to: "won't" },
    ];

    let improved = content;
    improvements.forEach(({ from, to }) => {
      improved = improved.replace(from, to);
    });

    if (!improved.endsWith('.') && !improved.endsWith('!') && !improved.endsWith('?')) {
      improved += '.';
    }

    improved = improved.charAt(0).toUpperCase() + improved.slice(1);

    return improved;
  };

  const handleAccept = () => {
    onAccept(rewrittenContent);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Sparkles size={20} color="#25D366" strokeWidth={2} />
              <Text style={styles.title}>AI Rewrite Suggestion</Text>
            </View>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color="#94a3b8" />
            </Pressable>
          </View>

          {isGenerating ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#25D366" />
              <Text style={styles.loadingText}>Analyzing and improving your post...</Text>
            </View>
          ) : (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Original</Text>
                <View style={styles.textBox}>
                  <Text style={styles.originalText}>{originalContent}</Text>
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>AI Suggestion</Text>
                <View style={[styles.textBox, styles.suggestionBox]}>
                  <Text style={styles.suggestionText}>{rewrittenContent}</Text>
                </View>
              </View>

              <View style={styles.improvements}>
                <Text style={styles.improvementsTitle}>Improvements Made:</Text>
                {improvements.map((improvement, index) => (
                  <View key={index} style={styles.improvementItem}>
                    <Check size={16} color="#25D366" strokeWidth={2.5} />
                    <Text style={styles.improvementText}>{improvement}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.footer}>
                <Pressable style={styles.cancelButton} onPress={onClose}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.acceptButton} onPress={handleAccept}>
                  <Check size={18} color="#0b141a" strokeWidth={2.5} />
                  <Text style={styles.acceptButtonText}>Accept Suggestion</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  content: {
    backgroundColor: '#111b21',
    borderRadius: 16,
    maxHeight: '85%',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2329',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    padding: 60,
    alignItems: 'center',
    gap: 20,
  },
  loadingText: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textBox: {
    backgroundColor: '#1a2329',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2a3942',
  },
  suggestionBox: {
    backgroundColor: '#1a2f29',
    borderColor: '#25D366',
  },
  originalText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#94a3b8',
  },
  suggestionText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#e5e7eb',
  },
  improvements: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  improvementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  improvementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 6,
  },
  improvementText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#1a2329',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1a2329',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#94a3b8',
  },
  acceptButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#25D366',
  },
  acceptButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0b141a',
  },
});

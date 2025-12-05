import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import {
  CheckCircle,
  Circle,
  BookmarkIcon,
  XCircle,
} from 'lucide-react-native';

type QuestionStatus = 'correct' | 'wrong' | 'marked' | 'skipped' | 'unanswered';

type FilterType = 'all' | 'wrong' | 'correct' | 'skipped' | 'unanswered' | 'marked';

interface MCQItem {
  status: QuestionStatus;
  serial_number: number;
  react_order_final: number;
  is_correct?: boolean;
  student_answer?: string | null;
}

interface ReviewPaletteCounts {
  correct: number;
  wrong: number;
  skipped: number;
  marked: number;
  unanswered: number;
}

interface MockTestReviewPaletteProps {
  mcqs: MCQItem[];
  counts: ReviewPaletteCounts;
  onSelectQuestion: (reactOrderFinal: number, category: FilterType) => void;
  isVisible?: boolean;
  onClose?: () => void;
  currentReactOrder?: number;
}

export default function MockTestReviewPalette({
  mcqs,
  counts,
  onSelectQuestion,
  isVisible = false,
  onClose,
  currentReactOrder,
}: MockTestReviewPaletteProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredMCQs, setFilteredMCQs] = useState<MCQItem[]>(mcqs);

  useEffect(() => {
    console.log("🎨 REVIEW PALETTE INPUT:", mcqs);
    console.log("📊 REVIEW PALETTE COUNTS:", counts);
  }, [mcqs, counts]);

  useEffect(() => {
    applyFilter(activeFilter);
  }, [activeFilter, mcqs]);

  const applyFilter = (filter: FilterType) => {
    let filtered = [...mcqs];

    switch (filter) {
      case 'wrong':
        filtered = mcqs.filter(q => q.is_correct === false || q.status === 'wrong');
        break;
      case 'correct':
        filtered = mcqs.filter(q => q.is_correct === true || q.status === 'correct');
        break;
      case 'skipped':
        filtered = mcqs.filter(q => q.status === 'skipped');
        break;
      case 'unanswered':
        filtered = mcqs.filter(q =>
          q.status === 'unanswered' ||
          q.status === null ||
          q.student_answer === null ||
          q.student_answer === "" ||
          q.is_correct === null
        );
        break;
      case 'marked':
        filtered = mcqs.filter(q => q.status === 'marked');
        break;
      case 'all':
      default:
        filtered = mcqs;
        break;
    }

    setFilteredMCQs(filtered);
  };

  const getStatusColor = (mcq: MCQItem) => {
    if (mcq.is_correct === true || mcq.status === 'correct')
      return '#10b981';
  
    if (mcq.is_correct === false || mcq.status === 'wrong')
      return '#ef4444';
  
    if (mcq.status === 'marked')
      return '#f59e0b';
  
    if (mcq.status === 'skipped')
      return '#fb923c';
  
    if (
      mcq.status === 'unanswered' ||
      mcq.status === null ||
      mcq.student_answer === null ||
      mcq.student_answer === "" ||
      mcq.is_correct === null
    )
      return '#64748b';
  
    // ⭐ DEFAULT – prevent undefined
    return '#64748b';
  };


  const getStatusIcon = (mcq: MCQItem, size: number = 8) => {
    if (mcq.is_correct === true || mcq.status === 'correct') {
      return <CheckCircle size={size} color="#10b981" />;
    }
    if (mcq.is_correct === false || mcq.status === 'wrong') {
      return <XCircle size={size} color="#ef4444" />;
    }
    if (mcq.status === 'marked') {
      return <BookmarkIcon size={size} color="#f59e0b" />;
    }
    if (mcq.status === 'skipped') {
      return <XCircle size={size} color="#fb923c" />;
    }
    if (
      mcq.status === 'unanswered' ||
      mcq.status === null ||
      mcq.student_answer === null ||
      mcq.student_answer === "" ||
      mcq.is_correct === null
    )
    return <Circle size={size} color="#64748b" />;
  };

  const handleQuestionSelect = (mcq: MCQItem) => {
    console.log("🟦 REVIEW PALETTE BUBBLE CLICK:", {
      serial_number: mcq.serial_number,
      react_order_final: mcq.react_order_final,
      status: mcq.status,
      category: activeFilter
    });

    onSelectQuestion(mcq.react_order_final, activeFilter);

    if (onClose) onClose();
  };

  const NavigationContent = () => (
    <View style={styles.navigationContainer}>
      <View style={styles.compactHeader}>
        <View style={styles.statsCompact}>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#10b981' }]} /> {counts.correct}
          </Text>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#ef4444' }]} /> {counts.wrong}
          </Text>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#fb923c' }]} /> {counts.skipped}
          </Text>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#64748b' }]} /> {counts.unanswered}
          </Text>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#f59e0b' }]} /> {counts.marked}
          </Text>
        </View>
      </View>

      <View style={styles.filtersCompact}>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'all' && styles.filterChipActive]}
          onPress={() => setActiveFilter('all')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'all' && styles.filterChipTextActive]}>All</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'unanswered' && styles.filterChipActive]}
          onPress={() => setActiveFilter('unanswered')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'unanswered' && styles.filterChipTextActive]}>Unanswered</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'correct' && styles.filterChipActive]}
          onPress={() => setActiveFilter('correct')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'correct' && styles.filterChipTextActive]}>Correct</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'wrong' && styles.filterChipActive]}
          onPress={() => setActiveFilter('wrong')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'wrong' && styles.filterChipTextActive]}>Wrong</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'skipped' && styles.filterChipActive]}
          onPress={() => setActiveFilter('skipped')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'skipped' && styles.filterChipTextActive]}>Skipped</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'marked' && styles.filterChipActive]}
          onPress={() => setActiveFilter('marked')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'marked' && styles.filterChipTextActive]}>Marked</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.gridContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.questionsGrid}>
          {filteredMCQs.map((mcq) => (
            <TouchableOpacity
              key={mcq.react_order_final}
              style={[
                styles.questionBubble,
                {
                  borderColor: getStatusColor(mcq),
                  backgroundColor:
                    mcq.react_order_final === currentReactOrder
                      ? getStatusColor(mcq) + '40'
                      : 'transparent',
                  borderWidth: mcq.react_order_final === currentReactOrder ? 2 : 1,
                },
              ]}
              onPress={() => handleQuestionSelect(mcq)}
            >
              <Text
                style={[
                  styles.questionNumber,
                  { color: getStatusColor(mcq) },
                ]}
              >
                {mcq.serial_number}
              </Text>
              <View style={styles.statusIconContainer}>
                {getStatusIcon(mcq, 8)}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.legendCompact}>
        <View style={styles.legendItem}>
          <CheckCircle size={8} color="#10b981" />
          <Text style={styles.legendText}>Correct</Text>
        </View>
        <View style={styles.legendItem}>
          <XCircle size={8} color="#ef4444" />
          <Text style={styles.legendText}>Wrong</Text>
        </View>
        <View style={styles.legendItem}>
          <XCircle size={8} color="#fb923c" />
          <Text style={styles.legendText}>Skipped</Text>
        </View>
        <View style={styles.legendItem}>
          <Circle size={8} color="#64748b" />
          <Text style={styles.legendText}>Unanswered</Text>
        </View>
        <View style={styles.legendItem}>
          <BookmarkIcon size={8} color="#f59e0b" />
          <Text style={styles.legendText}>Marked</Text>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, !isMobile && styles.modalContentDesktop]}>
          <View style={styles.modalHandle} />
          {NavigationContent()}
          {onClose && (
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  navigationContainer: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsCompact: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  statCompact: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  statDotInline: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filtersCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  filterChip: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: '#1e293b',
  },
  filterChipActive: {
    backgroundColor: '#10b981',
  },
  filterChipText: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#000',
  },
  gridContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  questionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  questionBubble: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  questionNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  statusIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  legendCompact: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1e293b',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  legendText: {
    color: '#94a3b8',
    fontSize: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#000',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 12,
  },
  modalContentDesktop: {
    maxWidth: 500,
    alignSelf: 'center',
    width: '90%',
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  closeButton: {
    backgroundColor: '#1e293b',
    paddingVertical: 10,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

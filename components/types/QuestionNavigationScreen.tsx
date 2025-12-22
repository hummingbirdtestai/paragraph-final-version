//QuestionNavigationScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  useWindowDimensions,
  Platform,
} from 'react-native';
import {
  Grid3x3,
  CheckCircle,
  Circle,
  BookmarkIcon,
  XCircle,
  Clock,
  Filter,
} from 'lucide-react-native';

type QuestionStatus = 'answered' | 'marked' | 'skipped' | 'unanswered';

type FilterType = 'all' | 'marked' | 'unanswered' | 'skipped' | 'answered';

interface MCQItem {
  status: QuestionStatus;
  serial_number: number;
  react_order_final: number;
}

interface PaletteCounts {
  answered: number;
  skipped: number;
  marked: number;
  unanswered: number;
}

interface QuestionNavigationScreenProps {
  currentQuestion: number;
  mcqs: MCQItem[];
  counts: PaletteCounts;
  sectionId: string;
  timeLeft: number;
  onSelectQuestion: (sectionId: string, questionNumber: number) => void;
  isVisible?: boolean;
  onClose?: () => void;
}

export default function QuestionNavigationScreen({
  currentQuestion,
  mcqs,
  counts,
  sectionId,
  timeLeft,
  onSelectQuestion,
  isVisible = false,
  onClose,
}: QuestionNavigationScreenProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredMCQs, setFilteredMCQs] = useState<MCQItem[]>(mcqs);

  // Debug logs
  useEffect(() => {
    console.log("🎨 PALETTE INPUT:", mcqs);
    console.log("📊 PALETTE COUNTS:", counts);
  }, [mcqs, counts]);

  useEffect(() => {
    applyFilter(activeFilter);
  }, [activeFilter, mcqs]);

  const applyFilter = (filter: FilterType) => {
    let filtered = [...mcqs];

    switch (filter) {
      case 'marked':
        filtered = mcqs.filter(q => q.status === 'marked');
        break;
      case 'unanswered':
        filtered = mcqs.filter(q => q.status === 'unanswered');
        break;
      case 'skipped':
        filtered = mcqs.filter(q => q.status === 'skipped');
        break;
      case 'answered':
        filtered = mcqs.filter(q => q.status === 'answered');
        break;
      case 'all':
      default:
        filtered = mcqs;
        break;
    }

    setFilteredMCQs(filtered);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'answered':
        return '#10b981';
      case 'marked':
        return '#f59e0b';
      case 'skipped':
        return '#ef4444';
      case 'unanswered':
        return '#64748b';
      default:
        return '#64748b';
    }
  };

  const getStatusIcon = (status: QuestionStatus, size: number = 16) => {
    switch (status) {
      case 'answered':
        return <CheckCircle size={size} color="#10b981" />;
      case 'marked':
        return <BookmarkIcon size={size} color="#f59e0b" />;
      case 'skipped':
        return <XCircle size={size} color="#ef4444" />;
      case 'unanswered':
        return <Circle size={size} color="#64748b" />;
      default:
        return <Circle size={size} color="#64748b" />;
    }
  };

const handleQuestionSelect = (questionNumber: number) => {
  const selected = filteredMCQs.find(q => q.serial_number === questionNumber);
  console.log("🟦 PALETTE BUBBLE CLICK:", {
    serial_clicked: questionNumber,
    react_order_final: selected?.react_order_final,
    status: selected?.status
  });

  if (!selected) return;

  onSelectQuestion(sectionId, selected.react_order_final);

  if (onClose) onClose();
};


  const NavigationContent = () => (
    <View style={styles.navigationContainer}>
      <View style={styles.compactHeader}>
        <View style={styles.timerContainer}>
          <Clock size={16} color="#3b82f6" />
          <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
        </View>
        <View style={styles.statsCompact}>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#10b981' }]} /> {counts.answered}
          </Text>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#f59e0b' }]} /> {counts.marked}
          </Text>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#ef4444' }]} /> {counts.skipped}
          </Text>
          <Text style={styles.statCompact}>
            <View style={[styles.statDotInline, { backgroundColor: '#64748b' }]} /> {counts.unanswered}
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
          style={[styles.filterChip, activeFilter === 'marked' && styles.filterChipActive]}
          onPress={() => setActiveFilter('marked')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'marked' && styles.filterChipTextActive]}>Marked</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'unanswered' && styles.filterChipActive]}
          onPress={() => setActiveFilter('unanswered')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'unanswered' && styles.filterChipTextActive]}>Unanswered</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'skipped' && styles.filterChipActive]}
          onPress={() => setActiveFilter('skipped')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'skipped' && styles.filterChipTextActive]}>Skipped</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterChip, activeFilter === 'answered' && styles.filterChipActive]}
          onPress={() => setActiveFilter('answered')}
        >
          <Text style={[styles.filterChipText, activeFilter === 'answered' && styles.filterChipTextActive]}>Answered</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.questionsGrid}>
          {filteredMCQs.map((mcq) => (
            <TouchableOpacity
              key={mcq.serial_number}
              style={[
                styles.questionBubble,
                {
                  borderColor: getStatusColor(mcq.status),
                  backgroundColor:
                    mcq.serial_number === currentQuestion
                      ? getStatusColor(mcq.status) + '40'
                      : 'transparent',
                  borderWidth: mcq.serial_number === currentQuestion ? 2 : 1,
                },
              ]}
              onPress={() => handleQuestionSelect(mcq.serial_number)}
            >
              <Text
                style={[
                  styles.questionNumber,
                  { color: getStatusColor(mcq.status) },
                ]}
              >
                {mcq.serial_number}
              </Text>
              <View style={styles.statusIconContainer}>
                {getStatusIcon(mcq.status, 8)}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.legendCompact}>
        <View style={styles.legendItem}>
          <CheckCircle size={8} color="#10b981" />
          <Text style={styles.legendText}>Answered</Text>
        </View>
        <View style={styles.legendItem}>
          <BookmarkIcon size={8} color="#f59e0b" />
          <Text style={styles.legendText}>Marked</Text>
        </View>
        <View style={styles.legendItem}>
          <XCircle size={8} color="#ef4444" />
          <Text style={styles.legendText}>Skipped</Text>
        </View>
        <View style={styles.legendItem}>
          <Circle size={8} color="#64748b" />
          <Text style={styles.legendText}>Unanswered</Text>
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#1e293b',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  timerText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '700',
  },
  statsCompact: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
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

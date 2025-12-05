import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Zap, Brain, Clock, MessageCircle, Target, TrendingUp } from 'lucide-react-native';


const subjectData = [
  { subject: 'Microbiology', concepts: 871 },
  { subject: 'Biochemistry', concepts: 819 },
  { subject: 'Pharmacology', concepts: 815 },
  { subject: 'Pathology', concepts: 772 },
  { subject: 'Anatomy', concepts: 685 },
  { subject: 'General Medicine', concepts: 680 },
  { subject: 'Physiology', concepts: 644 },
  { subject: 'Obstetrics & Gynaecology', concepts: 634 },
  { subject: 'Community Medicine', concepts: 570 },
  { subject: 'Ophthalmology', concepts: 530 },
  { subject: 'Pediatrics', concepts: 514 },
  { subject: 'General Surgery', concepts: 400 },
  { subject: 'Orthopedics', concepts: 360 },
  { subject: 'Forensic Medicine', concepts: 353 },
  { subject: 'Psychiatry', concepts: 330 },
  { subject: 'ENT', concepts: 322 },
  { subject: 'Radiology', concepts: 222 },
  { subject: 'Dermatology', concepts: 222 },
  { subject: 'Anesthesia', concepts: 217 },
];

export default function PracticeScreen({ onSignUp }: { onSignUp: () => void }) {
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.section}>
          <Text style={styles.mainTitle}>The Revolution in NEET-PG Preparation</Text>

          <View style={styles.taglineContainer}>
            <Zap size={20} color="#00ff88" style={styles.icon} />
            <Text style={styles.tagline}>
              <Text style={styles.bold}>Hyperpersonalised. Adaptive. Ruthlessly Efficient.</Text>
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Welcome to <Text style={styles.bold}>Paragraph</Text> — India's only AI-driven Adaptive Learning System designed exclusively for NEET-PG, INI-CET, and NEXT.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>10,000 Concept Capsules</Text> distilled from <Text style={styles.bold}>10,000 real NEET-PG PYQs (2013–2025)</Text> — each clinically reasoned, high-yield, and mapped to how the exam actually tests you.
          </Text>

          {/* CTA Button 1 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Sign Up / Start Journey</Text>
          </TouchableOpacity>
        </View>

        {/* Learn What Matters Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Brain size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>Learn What Matters — Waste Nothing.</Text>
          </View>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Every Concept =</Text>
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              • <Text style={styles.bold}>Core logic behind the PYQ</Text> — the "why" that differentiates toppers.
            </Text>
            <Text style={styles.bullet}>
              • <Text style={styles.bold}>5 High-Yield Recall Pearls</Text> — pure retention science.
            </Text>
            <Text style={styles.bullet}>
              • <Text style={styles.bold}>1 Clinical MCQ</Text> in real exam format to check your grip immediately.
            </Text>
          </View>

          <View style={styles.highlightBox}>
            <Clock size={18} color="#00ff88" style={styles.icon} />
            <Text style={styles.highlight}>
              <Text style={styles.bold}>Just 3 minutes per concept</Text> (2 to learn, 1 to test).
            </Text>
          </View>

          <Text style={styles.paragraph}>
            That's <Text style={styles.bold}>500 hours</Text> of laser-focused adaptive mastery — not passive watching.
          </Text>
        </View>

        {/* The Engine Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>The Engine That Learns You.</Text>
          </View>

          <Text style={styles.paragraph}>
            Paragraph continuously tracks:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              • Your <Text style={styles.bold}>completed and bookmarked concepts</Text>.
            </Text>
            <Text style={styles.bullet}>
              • <Text style={styles.bold}>Incorrect MCQs</Text> and the reasoning behind your misses.
            </Text>
            <Text style={styles.bullet}>
              • Emerging <Text style={styles.bold}>learning gaps</Text> across subjects and systems.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            AI then builds a <Text style={styles.bold}>dynamic reinforcement path</Text> — pushing exactly what you need next to reach mastery before the exam.
          </Text>
        </View>

        {/* The Mentor Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MessageCircle size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>The Mentor That Never Rests.</Text>
          </View>

          <Text style={styles.paragraph}>
            Every interaction includes a <Text style={styles.bold}>mentor dialogue</Text> — not a recorded voice.
          </Text>

          <Text style={styles.paragraph}>
            Doubts? Logic gaps? Memory hacks? Mnemonics? Tables? Differential algorithms?
          </Text>

          <Text style={styles.paragraph}>
            Your mentor explains, simplifies, and reinforces — <Text style={styles.bold}>24×7</Text> — inside your chat.
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Clinical. Conversational. Instant.</Text>
          </Text>

          {/* CTA Button 2 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Sign Up / Start Journey</Text>
          </TouchableOpacity>
        </View>

        {/* Why Paragraph Exists Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔥 Why Paragraph Exists.</Text>

          <Text style={styles.paragraph}>
            Because the traditional model is broken:
          </Text>

          <View style={styles.problemList}>
            <Text style={styles.problemItem}>
              ❌ <Text style={styles.bold}>Weekend "Marathon" Face-to-Face Classes</Text> — rushed, cramped, one-directional teaching that promises "syllabus completion" but kills depth.
            </Text>
            <Text style={styles.problemItem}>
              ❌ <Text style={styles.bold}>Overhyped Online Video Libraries</Text> — hours of monologue from so-called "national dream faculty" that overload memory and waste time.
            </Text>
            <Text style={styles.problemItem}>
              ❌ <Text style={styles.bold}>Voluminous Notes</Text> — dumped PDFs that create cognitive overload, not retention.
            </Text>
            <Text style={styles.problemItem}>
              ❌ <Text style={styles.bold}>Live Classes</Text> — postponed, fragmented, draining motivation over months.
            </Text>
            <Text style={styles.problemItem}>
              ❌ <Text style={styles.bold}>Mock Tests</Text> — unnecessarily hard, demoralising, and ignorant of your specific learning gaps.
            </Text>
          </View>

          <Text style={styles.emphasis}>
            Paragraph changes that — <Text style={styles.bold}>permanently</Text>.
          </Text>
        </View>

        {/* The New Way Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>✅ The New Way to Master NEET-PG.</Text>

          <View style={styles.featureList}>
            <Text style={styles.feature}>
              ⚙ <Text style={styles.bold}>Machine Learning + Medical Reasoning</Text> at its core.
            </Text>
            <Text style={styles.feature}>
              💡 <Text style={styles.bold}>Adaptive flow</Text> that adjusts to your performance in real time.
            </Text>
            <Text style={styles.feature}>
              📈 <Text style={styles.bold}>Progress tracking</Text> that's personal, visual, and motivating.
            </Text>
            <Text style={styles.feature}>
              💬 <Text style={styles.bold}>Mentor chat</Text> that answers instantly, clinically, and logically.
            </Text>
            <Text style={styles.feature}>
              📚 <Text style={styles.bold}>Complete 20-Subject Coverage</Text>: Anatomy → Radiology, and everything in between.
            </Text>
          </View>
        </View>

        {/* Ready to Take Control Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🚀 Ready to Take Control?</Text>

          <View style={styles.finalCTA}>
            <Target size={28} color="#00ff88" />
            <Text style={styles.finalCTAText}>Tap Start Practice</Text>
          </View>

          <Text style={styles.finalMessage}>
            No lectures. No hype. No wasted hours.
          </Text>
          <Text style={styles.finalMessage}>
            Only you, your mentor, and the mastery loop that never fails.
          </Text>
        </View>

        {/* Cognitive Load Table Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🧮 Cognitive Load by Subject (NEET-PG 2013–2025)</Text>

          <Text style={styles.tableCaption}>
            Each number = total unique PYQ-derived concepts transformed into adaptive Concept Capsules.
          </Text>

          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderCell}>🔬 Subject</Text>
            <Text style={styles.tableHeaderCellRight}>🧠 Total Concepts</Text>
          </View>

          {subjectData.map((item, index) => (
            <View
              key={index}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
              ]}
            >
              <Text style={styles.tableCell}>{item.subject}</Text>
              <Text style={styles.tableCellRight}>{item.concepts}</Text>
            </View>
          ))}

          <View style={styles.tableSummary}>
            <Text style={styles.tableSummaryText}>
              🧩 <Text style={styles.bold}>Total Cognitive Load = 10,056 Concepts</Text>
            </Text>
            <Text style={styles.tableSummaryText}>
              ⏱ <Text style={styles.bold}>≈ 30,000 Minutes → 500 Hours of Adaptive Mastery.</Text>
            </Text>
          </View>

          <Text style={styles.finalNote}>
            Each concept takes only <Text style={styles.bold}>2 minutes to understand</Text> and <Text style={styles.bold}>1 minute to test</Text> — the fastest, most structured NEET-PG learning path ever built.
          </Text>

          {/* CTA Button 3 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Sign Up / Start Journey</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 30,
  },
  section: {
    marginBottom: 40,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
    lineHeight: 36,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#0a0a0a',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88',
  },
  tagline: {
    fontSize: 18,
    color: '#00ff88',
    lineHeight: 26,
    flex: 1,
  },
  icon: {
    marginRight: 10,
  },
  paragraph: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 26,
    marginBottom: 16,
  },
  bold: {
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00ff88',
    lineHeight: 30,
    marginBottom: 16,
  },
  bulletList: {
    marginBottom: 16,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 26,
    marginBottom: 12,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f1f1a',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  highlight: {
    fontSize: 16,
    color: '#00ff88',
    lineHeight: 24,
    flex: 1,
  },
  problemList: {
    marginBottom: 20,
    paddingLeft: 8,
  },
  problemItem: {
    fontSize: 15,
    color: '#cccccc',
    lineHeight: 24,
    marginBottom: 16,
  },
  emphasis: {
    fontSize: 18,
    color: '#ffffff',
    lineHeight: 28,
    marginTop: 8,
  },
  featureList: {
    paddingLeft: 8,
  },
  feature: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 26,
    marginBottom: 14,
  },
  finalCTA: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00ff88',
  },
  finalCTAText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00ff88',
    marginLeft: 12,
  },
  finalMessage: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  tableCaption: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    padding: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88',
  },
  tableHeaderCell: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00ff88',
    flex: 1,
  },
  tableHeaderCellRight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00ff88',
    textAlign: 'right',
    width: 120,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  tableRowEven: {
    backgroundColor: '#0a0a0a',
  },
  tableRowOdd: {
    backgroundColor: '#000000',
  },
  tableCell: {
    fontSize: 15,
    color: '#cccccc',
    flex: 1,
  },
  tableCellRight: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'right',
    width: 120,
  },
  tableSummary: {
    backgroundColor: '#0f1f1a',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00ff88',
  },
  tableSummaryText: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 26,
    marginBottom: 8,
  },
  finalNote: {
    fontSize: 15,
    color: '#cccccc',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  ctaButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  spacer: {
    height: 30,
  },
});

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Zap, Brain, Clock, MessageCircle, Target, TrendingUp } from 'lucide-react-native';

const subjectData = [
  { subject: 'Pathology', decks: 1062, cards: 10620, hours: 53 },
  { subject: 'Microbiology', decks: 699, cards: 6990, hours: 35 },
  { subject: 'General Medicine', decks: 593, cards: 5930, hours: 30 },
  { subject: 'Anatomy', decks: 539, cards: 5390, hours: 27 },
  { subject: 'Physiology', decks: 431, cards: 4310, hours: 22 },
  { subject: 'Pharmacology', decks: 396, cards: 3960, hours: 20 },
  { subject: 'Surgery', decks: 336, cards: 3360, hours: 17 },
  { subject: 'Biochemistry', decks: 263, cards: 2630, hours: 13 },
  { subject: 'Forensic Medicine', decks: 256, cards: 2560, hours: 13 },
  { subject: 'Pediatrics', decks: 233, cards: 2330, hours: 12 },
  { subject: 'Obstetrics', decks: 218, cards: 2180, hours: 11 },
  { subject: 'Gynaecology', decks: 195, cards: 1950, hours: 10 },
  { subject: 'Psychiatry', decks: 192, cards: 1920, hours: 10 },
  { subject: 'Community Medicine', decks: 188, cards: 1880, hours: 9 },
  { subject: 'Radiology', decks: 183, cards: 1830, hours: 9 },
  { subject: 'ENT', decks: 168, cards: 1680, hours: 8 },
  { subject: 'Anesthesia', decks: 162, cards: 1620, hours: 8 },
  { subject: 'Dermatology', decks: 155, cards: 1550, hours: 8 },
  { subject: 'Orthopedics', decks: 141, cards: 1410, hours: 7 },
  { subject: 'Ophthalmology', decks: 200, cards: 2000, hours: 10 },
];

export default function FlashcardsScreen({ onSignUp }: { onSignUp: () => void }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktop && styles.scrollContentDesktop,
          isTablet && !isDesktop && styles.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={[styles.section, (isTablet || isDesktop) && styles.sectionFullWidth]}>
          <Text style={styles.mainTitle}>Master 20 Subjects for NEETPG — One Flashcard Deck at a Time</Text>

          <View style={styles.taglineContainer}>
            <Zap size={20} color="#00ff88" style={styles.icon} />
            <Text style={styles.tagline}>
              <Text style={styles.bold}>Self-Study. Reinforced. Guided by AI at Every Step.</Text>
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Before you even sign up, imagine having an AI Chat Mentor that walks beside you — explaining, reinforcing, and testing your recall every 3 minutes.
          </Text>

          <Text style={styles.paragraph}>
            Each Flashcard Deck (≈ 10 cards) takes only <Text style={styles.bold}>3 minutes</Text> — short enough to stay consistent, deep enough to stay unforgettable.
          </Text>

          {/* CTA Button 1 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Sign Up / Start Flashcards Journey</Text>
          </TouchableOpacity>
        </View>

        {/* Two Column Grid for Tablet/Desktop */}
        <View style={[
          (isTablet || isDesktop) && styles.gridContainer,
          isDesktop && styles.gridContainerDesktop,
        ]}>
          {/* Learn What Matters Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <Brain size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>Why Flashcards Work — Scientifically Proven</Text>
          </View>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              • Active recall strengthens memory better than rereading or watching lectures.
            </Text>
            <Text style={styles.bullet}>
              • Spaced repetition locks long-term retention through calculated revisits.
            </Text>
            <Text style={styles.bullet}>
              • Each deck condenses <Text style={styles.bold}>10 ultra-high-yield flashcards</Text> into a 3-minute mastery loop.
            </Text>
          </View>

          <View style={styles.highlightBox}>
            <Clock size={18} color="#00ff88" style={styles.icon} />
            <Text style={styles.highlight}>
              <Text style={styles.bold}>6 600 Decks · 66 000 Flashcards · 330 Hours to Mastery</Text>
            </Text>
          </View>

          <Text style={styles.paragraph}>
            That's <Text style={styles.bold}>19 subjects</Text> — from Anatomy to Radiology — all transformed into adaptive flashcard decks powered by your AI Mentor's guidance.
          </Text>
        </View>

          {/* The Engine Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>Your 24×7 AI Chat Mentor</Text>
          </View>

          <Text style={styles.paragraph}>
            Every deck becomes a conversation with understanding — not just recall.
          </Text>

          <Text style={styles.paragraph}>
            Your Mentor explains the why, corrects misconceptions, and adapts your flow based on your past answers.
          </Text>

          <Text style={styles.paragraph}>
            Whether it's a tricky mechanism in Pathology or a pathway in Biochemistry, your AI Mentor keeps testing and reteaching till recall becomes reflex.
          </Text>
        </View>

          {/* The Mentor Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <MessageCircle size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>The Self-Study Revolution</Text>
          </View>

          <Text style={styles.paragraph}>
            Forget passive watching. Flashcards put you at the center of learning — short, focused, measurable sessions that build momentum every day.
          </Text>

          <Text style={styles.paragraph}>
            Each deck mastered adds up to long-term mastery — one 3-minute sprint at a time.
          </Text>

          {/* CTA Button 2 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Sign Up / Begin Self-Study</Text>
          </TouchableOpacity>
        </View>

          {/* Ready to Take Control Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <Text style={styles.sectionTitle}>🚀 The Discipline That Builds Toppers</Text>

          <View style={styles.finalCTA}>
            <Target size={28} color="#00ff88" />
            <Text style={styles.finalCTAText}>Tap Start Flashcards</Text>
          </View>

          <Text style={styles.finalMessage}>
            No lectures. No fatigue. Only you, your recall, and your Mentor — mastering 66 000 clinical facts with total focus.
          </Text>
          <Text style={styles.finalMessage}>
            Start your self-study revolution now.
          </Text>
          </View>
        </View>

        {/* Cognitive Load Table Section */}
        <View style={[styles.section, (isTablet || isDesktop) && styles.sectionFullWidth]}>
          <Text style={styles.sectionTitle}>🧮 Flashcard Decks by Subject</Text>

          <Text style={styles.tableCaption}>
            Each deck ≈ 10 flashcards · 3 minutes per deck · 6 600 decks → 330 total hours of active recall mastery.
          </Text>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>📘 Subject</Text>
              <Text style={styles.tableHeaderCellRight}>Decks</Text>
              <Text style={styles.tableHeaderCellRight}>Cards</Text>
              <Text style={styles.tableHeaderCellRight}>⏱ Hours</Text>
            </View>

            {subjectData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                  index === subjectData.length - 1 && styles.tableRowLast
                ]}
              >
                <Text style={styles.tableCell}>{item.subject}</Text>
                <Text style={styles.tableCellRight}>{item.decks}</Text>
                <Text style={styles.tableCellRight}>{item.cards}</Text>
                <Text style={styles.tableCellRight}>{item.hours}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableSummary}>
            <Text style={styles.tableSummaryText}>
              🧩 <Text style={styles.bold}>Total = 6 600 Decks · 66 000 Flashcards</Text>
            </Text>
            <Text style={styles.tableSummaryText}>
              ⏱ <Text style={styles.bold}>≈ 330 Hours → NEET-PG Ready Recall System</Text>
            </Text>
          </View>

          {/* CTA Button 3 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Sign Up / Begin Self-Study</Text>
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
  scrollContentTablet: {
    paddingHorizontal: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  scrollContentDesktop: {
    paddingHorizontal: 60,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
  },
  section: {
    marginBottom: 40,
    ...Platform.select({
      web: {
        backgroundColor: '#000000',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#1a2332',
        padding: 24,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  sectionFullWidth: {
    width: '100%',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  gridContainerDesktop: {
    marginHorizontal: -6,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 4,
    ...Platform.select({
      web: {
        marginBottom: 8,
      },
    }),
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
    backgroundColor: '#000000',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#00ff88',
    ...Platform.select({
      web: {
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        borderWidth: 1,
        borderColor: '#1a2332',
      },
    }),
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
    marginBottom: 20,
  },
  bold: {
    fontWeight: '700',
    color: '#ffffff',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    ...Platform.select({
      web: {
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1a2332',
      },
    }),
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00ff88',
    lineHeight: 30,
    marginBottom: 16,
  },
  bulletList: {
    marginBottom: 24,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 26,
    marginBottom: 16,
  },
  highlightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0e1a20',
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#00ff88',
    ...Platform.select({
      web: {
        justifyContent: 'center',
        borderWidth: 2,
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
  highlight: {
    fontSize: 16,
    color: '#00ff88',
    lineHeight: 24,
    flex: 1,
    ...Platform.select({
      web: {
        textAlign: 'center',
      },
    }),
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
    backgroundColor: '#0d1420',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#00ff88',
    ...Platform.select({
      web: {
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
    }),
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
  tableContainer: {
    ...Platform.select({
      web: {
        borderRadius: 8,
        overflow: 'hidden',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
      },
    }),
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#121b28',
    padding: 14,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 2,
    borderBottomColor: '#00ff88',
    ...Platform.select({
      web: {
        borderWidth: 1,
        borderColor: '#1a2332',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  tableHeaderCell: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00ff88',
    flex: 2,
    textAlign: 'center',
  },
  tableHeaderCellRight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00ff88',
    textAlign: 'center',
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#121b28',
    ...Platform.select({
      web: {
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderColor: '#1a2332',
      },
    }),
  },
  tableRowEven: {
    backgroundColor: '#0d1420',
  },
  tableRowOdd: {
    backgroundColor: '#0a0e1a',
  },
  tableRowLast: {
    ...Platform.select({
      web: {
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
      },
    }),
  },
  tableCell: {
    fontSize: 15,
    color: '#cccccc',
    flex: 2,
    textAlign: 'center',
  },
  tableCellRight: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  tableSummary: {
    backgroundColor: '#0e1a20',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#00ff88',
    ...Platform.select({
      web: {
        borderWidth: 2,
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
  tableSummaryText: {
    fontSize: 16,
    color: '#cccccc',
    lineHeight: 26,
    marginBottom: 8,
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
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        transition: 'all 0.3s ease',
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

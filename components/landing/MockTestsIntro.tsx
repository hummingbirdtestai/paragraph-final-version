import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Zap, Brain, Clock, MessageCircle, Target, TrendingUp } from 'lucide-react-native';

const mockTestData = [
  { title: 'NEET-PG Mock Test 1', day: 'Thursday', date: 'Nov 6 2025' },
  { title: 'NEET-PG Mock Test 2', day: 'Sunday', date: 'Nov 9 2025' },
  { title: 'NEET-PG Mock Test 3', day: 'Thursday', date: 'Nov 13 2025' },
  { title: 'NEET-PG Mock Test 4', day: 'Sunday', date: 'Nov 16 2025' },
  { title: 'NEET-PG Mock Test 5', day: 'Thursday', date: 'Nov 20 2025' },
  { title: 'NEET-PG Mock Test 6', day: 'Sunday', date: 'Nov 23 2025' },
  { title: 'NEET-PG Mock Test 7', day: 'Thursday', date: 'Nov 27 2025' },
  { title: 'NEET-PG Mock Test 8', day: 'Sunday', date: 'Nov 30 2025' },
  { title: 'NEET-PG Mock Test 9', day: 'Thursday', date: 'Dec 4 2025' },
  { title: 'NEET-PG Mock Test 10', day: 'Sunday', date: 'Dec 7 2025' },
  { title: 'NEET-PG Mock Test 11', day: 'Thursday', date: 'Dec 11 2025' },
  { title: 'NEET-PG Mock Test 12', day: 'Sunday', date: 'Dec 14 2025' },
  { title: 'NEET-PG Mock Test 13', day: 'Thursday', date: 'Dec 18 2025' },
  { title: 'NEET-PG Mock Test 14', day: 'Sunday', date: 'Dec 21 2025' },
  { title: 'NEET-PG Mock Test 15', day: 'Thursday', date: 'Dec 25 2025' },
  { title: 'NEET-PG Mock Test 16', day: 'Sunday', date: 'Dec 28 2025' },
  { title: 'NEET-PG Mock Test 17', day: 'Thursday', date: 'Jan 1 2026' },
  { title: 'NEET-PG Mock Test 18', day: 'Sunday', date: 'Jan 4 2026' },
  { title: 'NEET-PG Mock Test 19', day: 'Thursday', date: 'Jan 8 2026' },
  { title: 'NEET-PG Mock Test 20', day: 'Sunday', date: 'Jan 11 2026' },
  { title: 'NEET-PG Mock Test 21', day: 'Thursday', date: 'Jan 15 2026' },
  { title: 'NEET-PG Mock Test 22', day: 'Sunday', date: 'Jan 18 2026' },
  { title: 'NEET-PG Mock Test 23', day: 'Thursday', date: 'Jan 22 2026' },
  { title: 'NEET-PG Mock Test 24', day: 'Sunday', date: 'Jan 25 2026' },
  { title: 'NEET-PG Mock Test 25', day: 'Thursday', date: 'Jan 29 2026' },
  { title: 'NEET-PG Mock Test 26', day: 'Sunday', date: 'Feb 1 2026' },
  { title: 'NEET-PG Mock Test 27', day: 'Thursday', date: 'Feb 5 2026' },
  { title: 'NEET-PG Mock Test 28', day: 'Sunday', date: 'Feb 8 2026' },
  { title: 'NEET-PG Mock Test 29', day: 'Thursday', date: 'Feb 12 2026' },
  { title: 'NEET-PG Mock Test 30', day: 'Sunday', date: 'Feb 15 2026' },
  { title: 'NEET-PG Mock Test 31', day: 'Thursday', date: 'Feb 19 2026' },
  { title: 'NEET-PG Mock Test 32', day: 'Sunday', date: 'Feb 22 2026' },
  { title: 'NEET-PG Mock Test 33', day: 'Thursday', date: 'Feb 26 2026' },
  { title: 'NEET-PG Mock Test 34', day: 'Sunday', date: 'Mar 1 2026' },
  { title: 'NEET-PG Mock Test 35', day: 'Thursday', date: 'Mar 5 2026' },
  { title: 'NEET-PG Mock Test 36', day: 'Sunday', date: 'Mar 8 2026' },
  { title: 'NEET-PG Mock Test 37', day: 'Thursday', date: 'Mar 12 2026' },
  { title: 'NEET-PG Mock Test 38', day: 'Sunday', date: 'Mar 15 2026' },
  { title: 'NEET-PG Mock Test 39', day: 'Thursday', date: 'Mar 19 2026' },
  { title: 'NEET-PG Mock Test 40', day: 'Sunday', date: 'Mar 22 2026' },
  { title: 'NEET-PG Mock Test 41', day: 'Thursday', date: 'Mar 26 2026' },
  { title: 'NEET-PG Mock Test 42', day: 'Sunday', date: 'Mar 29 2026' },
  { title: 'NEET-PG Mock Test 43', day: 'Thursday', date: 'Apr 2 2026' },
  { title: 'NEET-PG Mock Test 44', day: 'Sunday', date: 'Apr 5 2026' },
  { title: 'NEET-PG Mock Test 45', day: 'Thursday', date: 'Apr 9 2026' },
  { title: 'NEET-PG Mock Test 46', day: 'Sunday', date: 'Apr 12 2026' },
  { title: 'NEET-PG Mock Test 47', day: 'Thursday', date: 'Apr 16 2026' },
  { title: 'NEET-PG Mock Test 48', day: 'Sunday', date: 'Apr 19 2026' },
  { title: 'NEET-PG Mock Test 49', day: 'Thursday', date: 'Apr 23 2026' },
  { title: 'NEET-PG Mock Test 50', day: 'Sunday', date: 'Apr 26 2026' },
  { title: 'NEET-PG Mock Test 51', day: 'Thursday', date: 'Apr 30 2026' },
  { title: 'NEET-PG Mock Test 52', day: 'Sunday', date: 'May 3 2026' },
  { title: 'NEET-PG Mock Test 53', day: 'Thursday', date: 'May 7 2026' },
  { title: 'NEET-PG Mock Test 54', day: 'Sunday', date: 'May 10 2026' },
  { title: 'NEET-PG Mock Test 55', day: 'Thursday', date: 'May 14 2026' },
  { title: 'NEET-PG Mock Test 56', day: 'Sunday', date: 'May 17 2026' },
  { title: 'NEET-PG Mock Test 57', day: 'Thursday', date: 'May 21 2026' },
  { title: 'NEET-PG Mock Test 58', day: 'Sunday', date: 'May 24 2026' },
  { title: 'NEET-PG Mock Test 59', day: 'Thursday', date: 'May 28 2026' },
  { title: 'NEET-PG Mock Test 60', day: 'Sunday', date: 'May 31 2026' },
  { title: 'NEET-PG Mock Test 61', day: 'Thursday', date: 'Jun 4 2026' },
  { title: 'NEET-PG Mock Test 62', day: 'Sunday', date: 'Jun 7 2026' },
  { title: 'NEET-PG Mock Test 63', day: 'Thursday', date: 'Jun 11 2026' },
  { title: 'NEET-PG Mock Test 64', day: 'Sunday', date: 'Jun 14 2026' },
  { title: 'NEET-PG Mock Test 65', day: 'Thursday', date: 'Jun 18 2026' },
  { title: 'NEET-PG Mock Test 66', day: 'Sunday', date: 'Jun 21 2026' },
  { title: 'NEET-PG Mock Test 67', day: 'Thursday', date: 'Jun 25 2026' },
  { title: 'NEET-PG Mock Test 68', day: 'Sunday', date: 'Jun 28 2026' },
  { title: 'NEET-PG Mock Test 69', day: 'Thursday', date: 'Jul 2 2026' },
  { title: 'NEET-PG Mock Test 70', day: 'Sunday', date: 'Jul 5 2026' },
  { title: 'NEET-PG Mock Test 71', day: 'Thursday', date: 'Jul 9 2026' },
  { title: 'NEET-PG Mock Test 72', day: 'Sunday', date: 'Jul 12 2026' },
  { title: 'NEET-PG Mock Test 73', day: 'Thursday', date: 'Jul 16 2026' },
  { title: 'NEET-PG Mock Test 74', day: 'Sunday', date: 'Jul 19 2026' },
  { title: 'NEET-PG Mock Test 75', day: 'Thursday', date: 'Jul 23 2026' },
  { title: 'NEET-PG Mock Test 76', day: 'Sunday', date: 'Jul 26 2026' },
  { title: 'NEET-PG Mock Test 77', day: 'Thursday', date: 'Jul 30 2026' },
  { title: 'NEET-PG Mock Test 78', day: 'Sunday', date: 'Aug 2 2026' },
  { title: 'NEET-PG Mock Test 79', day: 'Thursday', date: 'Aug 6 2026' },
  { title: 'NEET-PG Mock Test 80', day: 'Sunday', date: 'Aug 9 2026' },
  { title: 'NEET-PG Mock Test 81', day: 'Thursday', date: 'Aug 13 2026' },
  { title: 'NEET-PG Mock Test 82', day: 'Sunday', date: 'Aug 16 2026' },
  { title: 'NEET-PG Mock Test 83', day: 'Thursday', date: 'Aug 20 2026' },
  { title: 'NEET-PG Mock Test 84', day: 'Sunday', date: 'Aug 23 2026' },
  { title: 'NEET-PG Mock Test 85', day: 'Thursday', date: 'Aug 27 2026' },
  { title: 'NEET-PG Mock Test 86', day: 'Sunday', date: 'Aug 30 2026' },
  { title: 'NEET-PG Mock Test 87', day: 'Thursday', date: 'Sep 3 2026' },
  { title: 'NEET-PG Mock Test 88', day: 'Sunday', date: 'Sep 6 2026' },
  { title: 'NEET-PG Mock Test 89', day: 'Thursday', date: 'Sep 10 2026' },
  { title: 'NEET-PG Mock Test 90', day: 'Sunday', date: 'Sep 13 2026' },
  { title: 'NEET-PG Mock Test 91', day: 'Thursday', date: 'Sep 17 2026' },
  { title: 'NEET-PG Mock Test 92', day: 'Sunday', date: 'Sep 20 2026' },
  { title: 'NEET-PG Mock Test 93', day: 'Thursday', date: 'Sep 24 2026' },
  { title: 'NEET-PG Mock Test 94', day: 'Sunday', date: 'Sep 27 2026' },
  { title: 'NEET-PG Mock Test 95', day: 'Thursday', date: 'Oct 1 2026' },
  { title: 'NEET-PG Mock Test 96', day: 'Sunday', date: 'Oct 4 2026' },
  { title: 'NEET-PG Mock Test 97', day: 'Thursday', date: 'Oct 8 2026' },
  { title: 'NEET-PG Mock Test 98', day: 'Sunday', date: 'Oct 11 2026' },
  { title: 'NEET-PG Mock Test 99', day: 'Thursday', date: 'Oct 15 2026' },
  { title: 'NEET-PG Mock Test 100', day: 'Sunday', date: 'Oct 18 2026' },
];

export default function MockTestsLanding({ onSignUp }: { onSignUp: () => void }) {
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
          <Text style={styles.mainTitle}>The NEET-PG Simulator — 100 Predictive Mock Tests That Think Like the Examiner</Text>

          <View style={styles.taglineContainer}>
            <Zap size={20} color="#00ff88" style={styles.icon} />
            <Text style={styles.tagline}>
              <Text style={styles.bold}>AI-Curated. Data-Trained. Clinically Real.</Text>
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Every Thursday and Sunday — two full-length NEET-PG mock tests per week —
          </Text>

          <Text style={styles.paragraph}>
            for 50 weeks a year, you complete 100 machine-generated predictive simulations built from real NEET-PG DNA.
          </Text>

          <Text style={styles.paragraph}>
            Each mock test mirrors the pattern, pressure, and precision of the real exam —
          </Text>

          <Text style={styles.paragraph}>
            <Text style={styles.bold}>300 MCQs · 3 Hours 30 Minutes · Authentic difficulty and distribution.</Text>
          </Text>

          {/* CTA Button 1 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Start Mock Test</Text>
          </TouchableOpacity>
        </View>

        {/* Two Column Grid for Tablet/Desktop */}
        <View style={[
          (isTablet || isDesktop) && styles.gridContainer,
          isDesktop && styles.gridContainerDesktop,
        ]}>
          {/* Real Exam Pressure Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <Brain size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>Real Exam Pressure — Real Learning</Text>
          </View>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              Each test can be attempted in one continuous stretch or intermittently, depending on your hospital duties or shifts.
            </Text>
            <Text style={styles.bullet}>
              Your timer automatically remembers where you paused, so you can resume seamlessly without losing time or momentum.
            </Text>
            <Text style={styles.bullet}>
              You're not just practicing questions — you're training endurance, judgment, and strategy under authentic exam stress.
            </Text>
          </View>

          <View style={styles.highlightBox}>
            <Clock size={18} color="#00ff88" style={styles.icon} />
            <Text style={styles.highlight}>
              <Text style={styles.bold}>No waiting for live "discussion sessions." No dependency on faculty.</Text>
            </Text>
          </View>
        </View>

          {/* AI Mentor Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <MessageCircle size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>AI Mentor: Your Personal Discussion Room</Text>
          </View>

          <Text style={styles.paragraph}>
            After every test, the AI Mentor breaks down every single MCQ with you —
          </Text>

          <Text style={styles.paragraph}>
            explaining why each option is right or wrong, connecting the reasoning to core concepts, and turning every mistake into mastery.
          </Text>

          <Text style={styles.paragraph}>
            Every test becomes your own instant, adaptive teaching session — powered by logic, not lectures.
          </Text>
        </View>

          {/* Why These 100 Tests Matter Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>Why These 100 Tests Matter</Text>
          </View>

          <Text style={styles.paragraph}>
            Unlike the dime-a-dozen mock test series flooding the market,
          </Text>

          <Text style={styles.paragraph}>
            Paragraph's NEET-PG Mock Tests are machine-learned and data-validated.
          </Text>

          <Text style={styles.paragraph}>
            They're generated through <Text style={styles.bold}>Predictive Analysis of 10 000 NEET-PG MCQs (2013 – 2025)</Text> —
          </Text>

          <Text style={styles.paragraph}>
            focusing on the question-writing style, distractor logic, image patterns, and clinical triggers used by actual NEET-PG examiners.
          </Text>

          <Text style={styles.paragraph}>
            That means every test you take is not random — it's probabilistically close to what the exam will actually test next.
          </Text>
        </View>

          {/* Smarter Every Week Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <Brain size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>Smarter Every Week</Text>
          </View>

          <Text style={styles.paragraph}>
            The AI Learning Engine constantly tracks:
          </Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              The topics and systems you repeatedly miss.
            </Text>
            <Text style={styles.bullet}>
              Your weak zones and fatigue points under time pressure.
            </Text>
            <Text style={styles.bullet}>
              The recall decay between two mock tests.
            </Text>
            <Text style={styles.bullet}>
              The subject-wise score evolution over 100 sessions.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Then it builds a personalized reinforcement schedule — showing you exactly
          </Text>

          <Text style={styles.paragraph}>
            what to revise today, this week, and before the next mock so you never fall behind the curve.
          </Text>

          <Text style={styles.paragraph}>
            You're not competing with others —
          </Text>

          <Text style={styles.paragraph}>
            you're competing with your previous performance, climbing steadily toward perfection.
          </Text>

          {/* CTA Button 2 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Start Mock Test</Text>
          </TouchableOpacity>
        </View>

          {/* The Final Race Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <Text style={styles.sectionTitle}>The Final Race</Text>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              100 Mock Tests — every Thursday & Sunday
            </Text>
            <Text style={styles.bullet}>
              3 Hours 30 Minutes per test (pause-resume enabled)
            </Text>
            <Text style={styles.bullet}>
              AI Mentor Review after every question
            </Text>
            <Text style={styles.bullet}>
              Learning-Gap Feedback Loop until 100 % ready
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Each test pushes you one step closer to D-Day —
          </Text>

          <Text style={styles.paragraph}>
            the real NEET-PG, where there are no surprises left, only confidence.
          </Text>
        </View>

          {/* Your Next Step Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <Text style={styles.sectionTitle}>Your Next Step</Text>

          <View style={styles.finalCTA}>
            <Target size={28} color="#00ff88" />
            <Text style={styles.finalCTAText}>Tap "Start Mock Test"</Text>
          </View>

          <Text style={styles.finalMessage}>
            and begin the journey that replaces anxiety with algorithmic precision.
          </Text>
          <Text style={styles.finalMessage}>
            100 Predictive Mocks. 1 Real Exam. Infinite Confidence.
          </Text>
          </View>
        </View>

        {/* Mock Test Schedule Table Section */}
        <View style={[styles.section, (isTablet || isDesktop) && styles.sectionFullWidth]}>
          <Text style={styles.sectionTitle}>NEET-PG Mock Test Schedule (Nov 2025 – Oct 2026)</Text>

          <Text style={styles.tableCaption}>
            Every Thursday & Sunday · 100 Full-Scale Tests · 3 h 30 min Each
          </Text>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>Test Title</Text>
              <Text style={styles.tableHeaderCellRight}>Day</Text>
              <Text style={styles.tableHeaderCellRight}>Date</Text>
            </View>

            {mockTestData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                  index === mockTestData.length - 1 && styles.tableRowLast
                ]}
              >
                <Text style={styles.tableCell}>{item.title}</Text>
                <Text style={styles.tableCellRight}>{item.day}</Text>
                <Text style={styles.tableCellRight}>{item.date}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableSummary}>
            <Text style={styles.tableSummaryText}>
              <Text style={styles.bold}>100 Predictive Mocks. 1 Real Exam. Infinite Confidence.</Text>
            </Text>
          </View>

          {/* CTA Button 3 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onSignUp}>
            <Text style={styles.ctaButtonText}>Start Mock Test</Text>
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
    backgroundColor: '#0e1a20',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
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
    flex: 1,
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
    flex: 1,
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

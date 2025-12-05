import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native';
import { Swords, Zap, Clock, Brain, Target, TrendingUp } from 'lucide-react-native';
import { BottomNav } from "@/components/navigation/BottomNav";
import LogoHeader from "@/components/common/LogoHeader";

const battleScheduleData = [
  { time: '10:00 AM', subjects: 'Anatomy, Physiology', theme: 'Foundation Systems' },
  { time: '11:00 AM', subjects: 'Biochemistry, Microbiology', theme: 'Molecules & Microbes' },
  { time: '12:00 PM', subjects: 'Pharmacology', theme: 'Mechanisms in Action' },
  { time: '1:00 PM', subjects: 'Pathology', theme: 'Diseases in Motion' },
  { time: '2:00 PM', subjects: 'Community Medicine', theme: 'Public Health Pulse' },
  { time: '3:00 PM', subjects: 'ENT, Ophthalmology, Forensic Medicine', theme: 'Sense & Law' },
  { time: '4:00 PM', subjects: 'General Medicine', theme: 'Clinical Reasoning' },
  { time: '5:00 PM', subjects: 'General Surgery', theme: 'Scalpel & Science' },
  { time: '6:00 PM', subjects: 'Obstetrics & Gynaecology', theme: 'Life & Delivery' },
  { time: '7:00 PM', subjects: 'Orthopedics, Pediatrics', theme: 'Growth & Motion' },
  { time: '8:00 PM', subjects: 'Psychiatry, Dermatology, Anesthesia', theme: 'Mind & Skin' },
  { time: '9:00 PM', subjects: 'Radiology', theme: 'Image Intelligence' },
];

export default function BattleIntroScreen({ onJoinBattle }: { onJoinBattle: () => void }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const isDesktop = width >= 1024;

  return (
    <View style={styles.container}>
      <LogoHeader />
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
          <Text style={styles.mainTitle}>The Daily Battle — Compete. Recall. Conquer.</Text>

          <View style={styles.taglineContainer}>
            <Zap size={20} color="#00ff88" style={styles.icon} />
            <Text style={styles.tagline}>
              <Text style={styles.bold}>Real-Time NEET-PG Quizzes · 12 Battles Every Day · 50 MCQs Each</Text>
            </Text>
          </View>

          <Text style={styles.paragraph}>
            Welcome to the Battle Arena — a live, automated quiz platform that brings students together in real-time, built to ignite your competitive spirit every single hour.
          </Text>

          <Text style={styles.paragraph}>
            Each battle is a 50-question live quiz,{'\n'}
            with a 20-second timer per MCQ,{'\n'}
            where hundreds of NEET-PG aspirants join simultaneously —{'\n'}
            learning, recalling, and racing in real time.
          </Text>

          {/* CTA Button 1 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onJoinBattle}>
            <Text style={styles.ctaButtonText}>Join Battle</Text>
          </TouchableOpacity>
        </View>

        {/* Two Column Grid for Tablet/Desktop */}
        <View style={[
          (isTablet || isDesktop) && styles.gridContainer,
          isDesktop && styles.gridContainerDesktop,
        ]}>
          {/* Why Battle Exists Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <Brain size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>Why Battle Exists</Text>
          </View>

          <Text style={styles.paragraph}>
            Preparation is not just reading — it's responding under pressure.{'\n'}
            The Battle Mode turns that pressure into performance.
          </Text>

          <Text style={styles.paragraph}>
            Every MCQ tests <Text style={styles.bold}>Active Recall + Spaced Repetition</Text> from{'\n'}
            <Text style={styles.bold}>10 000 NEET-PG Concepts</Text> derived from <Text style={styles.bold}>10 000 PYQs (2013 – 2025)</Text>.
          </Text>

          <Text style={styles.paragraph}>
            Each question pushes you to recall faster, reason sharper,{'\n'}
            and cement concepts under the ticking clock — exactly how toppers train.
          </Text>
        </View>

          {/* How It Works Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>How It Works</Text>
          </View>

          <View style={styles.bulletList}>
            <Text style={styles.bullet}>
              ⚔ <Text style={styles.bold}>50 MCQs per Battle</Text> — time-bound to 20 seconds each.
            </Text>
            <Text style={styles.bullet}>
              💥 <Text style={styles.bold}>Instant Leaderboard Updates</Text> after every question.
            </Text>
            <Text style={styles.bullet}>
              🧠 <Text style={styles.bold}>Adaptive AI Mentor</Text> watching your accuracy, timing, and recall strength.
            </Text>
            <Text style={styles.bullet}>
              📊 <Text style={styles.bold}>Performance Scan</Text> after each quiz — exposing your micro-learning gaps.
            </Text>
            <Text style={styles.bullet}>
              🔄 <Text style={styles.bold}>Smart Reinforcement Path</Text> sent to your dashboard to fix those gaps.
            </Text>
          </View>

          <Text style={styles.paragraph}>
            The AI Mentor never sleeps — it tracks your hourly performance and "scans your preparation mind" to identify which subjects, systems, or question types are slowing you down — then prescribes exactly what to revise next.
          </Text>
        </View>

          {/* The Power of Hourly Battles Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <Swords size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>The Power of Hourly Battles</Text>
          </View>

          <Text style={styles.paragraph}>
            Every hour of every day, a new chance to compete.{'\n'}
            <Text style={styles.bold}>12 Live Battles Daily, 50 weeks a year</Text> — that's over <Text style={styles.bold}>4 000 live quizzes annually</Text>.
          </Text>

          <Text style={styles.paragraph}>
            You're not just learning; you're evolving in public —{'\n'}
            against your peers, your weaknesses, and your yesterday self.
          </Text>

          <Text style={styles.paragraph}>
            Each leaderboard refresh isn't just a score — it's feedback.{'\n'}
            Each mistake is a map toward mastery.
          </Text>
        </View>

          {/* The AI Mentor's Role Section */}
          <View style={[styles.section, (isTablet || isDesktop) && styles.gridItem]}>
          <View style={styles.sectionHeader}>
            <Brain size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>The AI Mentor's Role</Text>
          </View>

          <Text style={styles.paragraph}>
            Your AI Mentor doesn't just grade your answers —{'\n'}
            it monitors your evolution hour by hour, learning your cognitive rhythm.
          </Text>

          <Text style={styles.paragraph}>
            It identifies fatigue, hesitation, and pattern errors.{'\n'}
            It then recalibrates your next day's Battle suggestions and Practice flow{'\n'}
            to close those gaps immediately.
          </Text>

          <Text style={styles.paragraph}>
            If your accuracy in "Pathology @ 1 PM" is slipping,{'\n'}
            you'll find targeted Concept and Flashcard reinforcement waiting that evening.
          </Text>

          <Text style={styles.paragraph}>
            Every Battle becomes a mirror of your brain's progress —{'\n'}
            and every reflection shows how close you are to mastery.
          </Text>
        </View>
        </View>

        {/* Battle Schedule Table Section */}
        <View style={[styles.section, (isTablet || isDesktop) && styles.sectionFullWidth]}>
          <Text style={styles.sectionTitle}>🧮 Daily Battle Schedule (All Year Round)</Text>

          <Text style={styles.tableCaption}>
            12 Live Battles Every Day · 50 MCQs Each · 20 Seconds Per Question
          </Text>

          <View style={styles.tableContainer}>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderCell}>🕒 Time</Text>
              <Text style={styles.tableHeaderCellRight}>🧩 Subjects</Text>
              <Text style={styles.tableHeaderCellRight}>💥 Quiz Theme</Text>
            </View>

            {battleScheduleData.map((item, index) => (
              <View
                key={index}
                style={[
                  styles.tableRow,
                  index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
                  index === battleScheduleData.length - 1 && styles.tableRowLast
                ]}
              >
                <Text style={styles.tableCell}>{item.time}</Text>
                <Text style={styles.tableCellRight}>{item.subjects}</Text>
                <Text style={styles.tableCellRight}>{item.theme}</Text>
              </View>
            ))}
          </View>

          <View style={styles.tableSummary}>
            <Text style={styles.tableSummaryText}>
              <Text style={styles.bold}>12 Battles Daily × 50 Weeks = 4 000+ Live Quizzes Per Year</Text>
            </Text>
          </View>

          {/* CTA Button 2 */}
          <TouchableOpacity style={styles.ctaButton} onPress={onJoinBattle}>
            <Text style={styles.ctaButtonText}>Join Battle</Text>
          </TouchableOpacity>
        </View>

        {/* The Spirit of Preparation Section */}
        <View style={[styles.section, (isTablet || isDesktop) && styles.sectionFullWidth]}>
          <View style={styles.sectionHeader}>
            <Target size={24} color="#00ff88" style={styles.icon} />
            <Text style={styles.sectionTitle}>The Spirit of Preparation</Text>
          </View>

          <Text style={styles.paragraph}>
            In medicine, competition is not rivalry — it's refinement.{'\n'}
            Every Battle keeps that spirit alive, every hour, every day, every subject.
          </Text>

          <Text style={styles.paragraph}>
            You're not just answering questions;{'\n'}
            you're training your reflexes, sharpening your instincts, and rewriting your limits.
          </Text>

          <Text style={styles.sectionTitle}>🚀 Step Into the Arena</Text>

          <View style={styles.finalCTA}>
            <Swords size={28} color="#00ff88" />
            <Text style={styles.finalCTAText}>Tap "Join Battle"</Text>
          </View>

          <Text style={styles.finalMessage}>
            and enter the live leaderboard where precision meets speed.
          </Text>

          <Text style={styles.finalMessage}>
            <Text style={styles.bold}>50 MCQs. 20 Seconds Each. 12 Times a Day.</Text>
          </Text>
          <Text style={styles.finalMessage}>
            <Text style={styles.bold}>One Mentor. One Mission — To Make You the Next NEET-PG Topper.</Text>
          </Text>
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
    marginHorizontal: -12,
  },
  gridContainerDesktop: {
    marginHorizontal: -16,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 12,
    ...Platform.select({
      web: {
        marginBottom: 24,
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
    ...Platform.select({
      web: {
        textAlign: 'center',
      },
    }),
  },
  tableHeaderCellRight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#00ff88',
    textAlign: 'right',
    flex: 1,
    ...Platform.select({
      web: {
        textAlign: 'center',
      },
    }),
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
    ...Platform.select({
      web: {
        textAlign: 'center',
      },
    }),
  },
  tableCellRight: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    ...Platform.select({
      web: {
        textAlign: 'center',
      },
    }),
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
    ...Platform.select({
      web: {
        textAlign: 'center',
      },
    }),
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

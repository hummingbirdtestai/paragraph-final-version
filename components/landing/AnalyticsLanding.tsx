import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native';
import { BarChart3, TrendingUp, Brain, Target, Clock, Zap, Activity, Eye, Gauge, Award } from 'lucide-react-native';
import LogoHeader from '../common/LogoHeader';

interface AnalyticsLandingProps {
  onSignUp: () => void;
  onSignIn: () => void;
  onShowAnalytics: () => void;
}

export default function AnalyticsLanding({ onSignUp, onSignIn, onShowAnalytics }: AnalyticsLandingProps) {
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
        {/* HERO SECTION */}
        <View style={[styles.heroSection, (isTablet || isDesktop) && styles.heroSectionWide]}>
          <Text style={[styles.heroTitle, (isTablet || isDesktop) && styles.heroTitleWide]}>
            AI-Driven NEET-PG Analytics Engine
          </Text>

          <View style={styles.heroSubContainer}>
            <BarChart3 size={20} color="#00ff88" style={styles.heroIcon} />
            <Text style={styles.heroSubtitle}>
              Your preparation is now measured, analysed, and optimised — automatically.
            </Text>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={onSignIn}>
            <Text style={styles.ctaButtonText}>Sign In</Text>
          </TouchableOpacity>

        </View>

        {/* CARDS GRID */}
        <View style={[(isTablet || isDesktop) && styles.gridContainer]}>
          {/* WHY THIS MATTERS */}
          <View style={[styles.card, (isTablet || isDesktop) && styles.gridItem]}>
            <View style={styles.cardHeader}>
              <Target size={22} color="#00ff88" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Why This Matters</Text>
            </View>

            <Text style={styles.cardText}>
              Most aspirants study hard.{'\n'}
              Toppers study intelligently.
            </Text>

            <View style={styles.highlightBox}>
              <Text style={styles.highlightText}>
                This analytics engine shows you exactly where you stand, where you're leaking marks, and how to fix it — fast.
              </Text>
            </View>
          </View>

          {/* WHAT THIS GIVES YOU */}
          <View style={[styles.card, (isTablet || isDesktop) && styles.gridItem]}>
            <View style={styles.cardHeader}>
              <TrendingUp size={22} color="#00ff88" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>What This Gives You</Text>
            </View>

            <Text style={styles.sectionSubtitle}>1. Deep Performance Analytics</Text>
            <View style={styles.bulletList}>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Accuracy subject-wise & system-wise</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Time efficiency and fatigue detection</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Strong vs weak topics (auto-clustered)</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>MCQ patterns you repeatedly get wrong</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Predictive scoring for NEET-PG / INI-CET</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Target zones that improve rank fastest</Text>
              </View>
            </View>

            <Text style={styles.sectionSubtitle}>2. Personalised Learning Pathway</Text>
            <View style={styles.bulletList}>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>What to study today for maximum ROI</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>High-yield targets mapped to your weak areas</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Daily efficiency score</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Adaptive difficulty MCQs</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Concept → Flashcard → MCQ reinforcement loops</Text>
              </View>
            </View>

            <Text style={styles.sectionSubtitle}>3. Mastery Dashboard</Text>
            <View style={styles.bulletList}>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Completion % by subject</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Time spent vs time required</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Your "Most Neglected Topics"</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Toppers' benchmark comparison</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Learning momentum graph</Text>
              </View>
            </View>
          </View>

          {/* VISUAL HIGHLIGHTS */}
          <View style={[styles.card, (isTablet || isDesktop) && styles.gridItem]}>
            <View style={styles.cardHeader}>
              <Eye size={22} color="#00ff88" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Visual Highlights</Text>
            </View>

            <View style={styles.visualList}>
              <View style={styles.visualItem}>
                <Gauge size={18} color="#00ff88" style={styles.visualIcon} />
                <View style={styles.visualTextContainer}>
                  <Text style={styles.visualTitle}>Progress Gauge</Text>
                  <Text style={styles.visualDesc}>Overall preparation %</Text>
                </View>
              </View>

              <View style={styles.visualItem}>
                <Activity size={18} color="#00ff88" style={styles.visualIcon} />
                <View style={styles.visualTextContainer}>
                  <Text style={styles.visualTitle}>Accuracy Heatmap</Text>
                  <Text style={styles.visualDesc}>Red = weak; Green = strong</Text>
                </View>
              </View>

              <View style={styles.visualItem}>
                <Clock size={18} color="#00ff88" style={styles.visualIcon} />
                <View style={styles.visualTextContainer}>
                  <Text style={styles.visualTitle}>Time Efficiency Bar</Text>
                  <Text style={styles.visualDesc}>Minutes spent vs expected</Text>
                </View>
              </View>

              <View style={styles.visualItem}>
                <Target size={18} color="#00ff88" style={styles.visualIcon} />
                <View style={styles.visualTextContainer}>
                  <Text style={styles.visualTitle}>Topic Mastery Rings</Text>
                  <Text style={styles.visualDesc}>Anatomy, Physiology, Pathology, etc.</Text>
                </View>
              </View>

              <View style={styles.visualItem}>
                <BarChart3 size={18} color="#00ff88" style={styles.visualIcon} />
                <View style={styles.visualTextContainer}>
                  <Text style={styles.visualTitle}>Prediction Scale</Text>
                  <Text style={styles.visualDesc}>Expected score if exam were today</Text>
                </View>
              </View>
            </View>
          </View>

          {/* AI MENTOR ADVANTAGE */}
          <View style={[styles.card, (isTablet || isDesktop) && styles.gridItem]}>
            <View style={styles.cardHeader}>
              <Brain size={22} color="#00ff88" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>AI Mentor Advantage</Text>
            </View>

            <Text style={styles.cardText}>
              This engine learns from every single click you make — every concept you read, every MCQ you answer, every minute you invest.
            </Text>

            <Text style={styles.cardText}>
              It builds a digital twin of your preparation, and guides you with:
            </Text>

            <View style={styles.bulletList}>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Precise recommendations</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Strategic priorities</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>High-yield checkpoints</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Daily actionables</Text>
              </View>
            </View>

            <View style={styles.emphasisBox}>
              <Text style={styles.emphasisText}>
                No confusion. No randomness. Only progress.
              </Text>
            </View>

            <TouchableOpacity style={styles.ctaButtonSecondary} onPress={onSignIn}>
              <Text style={styles.ctaButtonSecondaryText}>Sign In</Text>
            </TouchableOpacity>
          </View>

          {/* TIME PRESSURE REALITY CHECK */}
          <View style={[styles.card, (isTablet || isDesktop) && styles.gridItem]}>
            <View style={styles.cardHeader}>
              <Clock size={22} color="#00ff88" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Time Pressure Reality Check</Text>
            </View>

            <Text style={styles.cardText}>
              NEET-PG rewards those who finish strong.
            </Text>

            <Text style={styles.cardText}>
              Every day without analytics = marks lost unknowingly.
            </Text>

            <View style={styles.bulletList}>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Hours left to finish each subject</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Your current pace</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>Best-case vs worst-case timeline</Text>
              </View>
              <View style={styles.listItem}>
                <View style={styles.bullet} />
                <Text style={styles.listText}>"If exam is tomorrow" score estimate</Text>
              </View>
            </View>
          </View>

          {/* DESIGNED FOR MEDICAL STUDENTS */}
          <View style={[styles.card, (isTablet || isDesktop) && styles.gridItem]}>
            <View style={styles.cardHeader}>
              <Activity size={22} color="#00ff88" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>Designed for Medical Students</Text>
            </View>

            <Text style={styles.cardText}>
              Built around real medical workflows:
            </Text>

            <Text style={styles.cardText}>
              Systems, Subjects, PYQs, High-yield ladders, Mistake patterns, Efficiency science.
            </Text>

            <View style={styles.emphasisBox}>
              <Text style={styles.emphasisText}>
                No generic dashboards.{'\n'}
                This is built for NEET-PG.
              </Text>
            </View>
          </View>

          {/* WHAT YOU BECOME */}
          <View style={[styles.card, (isTablet || isDesktop) && styles.gridItem]}>
            <View style={styles.cardHeader}>
              <Award size={22} color="#00ff88" style={styles.cardIcon} />
              <Text style={styles.cardTitle}>What You Become</Text>
            </View>

            <Text style={styles.cardText}>
              A smarter, faster, more strategic NEET-PG aspirant who:
            </Text>

            <View style={styles.bulletList}>
              <View style={styles.listItem}>
                <Zap size={14} color="#00ff88" style={styles.zapIcon} />
                <Text style={styles.listText}>knows exactly what to study</Text>
              </View>
              <View style={styles.listItem}>
                <Zap size={14} color="#00ff88" style={styles.zapIcon} />
                <Text style={styles.listText}>wastes zero time</Text>
              </View>
              <View style={styles.listItem}>
                <Zap size={14} color="#00ff88" style={styles.zapIcon} />
                <Text style={styles.listText}>converts weak zones into strengths</Text>
              </View>
              <View style={styles.listItem}>
                <Zap size={14} color="#00ff88" style={styles.zapIcon} />
                <Text style={styles.listText}>prepares like a topper</Text>
              </View>
              <View style={styles.listItem}>
                <Zap size={14} color="#00ff88" style={styles.zapIcon} />
                <Text style={styles.listText}>finishes on time with confidence</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FINAL CTA SECTION */}
        <View style={[styles.finalSection, (isTablet || isDesktop) && styles.finalSectionWide]}>
          <View style={styles.finalCard}>
            <View style={styles.finalHeader}>
              <Target size={28} color="#00ff88" />
              <Text style={styles.finalTitle}>Start Your Analytics Journey</Text>
            </View>

            <Text style={styles.finalSubtitle}>
              1 tap → full dashboard unlocked.
            </Text>

            <TouchableOpacity style={styles.ctaButton} onPress={onShowAnalytics}>
              <Text style={styles.ctaButtonText}>Show Analytics</Text>
            </TouchableOpacity>

            <Text style={styles.footerText}>
              Powered by Paragraph's AI Learning Engine.
            </Text>
          </View>
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
    paddingTop: 32,
    paddingBottom: 32,
  },
  scrollContentTablet: {
    paddingHorizontal: 40,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 40,
  },
  scrollContentDesktop: {
    paddingHorizontal: 60,
    maxWidth: 1400,
    alignSelf: 'center',
    width: '100%',
    paddingTop: 48,
  },

  heroSection: {
    marginBottom: 32,
  },
  heroSectionWide: {
    marginBottom: 48,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
    lineHeight: 36,
  },
  heroTitleWide: {
    fontSize: 38,
    lineHeight: 48,
    textAlign: 'center',
  },
  heroSubContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#00ff88',
  },
  heroIcon: {
    marginRight: 10,
  },
  heroSubtitle: {
    flex: 1,
    fontSize: 16,
    color: '#00ff88',
    lineHeight: 22,
    fontWeight: '600',
  },

  ctaButton: {
    backgroundColor: '#00ff88',
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    minWidth: 180,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  ctaButtonSecondary: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 2,
    borderColor: '#00ff88',
    marginTop: 20,
    minWidth: 160,
  },
  ctaButtonSecondaryText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#00ff88',
  },

  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -10,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 10,
  },

  card: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a2332',
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a2332',
  },
  cardIcon: {
    marginRight: 10,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#00ff88',
    flex: 1,
  },
  cardText: {
    fontSize: 15,
    color: '#b0b0b0',
    lineHeight: 24,
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#ffffff',
    marginTop: 16,
    marginBottom: 10,
  },

  highlightBox: {
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ff88',
    marginTop: 8,
  },
  highlightText: {
    fontSize: 15,
    color: '#00ff88',
    lineHeight: 22,
    fontWeight: '600',
  },

  emphasisBox: {
    backgroundColor: 'rgba(0, 255, 136, 0.08)',
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#00ff88',
    marginTop: 12,
  },
  emphasisText: {
    fontSize: 15,
    color: '#00ff88',
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
  },

  bulletList: {
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#00ff88',
    marginRight: 10,
  },
  zapIcon: {
    marginRight: 10,
  },
  listText: {
    flex: 1,
    fontSize: 14,
    color: '#b0b0b0',
    lineHeight: 20,
  },

  visualList: {
    gap: 14,
  },
  visualItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0, 255, 136, 0.04)',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1a2332',
  },
  visualIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  visualTextContainer: {
    flex: 1,
  },
  visualTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  visualDesc: {
    fontSize: 13,
    color: '#808080',
    lineHeight: 18,
  },

  finalSection: {
    marginTop: 16,
    marginBottom: 16,
  },
  finalSectionWide: {
    marginTop: 32,
  },
  finalCard: {
    backgroundColor: 'rgba(0, 255, 136, 0.06)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#00ff88',
    padding: 32,
    alignItems: 'center',
  },
  finalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  finalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#00ff88',
    textAlign: 'center',
  },
  finalSubtitle: {
    fontSize: 17,
    color: '#ffffff',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  footerText: {
    fontSize: 12,
    color: '#808080',
    marginTop: 24,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  spacer: {
    height: 32,
  },
});

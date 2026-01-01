import React, { memo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import Footer from './Footer';
import { useAuth } from "@/contexts/AuthContext";

interface HomeScreenProps {
  images: {
    img1: string;
    img2: string;
    img3: string;
    img4: string;
    img5: string;
    img6: string;
    img7: string;
    img8: string;
    img9: string;
    img10: string;
    img11: string;
  };
}
export default function HomeScreen(
  { images, onOpenAuth }: HomeScreenProps & { onOpenAuth?: (mode: "login" | "signup") => void }
) {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";
  const isMobile = !isWeb || width < 768;

  const { user } = useAuth();
  const isLoggedIn = !!user;

  if (isMobile) {
    return (
      <MobileLayout
        images={images}
        onOpenAuth={onOpenAuth}
        isLoggedIn={isLoggedIn}
      />
    );
  }

  return (
    <WebLayout
      images={images}
      onOpenAuth={onOpenAuth}
      isLoggedIn={isLoggedIn}
    />
  );
}


function MobileLayout({ images, onOpenAuth, isLoggedIn }: HomeScreenProps & {
  onOpenAuth?: (mode: "login" | "signup") => void;
  isLoggedIn: boolean;
}) {

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.mobileContent}>
      <Section1Mobile image={images.img1} />
      <Section5Mobile image={images.img5} />
      <Section8Mobile />
      <Section7Mobile />
      <Section2Mobile image={images.img2} />
      <Section4Mobile image={images.img4} />
      <Section3Mobile image={images.img3} />
      <Section6Mobile image={images.img6} />
      <Block1Mobile image={images.img7} />
      <Block2Mobile image={images.img8} />
      <Block3Mobile image={images.img9} />
      <Block4Mobile image={images.img10} />
      <Block5Mobile image={images.img11} />
      <Section9Mobile onOpenAuth={onOpenAuth} isLoggedIn={isLoggedIn} />
      <ProFeaturesUnlockMobile />
      <AIPersonalizationMobile />
      <SystemNotFacultyMobile />
      <PersonalMentorMobile />
      <Footer />
    </ScrollView>
  );
}

function WebLayout({ images, onOpenAuth, isLoggedIn }: HomeScreenProps & {
  onOpenAuth?: (mode: "login" | "signup") => void;
  isLoggedIn: boolean;
}) {

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.webContent}>
      <Section1Web image={images.img1} />
      <Section5Web image={images.img5} />
      <Section8Web />
      <Section7Web />
      <Section2Web image={images.img2} />
      <Section4Web image={images.img4} />
      <Section3Web image={images.img3} />
      <Section6Web image={images.img6} />
      <Block1Web image={images.img7} />
      <Block2Web image={images.img8} />
      <Block3Web image={images.img9} />
      <Block4Web image={images.img10} />
      <Block5Web image={images.img11} />
      <Section9Web onOpenAuth={onOpenAuth} isLoggedIn={isLoggedIn} />
      <ProFeaturesUnlockWeb />
      <AIPersonalizationWeb />
      <SystemNotFacultyWeb />
      <PersonalMentorWeb />
      <Footer />
    </ScrollView>
  );
}


const Section1Mobile = memo(({ image }: { image: string }) => {
  console.log('Section1Mobile mounted');
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImageSection1} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>NEETPG Prep Became Complicated. You Didn't</Text>
        <Text style={styles.mobileBody}>
         You’re Not Struggling — The System Is Broken.
        </Text>
        <Text style={styles.mobileBody}>Most students today are stuck in a cycle of:</Text>
        <Text style={styles.mobileBullet}>• <Text style={styles.highlight}>Endless video lectures</Text> that eat hours but give no clarity</Text>
        <Text style={styles.mobileBullet}>• <Text style={styles.highlight}>Crowded classes</Text> where no one knows your weaknesses</Text>
        <Text style={styles.mobileBullet}>• <Text style={styles.highlight}>Mock tests</Text> that crush confidence instead of building it</Text>
        <Text style={styles.mobileBullet}>• <Text style={styles.highlight}>Overloaded Q-banks</Text> you'll never revise</Text>
        <Text style={styles.mobileBullet}>• <Text style={styles.highlight}>Notes</Text> that grow heavier every year</Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          This isn't learning.{'\n'}This is burnout.{'\n'}And burnout doesn't produce ranks.
        </Text>
      </View>
    </View>
  );
});

const Section1Web = memo(({ image }: { image: string }) => {
  console.log('Section1Web mounted');
  return (
    <View style={styles.webSection}>
      <View style={styles.webHero}>
        <View style={styles.webHeroText}>
          <Text style={styles.webHeading}>NEETPG Prep Became Complicated. You Didn't</Text>
          <Text style={styles.webSubheading}>
            You're Not Struggling — The System Is Broken
          </Text>
          <View style={styles.webBulletList}>
            <Text style={styles.webBullet}>• <Text style={styles.highlight}>Endless video lectures</Text> that eat hours but give no clarity</Text>
            <Text style={styles.webBullet}>• <Text style={styles.highlight}>Crowded classes</Text> where no one knows your weaknesses</Text>
            <Text style={styles.webBullet}>• <Text style={styles.highlight}>Mock tests</Text> that crush confidence instead of building it</Text>
            <Text style={styles.webBullet}>• <Text style={styles.highlight}>Overloaded Q-banks</Text> you'll never revise</Text>
            <Text style={styles.webBullet}>• <Text style={styles.highlight}>Notes</Text> that grow heavier every year</Text>
          </View>
          <Text style={[styles.webBody, styles.emphasis]}>
            This isn't learning. This is burnout.{'\n'}And burnout doesn't produce ranks.
          </Text>
        </View>
        <Image source={{ uri: image }} style={styles.webHeroImage} resizeMode="contain" progressiveRenderingEnabled />
      </View>
    </View>
  );
});

const Section2Mobile = memo(({ image }: { image: string }) => {
  console.log('Section2Mobile mounted');
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>NEETPG Prep That Actually Works</Text>
        <Text style={styles.mobileBody}>
          Learning can be rewarding, sharp, and energising.
        </Text>
        <Text style={styles.mobileBody}>That's why Paragraph rebuilds your entire journey around:</Text>
        <Text style={styles.mobileCheck}>✔ Short, personalised quizzes</Text>
        <Text style={styles.mobileCheck}>✔ Instant clarity</Text>
        <Text style={styles.mobileCheck}>✔ Visible progress you can feel proud of</Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          Minus the drudgery.{'\n'}Plus the dopamine.
        </Text>
      </View>
    </View>
  );
});

const Section2Web = memo(({ image }: { image: string }) => {
  console.log('Section2Web mounted');
  return (
    <View style={styles.webSection}>
      <View style={styles.webReverse}>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>But NEETPG was never meant to feel like torture.</Text>
          <Text style={styles.webBody}>
            Learning can be rewarding, sharp, and energising.
          </Text>
          <Text style={styles.webBody}>That's why Paragraph rebuilds your entire journey around:</Text>
          <View style={styles.webCheckList}>
            <Text style={styles.webCheck}>✔ Short, personalised quizzes</Text>
            <Text style={styles.webCheck}>✔ Instant clarity</Text>
            <Text style={styles.webCheck}>✔ Visible progress you can feel proud of</Text>
          </View>
          <Text style={[styles.webBody, styles.emphasis]}>
            Minus the drudgery. Plus the dopamine.
          </Text>
        </View>
      </View>
    </View>
  );
});

const Section3Mobile = memo(({ image }: { image: string }) => {
  console.log('Section3Mobile mounted');
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>Daily Support, Not Daily Stress</Text>
        <Text style={styles.mobileBody}>
          Most apps show a goal.{'\n'}Paragraph actually helps you reach it.
        </Text>
        <Text style={styles.mobileBody}>
          <Text style={styles.bold}>Didn't study today?</Text> Your AI nudges you gently.
        </Text>
        <Text style={styles.mobileBody}>
          <Text style={styles.bold}>Feeling stuck?</Text> It triggers a quick 5-minute revision.
        </Text>
        <Text style={styles.mobileBody}>
          <Text style={styles.bold}>Losing consistency?</Text> It restarts your momentum instantly.
        </Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          This isn't an app.{'\n'}It's a daily coaching system that keeps you moving.
        </Text>
      </View>
    </View>
  );
});

const Section3Web = memo(({ image }: { image: string }) => {
  console.log('Section3Web mounted');
  return (
    <View style={styles.webSection}>
      <View style={styles.webHero}>
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>Daily Support, Not Daily Stress</Text>
          <Text style={styles.webSubheading}>
            Most apps show a goal. Paragraph actually helps you reach it.
          </Text>
          <View style={styles.webFeatureGrid}>
            <View style={styles.webFeature}>
              <Text style={styles.webFeatureTitle}>Didn't study today?</Text>
              <Text style={styles.webFeatureText}>Your AI nudges you gently.</Text>
            </View>
            <View style={styles.webFeature}>
              <Text style={styles.webFeatureTitle}>Feeling stuck?</Text>
              <Text style={styles.webFeatureText}>It triggers a quick 5-minute revision.</Text>
            </View>
            <View style={styles.webFeature}>
              <Text style={styles.webFeatureTitle}>Losing consistency?</Text>
              <Text style={styles.webFeatureText}>It restarts your momentum instantly.</Text>
            </View>
          </View>
          <Text style={[styles.webBody, styles.emphasis]}>
            This isn't an app. It's a daily coaching system that keeps you moving.
          </Text>
        </View>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
      </View>
    </View>
  );
});

const Section4Mobile = memo(({ image }: { image: string }) => {
  console.log('Section4Mobile mounted');
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>From Mistakes to Mastery</Text>
        <Text style={styles.mobileBody}>
          Every mistake is a message.{'\n'}Paragraph listens.
        </Text>
        <Text style={styles.mobileBody}>
          If you get 6 MCQs wrong today, the system instantly:
        </Text>
        <Text style={styles.mobileBullet}>• Detects the weak topics</Text>
        <Text style={styles.mobileBullet}>• Converts them into your revision list</Text>
        <Text style={styles.mobileBullet}>• Auto-prioritises based on your gaps</Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          This is how toppers study — not more, but smarter, consistently closing loops.
        </Text>
      </View>
    </View>
  );
});

const Section4Web = memo(({ image }: { image: string }) => {
  console.log('Section4Web mounted');
  return (
    <View style={styles.webSection}>
      <View style={styles.webReverse}>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>From Mistakes to Mastery</Text>
          <Text style={styles.webSubheading}>
            Every mistake is a message. Paragraph listens.
          </Text>
          <Text style={styles.webBody}>
            If you get 6 MCQs wrong today, the system instantly:
          </Text>
          <View style={styles.webBulletList}>
            <Text style={styles.webBullet}>• Detects the weak topics</Text>
            <Text style={styles.webBullet}>• Converts them into your revision list</Text>
            <Text style={styles.webBullet}>• Auto-prioritises based on your gaps</Text>
          </View>
          <Text style={[styles.webBody, styles.emphasis]}>
            This is how toppers study — not more, but smarter, consistently closing loops.
          </Text>
        </View>
      </View>
    </View>
  );
});

const Section5Mobile = memo(({ image }: { image: string }) => {
  console.log('Section5Mobile mounted');
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>Your 10,000-Concepts based on NEETPG PYQs journey, Simplified</Text>
        <Text style={styles.mobileBody}>
          NEETPG looks overwhelming only if you walk it blindly.
        </Text>
        <Text style={styles.mobileBody}>
          Paragraph breaks your preparation into a clear 4-step roadmap:
        </Text>
        <Text style={styles.mobileStep}>1️⃣ 10000 Concepts</Text>
        <Text style={styles.mobileStep}>2️⃣ 45332 Flash Cards</Text>
        <Text style={styles.mobileStep}>3️⃣ 50 Mock Tests</Text>
        <Text style={styles.mobileStep}>4️⃣ Daily 14 Group Quizzes</Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          Every day you move forward.{'\n'}
          Every gap gets fixed automatically.{'\n'}
          Every milestone is visible.
        </Text>
        <Text style={styles.mobileBody}>
          This is your 10,000-concept path — made simple, structured, achievable.
        </Text>
      </View>
    </View>
  );
});

const Section5Web = memo(({ image }: { image: string }) => {
  console.log('Section5Web mounted');
  return (
    <View style={styles.webSection}>
      <View style={styles.webHero}>
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>Your 10,000-Concepts based on NEETPG PYQs journey, Simplified</Text>
          <Text style={styles.webSubheading}>
            NEETPG looks overwhelming only if you walk it blindly.
          </Text>
          <Text style={styles.webBody}>
            Paragraph breaks your preparation into a clear 4-step roadmap:
          </Text>
          <View style={styles.webStepGrid}>
            <View style={styles.webStep}>
              <Text style={styles.webStepNumber}>1️⃣</Text>
              <Text style={styles.webStepText}>10000 Concepts</Text>
            </View>
            <View style={styles.webStep}>
              <Text style={styles.webStepNumber}>2️⃣</Text>
              <Text style={styles.webStepText}>45332 Flash Cards</Text>
            </View>
            <View style={styles.webStep}>
              <Text style={styles.webStepNumber}>3️⃣</Text>
              <Text style={styles.webStepText}>50 Mock Tests</Text>
            </View>
            <View style={styles.webStep}>
              <Text style={styles.webStepNumber}>4️⃣</Text>
              <Text style={styles.webStepText}>Daily 14 Group Quizzes</Text>
            </View>
          </View>
          <Text style={[styles.webBody, styles.emphasis]}>
            Every day you move forward. Every gap gets fixed automatically.{'\n'}
            Every milestone is visible.
          </Text>
          <Text style={styles.webBody}>
            This is your 10,000-concept path — made simple, structured, achievable.
          </Text>
        </View>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
      </View>
    </View>
  );
});

const Section6Mobile = memo(({ image }: { image: string }) => {
  console.log('Section6Mobile mounted');
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImageSection6} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>You Are Never Alone</Text>
        <Text style={styles.mobileBody}>
          And unlike coaching classes where you struggle in silence…
        </Text>
        <Text style={styles.mobileBody}>
          Paragraph gives you a 24×7 AI Tutor that clears doubts instantly:
        </Text>
        <View style={styles.doubtBox}>
          <Text style={styles.doubtText}>"Sir, I'm confused about CO formula…"</Text>
          <Text style={styles.doubtText}>"Factors affecting HR and SV?"</Text>
          <Text style={styles.doubtText}>"Why is this MCQ wrong?"</Text>
        </View>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          Every concept becomes clear.{'\n'}
          Every mistake is corrected immediately.{'\n'}
          You learn with confidence — not confusion.
        </Text>
      </View>
    </View>
  );
});

const Section6Web = memo(({ image }: { image: string }) => {
  console.log('Section6Web mounted');
  return (
    <View style={styles.webSection}>
      <View style={styles.webReverse}>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>You Are Never Alone</Text>
          <Text style={styles.webBody}>
            And unlike coaching classes where you struggle in silence…
          </Text>
          <Text style={styles.webBody}>
            Paragraph gives you a 24×7 AI Tutor that clears doubts instantly:
          </Text>
          <View style={styles.webDoubtBox}>
            <Text style={styles.webDoubtText}>"Sir, I'm confused about CO formula…"</Text>
            <Text style={styles.webDoubtText}>"Factors affecting HR and SV?"</Text>
            <Text style={styles.webDoubtText}>"Why is this MCQ wrong?"</Text>
          </View>
          <Text style={[styles.webBody, styles.emphasis]}>
            Every concept becomes clear. Every mistake is corrected immediately.{'\n'}
            You learn with confidence — not confusion.
          </Text>
        </View>
      </View>
    </View>
  );
});

const Section7Mobile = memo(() => {
  console.log('Section7Mobile mounted');
  return (
    <View style={styles.mobileQuoteSection}>
      <Text style={styles.mobileQuoteHeading}>The Real NEETPG Strategy</Text>
      <Text style={styles.mobileQuote}>
        Toppers don't crack NEETPG with:{'\n'}
        ✘ 1,000-hour videos{'\n'}
        ✘ Mega batches{'\n'}
        ✘ Hype or marketing
      </Text>
      <Text style={styles.mobileQuote}>They crack it with:</Text>
      <Text style={styles.mobileQuoteCheck}>✔ Structured learning</Text>
      <Text style={styles.mobileQuoteCheck}>✔ Practice with feedback</Text>
      <Text style={styles.mobileQuoteCheck}>✔ Disciplined revision</Text>
      <Text style={styles.mobileQuoteCheck}>✔ Self-paced momentum</Text>
      <Text style={[styles.mobileQuote, styles.emphasis]}>
        Paragraph gives you exactly that.
      </Text>
    </View>
  );
});

const Section7Web = memo(() => {
  console.log('Section7Web mounted');
  return (
    <View style={styles.webQuoteSection}>
      <View style={styles.webQuoteContent}>
        <Text style={styles.webQuoteHeading}>The Real NEETPG Strategy</Text>
        <View style={styles.webQuoteGrid}>
          <View style={styles.webQuoteColumn}>
            <Text style={styles.webQuoteSubtitle}>Toppers don't crack NEETPG with:</Text>
            <Text style={styles.webQuoteItem}>✘ 1,000-hour videos</Text>
            <Text style={styles.webQuoteItem}>✘ Mega batches</Text>
            <Text style={styles.webQuoteItem}>✘ Hype or marketing</Text>
          </View>
          <View style={styles.webQuoteColumn}>
            <Text style={styles.webQuoteSubtitle}>They crack it with:</Text>
            <Text style={styles.webQuoteCheck}>✔ Structured learning</Text>
            <Text style={styles.webQuoteCheck}>✔ Practice with feedback</Text>
            <Text style={styles.webQuoteCheck}>✔ Disciplined revision</Text>
            <Text style={styles.webQuoteCheck}>✔ Self-paced momentum</Text>
          </View>
        </View>
        <Text style={[styles.webQuoteFooter, styles.emphasis]}>
          Paragraph gives you exactly that.
        </Text>
      </View>
    </View>
  );
});

const Section8Mobile = memo(() => {
  console.log('Section8Mobile mounted');
  return (
    <View style={styles.mobileSection}>
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>Your 1000-Hour Plan to a Top 1000 Rank</Text>
        <View style={styles.planItem}>
          <Text style={styles.planText}>10,000 High-Yield Concepts</Text>
          <Text style={styles.planHours}>150 hours</Text>
        </View>
        <View style={styles.planItem}>
          <Text style={styles.planText}>10,000 PYQs</Text>
          <Text style={styles.planHours}>150 hours</Text>
        </View>
        <View style={styles.planItem}>
          <Text style={styles.planText}>50 Grand Tests</Text>
          <Text style={styles.planHours}>250 hours</Text>
        </View>
        <View style={styles.planItem}>
          <Text style={styles.planText}>45,000 Flashcards</Text>
          <Text style={styles.planHours}>400 hours</Text>
        </View>
        <View style={styles.planTotal}>
          <Text style={styles.planTotalText}>Your Total: 1000 hours</Text>
          <Text style={styles.planSubtext}>A complete NEETPG journey.</Text>
        </View>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          No noise.{'\n'}No overwhelm.{'\n'}Just dependable progress — every single day.
        </Text>
      </View>
    </View>
  );
});

const Section8Web = memo(() => {
  console.log('Section8Web mounted');
  return (
    <View style={styles.webSection}>
      <View style={styles.webPlanContent}>
        <Text style={styles.webHeading}>Your 1000-Hour Plan to a Top 1000 Rank</Text>
        <View style={styles.webPlanGrid}>
          <View style={styles.webPlanCard}>
            <Text style={styles.webPlanNumber}>10,000</Text>
            <Text style={styles.webPlanLabel}>High-Yield Concepts</Text>
            <Text style={styles.webPlanHours}>150 hours</Text>
          </View>
          <View style={styles.webPlanCard}>
            <Text style={styles.webPlanNumber}>10,000</Text>
            <Text style={styles.webPlanLabel}>PYQs</Text>
            <Text style={styles.webPlanHours}>150 hours</Text>
          </View>
          <View style={styles.webPlanCard}>
            <Text style={styles.webPlanNumber}>50</Text>
            <Text style={styles.webPlanLabel}>Grand Tests</Text>
            <Text style={styles.webPlanHours}>250 hours</Text>
          </View>
          <View style={styles.webPlanCard}>
            <Text style={styles.webPlanNumber}>45,000</Text>
            <Text style={styles.webPlanLabel}>Flashcards</Text>
            <Text style={styles.webPlanHours}>400 hours</Text>
          </View>
        </View>
        <View style={styles.webPlanTotal}>
          <Text style={styles.webPlanTotalText}>Your Total: 1000 hours</Text>
          <Text style={styles.webPlanSubtext}>A complete NEETPG journey.</Text>
        </View>
        <Text style={[styles.webBody, styles.emphasis]}>
          No noise. No overwhelm. Just dependable progress — every single day.
        </Text>
      </View>
    </View>
  );
});

const Block1Mobile = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>Everything You Study Is Exam-Critical</Text>
        <Text style={styles.mobileBody}>
          10,000 NEET-PG PYQs mapped to concepts & mistakes
        </Text>
        <Text style={styles.mobileBody}>
          10,000 high-yield concepts (no duplication, no fluff)
        </Text>
        <Text style={styles.mobileBody}>
          45,000 flashcards for rapid recall & long-term memory
        </Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          You don't study more. You study exactly what matters.
        </Text>
      </View>
    </View>
  );
});

const Block1Web = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webHero}>
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>Everything You Study Is Exam-Critical</Text>
          <Text style={styles.webBody}>
            10,000 NEET-PG PYQs mapped to concepts & mistakes
          </Text>
          <Text style={styles.webBody}>
            10,000 high-yield concepts (no duplication, no fluff)
          </Text>
          <Text style={styles.webBody}>
            45,000 flashcards for rapid recall & long-term memory
          </Text>
          <Text style={[styles.webBody, styles.emphasis]}>
            You don't study more. You study exactly what matters.
          </Text>
        </View>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
      </View>
    </View>
  );
});

const Block2Mobile = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>Daily Progress. Zero Burnout.</Text>
        <Text style={styles.mobileBody}>
          Short, personalised quizzes every day
        </Text>
        <Text style={styles.mobileBody}>
          Daily group quizzes (15 live battles, 450 MCQs/day)
        </Text>
        <Text style={styles.mobileBody}>
          Instant feedback and rankings to build exam temperament
        </Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          Consistency beats motivation. We engineer consistency.
        </Text>
      </View>
    </View>
  );
});

const Block2Web = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webReverse}>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>Daily Progress. Zero Burnout.</Text>
          <Text style={styles.webBody}>
            Short, personalised quizzes every day
          </Text>
          <Text style={styles.webBody}>
            Daily group quizzes (15 live battles, 450 MCQs/day)
          </Text>
          <Text style={styles.webBody}>
            Instant feedback and rankings to build exam temperament
          </Text>
          <Text style={[styles.webBody, styles.emphasis]}>
            Consistency beats motivation. We engineer consistency.
          </Text>
        </View>
      </View>
    </View>
  );
});

const Block3Mobile = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>Learn Faster With Visual Memory</Text>
        <Text style={styles.mobileBody}>
          3-minute revision videos (6,000 short reels)
        </Text>
        <Text style={styles.mobileBody}>
          Daily image-based learning with clinical cases
        </Text>
        <Text style={styles.mobileBody}>
          60,000 high-yield facts reinforced visually
        </Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          Built for attention spans of 2026 — fast, sharp, unforgettable.
        </Text>
      </View>
    </View>
  );
});

const Block3Web = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webHero}>
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>Learn Faster With Visual Memory</Text>
          <Text style={styles.webBody}>
            3-minute revision videos (6,000 short reels)
          </Text>
          <Text style={styles.webBody}>
            Daily image-based learning with clinical cases
          </Text>
          <Text style={styles.webBody}>
            60,000 high-yield facts reinforced visually
          </Text>
          <Text style={[styles.webBody, styles.emphasis]}>
            Built for attention spans of 2026 — fast, sharp, unforgettable.
          </Text>
        </View>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
      </View>
    </View>
  );
});

const Block4Mobile = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>Practice Under Real Exam Pressure</Text>
        <Text style={styles.mobileBody}>
          100 full-length NEET-PG level grand tests
        </Text>
        <Text style={styles.mobileBody}>
          Bi-weekly exam-standard mock tests
        </Text>
        <Text style={styles.mobileBody}>
          Rank prediction and deep performance analysis
        </Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          Confidence comes from knowing where you stand.
        </Text>
      </View>
    </View>
  );
});

const Block4Web = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webReverse}>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>Practice Under Real Exam Pressure</Text>
          <Text style={styles.webBody}>
            100 full-length NEET-PG level grand tests
          </Text>
          <Text style={styles.webBody}>
            Bi-weekly exam-standard mock tests
          </Text>
          <Text style={styles.webBody}>
            Rank prediction and deep performance analysis
          </Text>
          <Text style={[styles.webBody, styles.emphasis]}>
            Confidence comes from knowing where you stand.
          </Text>
        </View>
      </View>
    </View>
  );
});

const Block5Mobile = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.mobileSection}>
      <Image source={{ uri: image }} style={styles.mobileImage} resizeMode="cover" progressiveRenderingEnabled />
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>A System That Adapts To You</Text>
        <Text style={styles.mobileBody}>
          AI-driven adaptive learning based on mistakes and speed
        </Text>
        <Text style={styles.mobileBody}>
          24×7 AI doubt-clearing chat
        </Text>
        <Text style={styles.mobileBody}>
          Automatic revision and gap-closing without planning stress
        </Text>
        <Text style={[styles.mobileBody, styles.emphasis]}>
          Feels like a personal mentor — because it behaves like one.
        </Text>
      </View>
    </View>
  );
});

const Block5Web = memo(({ image }: { image: string }) => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webHero}>
        <View style={styles.webTextBlock}>
          <Text style={styles.webHeading}>A System That Adapts To You</Text>
          <Text style={styles.webBody}>
            AI-driven adaptive learning based on mistakes and speed
          </Text>
          <Text style={styles.webBody}>
            24×7 AI doubt-clearing chat
          </Text>
          <Text style={styles.webBody}>
            Automatic revision and gap-closing without planning stress
          </Text>
          <Text style={[styles.webBody, styles.emphasis]}>
            Feels like a personal mentor — because it behaves like one.
          </Text>
        </View>
        <Image source={{ uri: image }} style={styles.webSideImage} resizeMode="contain" progressiveRenderingEnabled />
      </View>
    </View>
  );
});

const ProFeaturesUnlockMobile = memo(() => {
  return (
    <View style={styles.mobileSection}>
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>What You Unlock with Paragraph Pro</Text>

        <View style={styles.proFeatureCard}>
          <Text style={styles.proFeatureTitle}>10,000 NEET-PG PYQs</Text>
          <Text style={styles.proFeatureText}>– Mapped to concepts, mistakes, and exam patterns</Text>
          <Text style={styles.proFeatureText}>– ~150 hours of focused revision</Text>
        </View>

        <View style={styles.proFeatureCard}>
          <Text style={styles.proFeatureTitle}>10,000 High-Yield Concepts</Text>
          <Text style={styles.proFeatureText}>– Exam-critical only</Text>
          <Text style={styles.proFeatureText}>– No duplication, no fluff</Text>
        </View>

        <View style={styles.proFeatureCard}>
          <Text style={styles.proFeatureTitle}>45,000 Flashcards</Text>
          <Text style={styles.proFeatureText}>– Rapid recall</Text>
          <Text style={styles.proFeatureText}>– Long-term memory</Text>
          <Text style={styles.proFeatureText}>– Last-minute revision</Text>
        </View>

        <View style={styles.proFeatureCard}>
          <Text style={styles.proFeatureTitle}>Daily Short Videos (3-minute reels)</Text>
          <Text style={styles.proFeatureText}>– 6,000 videos total</Text>
          <Text style={styles.proFeatureText}>– ~60,000 high-yield facts</Text>
          <Text style={styles.proFeatureText}>– No binge-watching</Text>
        </View>

        <View style={styles.proFeatureCard}>
          <Text style={styles.proFeatureTitle}>Daily Image-Based Learning</Text>
          <Text style={styles.proFeatureText}>– 4,500 clinical images</Text>
          <Text style={styles.proFeatureText}>– Visual exam-pattern recognition</Text>
        </View>

        <View style={styles.proFeatureCard}>
          <Text style={styles.proFeatureTitle}>100 Full-Length NEET-PG Mock Tests</Text>
          <Text style={styles.proFeatureText}>– Bi-weekly</Text>
          <Text style={styles.proFeatureText}>– Exam-level difficulty</Text>
          <Text style={styles.proFeatureText}>– Rank prediction & analysis</Text>
        </View>

        <View style={styles.proFeatureCard}>
          <Text style={styles.proFeatureTitle}>Daily Group Quizzes</Text>
          <Text style={styles.proFeatureText}>– 15 quizzes every day</Text>
          <Text style={styles.proFeatureText}>– 450 MCQs/day</Text>
          <Text style={styles.proFeatureText}>– All 19 NEET-PG subjects</Text>
          <Text style={styles.proFeatureText}>– Live competition & feedback</Text>
        </View>
      </View>
    </View>
  );
});

const ProFeaturesUnlockWeb = memo(() => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webTextBlock}>
        <Text style={styles.webHeading}>What You Unlock with Paragraph Pro</Text>

        <View style={styles.webProGrid}>
          <View style={styles.webProCard}>
            <Text style={styles.webProCardTitle}>10,000 NEET-PG PYQs</Text>
            <Text style={styles.webProCardText}>– Mapped to concepts, mistakes, and exam patterns</Text>
            <Text style={styles.webProCardText}>– ~150 hours of focused revision</Text>
          </View>

          <View style={styles.webProCard}>
            <Text style={styles.webProCardTitle}>10,000 High-Yield Concepts</Text>
            <Text style={styles.webProCardText}>– Exam-critical only</Text>
            <Text style={styles.webProCardText}>– No duplication, no fluff</Text>
          </View>

          <View style={styles.webProCard}>
            <Text style={styles.webProCardTitle}>45,000 Flashcards</Text>
            <Text style={styles.webProCardText}>– Rapid recall</Text>
            <Text style={styles.webProCardText}>– Long-term memory</Text>
            <Text style={styles.webProCardText}>– Last-minute revision</Text>
          </View>

          <View style={styles.webProCard}>
            <Text style={styles.webProCardTitle}>Daily Short Videos (3-minute reels)</Text>
            <Text style={styles.webProCardText}>– 6,000 videos total</Text>
            <Text style={styles.webProCardText}>– ~60,000 high-yield facts</Text>
            <Text style={styles.webProCardText}>– No binge-watching</Text>
          </View>

          <View style={styles.webProCard}>
            <Text style={styles.webProCardTitle}>Daily Image-Based Learning</Text>
            <Text style={styles.webProCardText}>– 4,500 clinical images</Text>
            <Text style={styles.webProCardText}>– Visual exam-pattern recognition</Text>
          </View>

          <View style={styles.webProCard}>
            <Text style={styles.webProCardTitle}>100 Full-Length NEET-PG Mock Tests</Text>
            <Text style={styles.webProCardText}>– Bi-weekly</Text>
            <Text style={styles.webProCardText}>– Exam-level difficulty</Text>
            <Text style={styles.webProCardText}>– Rank prediction & analysis</Text>
          </View>

          <View style={[styles.webProCard, styles.webProCardCentered]}>
            <Text style={[styles.webProCardTitle, styles.centeredText]}>Daily Group Quizzes</Text>
            <Text style={[styles.webProCardText, styles.centeredText]}>– 15 quizzes every day</Text>
            <Text style={[styles.webProCardText, styles.centeredText]}>– 450 MCQs/day</Text>
            <Text style={[styles.webProCardText, styles.centeredText]}>– All 19 NEET-PG subjects</Text>
            <Text style={[styles.webProCardText, styles.centeredText]}>– Live competition & feedback</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const AIPersonalizationMobile = memo(() => {
  return (
    <View style={styles.mobileSection}>
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>AI-Driven, Hyper-Personalised Learning</Text>

        <Text style={styles.mobileBody}>AI tracks:</Text>
        <Text style={styles.mobileBullet}>– Your mistakes</Text>
        <Text style={styles.mobileBullet}>– Your speed</Text>
        <Text style={styles.mobileBullet}>– Your weak subjects</Text>

        <Text style={[styles.mobileBody, { marginTop: 16 }]}>The system automatically:</Text>
        <Text style={styles.mobileBullet}>– Builds your daily study plan</Text>
        <Text style={styles.mobileBullet}>– Pushes only what YOU need today</Text>
        <Text style={styles.mobileBullet}>– Repeats weak areas until fixed</Text>

        <Text style={[styles.mobileBody, styles.emphasis]}>
          Two students. Same syllabus. Completely different daily plans.
        </Text>
      </View>
    </View>
  );
});

const AIPersonalizationWeb = memo(() => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webTextBlock}>
        <Text style={styles.webHeading}>AI-Driven, Hyper-Personalised Learning</Text>

        <View style={styles.webHero}>
          <View style={styles.webTextBlock}>
            <Text style={styles.webSubheading}>AI tracks:</Text>
            <Text style={styles.webBullet}>– Your mistakes</Text>
            <Text style={styles.webBullet}>– Your speed</Text>
            <Text style={styles.webBullet}>– Your weak subjects</Text>
          </View>

          <View style={styles.webTextBlock}>
            <Text style={styles.webSubheading}>The system automatically:</Text>
            <Text style={styles.webBullet}>– Builds your daily study plan</Text>
            <Text style={styles.webBullet}>– Pushes only what YOU need today</Text>
            <Text style={styles.webBullet}>– Repeats weak areas until fixed</Text>
          </View>
        </View>

        <Text style={[styles.webBody, styles.emphasis, { textAlign: 'center', marginTop: 24 }]}>
          Two students. Same syllabus. Completely different daily plans.
        </Text>
      </View>
    </View>
  );
});

const SystemNotFacultyMobile = memo(() => {
  return (
    <View style={styles.mobileSection}>
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>No Faculty Hype. Just a System.</Text>

        <Text style={styles.mobileBody}>No celebrity faculty dependency</Text>
        <Text style={styles.mobileBody}>No one-size-fits-all schedules</Text>
        <Text style={styles.mobileBody}>No marathon lectures</Text>

        <Text style={[styles.mobileBody, { marginTop: 16, fontWeight: '700', color: '#3fb950' }]}>Instead:</Text>
        <Text style={styles.mobileCheck}>✔ System-driven learning</Text>
        <Text style={styles.mobileCheck}>✔ Self-paced momentum</Text>
        <Text style={styles.mobileCheck}>✔ Daily direction and correction</Text>
      </View>
    </View>
  );
});

const SystemNotFacultyWeb = memo(() => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webTextBlock}>
        <Text style={styles.webHeading}>No Faculty Hype. Just a System.</Text>

        <View style={styles.webHero}>
          <View style={styles.webTextBlock}>
            <Text style={styles.webBody}>No celebrity faculty dependency</Text>
            <Text style={styles.webBody}>No one-size-fits-all schedules</Text>
            <Text style={styles.webBody}>No marathon lectures</Text>
          </View>

          <View style={styles.webTextBlock}>
            <Text style={[styles.webBody, { fontWeight: '700', color: '#3fb950' }]}>Instead:</Text>
            <Text style={styles.webCheck}>✔ System-driven learning</Text>
            <Text style={styles.webCheck}>✔ Self-paced momentum</Text>
            <Text style={styles.webCheck}>✔ Daily direction and correction</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

const PersonalMentorMobile = memo(() => {
  return (
    <View style={styles.mobileSection}>
      <View style={styles.mobilePadding}>
        <Text style={styles.mobileHeading}>Feels Like a Personal Mentor</Text>

        <Text style={styles.mobileCheck}>✔ 24×7 AI doubt-clearing</Text>
        <Text style={styles.mobileCheck}>✔ Instant explanations</Text>
        <Text style={styles.mobileCheck}>✔ No waiting for faculty</Text>
        <Text style={styles.mobileCheck}>✔ No batch dependency</Text>

        <Text style={[styles.mobileBody, styles.emphasis, { marginTop: 16 }]}>
          Reassuring, supportive, personal.
        </Text>
      </View>
    </View>
  );
});

const PersonalMentorWeb = memo(() => {
  return (
    <View style={styles.webSection}>
      <View style={styles.webTextBlock}>
        <Text style={styles.webHeading}>Feels Like a Personal Mentor</Text>

        <View style={styles.webCheckList}>
          <Text style={styles.webCheck}>✔ 24×7 AI doubt-clearing</Text>
          <Text style={styles.webCheck}>✔ Instant explanations</Text>
          <Text style={styles.webCheck}>✔ No waiting for faculty</Text>
          <Text style={styles.webCheck}>✔ No batch dependency</Text>
        </View>

        <Text style={[styles.webBody, styles.emphasis, { textAlign: 'center', marginTop: 24 }]}>
          Reassuring, supportive, personal.
        </Text>
      </View>
    </View>
  );
});

const Section9Mobile = memo(({ onOpenAuth, isLoggedIn }) => {
  if (isLoggedIn) return null;

  return (
    <View style={styles.mobileCTASection}>
      <Text style={styles.mobileCTAHeading}>Start Your Journey</Text>
      <Text style={styles.mobileCTAText}>
        This is the NEETPG preparation model built for 2026 —
        efficient, adaptive, personalised, unstoppable.
      </Text>

      <Pressable
        style={styles.mobileCTAButton}
        onPress={() => onOpenAuth?.("signup")}
      >
        <Text style={styles.mobileCTAButtonText}>Sign Up Now</Text>
      </Pressable>
    </View>
  );
});


const Section9Web = memo(({ onOpenAuth, isLoggedIn }) => {
  if (isLoggedIn) return null;

  return (
    <View style={styles.webCTASection}>
      <View style={styles.webCTAContent}>
        <Text style={styles.webCTAHeading}>Start Your Journey</Text>

        <Pressable
          style={styles.webCTAButton}
          onPress={() => onOpenAuth?.("signup")}
        >
          <Text style={styles.webCTAButtonText}>Sign Up Now</Text>
        </Pressable>
      </View>
    </View>
  );
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  mobileContent: {
    paddingBottom: 40,
  },
  webContent: {
    paddingBottom: 80,
  },

  mobileSection: {
    marginBottom: 32,
    marginHorizontal: 16,
  },
  mobilePadding: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 24,
    backgroundColor: '#161b22',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mobileImage: {
    width: '100%',
    height: 240,
    backgroundColor: '#161b22',
    borderRadius: 16,
    marginBottom: 16,
  },
  mobileImageSection1: {
    width: '100%',
    height: 380,
    backgroundColor: '#161b22',
    borderRadius: 16,
    marginBottom: 16,
  },
  mobileImageSection6: {
    width: '100%',
    height: 340,
    backgroundColor: '#161b22',
    borderRadius: 16,
    marginBottom: 16,
  },
  mobileHeading: {
    fontSize: 28,
    fontWeight: '600',
    color: '#f4e4c1',
    marginBottom: 16,
    lineHeight: 36,
  },
  mobileBody: {
    fontSize: 16,
    color: '#c9d1d9',
    lineHeight: 24,
    marginBottom: 12,
  },
  mobileBullet: {
    fontSize: 15,
    color: '#8b949e',
    lineHeight: 22,
    marginBottom: 8,
    paddingLeft: 8,
  },
  mobileCheck: {
    fontSize: 16,
    color: '#3fb950',
    lineHeight: 24,
    marginBottom: 8,
  },
  mobileStep: {
    fontSize: 18,
    color: '#58a6ff',
    lineHeight: 28,
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    color: '#fbbf24',
  },
  emphasis: {
    color: '#58a6ff',
    fontWeight: '600',
    marginTop: 8,
  },
  highlight: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  doubtBox: {
    backgroundColor: '#1c2128',
    padding: 16,
    borderRadius: 8,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  doubtText: {
    fontSize: 15,
    color: '#8b949e',
    lineHeight: 22,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  mobileQuoteSection: {
    backgroundColor: '#161b22',
    paddingVertical: 48,
    paddingHorizontal: 20,
    marginBottom: 32,
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mobileQuoteHeading: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f4e4c1',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 40,
  },
  mobileQuote: {
    fontSize: 16,
    color: '#c9d1d9',
    lineHeight: 24,
    marginBottom: 12,
  },
  mobileQuoteCheck: {
    fontSize: 16,
    color: '#3fb950',
    lineHeight: 24,
    marginBottom: 8,
  },
  planItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#21262d',
  },
  planText: {
    fontSize: 16,
    color: '#c9d1d9',
    fontWeight: '500',
  },
  planHours: {
    fontSize: 16,
    color: '#3fb950',
    fontWeight: '700',
  },
  planTotal: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#30363d',
  },
  planTotalText: {
    fontSize: 20,
    color: '#f4e4c1',
    fontWeight: '700',
    marginBottom: 4,
  },
  planSubtext: {
    fontSize: 14,
    color: '#8b949e',
  },
  mobileCTASection: {
    paddingHorizontal: 20,
    paddingVertical: 48,
    alignItems: 'center',
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#161b22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mobileCTAHeading: {
    fontSize: 36,
    fontWeight: '700',
    color: '#f4e4c1',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 44,
  },
  mobileCTAText: {
    fontSize: 16,
    color: '#c9d1d9',
    lineHeight: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  mobileCTAButton: {
    backgroundColor: '#238636',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 8,
    marginTop: 16,
  },
  mobileCTAButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f0f6fc',
  },

  webSection: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 64,
    paddingHorizontal: 48,
    borderRadius: 20,
    marginVertical: 24,
    backgroundColor: '#161b22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  webHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  webReverse: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  webHeroText: {
    flex: 1,
    minWidth: 300,
    marginRight: 20,
    marginLeft: 20,
  },
  webTextBlock: {
    flex: 1,
    minWidth: 300,
    marginRight: 20,
    marginLeft: 20,
  },
  webHeroImage: {
    width: '40%',
    maxWidth: 480,
    minWidth: 260,
    aspectRatio: 4 / 3,
    borderRadius: 16,
    backgroundColor: '#161b22',
  },
  webSideImage: {
    width: '40%',
    maxWidth: 420,
    minWidth: 260,
    aspectRatio: 4 / 3,
    borderRadius: 16,
    backgroundColor: '#161b22',
  },
  webHeading: {
    fontSize: 48,
    fontWeight: '600',
    color: '#f4e4c1',
    marginBottom: 24,
    lineHeight: 56,
  },
  webSubheading: {
    fontSize: 24,
    color: '#f4e4c1',
    lineHeight: 36,
    marginBottom: 24,
  },
  webBody: {
    fontSize: 18,
    color: '#c9d1d9',
    lineHeight: 28,
    marginBottom: 16,
  },
  webBulletList: {
    marginVertical: 16,
  },
  webBullet: {
    fontSize: 17,
    color: '#8b949e',
    lineHeight: 26,
    marginBottom: 10,
  },
  webCheckList: {
    marginVertical: 16,
  },
  webCheck: {
    fontSize: 18,
    color: '#3fb950',
    lineHeight: 28,
    marginBottom: 10,
  },
  webFeatureGrid: {
    marginVertical: 24,
  },
  webFeature: {
    backgroundColor: '#1c2128',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  webFeatureTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#fbbf24',
    marginBottom: 8,
  },
  webFeatureText: {
    fontSize: 16,
    color: '#c9d1d9',
    lineHeight: 24,
  },
  webStepGrid: {
    flexDirection: 'row',
    marginVertical: 24,
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  webStep: {
    flex: 1,
    minWidth: 120,
    backgroundColor: '#1c2128',
    padding: 16,
    margin: 8,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  webStepNumber: {
    fontSize: 32,
    marginBottom: 8,
  },
  webStepText: {
    fontSize: 17,
    color: '#58a6ff',
    fontWeight: '600',
    textAlign: 'center',
  },
  webDoubtBox: {
    backgroundColor: '#1c2128',
    padding: 24,
    borderRadius: 12,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  webDoubtText: {
    fontSize: 17,
    color: '#8b949e',
    lineHeight: 26,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  webQuoteSection: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 64,
    paddingHorizontal: 48,
    borderRadius: 20,
    marginVertical: 24,
    backgroundColor: '#161b22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  webQuoteContent: {
    maxWidth: 1000,
    alignSelf: 'center',
  },
  webQuoteHeading: {
    fontSize: 52,
    fontWeight: '700',
    color: '#f4e4c1',
    marginBottom: 48,
    textAlign: 'center',
    lineHeight: 64,
  },
  webQuoteGrid: {
    flexDirection: 'row',
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  webQuoteColumn: {
    flex: 1,
    marginHorizontal: 32,
  },
  webQuoteSubtitle: {
    fontSize: 20,
    color: '#f4e4c1',
    marginBottom: 20,
    fontWeight: '600',
  },
  webQuoteItem: {
    fontSize: 18,
    color: '#8b949e',
    lineHeight: 28,
    marginBottom: 12,
  },
  webQuoteCheck: {
    fontSize: 18,
    color: '#3fb950',
    lineHeight: 28,
    marginBottom: 12,
  },
  webQuoteFooter: {
    fontSize: 22,
    color: '#58a6ff',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 24,
  },
  webPlanContent: {
    maxWidth: 1100,
    alignSelf: 'center',
  },
  webPlanGrid: {
    flexDirection: 'row',
    marginVertical: 32,
    marginHorizontal: -12,
  },
  webPlanCard: {
    flex: 1,
    backgroundColor: '#1c2128',
    padding: 28,
    margin: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  webPlanNumber: {
    fontSize: 40,
    fontWeight: '700',
    color: '#fbbf24',
    marginBottom: 8,
  },
  webPlanLabel: {
    fontSize: 16,
    color: '#c9d1d9',
    marginBottom: 12,
    textAlign: 'center',
  },
  webPlanHours: {
    fontSize: 18,
    color: '#58a6ff',
    fontWeight: '700',
  },
  webPlanTotal: {
    alignItems: 'center',
    paddingVertical: 24,
    borderTopWidth: 2,
    borderTopColor: '#30363d',
    marginBottom: 24,
  },
  webPlanTotalText: {
    fontSize: 28,
    color: '#f4e4c1',
    fontWeight: '700',
    marginBottom: 8,
  },
  webPlanSubtext: {
    fontSize: 16,
    color: '#8b949e',
  },
  webCTASection: {
    maxWidth: 1200,
    width: '100%',
    alignSelf: 'center',
    paddingVertical: 64,
    paddingHorizontal: 48,
    borderRadius: 20,
    marginVertical: 24,
    backgroundColor: '#161b22',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
  },
  webCTAContent: {
    maxWidth: 800,
    alignSelf: 'center',
    alignItems: 'center',
  },
  webCTAHeading: {
    fontSize: 56,
    fontWeight: '700',
    color: '#f4e4c1',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 68,
  },
  webCTAText: {
    fontSize: 20,
    color: '#c9d1d9',
    lineHeight: 32,
    marginBottom: 20,
    textAlign: 'center',
  },
  webCTAButton: {
    backgroundColor: '#238636',
    paddingVertical: 20,
    paddingHorizontal: 64,
    borderRadius: 8,
    marginTop: 24,
  },
  webCTAButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#f0f6fc',
  },

  proFeatureCard: {
    backgroundColor: '#1c2128',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  proFeatureTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fbbf24',
    marginBottom: 8,
  },
  proFeatureText: {
    fontSize: 15,
    color: '#c9d1d9',
    lineHeight: 22,
    marginBottom: 4,
  },

  webProGrid: {
    marginTop: 24,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  webProCard: {
    backgroundColor: '#1c2128',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    minWidth: 300,
    maxWidth: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  webProCardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fbbf24',
    marginBottom: 12,
  },
  webProCardText: {
    fontSize: 17,
    color: '#c9d1d9',
    lineHeight: 26,
    marginBottom: 6,
  },
  webProCardCentered: {
    width: '48%',
    maxWidth: '48%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  centeredText: {
    textAlign: 'center',
  },
});

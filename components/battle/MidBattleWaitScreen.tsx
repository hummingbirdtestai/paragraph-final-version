import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Clock, Sparkles } from 'lucide-react-native';
import { useEffect, useState } from 'react';

export default function MidBattleWaitScreen() {
  const [timeLeft, setTimeLeft] = useState(20);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 1) {
          clearInterval(progressInterval);
          return 1;
        }
        return prev + 0.05;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <View style={styles.container}>
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 500,
        }}
        style={styles.content}
      >
        <View style={styles.timerContainer}>
          <MotiView
            from={{ scale: 1, opacity: 0.3 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'timing',
              duration: 20000,
            }}
            style={[
              styles.progressRing,
              {
                transform: [
                  {
                    scale: 1 - progress * 0.1,
                  },
                ],
              },
            ]}
          />

          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{
              type: 'timing',
              duration: 20000,
            }}
            style={styles.rotatingRing}
          >
            <View style={styles.ringSegment} />
          </MotiView>

          <View style={styles.clockIconContainer}>
            <MotiView
              from={{ scale: 1 }}
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                type: 'timing',
                duration: 1000,
                loop: true,
              }}
            >
              <Clock size={56} color="#FFD600" strokeWidth={2.5} />
            </MotiView>
          </View>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              type: 'timing',
              duration: 1500,
              loop: true,
            }}
            style={styles.timeDisplay}
          >
            <Text style={styles.timeText}>{timeLeft}s</Text>
          </MotiView>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 600,
            delay: 200,
          }}
          style={styles.textContainer}
        >
          <View style={styles.headingRow}>
            <MotiView
              from={{ translateY: 0 }}
              animate={{ translateY: [-2, 2, -2] }}
              transition={{
                type: 'timing',
                duration: 2000,
                loop: true,
              }}
            >
              <Text style={styles.emoji}>⏳</Text>
            </MotiView>
            <Text style={styles.heading}>You joined mid-battle</Text>
          </View>

          <MotiView
            from={{ opacity: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
            }}
          >
            <Text style={styles.subtext}>
              Please wait for the next round to begin
            </Text>
          </MotiView>
        </MotiView>

        <View style={styles.particleContainer}>
          {[...Array(6)].map((_, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 0, scale: 0 }}
              animate={{
                opacity: [0, 0.8, 0],
                translateY: [-40, -100],
                scale: [0, 1, 0],
              }}
              transition={{
                type: 'timing',
                duration: 3000,
                loop: true,
                delay: index * 500,
              }}
              style={[
                styles.particle,
                {
                  left: `${15 + index * 14}%`,
                },
              ]}
            >
              <Sparkles size={16} color="#FFD600" fill="#FFD600" />
            </MotiView>
          ))}
        </View>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: [0.08, 0.2, 0.08] }}
        transition={{
          type: 'timing',
          duration: 3000,
          loop: true,
        }}
        style={styles.backgroundGlow}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    zIndex: 10,
  },
  timerContainer: {
    position: 'relative',
    width: 200,
    height: 200,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 48,
  },
  progressRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#FFD600',
    opacity: 0.2,
  },
  rotatingRing: {
    position: 'absolute',
    width: 200,
    height: 200,
  },
  ringSegment: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#FFD600',
    borderRightColor: '#FFD600',
  },
  clockIconContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    position: 'absolute',
    bottom: -40,
  },
  timeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFD600',
    letterSpacing: 1,
  },
  textContainer: {
    alignItems: 'center',
  },
  headingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  emoji: {
    fontSize: 28,
  },
  heading: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  particleContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
  },
  particle: {
    position: 'absolute',
    bottom: '20%',
  },
  backgroundGlow: {
    position: 'absolute',
    top: '25%',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#FFD600',
    opacity: 0.1,
  },
});

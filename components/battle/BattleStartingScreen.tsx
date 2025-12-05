import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import { Zap } from 'lucide-react-native';

export default function BattleStartingScreen() {
  return (
    <View style={styles.container}>
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: 'timing',
          duration: 600,
        }}
        style={styles.content}
      >
        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{
            type: 'timing',
            duration: 2000,
            loop: true,
          }}
          style={styles.glowRing}
        />

        <MotiView
          from={{ scale: 1 }}
          animate={{ scale: [1, 1.15, 1] }}
          transition={{
            type: 'timing',
            duration: 2000,
            loop: true,
            delay: 400,
          }}
          style={styles.iconContainer}
        >
          <MotiView
            from={{ rotate: '0deg' }}
            animate={{ rotate: '360deg' }}
            transition={{
              type: 'timing',
              duration: 3000,
              loop: true,
            }}
          >
            <Zap size={72} color="#00FFD1" fill="#00FFD1" />
          </MotiView>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{
            type: 'timing',
            duration: 800,
            delay: 300,
          }}
          style={styles.textContainer}
        >
          <MotiView
            from={{ opacity: 1 }}
            animate={{ opacity: [1, 0.7, 1] }}
            transition={{
              type: 'timing',
              duration: 1500,
              loop: true,
            }}
          >
            <Text style={styles.emoji}>🔥</Text>
          </MotiView>

          <Text style={styles.heading}>The Battle Begins Soon!</Text>

          <MotiView
            from={{ opacity: 0.6 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{
              type: 'timing',
              duration: 2000,
              loop: true,
            }}
          >
            <Text style={styles.subtext}>
              Waiting for the host to start the first question
            </Text>
          </MotiView>

          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((index) => (
              <MotiView
                key={index}
                from={{ opacity: 0.3, scale: 0.8 }}
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{
                  type: 'timing',
                  duration: 1200,
                  loop: true,
                  delay: index * 200,
                }}
                style={styles.dot}
              />
            ))}
          </View>
        </MotiView>
      </MotiView>

      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: [0.1, 0.3, 0.1] }}
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
  glowRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#00FFD1',
    opacity: 0.15,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 42,
    marginBottom: 12,
  },
  heading: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subtext: {
    fontSize: 16,
    color: '#A0A0A0',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 320,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 24,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FFD1',
  },
  backgroundGlow: {
    position: 'absolute',
    top: '20%',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#00FFD1',
    opacity: 0.1,
  },
});

# CelebrationPopup Component

A premium, animated celebration popup component for milestone achievements in the Paragraph NEET-PG learning app.

## Features

- ✨ Smooth spring animations with bounce effect
- 🎯 Auto-dismiss with configurable delay
- 📱 Haptic feedback on iOS/Android
- 🌟 Floating sparkle decorations
- 🎨 Glass-morphic design with neon mint glow
- 🖼️ Supports GIF animations or placeholder emoji
- 🌙 Optimized for dark mode
- 📱 Responsive and works on Web + Mobile

## Usage

### Basic Example

```tsx
import { useState } from 'react';
import CelebrationPopup from '@/components/CelebrationPopup';

function MyComponent() {
  const [showCelebration, setShowCelebration] = useState(false);

  const handleStreakComplete = () => {
    setShowCelebration(true);
  };

  return (
    <>
      <Button onPress={handleStreakComplete}>Complete Streak</Button>

      <CelebrationPopup
        visible={showCelebration}
        onClose={() => setShowCelebration(false)}
        message="🔥 Amazing! 5 day streak!"
      />
    </>
  );
}
```

### With Custom GIF

```tsx
<CelebrationPopup
  visible={showCelebration}
  onClose={() => setShowCelebration(false)}
  message="🏆 Victory! You won the battle!"
  gifUrl="https://example.com/celebration.gif"
  autoDismissDelay={3000}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | Required | Controls popup visibility |
| `onClose` | `() => void` | Required | Callback when popup closes |
| `message` | `string` | "🔥 Great job! You hit a streak!" | Celebration message |
| `gifUrl` | `string` | `undefined` | URL to GIF animation (optional) |
| `autoDismissDelay` | `number` | 2500 | Auto-dismiss delay in milliseconds |

## Use Cases

### 1. Streak Milestones
```tsx
<CelebrationPopup
  visible={streakComplete}
  onClose={() => setStreakComplete(false)}
  message="🔥 Great job! You hit a streak!"
/>
```

### 2. Concept Mastery
```tsx
<CelebrationPopup
  visible={conceptMastered}
  onClose={() => setConceptMastered(false)}
  message="⭐ Concept Mastered! Keep going!"
/>
```

### 3. Battle Victory
```tsx
<CelebrationPopup
  visible={battleWon}
  onClose={() => setBattleWon(false)}
  message="🏆 Victory! You won the battle!"
/>
```

### 4. Mock Test Completion
```tsx
<CelebrationPopup
  visible={testComplete}
  onClose={() => setTestComplete(false)}
  message="✅ Mock test completed! Great work!"
/>
```

## Design Specifications

- **Popup Width**: 280px (max, responsive to screen width)
- **Background**: #0B141A (app dark background)
- **Border**: 1.5px solid #25D366 (mint green)
- **Border Radius**: 24px
- **GIF Container Height**: 160px
- **Text Color**: #FFFFFF
- **Font Size**: 18px (message)
- **Font Weight**: 600 (semibold)
- **Glow Effect**: Mint green shadow (#25D366)

## Animation Details

1. **Entry Animation**:
   - Scale: 0 → 1.1 → 1 (spring with bounce)
   - Opacity: 0 → 1
   - Duration: ~600ms

2. **Exit Animation**:
   - Scale: 1 → 0.8
   - Opacity: 1 → 0
   - Duration: 200ms

3. **Sparkles**:
   - 3 sparkle elements (✨⭐✨)
   - Staggered appearance
   - Float upward with fade
   - Duration: 400ms each

## Integration with Streak Tracking

```tsx
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import CelebrationPopup from '@/components/CelebrationPopup';

function PracticeScreen() {
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const completeDaily = async () => {
    const { data } = await supabase
      .from('user_progress')
      .select('streak_count')
      .single();

    const newStreak = (data?.streak_count || 0) + 1;
    setCurrentStreak(newStreak);

    await supabase
      .from('user_progress')
      .update({
        streak_count: newStreak,
        last_practice_date: new Date().toISOString()
      });

    if (newStreak % 5 === 0) {
      setShowStreakCelebration(true);
    }
  };

  return (
    <>
      <Button onPress={completeDaily}>Complete Daily Practice</Button>

      <CelebrationPopup
        visible={showStreakCelebration}
        onClose={() => setShowStreakCelebration(false)}
        message={`🔥 Amazing! ${currentStreak} day streak!`}
      />
    </>
  );
}
```

## Customization Tips

1. **Change Border Color**: Modify `borderColor` in `styles.popup`
2. **Adjust Glow**: Change `shadowColor` in `styles.glowContainer`
3. **Different Emojis**: Pass different emojis in the message prop
4. **Longer Display**: Increase `autoDismissDelay` prop value
5. **Custom Size**: Adjust width in `styles.container`

## Accessibility

- Auto-dismiss ensures users aren't blocked
- Tap anywhere to close immediately
- Haptic feedback provides tactile confirmation
- High contrast text for readability

## Performance

- Uses `react-native-reanimated` for 60fps animations
- Minimal re-renders
- Efficient shadow rendering
- Platform-specific optimizations

## Browser Compatibility

- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Desktop Chrome/Firefox/Safari
- ✅ React Native iOS
- ✅ React Native Android

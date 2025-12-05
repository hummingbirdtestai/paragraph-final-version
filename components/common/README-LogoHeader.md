# LogoHeader Component - Usage Guide

## Overview
The `LogoHeader` component displays the Paragraph logo at the top-left corner of screens with responsive sizing and dark mode styling.

## Component Features

### ✅ Relative Positioning
- Uses `position: 'relative'` (not fixed)
- Flows naturally with page content
- No z-index conflicts

### ✅ Responsive Sizing
- **Desktop (≥1024px):** 160px width
- **Tablet (768-1023px):** 130px width
- **Mobile (<768px):** 100px width
- Height automatically calculated (40% of width)

### ✅ Dark Mode Styling
- Background: `#0B0B0B`
- Border: `#1a1a1a`
- Subtle shadow with elevation: 4

### ✅ Professional Design
- Padding: 16px horizontal, 12px vertical
- Shadow: opacity 0.2, radius 3.84
- Border bottom for separation

## Installation & Import

```tsx
import LogoHeader from '@/components/common/LogoHeader';
```

## Usage Examples

### Example 1: Basic Screen with ScrollView (Recommended)

```tsx
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import LogoHeader from '@/components/common/LogoHeader';

export default function MyScreen() {
  return (
    <View style={styles.container}>
      <LogoHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Content</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    color: '#ffffff',
    fontWeight: '700',
  },
});
```

### Example 2: Using ScreenWithLogo Wrapper (Simplest)

```tsx
import ScreenWithLogo from '@/components/common/ScreenWithLogo';
import { ScrollView, Text } from 'react-native';

export default function MyScreen() {
  return (
    <ScreenWithLogo>
      <ScrollView>
        <Text style={{ color: '#fff' }}>Your content here</Text>
      </ScrollView>
    </ScreenWithLogo>
  );
}
```

## Design Specifications

### Colors
- **Header Background:** `#0B0B0B`
- **Border:** `#1a1a1a`
- **Shadow:** `#000` with opacity 0.2

### Spacing
- **Horizontal Padding:** 16px
- **Vertical Padding:** 12px

### Shadow & Elevation
- **Shadow Offset:** { width: 0, height: 2 }
- **Shadow Opacity:** 0.2
- **Shadow Radius:** 3.84
- **Elevation (Android):** 4

### Logo Sizes
```
Desktop:  160px × 64px
Tablet:   130px × 52px
Mobile:   100px × 40px
```

## Best Practices

### ✅ DO:
- Place `<LogoHeader />` as the first child in your screen container
- Use dark background for parent container
- Let content flow naturally below the header

### ❌ DON'T:
- Add custom `marginTop` to the header
- Modify logo aspect ratio
- Override elevation without testing both platforms

## Content Spacing

Content flows naturally below the header. No manual spacing needed!

```tsx
// ✅ Good - Content flows naturally
<View style={{ flex: 1 }}>
  <LogoHeader />
  <ScrollView>
    <Text>Content starts here</Text>
  </ScrollView>
</View>
```

## Complete Screen Template

```tsx
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import LogoHeader from '@/components/common/LogoHeader';

export default function MyScreen() {
  return (
    <View style={styles.container}>
      <LogoHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>My Screen</Text>
        <Text style={styles.text}>Content flows naturally below the header.</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: '#b0b0b0',
    lineHeight: 24,
  },
});
```

## Summary

✅ Relative positioning - Content flows naturally
✅ Responsive sizing - Desktop/Tablet/Mobile
✅ Dark mode ready - Perfect for dark themes
✅ Simple integration - Just add at top of screen
✅ No manual spacing - Content adjusts automatically

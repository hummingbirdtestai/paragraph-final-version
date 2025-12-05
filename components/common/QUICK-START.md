# LogoHeader - Quick Start Guide

## 🚀 Add Logo to Any Screen in 3 Steps

### Step 1: Import
```tsx
import LogoHeader from '@/components/common/LogoHeader';
```

### Step 2: Add to Screen
```tsx
export default function MyScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <LogoHeader />
      <ScrollView>
        {/* Your content */}
      </ScrollView>
    </View>
  );
}
```

### Step 3: Done! ✅
Content flows naturally below the header. No spacing calculations needed.

---

## 📱 Logo Sizes

- **Desktop:** 160px
- **Tablet:** 130px
- **Mobile:** 100px

Automatically responsive!

---

## 🎨 Design

- Background: `#0B0B0B` (dark grey)
- Border: `#1a1a1a`
- Shadow: elevation 4
- Padding: 16px horizontal, 12px vertical

---

## ✅ Key Points

1. **Relative positioning** - content flows naturally
2. **No marginTop needed** - header is part of the flow
3. **Responsive** - sizes automatically
4. **Dark mode ready** - perfect for dark themes

---

## 📝 Complete Example

```tsx
import React from 'react';
import { View, ScrollView, Text, StyleSheet } from 'react-native';
import LogoHeader from '@/components/common/LogoHeader';

export default function MyScreen() {
  return (
    <View style={styles.container}>
      <LogoHeader />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.text}>Your content here</Text>
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
  text: {
    fontSize: 16,
    color: '#b0b0b0',
  },
});
```

---

## 🔗 More Info

See `README-LogoHeader.md` for detailed documentation and advanced examples.

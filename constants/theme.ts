export const theme = {
  colors: {
    background: '#0D0D0D',
    mentorBubble: '#1A1A1A',
    studentBubble: '#121212',
    accent: '#00A67E',
    text: '#E0E0E0',
    textSecondary: '#A0A0A0',
    border: '#2A2A2A',
    success: '#00A67E',
    error: '#FF4444',
    warning: '#FFA500',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  typography: {
    body: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '400' as const,
    },
    bodySmall: {
      fontSize: 14,
      lineHeight: 20,
      fontWeight: '400' as const,
    },
    heading: {
      fontSize: 18,
      lineHeight: 22,
      fontWeight: '600' as const,
    },
    caption: {
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '400' as const,
    },
  },
};

export type Theme = typeof theme;
import { View, Text, StyleSheet } from 'react-native';

interface FocusKpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color?: string;
}

export default function FocusKpiCard({ label, value, icon, color = '#25D366' }: FocusKpiCardProps) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
        {icon}
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1f2937',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    minWidth: 140,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    display: 'flex',
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

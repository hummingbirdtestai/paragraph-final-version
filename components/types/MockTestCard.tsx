//MockTestCard.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Calendar } from 'lucide-react-native';

interface MockTestCardProps {
  title: string;
  date: string;
  buttonText: string;
  buttonVariant: 'filled' | 'outlined';
  onPress: () => void;
}

export function MockTestCard({ title, date, buttonText, buttonVariant, onPress }: MockTestCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.dateContainer}>
          <Calendar color="#888" size={14} />
          <Text style={styles.date}>{date}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={[
          styles.button,
          buttonVariant === 'filled' ? styles.buttonFilled : styles.buttonOutlined
        ]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText,
          buttonVariant === 'filled' ? styles.buttonTextFilled : styles.buttonTextOutlined
        ]}>
          {buttonText}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#0f0f0f',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardContent: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 6,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 13,
    color: '#888',
    marginLeft: 6,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  buttonFilled: {
    backgroundColor: '#25D366',
  },
  buttonOutlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#25D366',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextFilled: {
    color: '#000',
  },
  buttonTextOutlined: {
    color: '#25D366',
  },
});

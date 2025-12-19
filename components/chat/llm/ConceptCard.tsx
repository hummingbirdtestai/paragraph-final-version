import { View, Text, StyleSheet } from 'react-native';
import MarkdownText from '@/components/types/MarkdownText';

export function ConceptCard({ title, text }: { title?: string; text: string }) {
  return (
    <View style={styles.container}>
      {title && <Text style={styles.title}>{title}</Text>}
      <MarkdownText>{text}</MarkdownText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    color: '#9BE7C4',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 6,
  },
});

import { View, Text, StyleSheet } from 'react-native';

export function TableCard({ rows }: { rows: string[][] }) {
  return (
    <View style={styles.table}>
      {rows.map((row, i) => (
        <View key={i} style={styles.row}>
          <Text style={styles.cellLeft}>{row[0]}</Text>
          <Text style={styles.cellRight}>{row[1]}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  table: {
    marginVertical: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#2a2a2a',
  },
  row: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cellLeft: {
    flex: 1,
    color: '#e1e1e1',
    fontWeight: '600',
  },
  cellRight: {
    flex: 1,
    color: '#bdbdbd',
  },
});

import { Text, View, StyleSheet } from 'react-native';

interface MarkdownTextProps {
  children: string;
}

export default function MarkdownText({ children }: MarkdownTextProps) {
  const lines = children.split('\n');
  const elements: JSX.Element[] = [];
  let listIndex = 0;

  lines.forEach((line, index) => {
    if (!line.trim()) {
      elements.push(<View key={`space-${index}`} style={styles.spacing} />);
      return;
    }

    // Heading 1
    if (line.startsWith('# ')) {
      elements.push(
        <Text key={index} style={styles.h1}>
          {parseLine(line.substring(2))}
        </Text>
      );
    }
    // Heading 3
    else if (line.startsWith('### ')) {
      elements.push(
        <Text key={index} style={styles.h3}>
          {parseLine(line.substring(4))}
        </Text>
      );
    }
    // Heading 2
    else if (line.startsWith('## ')) {
      elements.push(
        <Text key={index} style={styles.h2}>
          {parseLine(line.substring(3))}
        </Text>
      );
    }
    // Numbered list
    else if (line.match(/^\d+\.\s/)) {
      listIndex++;
      const content = line.replace(/^\d+\.\s/, '');
      elements.push(
        <View key={index} style={styles.listItem}>
          <Text style={styles.listNumber}>{listIndex}. </Text>
          <Text style={styles.listText}>{parseLine(content)}</Text>
        </View>
      );
    }
    // Regular paragraph
    else {
      elements.push(
        <Text key={index} style={styles.paragraph}>
          {parseLine(line)}
        </Text>
      );
    }
  });

  return <View style={styles.container}>{elements}</View>;
}

function parseLine(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = [];
  let currentText = '';
  let i = 0;

  while (i < text.length) {
    // Bold text **text**
    if (text[i] === '*' && text[i + 1] === '*') {
      if (currentText) {
        parts.push(currentText);
        currentText = '';
      }

      const endIndex = text.indexOf('**', i + 2);
      if (endIndex !== -1) {
        const boldText = text.substring(i + 2, endIndex);
        parts.push(
          <Text key={`bold-${i}`} style={styles.bold}>
            {boldText}
          </Text>
        );
        i = endIndex + 2;
        continue;
      }
    }

    // Italic text *text*
    if (text[i] === '*' && text[i + 1] !== '*') {
      if (currentText) {
        parts.push(currentText);
        currentText = '';
      }

      const endIndex = text.indexOf('*', i + 1);
      if (endIndex !== -1) {
        const italicText = text.substring(i + 1, endIndex);
        parts.push(
          <Text key={`italic-${i}`} style={styles.italic}>
            {italicText}
          </Text>
        );
        i = endIndex + 1;
        continue;
      }
    }

    currentText += text[i];
    i++;
  }

  if (currentText) {
    parts.push(currentText);
  }

  return parts.length > 0 ? parts : [text];
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  spacing: {
    height: 8,
  },
  h1: {
    color: '#25D366',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    lineHeight: 28,
  },
  h2: {
    color: '#32CD32',
    fontSize: 19,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 8,
    lineHeight: 24,
  },
  h3: {
    color: '#90EE90',
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 22,
  },
  paragraph: {
    color: '#e1e1e1',
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 6,
  },
  listItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 4,
  },
  listNumber: {
    color: '#25D366',
    fontSize: 15,
    fontWeight: '600',
    marginRight: 4,
  },
  listText: {
    color: '#e1e1e1',
    fontSize: 15,
    lineHeight: 23,
    flex: 1,
  },
  bold: {
    color: '#ffffff',
    fontWeight: '700',
  },
  italic: {
    fontStyle: 'italic',
    color: '#e1e1e1',
  },
});

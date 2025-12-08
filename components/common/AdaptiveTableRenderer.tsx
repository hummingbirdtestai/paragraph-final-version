import React from 'react';
import { View, Text, StyleSheet, useWindowDimensions } from 'react-native';
import Markdown from 'react-native-markdown-display';

interface TableData {
  headers: string[];
  rows: string[][];
}

interface ContentBlock {
  type: 'markdown' | 'table';
  content: string | TableData;
}

// Parse markdown to extract tables and other content
function parseMarkdownContent(markdown: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = markdown.split('\n');
  let currentMarkdown: string[] = [];
  let currentTable: string[] = [];
  let inTable = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isTableLine = line.trim().startsWith('|') && line.trim().endsWith('|');
    const isSeparatorLine = /^\|\s*[-:]+\s*(\|\s*[-:]+\s*)*\|$/.test(line.trim());

    if (isTableLine) {
      // Start or continue table
      if (!inTable) {
        // Save accumulated markdown
        if (currentMarkdown.length > 0) {
          blocks.push({
            type: 'markdown',
            content: currentMarkdown.join('\n'),
          });
          currentMarkdown = [];
        }
        inTable = true;
      }
      currentTable.push(line);
    } else {
      // Not a table line
      if (inTable) {
        // End of table - process it
        if (currentTable.length > 0) {
          const tableData = parseTable(currentTable);
          if (tableData) {
            blocks.push({
              type: 'table',
              content: tableData,
            });
          }
          currentTable = [];
        }
        inTable = false;
      }
      currentMarkdown.push(line);
    }
  }

  // Handle remaining content
  if (inTable && currentTable.length > 0) {
    const tableData = parseTable(currentTable);
    if (tableData) {
      blocks.push({
        type: 'table',
        content: tableData,
      });
    }
  }

  if (currentMarkdown.length > 0) {
    blocks.push({
      type: 'markdown',
      content: currentMarkdown.join('\n'),
    });
  }

  return blocks;
}

// Parse a table into structured data
function parseTable(tableLines: string[]): TableData | null {
  if (tableLines.length < 2) return null;

  // Remove separator line (second line with dashes)
  const filteredLines = tableLines.filter(
    (line) => !/^\|\s*[-:]+\s*(\|\s*[-:]+\s*)*\|$/.test(line.trim())
  );

  if (filteredLines.length === 0) return null;

  // Parse header
  const headers = filteredLines[0]
    .split('|')
    .map((cell) => cell.trim())
    .filter((cell) => cell.length > 0);

  // Parse rows
  const rows = filteredLines.slice(1).map((line) =>
    line
      .split('|')
      .map((cell) => cell.trim())
      .filter((cell) => cell.length > 0)
  );

  return { headers, rows };
}

// Render inline markdown formatting (bold, italic, etc.)
function renderFormattedText(text: string, styles: any, isMobile: boolean) {
  // Handle bold+italic: ***text***
  const boldItalicRegex = /\*\*\*(.*?)\*\*\*/g;
  // Handle bold: **text**
  const boldRegex = /\*\*(.*?)\*\*/g;
  // Handle italic: *text*
  const italicRegex = /\*(.*?)\*/g;
  // Handle inline code: `code`
  const codeRegex = /`([^`]+)`/g;

  const parts: JSX.Element[] = [];

  // Process bold+italic first
  let processedText = text.replace(boldItalicRegex, (match, content) => {
    return `__BI_START__${content}__BI_END__`;
  });

  // Process bold
  processedText = processedText.replace(boldRegex, (match, content) => {
    return `__B_START__${content}__B_END__`;
  });

  // Process italic
  processedText = processedText.replace(italicRegex, (match, content) => {
    return `__I_START__${content}__I_END__`;
  });

  // Process inline code
  processedText = processedText.replace(codeRegex, (match, content) => {
    return `__CODE_START__${content}__CODE_END__`;
  });

  // Split by line breaks first to handle multiline content
  const lines = processedText.split('\n');

  return (
    <Text style={styles.cellText}>
      {lines.map((line, lineIndex) => (
        <React.Fragment key={`line-${lineIndex}`}>
          {lineIndex > 0 && '\n'}
          {renderLine(line, styles)}
        </React.Fragment>
      ))}
    </Text>
  );
}

// Render a single line with formatting
function renderLine(line: string, styles: any) {
  const segments = line.split(/(__(?:BI|B|I|CODE)_(?:START|END)__)/);
  const parts: JSX.Element[] = [];
  let currentStyle: 'normal' | 'bold' | 'italic' | 'bolditalic' | 'code' = 'normal';

  segments.forEach((segment, index) => {
    if (segment === '__BI_START__') {
      currentStyle = 'bolditalic';
    } else if (segment === '__BI_END__') {
      currentStyle = 'normal';
    } else if (segment === '__B_START__') {
      currentStyle = 'bold';
    } else if (segment === '__B_END__') {
      currentStyle = 'normal';
    } else if (segment === '__I_START__') {
      currentStyle = 'italic';
    } else if (segment === '__I_END__') {
      currentStyle = 'normal';
    } else if (segment === '__CODE_START__') {
      currentStyle = 'code';
    } else if (segment === '__CODE_END__') {
      currentStyle = 'normal';
    } else if (segment.length > 0) {
      let textStyle = styles.cellText;

      if (currentStyle === 'bold') {
        textStyle = [styles.cellText, styles.boldText];
      } else if (currentStyle === 'italic') {
        textStyle = [styles.cellText, styles.italicText];
      } else if (currentStyle === 'bolditalic') {
        textStyle = [styles.cellText, styles.boldText, styles.italicText];
      } else if (currentStyle === 'code') {
        textStyle = [styles.cellText, styles.codeText];
      }

      parts.push(
        <Text key={`segment-${index}`} style={textStyle}>
          {segment}
        </Text>
      );
    }
  });

  return <>{parts}</>;
}

// Mobile: Render table as vertically stacked fact cards
function MobileTableRenderer({ tableData, styles }: { tableData: TableData; styles: any }) {
  const { headers, rows } = tableData;

  return (
    <View style={styles.mobileTableContainer}>
      {rows.map((row, rowIndex) => {
        if (!row || row.length === 0) return null;

        return (
          <View key={`row-${rowIndex}`} style={styles.factCard}>
            {/* First cell as header/title */}
            <View style={styles.factCardHeader}>
              <Text style={styles.factCardTitle}>
                {renderFormattedText(row[0] || '', styles, true)}
              </Text>
            </View>

            {/* Subsequent cells as labeled sections */}
            {row.slice(1).map((cell, cellIndex) => {
              const label = headers[cellIndex + 1] || `Field ${cellIndex + 1}`;
              const isLastSection = cellIndex === row.slice(1).length - 1;
              return (
                <View
                  key={`cell-${rowIndex}-${cellIndex}`}
                  style={[
                    styles.factCardSection,
                    isLastSection && styles.factCardSectionLast,
                  ]}
                >
                  <Text style={styles.factCardLabel}>{label}</Text>
                  <View style={styles.factCardValue}>
                    {renderFormattedText(cell, styles, true)}
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
}

// Web: Render table as standard multi-column table
function WebTableRenderer({ tableData, styles }: { tableData: TableData; styles: any }) {
  const { headers, rows } = tableData;

  return (
    <View style={styles.webTableContainer}>
      {/* Header Row */}
      <View style={styles.webTableHeader}>
        {headers.map((header, index) => (
          <View
            key={`header-${index}`}
            style={[
              styles.webTableHeaderCell,
              index === headers.length - 1 && styles.webTableLastCell,
            ]}
          >
            <Text style={styles.webTableHeaderText}>
              {renderFormattedText(header, styles, false)}
            </Text>
          </View>
        ))}
      </View>

      {/* Data Rows */}
      {rows.map((row, rowIndex) => (
        <View
          key={`row-${rowIndex}`}
          style={[
            styles.webTableRow,
            rowIndex === rows.length - 1 && styles.webTableLastRow,
          ]}
        >
          {row.map((cell, cellIndex) => (
            <View
              key={`cell-${rowIndex}-${cellIndex}`}
              style={[
                styles.webTableCell,
                cellIndex === row.length - 1 && styles.webTableLastCell,
              ]}
            >
              {renderFormattedText(cell, styles, false)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// Main Adaptive Table Renderer Component
export default function AdaptiveTableRenderer({
  markdown,
  markdownStyles,
  isMobile,
}: {
  markdown: string;
  markdownStyles: any;
  isMobile: boolean;
}) {
  const blocks = parseMarkdownContent(markdown);

  return (
    <View style={localStyles.container}>
      {blocks.map((block, index) => {
        if (block.type === 'markdown') {
          return (
            <View
              key={`md-${index}`}
              style={isMobile ? localStyles.markdownBlockMobile : localStyles.markdownBlockWeb}
            >
              <Markdown style={markdownStyles}>
                {block.content as string}
              </Markdown>
            </View>
          );
        } else if (block.type === 'table') {
          const tableData = block.content as TableData;
          return isMobile ? (
            <MobileTableRenderer
              key={`table-${index}`}
              tableData={tableData}
              styles={localStyles}
            />
          ) : (
            <WebTableRenderer
              key={`table-${index}`}
              tableData={tableData}
              styles={localStyles}
            />
          );
        }
        return null;
      })}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%',
  },
  markdownBlockMobile: {
    paddingHorizontal: 16,
  },
  markdownBlockWeb: {
    width: '100%',
  },

  // Mobile Fact Card Styles
  mobileTableContainer: {
    marginVertical: 16,
    width: '100%',
    paddingHorizontal: 16,
  },
  factCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
    overflow: 'hidden',
  },
  factCardHeader: {
    backgroundColor: '#0f0f0f',
    padding: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#10b981',
  },
  factCardTitle: {
    color: '#10b981',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 24,
  },
  factCardSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  factCardSectionLast: {
    borderBottomWidth: 0,
  },
  factCardLabel: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  factCardValue: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cellText: {
    color: '#e1e1e1',
    fontSize: 15,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: '700',
    color: '#ffffff',
  },
  italicText: {
    fontStyle: 'italic',
  },
  codeText: {
    backgroundColor: '#0d0d0d',
    color: '#f59e0b',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontFamily: 'monospace',
  },

  // Web Table Styles
  webTableContainer: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    marginVertical: 18,
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  webTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#0f0f0f',
    borderBottomWidth: 2,
    borderBottomColor: '#10b981',
  },
  webTableHeaderCell: {
    flex: 1,
    padding: 14,
    borderRightWidth: 1,
    borderRightColor: '#333',
    minWidth: 120,
  },
  webTableHeaderText: {
    color: '#10b981',
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 22,
  },
  webTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  webTableLastRow: {
    borderBottomWidth: 0,
  },
  webTableCell: {
    flex: 1,
    padding: 14,
    borderRightWidth: 1,
    borderRightColor: '#333',
    minWidth: 120,
    justifyContent: 'center',
  },
  webTableLastCell: {
    borderRightWidth: 0,
  },
});

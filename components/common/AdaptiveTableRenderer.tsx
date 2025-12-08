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

interface Section {
  heading?: string;
  headingLevel?: number;
  blocks: ContentBlock[];
}

// Remove any remaining code fences from content
function removeFences(text: string): string {
  let cleaned = text.trim();

  // Remove standalone backtick lines
  cleaned = cleaned.split('\n')
    .filter(line => {
      const trimmedLine = line.trim();
      // Filter out lines that are just backticks
      return !(/^`{3,}[a-zA-Z]*\s*$/.test(trimmedLine));
    })
    .join('\n');

  // Also remove any fence blocks that wrap content
  cleaned = cleaned.replace(/```[a-zA-Z]*\n/g, '');
  cleaned = cleaned.replace(/\n?```\s*$/g, '');

  return cleaned.trim();
}

// Parse markdown into sections based on headings
function parseMarkdownIntoSections(markdown: string): Section[] {
  // First pass: remove any remaining code fences
  const cleanedMarkdown = removeFences(markdown);

  const lines = cleanedMarkdown.split('\n');
  const sections: Section[] = [];
  let currentSection: Section = { blocks: [] };
  let currentContent: string[] = [];

  const isHeading = (line: string) => {
    return /^#{1,3}\s+/.test(line.trim());
  };

  const getHeadingLevel = (line: string): number => {
    const match = line.match(/^(#{1,3})\s+/);
    return match ? match[1].length : 0;
  };

  const getHeadingText = (line: string): string => {
    // Keep markdown formatting intact - it will be rendered by Markdown component
    return line.replace(/^#{1,3}\s+/, '').trim();
  };

  const flushCurrentContent = () => {
    if (currentContent.length > 0) {
      const contentText = currentContent.join('\n').trim();
      if (contentText) {
        const contentBlocks = parseContentIntoBlocks(contentText);
        currentSection.blocks.push(...contentBlocks);
      }
      currentContent = [];
    }
  };

  for (const line of lines) {
    if (isHeading(line)) {
      // Flush current content and save current section
      flushCurrentContent();

      if (currentSection.heading || currentSection.blocks.length > 0) {
        sections.push(currentSection);
      }

      // Start new section
      currentSection = {
        heading: getHeadingText(line),
        headingLevel: getHeadingLevel(line),
        blocks: [],
      };
    } else {
      currentContent.push(line);
    }
  }

  // Flush remaining content
  flushCurrentContent();
  if (currentSection.heading || currentSection.blocks.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

// Parse content into blocks (tables and markdown)
function parseContentIntoBlocks(content: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = content.split('\n');
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
function MobileTableRenderer({
  tableData,
  styles,
  markdownStyles,
  markdownRules,
}: {
  tableData: TableData;
  styles: any;
  markdownStyles: any;
  markdownRules?: any;
})
 {
  const { headers, rows } = tableData;

  return (
    <View style={styles.mobileTableContainer}>
      {rows.map((row, rowIndex) => {
        if (!row || row.length === 0) return null;

        return (
          <View key={`row-${rowIndex}`} style={styles.factCard}>
            {/* First cell as header/title */}
            <View style={styles.factCardHeader}>
              <View style={{ flex: 1, width: '100%' }}>
                <Markdown style={markdownStyles} rules={markdownRules}>
                  {row[0] || ''}
                </Markdown>
              </View>
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
                  <View style={{ width: '100%' }}>
                    <Markdown
                      style={{
                        ...markdownStyles,
                        body: styles.factCardLabel,
                        paragraph: {
                          ...styles.factCardLabel,
                          margin: 0,
                          padding: 0,
                        },
                        strong: {
                          fontWeight: '700',
                          color: '#3b82f6',
                        },
                        em: {
                          fontStyle: 'italic',
                          color: '#3b82f6',
                        },
                      }}
                      rules={markdownRules}
                    >
                      {label}
                    </Markdown>
                  </View>
                  <View style={styles.factCardValue}>
                    <View style={{ flex: 1, width: '100%' }}>
                      <Markdown style={markdownStyles} rules={markdownRules}>
                        {cell}
                      </Markdown>
                    </View>
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
function WebTableRenderer({
  tableData,
  styles,
  markdownStyles,
  markdownRules,
}: {
  tableData: TableData;
  styles: any;
  markdownStyles: any;
  markdownRules?: any;
})
 {
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
            <View style={{ flex: 1, width: '100%' }}>
              <Markdown
                style={{
                  ...markdownStyles,
                  body: styles.webTableHeaderText,
                  paragraph: {
                    ...styles.webTableHeaderText,
                    margin: 0,
                    padding: 0,
                  },
                  strong: {
                    fontWeight: '700',
                    color: '#10b981',
                  },
                  em: {
                    fontStyle: 'italic',
                    color: '#10b981',
                  },
                }}
                rules={markdownRules}
              >
                {header}
              </Markdown>
            </View>
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
              <View style={{ flex: 1, width: '100%' }}>
                <Markdown style={markdownStyles} rules={markdownRules}>
                  {cell}
                </Markdown>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

// Render a single section with its heading and content blocks
function SectionRenderer({
  section,
  markdownStyles,
  markdownRules,
  isMobile,
  sectionIndex,
}: {
  section: Section;
  markdownStyles: any;
  markdownRules?: any;
  isMobile: boolean;
  sectionIndex: number;
}) {
  const hasHeading = section.heading && section.heading.length > 0;

  return (
    <View style={[localStyles.sectionBox, isMobile ? localStyles.sectionBoxMobile : localStyles.sectionBoxWeb]}>
      {hasHeading && (
        <View style={localStyles.sectionHeadingContainer}>
          <Markdown
            style={{
              body: {
                ...localStyles.sectionHeading,
                ...(section.headingLevel === 1 ? localStyles.sectionHeading1 : {}),
                ...(section.headingLevel === 2 ? localStyles.sectionHeading2 : {}),
                ...(section.headingLevel === 3 ? localStyles.sectionHeading3 : {}),
              },
              paragraph: {
                ...localStyles.sectionHeading,
                ...(section.headingLevel === 1 ? localStyles.sectionHeading1 : {}),
                ...(section.headingLevel === 2 ? localStyles.sectionHeading2 : {}),
                ...(section.headingLevel === 3 ? localStyles.sectionHeading3 : {}),
                margin: 0,
                padding: 0,
              },
              strong: {
                fontWeight: '700',
                color: section.headingLevel === 1 ? '#10b981' :
                       section.headingLevel === 2 ? '#3b82f6' :
                       section.headingLevel === 3 ? '#8b5cf6' : '#10b981',
              },
              em: {
                fontStyle: 'italic',
                color: section.headingLevel === 1 ? '#10b981' :
                       section.headingLevel === 2 ? '#3b82f6' :
                       section.headingLevel === 3 ? '#8b5cf6' : '#10b981',
              },
            }}
            rules={markdownRules}
          >
            {section.heading}
          </Markdown>
        </View>
      )}

      <View style={localStyles.sectionContent}>
        {section.blocks.map((block, blockIndex) => {
          if (block.type === 'markdown') {
            return (
              <View key={`block-${blockIndex}`}>
                <Markdown style={markdownStyles} rules={markdownRules}>
                  {block.content as string}
                </Markdown>
              </View>
            );
          } else if (block.type === 'table') {
            const tableData = block.content as TableData;
            return isMobile ? (
              <MobileTableRenderer
                key={`block-${blockIndex}`}
                tableData={tableData}
                styles={localStyles}
                markdownStyles={markdownStyles}
                markdownRules={markdownRules}
              />
            ) : (
              <WebTableRenderer
                key={`block-${blockIndex}`}
                tableData={tableData}
                styles={localStyles}
                markdownStyles={markdownStyles}
                markdownRules={markdownRules}
              />
            );
          }
          return null;
        })}
      </View>
    </View>
  );
}

// Main Adaptive Table Renderer Component
export default function AdaptiveTableRenderer({
  markdown,
  markdownStyles,
  markdownRules,
  isMobile,
}: {
  markdown: string;
  markdownStyles: any;
  markdownRules?: any;
  isMobile: boolean;
}) {
  const sections = parseMarkdownIntoSections(markdown);

  return (
    <View style={localStyles.container}>
      {sections.map((section, index) => (
        <SectionRenderer
          key={`section-${index}`}
          section={section}
          markdownStyles={markdownStyles}
          markdownRules={markdownRules}
          isMobile={isMobile}
          sectionIndex={index}
        />
      ))}
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    width: '100%',
  },

  // Section Box Styles
  sectionBox: {
    marginBottom: 24,
    borderRightWidth: 4,
    borderRightColor: '#10b981',
    backgroundColor: '#0f0f0f',
    borderRadius: 8,
    overflow: 'hidden',
  },
  sectionBoxMobile: {
    marginHorizontal: 12,
  },
  sectionBoxWeb: {
    marginHorizontal: 0,
  },
  sectionHeadingContainer: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 2,
    borderBottomColor: '#10b981',
  },
  sectionHeading: {
    fontWeight: '700',
    color: '#10b981',
  },
  sectionHeading1: {
    fontSize: 24,
    lineHeight: 30,
  },
  sectionHeading2: {
    fontSize: 20,
    lineHeight: 26,
    color: '#3b82f6',
  },
  sectionHeading3: {
    fontSize: 17,
    lineHeight: 22,
    color: '#8b5cf6',
  },
  sectionContent: {
    padding: 14,
  },

  // Mobile Fact Card Styles
  mobileTableContainer: {
    marginVertical: 12,
    width: '100%',
  },
  factCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2a2a2a',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  factCardHeader: {
    backgroundColor: '#0f0f0f',
    padding: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#10b981',
  },
  factCardTitle: {
    color: '#10b981',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
  factCardSection: {
    padding: 12,
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
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  factCardValue: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  cellText: {
    color: '#e1e1e1',
    fontSize: 15,
    lineHeight: 24,
    flexShrink: 1,
    flexWrap: 'wrap',
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
    borderRadius: 8,
    marginVertical: 12,
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

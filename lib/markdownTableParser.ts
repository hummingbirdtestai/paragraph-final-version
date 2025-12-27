export interface ParsedTable {
  headers: string[];
  rows: string[][];
}

export type ContentBlock =
  | { type: 'markdown'; content: string }
  | { type: 'table'; content: string; parsed: ParsedTable };

export function isMarkdownTable(text: string): boolean {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return false;

  const hasHeaderRow = lines[0].includes('|');
  const hasSeparator = lines[1].includes('---') && lines[1].includes('|');

  return hasHeaderRow && hasSeparator;
}

export function parseTableString(tableString: string): ParsedTable | null {
  try {
    const lines = tableString.trim().split('\n').filter(line => line.trim());

    if (lines.length < 3) return null;

    const headerLine = lines[0];
    const separatorLine = lines[1];

    if (!headerLine.includes('|') || !separatorLine.includes('---')) {
      return null;
    }

    const parseRow = (line: string): string[] => {
      return line
        .split('|')
        .map(cell => cell.trim())
        .filter((cell, index, arr) => {
          if (index === 0 && cell === '') return false;
          if (index === arr.length - 1 && cell === '') return false;
          return true;
        });
    };

    const headers = parseRow(headerLine);
    const rows = lines.slice(2).map(line => parseRow(line));

    return { headers, rows };
  } catch (e) {
    console.error('Failed to parse table:', e);
    return null;
  }
}

export function splitIntoBlocks(text: string): ContentBlock[] {
  const blocks: ContentBlock[] = [];
  const lines = text.split('\n');

  let currentBlock = '';
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const nextLine = lines[i + 1];

    const isTableStart =
      line.includes('|') &&
      nextLine &&
      nextLine.includes('---') &&
      nextLine.includes('|');

    if (isTableStart) {
      if (currentBlock.trim()) {
        blocks.push({ type: 'markdown', content: currentBlock.trim() });
        currentBlock = '';
      }

      const tableLines: string[] = [line];
      i++;

      while (i < lines.length && lines[i].includes('|')) {
        tableLines.push(lines[i]);
        i++;
      }

      const tableString = tableLines.join('\n');
      const parsed = parseTableString(tableString);

      if (parsed) {
        blocks.push({ type: 'table', content: tableString, parsed });
      } else {
        blocks.push({ type: 'markdown', content: tableString });
      }
    } else {
      currentBlock += line + '\n';
      i++;
    }
  }

  if (currentBlock.trim()) {
    blocks.push({ type: 'markdown', content: currentBlock.trim() });
  }

  return blocks;
}

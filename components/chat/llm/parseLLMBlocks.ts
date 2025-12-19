export type LLMBlock =
  | { type: 'TEXT'; text: string }
  | { type: 'CONCEPT'; title?: string; text: string }
  | { type: 'MCQ'; text: string }
  | { type: 'FEEDBACK_CORRECT'; text: string }
  | { type: 'FEEDBACK_WRONG'; text: string }
  | { type: 'CLARIFICATION'; text: string }
  | { type: 'RECHECK_MCQ'; text: string }
  | { type: 'FINAL_ANSWER'; text: string }
  | { type: 'TAKEAWAYS'; text: string }
  | { type: 'CONCEPT_TABLE'; rows: string[][] };

const BLOCK_REGEX =
  /^\[(MENTOR|CONCEPT|MCQ|FEEDBACK_CORRECT|FEEDBACK_WRONG|CLARIFICATION|RECHECK_MCQ|FINAL_ANSWER|TAKEAWAYS|CONCEPT_TABLE)(?:\s+title="([^"]+)")?\]\n?/gm;

export function parseLLMBlocks(input: string): LLMBlock[] {
  const blocks: LLMBlock[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = BLOCK_REGEX.exec(input))) {
    if (match.index > lastIndex) {
      const raw = input.slice(lastIndex, match.index).trim();
      if (raw) blocks.push({ type: 'TEXT', text: raw });
    }

    const blockType = match[1];
    const title = match[2];
    const start = BLOCK_REGEX.lastIndex;
    const nextMatch = BLOCK_REGEX.exec(input);
    const end = nextMatch ? nextMatch.index : input.length;
    const content = input.slice(start, end).trim();

    BLOCK_REGEX.lastIndex = start;

    if (blockType === 'CONCEPT_TABLE') {
      const rows = content
        .split('\n')
        .map(r => r.split('|').map(c => c.trim()))
        .filter(r => r.length >= 2);

      blocks.push({ type: 'CONCEPT_TABLE', rows });
    } else {
      blocks.push({
        type: blockType as any,
        title,
        text: content,
      });
    }

    lastIndex = end;
  }

  if (lastIndex < input.length) {
    const tail = input.slice(lastIndex).trim();
    if (tail) blocks.push({ type: 'TEXT', text: tail });
  }

  return blocks;
}

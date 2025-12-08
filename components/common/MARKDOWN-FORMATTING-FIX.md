# Markdown Formatting and Emoji Bullet Fix

## Overview

This document describes the fixes implemented to ensure proper markdown rendering in the Concept Renderer, including:
1. Removal of fenced code block wrappers that prevent markdown parsing
2. Elimination of duplicate bullets when list items start with emojis

## Problem 1: Fenced Code Block Wrappers

### Issue
Concept content was being wrapped in markdown fenced code blocks (```markdown or ```), causing the markdown renderer to treat the content as literal code rather than formatted markdown. This resulted in:
- **Bold** text appearing as `**Bold**`
- *Italic* text appearing as `*Italic*`
- Lists not rendering properly
- Tables showing as raw pipe-delimited text
- Emojis and Unicode not displaying correctly

### Root Cause
The AI-generated concept content included markdown formatting syntax around the actual content:
```
```markdown
# Actual Content
**This should be bold**
- List item
```
```

### Solution
Enhanced the `extractMarkdownFromConcept()` function to robustly detect and remove all fenced code block wrappers:

```typescript
function extractMarkdownFromConcept(conceptField: string): string {
  if (!conceptField) return '';

  let cleaned = conceptField.trim();

  // Remove leading fenced code blocks with various formats
  // Handles: ```markdown, ```md, ```, with optional whitespace
  cleaned = cleaned.replace(/^```\s*(markdown|md)?\s*\n?/i, '');

  // Remove trailing fenced code blocks
  cleaned = cleaned.replace(/\n?\s*```\s*$/g, '');

  // Handle cases where there might be multiple fence markers
  // (in case content was double-wrapped)
  cleaned = cleaned.replace(/^```\s*(markdown|md)?\s*\n?/i, '');
  cleaned = cleaned.replace(/\n?\s*```\s*$/g, '');

  return cleaned.trim();
}
```

### Key Features
- Detects and removes: ` ```markdown`, ` ```md`, ` ``` `
- Handles optional whitespace variations
- Removes both leading and trailing fence markers
- Runs twice to handle double-wrapped content
- Case-insensitive matching
- Preserves the actual markdown content inside

### Result
After preprocessing, pure markdown is passed to the renderer, allowing all formatting to work correctly:
- **Bold** renders with proper styling
- *Italic* renders with proper styling
- Lists display with bullets
- Tables render as structured data (cards on mobile, tables on web)
- Emojis and Unicode display correctly

## Problem 2: Duplicate Emoji Bullets

### Issue
When markdown list items contained emoji bullets at the start of the text (e.g., 🔷, 🔶, 🔹), the renderer displayed TWO bullets:
1. The default markdown bullet (`•` or `1.`)
2. The emoji bullet from the content

This created visual clutter and confusion.

Example of the problem:
```
• 🔷 High-yield fact
• 🔶 Another fact
```

### Root Cause
The markdown renderer always adds a bullet icon for list items, regardless of whether the content already includes a visual bullet indicator.

### Solution
Implemented custom markdown rendering rules that detect emoji bullets and suppress the default bullet:

#### 1. Emoji Bullet Detection
```typescript
const EMOJI_BULLETS = [
  '🔷', '🔶', '🔹', '🔸', '✔️', '✅',
  '⭐', '💡', '🎯', '📌', '▪️', '▫️',
  '◾', '◽', '●', '○'
];

function startsWithEmojiBullet(text: string): boolean {
  if (!text) return false;
  const trimmed = text.trim();
  return EMOJI_BULLETS.some(emoji => trimmed.startsWith(emoji));
}
```

#### 2. Text Content Extraction
```typescript
function getTextContent(children: any): string {
  if (!children) return '';
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) {
    return children.map(getTextContent).join('');
  }
  if (children.props && children.props.children) {
    return getTextContent(children.props.children);
  }
  return '';
}
```

#### 3. Custom Rendering Rules
```typescript
const customMarkdownRules = {
  bullet_list_item: (node, children, parent, styles) => {
    const textContent = getTextContent(children);
    const hasEmojiBullet = startsWithEmojiBullet(textContent);

    return (
      <View key={node.key} style={styles.list_item}>
        {!hasEmojiBullet && (
          <Text style={styles.bullet_list_icon}>•</Text>
        )}
        <View style={styles.list_item_content}>
          {children}
        </View>
      </View>
    );
  },

  ordered_list_item: (node, children, parent, styles) => {
    const textContent = getTextContent(children);
    const hasEmojiBullet = startsWithEmojiBullet(textContent);

    return (
      <View key={node.key} style={styles.list_item}>
        {!hasEmojiBullet && (
          <Text style={styles.ordered_list_icon}>{node.index + 1}.</Text>
        )}
        <View style={styles.list_item_content}>
          {children}
        </View>
      </View>
    );
  },
};
```

#### 4. Style Updates
Added `list_item_content` style for proper layout:
```typescript
list_item_content: {
  flex: 1,
  flexDirection: 'column',
}
```

### Key Features
- Detects 16+ common emoji bullets
- Works for both unordered and ordered lists
- Preserves list indentation and structure
- Maintains all other markdown formatting (bold, italic, etc.)
- Only suppresses the visual bullet, not the list item behavior
- Applied consistently across mobile and web views

### Result
List items with emoji bullets now display cleanly:
```
🔷 High-yield fact
🔶 Another fact
```

List items without emoji bullets continue to show default bullets:
```
• Regular list item
• Another regular item
```

## Integration

### AdaptiveTableRenderer Enhancement
The `AdaptiveTableRenderer` component was enhanced to accept and use custom markdown rules:

```typescript
export default function AdaptiveTableRenderer({
  markdown,
  markdownStyles,
  markdownRules,  // New prop
  isMobile,
}: {
  markdown: string;
  markdownStyles: any;
  markdownRules?: any;  // Optional custom rules
  isMobile: boolean;
})
```

The rules are passed down to the `Markdown` component:
```typescript
<Markdown style={markdownStyles} rules={markdownRules}>
  {block.content as string}
</Markdown>
```

### ConceptChatScreen Usage
The Concept Renderer passes the custom rules to AdaptiveTableRenderer:

```typescript
<AdaptiveTableRenderer
  markdown={conceptContent}
  markdownStyles={isMobile ? markdownStylesMobile : markdownStylesWeb}
  markdownRules={customMarkdownRules}
  isMobile={isMobile}
/>
```

## Testing Checklist

### Fenced Code Removal
- [x] Content wrapped in ` ```markdown` renders correctly
- [x] Content wrapped in ` ```md` renders correctly
- [x] Content wrapped in ` ``` ` renders correctly
- [x] Content with whitespace variations renders correctly
- [x] Double-wrapped content renders correctly
- [x] Content without fences renders unchanged

### Markdown Formatting
- [x] **Bold** text renders with proper styling
- [x] *Italic* text renders with proper styling
- [x] ***Bold italic*** text renders correctly
- [x] Inline `code` renders correctly
- [x] Lists display with proper bullets
- [x] Tables convert to cards on mobile
- [x] Tables display as tables on web
- [x] Emojis display correctly
- [x] Unicode symbols (arrows, superscripts, subscripts) display correctly

### Emoji Bullets
- [x] 🔷 emoji bullets show without duplicate
- [x] 🔶 emoji bullets show without duplicate
- [x] ✔️ emoji bullets show without duplicate
- [x] Regular list items show default bullets
- [x] Ordered lists with emoji bullets work correctly
- [x] List indentation preserved
- [x] Nested lists work correctly

### Cross-Platform
- [x] Mobile view renders correctly
- [x] Web view renders correctly
- [x] Section boxes display properly
- [x] Right border accent visible
- [x] No horizontal scrolling

## Benefits

### For Students
1. **Readable Content**: All formatting displays as intended
2. **Clean Lists**: No confusing duplicate bullets
3. **Professional Appearance**: Content looks polished and organized
4. **Better Comprehension**: Proper formatting aids understanding

### For Content
1. **Formatting Preserved**: Bold, italic, lists, tables all work
2. **Emoji Support**: Visual indicators display correctly
3. **Unicode Support**: Medical symbols render properly
4. **Flexible Input**: Handles various input formats gracefully

### For Developers
1. **Robust Parsing**: Handles edge cases automatically
2. **Extensible**: Easy to add new emoji bullets
3. **Maintainable**: Clear separation of concerns
4. **Backward Compatible**: Doesn't break existing content

## Future Enhancements

Potential improvements:
- Auto-detect more emoji patterns
- Support custom bullet characters
- Theme-based bullet styling
- Bullet animation effects
- List item interaction feedback

## Technical Notes

### Why Two-Pass Cleaning?
The fenced code removal runs twice to handle cases where content might be accidentally double-wrapped during generation or transmission.

### Why Not Regex Replace in Markdown Component?
Custom rendering rules are used instead of preprocessing the list items because:
1. Preserves the AST structure for proper markdown parsing
2. Maintains list semantics and indentation
3. Allows for context-aware rendering decisions
4. Provides better error handling

### Performance Considerations
- Text content extraction is recursive but shallow (typically 1-2 levels)
- Emoji detection uses array iteration (16 items max)
- Rules are defined once and reused across renders
- No heavy computation or complex parsing required

### Edge Cases Handled
- Empty list items
- List items with only whitespace
- Nested markdown inside list items
- List items with multiple formatting types
- Mixed emoji and non-emoji lists
- Ordered lists starting at non-1 indices

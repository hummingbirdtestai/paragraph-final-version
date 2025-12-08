# Adaptive Table Renderer

## Overview

The Adaptive Table Renderer is a comprehensive document rendering system that transforms Markdown content into structured, readable sections with intelligent table handling. It automatically:
- Parses markdown into distinct sections based on headings (#, ##, ###)
- Renders each section in a boxed container with highlighted right border
- Converts complex multi-column tables into vertically stacked "fact cards" on mobile
- Maintains traditional table layout on web
- Ensures zero horizontal scrolling on any device

## Problem Solved

Medical high-yield fact tables often contain 3-6 columns with dense content including:
- Bold and italic text
- Emojis and Unicode symbols (→, ↑, ↓)
- Superscripts and subscripts
- Multi-line content within cells
- Inline code and mnemonics

Traditional table rendering on mobile screens causes:
- Compressed text that's hard to read
- Horizontal scrolling issues
- Loss of readability and context
- Poor user experience

## Solution

The Adaptive Table Renderer provides:

### Mobile (< 768px)
- Converts each table row into a vertically stacked card
- First cell becomes the card header/title
- Subsequent cells become labeled sections under descriptive headings
- Full-width layout without horizontal scrolling
- Preserves all markdown formatting
- No content loss or truncation

### Web (≥ 768px)
- Renders standard multi-column tables
- Natural cell expansion
- Proper column widths
- Traditional table aesthetics

## Features

- **Automatic Detection**: Parses markdown to identify pipe-delimited tables
- **Markdown Preservation**: Maintains bold, italic, bold+italic, inline code, emojis, Unicode
- **Line Break Support**: Handles multi-line content within cells
- **No Chat Styling**: Pure document-style rendering without chat bubble constraints
- **Seamless Integration**: Works with existing markdown rendering system
- **Responsive**: Automatically adapts based on screen width

## Usage

```typescript
import AdaptiveTableRenderer from '@/components/common/AdaptiveTableRenderer';

<AdaptiveTableRenderer
  markdown={conceptContent}
  markdownStyles={isMobile ? markdownStylesMobile : markdownStylesWeb}
  isMobile={isMobile}
/>
```

## How It Works

### 1. Section Parsing
- Scans markdown for headings (#, ##, ###)
- Creates distinct sections for each heading
- Groups all content under each heading into that section
- Sections without headings are rendered as standalone blocks

### 2. Content Block Parsing
Within each section:
- Identifies table boundaries using pipe delimiters
- Separates tables from regular markdown content
- Extracts table headers and data rows
- Preserves all other content (lists, paragraphs, code blocks)

### 3. Section Rendering
Each section is rendered in a boxed container:
- Highlighted right border (green accent)
- Dark background for visual separation
- Heading displayed at the top with colored underline
- Content area with proper padding
- No horizontal overflow

### 4. Mobile Table Rendering
Each table row becomes a fact card:

```
┌─────────────────────────────────┐
│ First Cell Content (Header)    │ ← Title with green color
├─────────────────────────────────┤
│ COLUMN 2 HEADER                 │ ← Label in blue
│ Cell content with formatting    │ ← Value with formatting
├─────────────────────────────────┤
│ COLUMN 3 HEADER                 │
│ Cell content with formatting    │
└─────────────────────────────────┘
```

### 3. Web Rendering
Standard table with proper columns:

```
┌──────────┬──────────┬──────────┐
│ Header 1 │ Header 2 │ Header 3 │ ← Green headers
├──────────┼──────────┼──────────┤
│ Cell 1   │ Cell 2   │ Cell 3   │
│ Cell 4   │ Cell 5   │ Cell 6   │
└──────────┴──────────┴──────────┘
```

## Formatting Support

The renderer preserves all markdown formatting:

- **Bold**: `**text**` → Bold text
- *Italic*: `*text*` → Italic text
- ***Bold+Italic***: `***text***` → Bold and italic
- `Inline Code`: `` `code` `` → Monospace with background
- Emojis: `🔥 💡 ⚡` → Rendered as-is
- Unicode: `→ ↑ ↓ ±` → Rendered as-is
- Line breaks: Preserved within cells

## Integration

### Concept Screen Integration

The Adaptive Table Renderer is integrated into `ConceptChatScreen.tsx`:

```typescript
// Old approach (horizontal scrolling tables)
<Markdown style={markdownStyles}>
  {conceptContent}
</Markdown>

// New approach (adaptive tables)
<AdaptiveTableRenderer
  markdown={conceptContent}
  markdownStyles={markdownStyles}
  isMobile={isMobile}
/>
```

### PracticeCard Integration

PracticeCard removes lateral padding for concept content to allow full-width table rendering:

```typescript
// Card with conditional padding
<View style={[styles.card, isConcept && styles.cardConcept]}>

// styles.cardConcept removes horizontal padding
cardConcept: {
  paddingHorizontal: 0,
}
```

The AdaptiveTableRenderer then adds padding back for non-table content while keeping tables full-width.

## Example Markdown

Input markdown:

```markdown
# High-Yield Facts

## Diabetes Classification

| Type | Pathophysiology | Treatment | Key Point |
|------|----------------|-----------|-----------|
| **Type 1** | Autoimmune destruction of β-cells | Insulin therapy | Absolute insulin deficiency |
| **Type 2** | Insulin resistance + β-cell dysfunction | Lifestyle + Metformin | Most common form (90-95%) |
| **Gestational** | Insulin resistance during pregnancy | Diet ± Insulin | Screen at 24-28 weeks |
```

Mobile Output:
- 3 vertically stacked cards
- Each card shows Type as header
- Pathophysiology, Treatment, and Key Point as labeled sections

Web Output:
- Standard 4-column table
- Full headers visible
- Traditional table layout

## Architecture

```
markdown content
       ↓
parseMarkdownIntoSections()
       ↓
Section[] (heading + content blocks)
       ↓
For each section:
  ┌─────────────────────────┐
  │ Section Box with Border │
  │  ┌───────────────────┐  │
  │  │ Heading (if any)  │  │
  │  └───────────────────┘  │
  │  ┌───────────────────┐  │
  │  │ Content Blocks    │  │
  │  │  - Markdown       │  │
  │  │  - Tables         │  │
  │  └───────────────────┘  │
  └─────────────────────────┘
       ↓
    isMobile?
    ↙     ↘
Mobile    Web
  ↓        ↓
Tables → Fact Cards
Lists → Vertical
       Standard Tables
       Standard Lists
```

## Benefits

1. **Readability**: Tables are easy to read on all devices
2. **No Truncation**: All content visible without scrolling
3. **Formatting Preserved**: Bold, italic, code, emojis all work
4. **Automatic**: No manual flags or configuration needed
5. **Consistent**: Same rendering logic across all concepts
6. **Maintainable**: Single source of truth for table rendering

## Technical Details

### Table Detection
- Uses regex to identify pipe-delimited rows
- Filters out separator lines (`|---|---|`)
- Validates minimum row count (header + data)

### Text Rendering
- Custom markdown parser for inline formatting
- Handles nested formatting (bold within italic, etc.)
- Preserves whitespace and line breaks
- Efficient rendering with minimal re-renders

### Performance
- Parses markdown once on mount
- Efficient block-based rendering
- No unnecessary re-renders
- Optimized for long documents

## Future Enhancements

Potential improvements:
- Support for merged cells
- Custom column width hints
- Sortable columns on web
- Export table data
- Print-optimized styles

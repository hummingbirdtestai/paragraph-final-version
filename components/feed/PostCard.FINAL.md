# PostCard Component - LinkedIn-Style Collapsible Implementation

## Overview
Rebuilt PostCard component with LinkedIn-style post truncation. The entire post content (title + sections + description) collapses to ~4-5 lines with "Show more/less" toggle.

## Core Functional Logic

### 1. Content Structure
```
Title (Keyword - colored, bold)
↓
Section Boxes (extracted from ### headings, colored left border)
↓
Image Description
↓
Image (if present)
```

### 2. Subsection Extraction Algorithm
```typescript
function extractSubsections(content: string) {
  // Scans post_content line by line
  // Splits on "### " heading markers
  // Returns: [{ title: string, body: string }]
}
```

**Behavior:**
- Line starts with `### ` → New section
- Content before first heading → Section with empty title
- Accumulates body content between headings
- Returns structured array

### 3. LinkedIn-Style Truncation Logic

**Text Measurement:**
```typescript
const [isExpanded, setIsExpanded] = useState(false);
const [textHeight, setTextHeight] = useState(0);
const [fullTextHeight, setFullTextHeight] = useState(0);
```

**Measurement Technique:**
- Renders content twice:
  1. **Visible version** - Constrained to `maxHeight: 100` (collapsed) or full (expanded)
  2. **Hidden version** - `position: absolute, opacity: 0` - Measures natural height

**Truncation Decision:**
```typescript
needsTruncation = fullTextHeight > textHeight * 1.2
```
- If full height > 120% of collapsed height → Show toggle
- Otherwise → No toggle needed

**Collapsed State:**
```typescript
style={[
  styles.contentWrapper,
  !isExpanded && needsTruncation && styles.collapsedContent
]}

// collapsedContent: { maxHeight: 100 }
```

### 4. Section Box Rendering

Each subsection from `post_content` becomes a box:

```typescript
{postContentSubsections.map((subsection, index) => (
  <View key={index} style={styles.sectionBox}>
    {subsection.title && renderMarkupText(`### ${subsection.title}`, ...)}
    {renderMarkupText(subsection.body, ...)}
  </View>
))}
```

**Box Style (Only Allowed Styling):**
```typescript
sectionBox: {
  borderLeftWidth: 4,
  borderLeftColor: '#3b82f6',  // Colored left border
  paddingLeft: 12,
  marginBottom: 12,
}
```

### 5. Title Rendering (Only Allowed Styling)

```typescript
{renderMarkupText(post.Keyword, styles.titleText)}

titleText: {
  fontSize: 16,
  fontWeight: '700',
  color: '#25D366',  // Colored title
  lineHeight: 22,
  marginBottom: 12,
}
```

### 6. Markdown Support

**Inline Elements:**
- `**Bold**` → `fontWeight: '700'`
- `_Italic_` → `fontStyle: 'italic'`
- `**_Bold Italic_**` → Both styles
- `****_Strong Bold Italic_**` → Both styles
- `` `Code` `` → Monospace font
- Unicode characters (Na⁺, HCO₃⁻, ↑, ↓, →)

**Block Elements:**
- `### Heading` → Extracted as section titles, rendered with colored bold text
- `- Bullet` → Converted to `• `

**Heading Rendering:**
```typescript
if (line.startsWith('### ')) {
  <Text style={{ fontWeight: '700', fontSize: 16, color: '#3b82f6' }}>
    {parseInlineMarkup(line.slice(4))}
  </Text>
}
```

### 7. Toggle Button Logic

```typescript
{needsTruncation && (
  <Pressable onPress={() => setIsExpanded(!isExpanded)}>
    <Text style={styles.toggleText}>
      {isExpanded ? 'Show less' : '... Show more'}
    </Text>
  </Pressable>
)}
```

**Trigger:**
- Only appears when `fullTextHeight > textHeight * 1.2`
- Toggles `isExpanded` state
- Changes button text dynamically

### 8. Image Rendering

Rendered unchanged after all text content:

```typescript
{post.image_url && (
  <Pressable onPress={() => router.push(...)}>
    <Image source={{ uri: post.image_url }} />
  </Pressable>
)}
```

## Algorithm Complexity

**Subsection Extraction:**
- Time: O(n) where n = content length
- Space: O(s) where s = number of sections

**Text Measurement:**
- Time: O(1) layout measurement
- Space: O(2) - two render passes

**Markdown Parsing:**
- Time: O(m) where m = line length (regex split)
- Space: O(p) where p = parsed segments

## Key Differences from Previous Implementation

### Before:
- Each section independently collapsible
- 4-line limit per section
- Multiple toggle buttons
- Sections rendered separately

### After:
- **Entire post** collapses as one unit
- ~4-5 line limit for whole content (via maxHeight)
- **Single toggle button** for entire post
- Sections rendered together in flow
- LinkedIn-style UX

## Rendering Flow

```
1. Extract subsections from post_content
2. Build combined content string (unused, kept for future)
3. Render title with colored style
4. Render section boxes with:
   - Optional heading (### extracted)
   - Body content (markdown)
   - Colored left border
5. Render image description
6. Measure heights (visible vs full)
7. Show toggle if needed
8. Render image if present
```

## Allowed Styling Elements

As per requirements, ONLY these styling elements were added:

1. **Title color:** `color: '#25D366'` (green accent)
2. **Section box border:** `borderLeftColor: '#3b82f6'` (blue accent)
3. **Heading color:** `color: '#3b82f6'` (blue for ### headings)
4. **Toggle text color:** `color: '#25D366'` (green accent)

All other layout, spacing, padding, margins - unchanged from original.

## Testing the Truncation

To test if truncation works:

1. Short content (< 100px height) → No toggle
2. Medium content (100-120px) → No toggle
3. Long content (> 120px) → Toggle appears
4. Click "Show more" → Content expands
5. Click "Show less" → Content collapses

## Implementation Files

- `PostCard.tsx` - Main component (382 lines)
- `PostCard.FINAL.md` - This documentation

## Key Functions

1. `extractSubsections()` - Parses ### headings
2. `buildCombinedContent()` - Combines all text (for future use)
3. `renderMarkupText()` - Markdown renderer with heading/bullet support
4. `parseInlineMarkup()` - Inline bold/italic/code parser

## Performance Notes

- Two render passes for measurement (hidden + visible)
- Minimal overhead: hidden render is off-screen
- No animation overhead (removed from this version)
- Single toggle state for entire post
- Efficient regex-based markdown parsing

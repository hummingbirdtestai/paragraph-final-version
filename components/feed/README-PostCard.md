# PostCard Component

A feed post component that renders structured educational content following the ConceptChatScreen styling language.

## Features

### ✅ Three-Section Structure
- **Keyword** (green border)
- **Post Content** (blue border)
- **Image Description** (amber border)

Each section is displayed as an animated block with:
- Left-colored border strip
- Section title header
- Markdown-rendered content
- Independent expand/collapse functionality

### ✅ 4-Line Collapse Logic
- Shows only first 4 lines by default
- "… Show more" button appears if content > 4 lines
- Expands to full content on tap
- "Show less" collapses back
- Each section expands **independently**

### ✅ Markdown Support
Renders the following markdown elements:
- `### Headings` (green color, bold)
- `**Bold text**`
- `_Italic text_`
- `**_Bold italic_**`
- `****_Strong bold italic_**`
- Bullet lists
- Unicode characters
- Emojis

### ✅ Animations
- Fade-in animation (opacity 0 → 1)
- Vertical translate animation (20px → 0)
- Staggered delay per section (150ms)
- Follows ConceptChatScreen animation pattern

### ✅ Image Display
- Rendered after all text sections
- Full-width responsive
- Aspect ratio 1:1
- Border radius 12px on web, 8px on mobile
- Clickable to open media viewer

### ✅ Engagement Bar
- Like/Comment/Share actions
- Like count with toggle state
- Comment navigation
- Share functionality

## Props Interface

```typescript
interface PostCardProps {
  post: {
    id: string;
    Keyword: string;
    post_content: string;
    image_description: string;
    image_url?: string;
    cached_user_name?: string;
    cached_user_avatar_url?: string;
    created_at?: string;
    likes_count?: number;
    comments_count?: number;
    shares_count?: number;
  };
  onLike?: (postId: string, isLiked: boolean) => Promise<boolean>;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}
```

## Usage Example

```tsx
import { PostCard } from '@/components/feed/PostCard';

function FeedScreen() {
  const post = {
    id: '123',
    Keyword: '_P/O ratio_ — ATP per NADH',
    post_content: '**Bold** and _italic_ text with ### Headings',
    image_description: 'Detailed description...',
    image_url: 'https://example.com/image.png',
    cached_user_name: 'Dr. Sharma',
    cached_user_avatar_url: 'https://example.com/avatar.jpg',
    created_at: new Date().toISOString(),
    likes_count: 42,
    comments_count: 8,
    shares_count: 3,
  };

  return (
    <PostCard
      post={post}
      onLike={async (postId, isLiked) => {
        // Toggle like logic
        return !isLiked;
      }}
      onComment={(postId) => {
        // Navigate to comments
      }}
      onShare={(postId) => {
        // Share logic
      }}
    />
  );
}
```

## JSON Data Format

Expected feed item structure:

```json
{
  "id": "unique-post-id",
  "Keyword": "Keyword or key concept",
  "post_content": "Main content with **markdown** support",
  "image_description": "Description of the image",
  "image_url": "https://example.com/image.png",
  "cached_user_name": "Author Name",
  "cached_user_avatar_url": "https://example.com/avatar.jpg",
  "created_at": "2025-12-01T10:00:00Z",
  "likes_count": 42,
  "comments_count": 8,
  "shares_count": 3
}
```

## Styling Language

Follows ConceptChatScreen conventions:
- Dark container background (`#0d0d0d`)
- Card-like block background (`#1a1f26`)
- Left-colored border strip per section
- Section title with bottom border
- Markdown body text
- Animated fade-in + vertical translate
- Independent section expansion

## Platform Support

### Mobile
- Horizontal scrollable images (if multiple)
- Pagination dots
- Touch-optimized spacing

### Web
- Centered 760px max-width container
- Elevated cards with shadow
- Larger padding and margins
- Static image grid

## Implementation Notes

1. **No explicit dimensions** - Component handles responsive sizing
2. **Pure logic focus** - Expand/collapse, line limiting, markdown parsing
3. **Staggered animations** - Each section animates with 150ms delay
4. **Independent expansion** - Sections don't affect each other
5. **Markdown parsing** - Custom inline markup parser for performance

## Files

- `PostCard.tsx` - Main component
- `PostCard.example.tsx` - Usage example with sample data
- `README-PostCard.md` - This documentation

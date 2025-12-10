# Notification System

Simple notification system for Paragraph NEET-PG app.

## Components

### 1. NotificationBell.tsx
Bell icon with unread counter badge that appears in the app header (top-right).

**Usage:**
```jsx
import NotificationBell from '@/components/NotificationBell';

<NotificationBell userId={user?.id} />
```

**Features:**
- Shows unread notification count
- Updates in real-time using Supabase subscriptions
- Navigates to notification inbox on click
- Red badge shows count (99+ if more than 99)

### 2. notifications.tsx (Route)
Full-screen notification inbox showing all user notifications.

**Route:** `/notifications`

**Features:**
- Lists all notifications (newest first)
- Shows message, timestamp, and optional GIF URL
- Marks all notifications as read when opened
- Green dot indicator for unread notifications
- Relative timestamps (e.g., "2h ago", "3d ago")
- Back button to return to previous screen

### 3. useNotifications.ts (Hook)
Reusable hook for managing notifications throughout the app.

**Usage:**
```jsx
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const { notifications, unreadCount, loading, markAsRead, createNotification } = useNotifications(userId);

  return (
    <View>
      <Text>Unread: {unreadCount}</Text>
    </View>
  );
}
```

**Available Methods:**
- `notifications` - Array of all notifications
- `unreadCount` - Number of unread notifications
- `loading` - Loading state
- `markAsRead(id)` - Mark single notification as read
- `markAllAsRead()` - Mark all notifications as read
- `createNotification(message, gifUrl)` - Create new notification
- `refresh()` - Manually refresh notifications

## Database Table

Table: `student_notifications`

Columns:
- `id` (uuid) - Primary key
- `student_id` (uuid) - User ID
- `message` (text) - Notification message
- `gif_url` (text, optional) - GIF URL
- `is_read` (boolean) - Read status
- `created_at` (timestamp) - Creation time

## Creating Notifications

### From Code:
```jsx
import { supabase } from '@/lib/supabaseClient';

const { error } = await supabase
  .from('student_notifications')
  .insert({
    student_id: userId,
    message: '🔥 Amazing! You hit a 5 day streak!',
    gif_url: null,  // optional
    is_read: false,
  });
```

### Using the Hook:
```jsx
const { createNotification } = useNotifications(userId);

await createNotification('⭐ Concept Mastered!');
```

### Test Component:
Use `NotificationExample.tsx` to test creating notifications:
```jsx
import NotificationExample from '@/components/NotificationExample';

<NotificationExample />
```

## Integration

The notification bell is already integrated into `AppHeader.tsx` and will appear automatically when users are logged in.

## Real-time Updates

The system uses Supabase real-time subscriptions to automatically update:
- Badge count in the bell icon
- Notification list in the inbox
- All instances using `useNotifications` hook

## Example Notification Messages

Common notification scenarios:
- `"🔥 Amazing! You hit a 5 day streak!"`
- `"⭐ Concept Mastered! Keep going!"`
- `"🏆 Victory! You won the battle!"`
- `"✅ Mock test completed! Check your results."`
- `"📚 New flashcards available for Anatomy"`
- `"⚡ Battle starting in 5 minutes!"`
- `"🎯 You're in the top 10 leaderboard!"`

## Security

Row Level Security (RLS) is enabled:
- Users can only read their own notifications
- Users can only update their own notifications
- All queries are filtered by `student_id`

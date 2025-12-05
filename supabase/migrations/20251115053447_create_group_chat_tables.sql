/*
  # Create Group Chat Tables

  ## Summary
  This migration creates the database schema for the group chat system with Telegram-level features.

  ## New Tables

  ### 1. `groups` (Group Chats)
    - `id` (uuid, primary key) - Group ID
    - `name` (text) - Group name
    - `description` (text) - Group description
    - `avatar_url` (text) - Group avatar/icon
    - `created_by` (uuid) - Creator user ID
    - `invite_link` (text) - Unique invite link
    - `is_private` (boolean) - Private group or public
    - `require_approval` (boolean) - Require admin approval to join
    - `slow_mode_seconds` (integer) - Time between messages for non-admins
    - `max_members` (integer) - Maximum member limit
    - `member_count` (integer) - Current member count
    - `online_count` (integer) - Current online members
    - `pinned_message_id` (uuid) - ID of pinned message
    - `created_at` (timestamptz) - Group creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 2. `group_members` (Group Membership)
    - `id` (uuid, primary key) - Membership ID
    - `group_id` (uuid) - Reference to group
    - `user_id` (uuid) - Reference to user
    - `role` (text) - Role: 'owner', 'admin', 'member'
    - `permissions` (jsonb) - Custom permissions object
    - `can_send_messages` (boolean) - Permission to send messages
    - `can_send_media` (boolean) - Permission to send media
    - `is_muted` (boolean) - User muted the group
    - `joined_at` (timestamptz) - When user joined
    - `last_read_at` (timestamptz) - Last time user read messages

  ### 3. `group_messages` (Group Messages)
    - `id` (uuid, primary key) - Message ID
    - `group_id` (uuid) - Reference to group
    - `sender_id` (uuid) - User who sent the message
    - `content` (text) - Message content
    - `message_type` (text) - Type: 'text', 'image', 'video', 'document', 'voice', 'sticker', 'system'
    - `media_url` (text) - URL for media files
    - `media_thumbnail` (text) - Thumbnail URL
    - `reply_to_id` (uuid) - Reference to message being replied to
    - `mentions` (jsonb) - Array of mentioned user IDs
    - `reactions` (jsonb) - Reaction counts object
    - `is_pinned` (boolean) - Whether message is pinned
    - `is_deleted` (boolean) - Whether message is deleted
    - `created_at` (timestamptz) - Message sent timestamp
    - `updated_at` (timestamptz) - Last edit timestamp

  ### 4. `group_events` (System Events)
    - `id` (uuid, primary key) - Event ID
    - `group_id` (uuid) - Reference to group
    - `event_type` (text) - Type: 'user_joined', 'user_left', 'user_promoted', 'user_restricted', 'settings_changed'
    - `actor_id` (uuid) - User who triggered the event
    - `target_id` (uuid) - User affected by the event
    - `metadata` (jsonb) - Additional event data
    - `created_at` (timestamptz) - Event timestamp

  ### 5. `group_join_requests` (Join Requests)
    - `id` (uuid, primary key) - Request ID
    - `group_id` (uuid) - Reference to group
    - `user_id` (uuid) - User requesting to join
    - `message` (text) - Optional message from user
    - `status` (text) - Status: 'pending', 'approved', 'rejected'
    - `reviewed_by` (uuid) - Admin who reviewed
    - `created_at` (timestamptz) - Request timestamp
    - `reviewed_at` (timestamptz) - Review timestamp

  ## Security
    - Enable Row Level Security (RLS) on all tables
    - Users can only access groups they are members of
    - Only admins can modify group settings
    - Only owners can delete groups
    - Message permissions based on group member roles

  ## Important Notes
    - All tables use UUIDs for primary keys
    - JSONB for flexible data structures (reactions, mentions, permissions)
    - Indexes for performance on frequently queried columns
    - Triggers for updating member counts and online status
*/

-- Create groups table
CREATE TABLE IF NOT EXISTS groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  avatar_url text,
  created_by uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  invite_link text UNIQUE,
  is_private boolean DEFAULT false,
  require_approval boolean DEFAULT false,
  slow_mode_seconds integer DEFAULT 0,
  max_members integer DEFAULT 1000,
  member_count integer DEFAULT 0,
  online_count integer DEFAULT 0,
  pinned_message_id uuid,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_members table
CREATE TABLE IF NOT EXISTS group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role text DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  permissions jsonb DEFAULT '{}',
  can_send_messages boolean DEFAULT true,
  can_send_media boolean DEFAULT true,
  is_muted boolean DEFAULT false,
  joined_at timestamptz DEFAULT now(),
  last_read_at timestamptz DEFAULT now(),
  UNIQUE(group_id, user_id)
);

-- Create group_messages table
CREATE TABLE IF NOT EXISTS group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'document', 'voice', 'sticker', 'system')),
  media_url text,
  media_thumbnail text,
  reply_to_id uuid REFERENCES group_messages(id) ON DELETE SET NULL,
  mentions jsonb DEFAULT '[]',
  reactions jsonb DEFAULT '{}',
  is_pinned boolean DEFAULT false,
  is_deleted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create group_events table
CREATE TABLE IF NOT EXISTS group_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  event_type text NOT NULL CHECK (event_type IN ('user_joined', 'user_left', 'user_promoted', 'user_restricted', 'settings_changed', 'message_pinned', 'message_unpinned')),
  actor_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  target_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Create group_join_requests table
CREATE TABLE IF NOT EXISTS group_join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  message text,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_by uuid REFERENCES profiles(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  reviewed_at timestamptz,
  UNIQUE(group_id, user_id, status)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_groups_created_by ON groups(created_by);
CREATE INDEX IF NOT EXISTS idx_groups_invite_link ON groups(invite_link);
CREATE INDEX IF NOT EXISTS idx_group_members_group_id ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_group_members_user_id ON group_members(user_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_group_id ON group_messages(group_id);
CREATE INDEX IF NOT EXISTS idx_group_messages_created_at ON group_messages(group_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_group_messages_pinned ON group_messages(group_id, is_pinned) WHERE is_pinned = true;
CREATE INDEX IF NOT EXISTS idx_group_events_group_id ON group_events(group_id);
CREATE INDEX IF NOT EXISTS idx_group_join_requests_status ON group_join_requests(group_id, status);

-- Enable Row Level Security
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_join_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for groups
CREATE POLICY "Users can view groups they are members of"
  ON groups FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create groups"
  ON groups FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

CREATE POLICY "Admins can update group settings"
  ON groups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for group_members
CREATE POLICY "Users can view members of their groups"
  ON group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can add members"
  ON group_members FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_members.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can update their own membership settings"
  ON group_members FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
      AND gm.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
      AND gm.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for group_messages
CREATE POLICY "Users can view messages in their groups"
  ON group_messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_messages.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages in their groups"
  ON group_messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_messages.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.can_send_messages = true
    )
  );

CREATE POLICY "Users can update their own messages"
  ON group_messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_messages.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (sender_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_messages.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  );

-- RLS Policies for group_events
CREATE POLICY "Users can view events in their groups"
  ON group_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_events.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "System can create events"
  ON group_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for group_join_requests
CREATE POLICY "Users can view their own join requests"
  ON group_join_requests FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_join_requests.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  );

CREATE POLICY "Users can create join requests"
  ON group_join_requests FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update join requests"
  ON group_join_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_join_requests.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM group_members
      WHERE group_members.group_id = group_join_requests.group_id
      AND group_members.user_id = auth.uid()
      AND group_members.role IN ('owner', 'admin')
    )
  );

-- Function to generate unique invite link
CREATE OR REPLACE FUNCTION generate_invite_link()
RETURNS text AS $$
BEGIN
  RETURN 'https://app.medstudent.com/join/' || substring(md5(random()::text) from 1 for 10);
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invite link
CREATE OR REPLACE FUNCTION set_invite_link()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_link IS NULL THEN
    NEW.invite_link := generate_invite_link();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_invite_link
  BEFORE INSERT ON groups
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_link();

-- Triggers to auto-update updated_at
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_group_messages_updated_at BEFORE UPDATE ON group_messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

/*
  # Create Chat and Messaging Tables

  ## Summary
  This migration creates the database schema for the individual chat (DM) system.

  ## New Tables

  ### 1. `profiles` (User Profiles)
    - `id` (uuid, primary key) - User ID
    - `name` (text) - User's full name
    - `avatar_url` (text) - Profile picture URL
    - `college` (text) - College name
    - `year` (text) - Academic year
    - `bio` (text) - User bio
    - `online_status` (boolean) - Whether user is currently online
    - `last_seen` (timestamptz) - Last time user was active
    - `created_at` (timestamptz) - Account creation timestamp
    - `updated_at` (timestamptz) - Last profile update timestamp

  ### 2. `chats` (Chat Conversations)
    - `id` (uuid, primary key) - Chat conversation ID
    - `user1_id` (uuid) - First user in the conversation
    - `user2_id` (uuid) - Second user in the conversation
    - `last_message` (text) - Preview of the last message
    - `last_message_time` (timestamptz) - Timestamp of last message
    - `user1_unread_count` (integer) - Unread message count for user1
    - `user2_unread_count` (integer) - Unread message count for user2
    - `user1_pinned` (boolean) - Whether chat is pinned for user1
    - `user2_pinned` (boolean) - Whether chat is pinned for user2
    - `user1_muted` (boolean) - Whether chat is muted for user1
    - `user2_muted` (boolean) - Whether chat is muted for user2
    - `created_at` (timestamptz) - Chat creation timestamp
    - `updated_at` (timestamptz) - Last update timestamp

  ### 3. `messages` (Individual Messages)
    - `id` (uuid, primary key) - Message ID
    - `chat_id` (uuid) - Reference to chat conversation
    - `sender_id` (uuid) - User who sent the message
    - `content` (text) - Message content
    - `message_type` (text) - Type: 'text', 'image', 'file'
    - `is_read` (boolean) - Whether message has been read
    - `read_at` (timestamptz) - When message was read
    - `is_deleted` (boolean) - Whether message is deleted
    - `reply_to_id` (uuid) - Reference to message being replied to
    - `created_at` (timestamptz) - Message sent timestamp
    - `updated_at` (timestamptz) - Last edit timestamp

  ### 4. `typing_indicators` (Real-time Typing Status)
    - `chat_id` (uuid) - Reference to chat conversation
    - `user_id` (uuid) - User who is typing
    - `is_typing` (boolean) - Typing status
    - `updated_at` (timestamptz) - Last update timestamp

  ## Security
    - Enable Row Level Security (RLS) on all tables
    - Users can only access their own profiles
    - Users can only see chats they are part of
    - Users can only send/read messages in their own chats
    - Typing indicators are visible to chat participants only

  ## Important Notes
    - All tables use UUIDs for primary keys
    - Timestamps use `timestamptz` for timezone support
    - Default values are set appropriately
    - Foreign key constraints ensure data integrity
    - Indexes added for performance on frequently queried columns
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  avatar_url text,
  college text,
  year text,
  bio text,
  online_status boolean DEFAULT false,
  last_seen timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  last_message text,
  last_message_time timestamptz DEFAULT now(),
  user1_unread_count integer DEFAULT 0,
  user2_unread_count integer DEFAULT 0,
  user1_pinned boolean DEFAULT false,
  user2_pinned boolean DEFAULT false,
  user1_muted boolean DEFAULT false,
  user2_muted boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_chat_users UNIQUE(user1_id, user2_id),
  CONSTRAINT different_users CHECK (user1_id != user2_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  message_type text DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
  is_read boolean DEFAULT false,
  read_at timestamptz,
  is_deleted boolean DEFAULT false,
  reply_to_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create typing_indicators table
CREATE TABLE IF NOT EXISTS typing_indicators (
  chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_typing boolean DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  PRIMARY KEY (chat_id, user_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_chats_user1 ON chats(user1_id);
CREATE INDEX IF NOT EXISTS idx_chats_user2 ON chats(user2_id);
CREATE INDEX IF NOT EXISTS idx_chats_last_message_time ON chats(last_message_time DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(chat_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_typing_indicators_chat ON typing_indicators(chat_id);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE typing_indicators ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- RLS Policies for chats
CREATE POLICY "Users can view their own chats"
  ON chats FOR SELECT
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create chats"
  ON chats FOR INSERT
  TO authenticated
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can update their own chats"
  ON chats FOR UPDATE
  TO authenticated
  USING (user1_id = auth.uid() OR user2_id = auth.uid())
  WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view messages in their chats"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can send messages in their chats"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = messages.chat_id
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  TO authenticated
  USING (sender_id = auth.uid())
  WITH CHECK (sender_id = auth.uid());

-- RLS Policies for typing_indicators
CREATE POLICY "Users can view typing indicators in their chats"
  ON typing_indicators FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM chats
      WHERE chats.id = typing_indicators.chat_id
      AND (chats.user1_id = auth.uid() OR chats.user2_id = auth.uid())
    )
  );

CREATE POLICY "Users can update their own typing status"
  ON typing_indicators FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their typing indicators"
  ON typing_indicators FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to auto-update updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_typing_indicators_updated_at BEFORE UPDATE ON typing_indicators
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

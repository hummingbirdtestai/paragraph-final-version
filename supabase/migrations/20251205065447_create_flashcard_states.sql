/*
  # Flashcard States Table

  1. New Tables
    - `flashcard_states`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `flashcard_id` (text, the flashcard ID)
      - `subject` (text, the subject name)
      - `is_viewed` (boolean, default false)
      - `is_bookmarked` (boolean, default false)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      
  2. Security
    - Enable RLS on `flashcard_states` table
    - Add policy for users to read their own flashcard states
    - Add policy for users to insert their own flashcard states
    - Add policy for users to update their own flashcard states
*/

CREATE TABLE IF NOT EXISTS flashcard_states (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  flashcard_id text NOT NULL,
  subject text NOT NULL,
  is_viewed boolean DEFAULT false,
  is_bookmarked boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, flashcard_id, subject)
);

ALTER TABLE flashcard_states ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own flashcard states"
  ON flashcard_states
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flashcard states"
  ON flashcard_states
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flashcard states"
  ON flashcard_states
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_flashcard_states_user_subject 
  ON flashcard_states(user_id, subject);

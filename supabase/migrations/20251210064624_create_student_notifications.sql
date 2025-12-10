/*
  # Create student notifications table

  1. New Tables
    - `student_notifications`
      - `id` (uuid, primary key)
      - `student_id` (uuid, references users)
      - `message` (text) - notification message
      - `gif_url` (text, optional) - optional GIF URL
      - `is_read` (boolean) - read status, default false
      - `created_at` (timestamp) - when notification was created

  2. Security
    - Enable RLS on `student_notifications` table
    - Add policy for authenticated users to read their own notifications
    - Add policy for authenticated users to update their own notifications
*/

CREATE TABLE IF NOT EXISTS student_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  message text NOT NULL,
  gif_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE student_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications"
  ON student_notifications
  FOR SELECT
  TO authenticated
  USING (student_id = (SELECT id FROM users WHERE id = auth.uid()));

CREATE POLICY "Users can update own notifications"
  ON student_notifications
  FOR UPDATE
  TO authenticated
  USING (student_id = (SELECT id FROM users WHERE id = auth.uid()))
  WITH CHECK (student_id = (SELECT id FROM users WHERE id = auth.uid()));

CREATE INDEX IF NOT EXISTS idx_student_notifications_student_id ON student_notifications(student_id);
CREATE INDEX IF NOT EXISTS idx_student_notifications_is_read ON student_notifications(is_read);

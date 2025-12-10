/*
  # Add Soft Delete Support to Student Notifications

  1. Changes
    - Add `is_hidden` column to `student_notifications` table
      - Type: boolean
      - Default: false
      - Not null: true
    
  2. Purpose
    - Enable soft delete functionality for notifications
    - Notifications are hidden from the user instead of permanently deleted
    - Preserves data for potential recovery or analytics
    
  3. Notes
    - Existing notifications will have `is_hidden = false` by default
    - No data migration needed as default value handles existing rows
*/

ALTER TABLE student_notifications
ADD COLUMN IF NOT EXISTS is_hidden boolean NOT NULL DEFAULT false;

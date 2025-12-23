/*
  # Create mark_mock_test_complete RPC

  1. Purpose
    - Marks a mock test as completed for a student
    - Upserts into mark_complete table
    - Sets test_complete = true and updates completed_at timestamp
    
  2. Function
    - `mark_mock_test_complete(p_student_id, p_exam_serial)`
    - Uses UPSERT (INSERT ... ON CONFLICT DO UPDATE)
    - Ensures completion state is persisted for get_mock_test_window RPC
    
  3. Usage
    - Called when Section E is completed automatically
    - Called when user manually finishes the test via Confirm Finish
*/

CREATE OR REPLACE FUNCTION mark_mock_test_complete(
  p_student_id uuid,
  p_exam_serial bigint
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO mark_complete (student_id, exam_serial, test_complete, completed_at)
  VALUES (p_student_id, p_exam_serial, true, now())
  ON CONFLICT (student_id, exam_serial)
  DO UPDATE SET
    test_complete = true,
    completed_at = now();
END;
$$;
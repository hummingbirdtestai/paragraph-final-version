export interface SubjectProgress {
  subject_id: string;
  total_items: number;
  completed_items: number;
  completion_percent: number;
  minutes_spent: number;
  minutes_total_time_to_complete: number;
}

export interface ProgressMasteryData {
  [subjectName: string]: SubjectProgress;
}

export interface ProgressResponse {
  get_progress_mastery_with_time: ProgressMasteryData;
}

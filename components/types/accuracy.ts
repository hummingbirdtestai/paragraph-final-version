export interface SubjectAccuracy {
  subject_id: string;
  correct_mcqs: number;
  attempted_mcqs: number;
  accuracy_7d_percent: number | null;
  accuracy_30d_percent: number | null;
  confidence_gap_items: number;
  confidence_gap_percent: number;
  overall_accuracy_percent: number;
  improvement_delta_percent: number | null;
}

export interface AccuracyPerformanceData {
  [subjectName: string]: SubjectAccuracy;
}

export interface AccuracyResponse {
  get_accuracy_performance_fast: AccuracyPerformanceData;
}

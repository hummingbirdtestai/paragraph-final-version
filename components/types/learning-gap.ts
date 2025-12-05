export interface ErrorTypeBreakdown {
  factual: number;
  interpretation: number;
  careless: number;
  time_pressure: number;
}

export interface SubjectLearningGap {
  subject_id: string;
  avg_time_per_mcq: number;
  avg_expected_time: number;
  time_stress_index: number;
  error_type_breakdown: ErrorTypeBreakdown;
}

export interface LearningGapData {
  [subjectName: string]: SubjectLearningGap;
}

export interface LearningGapResponse {
  get_deep_learning_gap: LearningGapData;
}

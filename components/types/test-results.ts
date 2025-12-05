export interface SubjectPerformance {
  score: number;
  skipped: number;
  answered: number;
  subject_name: string;
  wrong_answers: number;
  time_spent_min: number;
  correct_answers: number;
  total_questions: number;
  accuracy_percent: number;
  avg_time_per_mcq: number;
  time_eff_percent: number;
  effort_eff_percent: number;
  attempt_rate_percent: number;
}

export interface MockTestResult {
  subjects: SubjectPerformance[];
  exam_date: string;
  exam_title: string;
  exam_serial: number;
}

export interface MockTestResultsData {
  get_mock_test_subject_performance: MockTestResult[];
}

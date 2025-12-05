export interface ExamData {
  exam_serial: number;
  exam_title: string;
  exam_date: string;
  total_questions: number;
  answered: number;
  correct_answers: number;
  wrong_answers: number;
  skipped: number;
  score: number;
  accuracy_percent: number;
  attempt_rate_percent: number;
  time_spent_min: number;
  avg_time_per_mcq: number;
  time_eff_percent: number;
  effort_eff_percent: number;
}

export const examData: ExamData[] = [
  {
    exam_serial: 1,
    exam_title: "NEETPG Full Scale Mock Test 1",
    exam_date: "2025-10-27",
    total_questions: 200,
    answered: 196,
    correct_answers: 61,
    wrong_answers: 135,
    skipped: 4,
    score: 109,
    accuracy_percent: 31.12,
    attempt_rate_percent: 98.0,
    time_spent_min: 192.4,
    avg_time_per_mcq: 0.98,
    time_eff_percent: 109.2,
    effort_eff_percent: 64.56
  },
  {
    exam_serial: 2,
    exam_title: "NEETPG Full Scale Mock Test 2",
    exam_date: "2025-11-02",
    total_questions: 200,
    answered: 188,
    correct_answers: 82,
    wrong_answers: 106,
    skipped: 12,
    score: 222,
    accuracy_percent: 43.6,
    attempt_rate_percent: 94.0,
    time_spent_min: 210.6,
    avg_time_per_mcq: 1.12,
    time_eff_percent: 99.8,
    effort_eff_percent: 68.8
  },
  {
    exam_serial: 3,
    exam_title: "NEETPG Full Scale Mock Test 3",
    exam_date: "2025-11-09",
    total_questions: 200,
    answered: 178,
    correct_answers: 95,
    wrong_answers: 83,
    skipped: 22,
    score: 297,
    accuracy_percent: 53.4,
    attempt_rate_percent: 89.0,
    time_spent_min: 205.8,
    avg_time_per_mcq: 1.16,
    time_eff_percent: 102.3,
    effort_eff_percent: 71.2
  },
  {
    exam_serial: 4,
    exam_title: "NEETPG Full Scale Mock Test 4",
    exam_date: "2025-11-16",
    total_questions: 200,
    answered: 200,
    correct_answers: 112,
    wrong_answers: 88,
    skipped: 0,
    score: 360,
    accuracy_percent: 56.0,
    attempt_rate_percent: 100.0,
    time_spent_min: 205.0,
    avg_time_per_mcq: 1.03,
    time_eff_percent: 102.4,
    effort_eff_percent: 78.0
  }
];

import { MockTestResultsData } from '@/types/test-results';

export const MOCK_TEST_RESULTS_DATA: MockTestResultsData = {
  get_mock_test_subject_performance: [
    {
      exam_serial: 1,
      exam_title: "NEETPG Full Scale Mock Test 1",
      exam_date: "2025-10-27",
      subjects: [
        { score: 1, skipped: 1, answered: 4, subject_name: "Anatomy", wrong_answers: 3, time_spent_min: 0.21, correct_answers: 1, total_questions: 5, accuracy_percent: 25, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 5, attempt_rate_percent: 80 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Anesthesia", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Biochemistry", wrong_answers: 4, time_spent_min: 0.24, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 20, subject_name: "Community Medicine", wrong_answers: 16, time_spent_min: 0.91, correct_answers: 4, total_questions: 20, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: -6, skipped: 0, answered: 6, subject_name: "Dermatology", wrong_answers: 6, time_spent_min: 674.62, correct_answers: 0, total_questions: 6, accuracy_percent: 0, avg_time_per_mcq: 112.44, time_eff_percent: 0.89, effort_eff_percent: -25, attempt_rate_percent: 100 },
        { score: 6, skipped: 1, answered: 9, subject_name: "ENT", wrong_answers: 6, time_spent_min: 0.43, correct_answers: 3, total_questions: 10, accuracy_percent: 33.33, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 15, attempt_rate_percent: 90 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Forensic Medicine", wrong_answers: 4, time_spent_min: 0.24, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 27, skipped: 0, answered: 33, subject_name: "General Medicine", wrong_answers: 21, time_spent_min: 1.49, correct_answers: 12, total_questions: 33, accuracy_percent: 36.36, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 20.45, attempt_rate_percent: 100 },
        { score: 21, skipped: 1, answered: 24, subject_name: "General Surgery", wrong_answers: 15, time_spent_min: 1.16, correct_answers: 9, total_questions: 25, accuracy_percent: 37.5, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 21, attempt_rate_percent: 96 },
        { score: 5, skipped: 0, answered: 5, subject_name: "Microbiology", wrong_answers: 3, time_spent_min: 0.22, correct_answers: 2, total_questions: 5, accuracy_percent: 40, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 25, attempt_rate_percent: 100 },
        { score: 12, skipped: 1, answered: 28, subject_name: "Obstetrics and Gynaecology", wrong_answers: 20, time_spent_min: 1.33, correct_answers: 8, total_questions: 29, accuracy_percent: 28.57, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 10.34, attempt_rate_percent: 96.55 },
        { score: -4, skipped: 0, answered: 9, subject_name: "Ophthalmology", wrong_answers: 8, time_spent_min: 0.4, correct_answers: 1, total_questions: 9, accuracy_percent: 11.11, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: -11.11, attempt_rate_percent: 100 },
        { score: 16, skipped: 0, answered: 9, subject_name: "Orthopedics", wrong_answers: 4, time_spent_min: 0.43, correct_answers: 5, total_questions: 9, accuracy_percent: 55.56, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 44.44, attempt_rate_percent: 100 },
        { score: 6, skipped: 0, answered: 4, subject_name: "Pathology", wrong_answers: 2, time_spent_min: 0.2, correct_answers: 2, total_questions: 4, accuracy_percent: 50, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 37.5, attempt_rate_percent: 100 },
        { score: 10, skipped: 0, answered: 10, subject_name: "Pediatrics", wrong_answers: 6, time_spent_min: 0.43, correct_answers: 4, total_questions: 10, accuracy_percent: 40, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 25, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Pharmacology", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 15, skipped: 0, answered: 5, subject_name: "Physiology", wrong_answers: 1, time_spent_min: 0.22, correct_answers: 4, total_questions: 5, accuracy_percent: 80, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 75, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Psychiatry", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Radiology", wrong_answers: 4, time_spent_min: 0.26, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 }
      ]
    },
    {
      exam_serial: 2,
      exam_title: "NEETPG Full Scale Mock Test 2",
      exam_date: "2025-10-28",
      subjects: [
        { score: 1, skipped: 1, answered: 4, subject_name: "Anatomy", wrong_answers: 3, time_spent_min: 0.21, correct_answers: 1, total_questions: 5, accuracy_percent: 25, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 5, attempt_rate_percent: 80 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Anesthesia", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Biochemistry", wrong_answers: 4, time_spent_min: 0.24, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 20, subject_name: "Community Medicine", wrong_answers: 16, time_spent_min: 0.91, correct_answers: 4, total_questions: 20, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: -6, skipped: 0, answered: 6, subject_name: "Dermatology", wrong_answers: 6, time_spent_min: 674.62, correct_answers: 0, total_questions: 6, accuracy_percent: 0, avg_time_per_mcq: 112.44, time_eff_percent: 0.89, effort_eff_percent: -25, attempt_rate_percent: 100 },
        { score: 6, skipped: 1, answered: 9, subject_name: "ENT", wrong_answers: 6, time_spent_min: 0.43, correct_answers: 3, total_questions: 10, accuracy_percent: 33.33, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 15, attempt_rate_percent: 90 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Forensic Medicine", wrong_answers: 4, time_spent_min: 0.24, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 27, skipped: 0, answered: 33, subject_name: "General Medicine", wrong_answers: 21, time_spent_min: 1.49, correct_answers: 12, total_questions: 33, accuracy_percent: 36.36, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 20.45, attempt_rate_percent: 100 },
        { score: 21, skipped: 1, answered: 24, subject_name: "General Surgery", wrong_answers: 15, time_spent_min: 1.16, correct_answers: 9, total_questions: 25, accuracy_percent: 37.5, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 21, attempt_rate_percent: 96 },
        { score: 5, skipped: 0, answered: 5, subject_name: "Microbiology", wrong_answers: 3, time_spent_min: 0.22, correct_answers: 2, total_questions: 5, accuracy_percent: 40, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 25, attempt_rate_percent: 100 },
        { score: 12, skipped: 1, answered: 28, subject_name: "Obstetrics and Gynaecology", wrong_answers: 20, time_spent_min: 1.33, correct_answers: 8, total_questions: 29, accuracy_percent: 28.57, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 10.34, attempt_rate_percent: 96.55 },
        { score: -4, skipped: 0, answered: 9, subject_name: "Ophthalmology", wrong_answers: 8, time_spent_min: 0.4, correct_answers: 1, total_questions: 9, accuracy_percent: 11.11, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: -11.11, attempt_rate_percent: 100 },
        { score: 16, skipped: 0, answered: 9, subject_name: "Orthopedics", wrong_answers: 4, time_spent_min: 0.43, correct_answers: 5, total_questions: 9, accuracy_percent: 55.56, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 44.44, attempt_rate_percent: 100 },
        { score: 6, skipped: 0, answered: 4, subject_name: "Pathology", wrong_answers: 2, time_spent_min: 0.2, correct_answers: 2, total_questions: 4, accuracy_percent: 50, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 37.5, attempt_rate_percent: 100 },
        { score: 10, skipped: 0, answered: 10, subject_name: "Pediatrics", wrong_answers: 6, time_spent_min: 0.43, correct_answers: 4, total_questions: 10, accuracy_percent: 40, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 25, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Pharmacology", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 15, skipped: 0, answered: 5, subject_name: "Physiology", wrong_answers: 1, time_spent_min: 0.22, correct_answers: 4, total_questions: 5, accuracy_percent: 80, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 75, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Psychiatry", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Radiology", wrong_answers: 4, time_spent_min: 0.26, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 }
      ]
    },
    {
      exam_serial: 3,
      exam_title: "NEETPG Full Scale Mock Test 3",
      exam_date: "2025-10-31",
      subjects: [
        { score: 1, skipped: 1, answered: 4, subject_name: "Anatomy", wrong_answers: 3, time_spent_min: 0.21, correct_answers: 1, total_questions: 5, accuracy_percent: 25, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 5, attempt_rate_percent: 80 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Anesthesia", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Biochemistry", wrong_answers: 4, time_spent_min: 0.24, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 20, subject_name: "Community Medicine", wrong_answers: 16, time_spent_min: 0.91, correct_answers: 4, total_questions: 20, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: -6, skipped: 0, answered: 6, subject_name: "Dermatology", wrong_answers: 6, time_spent_min: 674.62, correct_answers: 0, total_questions: 6, accuracy_percent: 0, avg_time_per_mcq: 112.44, time_eff_percent: 0.89, effort_eff_percent: -25, attempt_rate_percent: 100 },
        { score: 6, skipped: 1, answered: 9, subject_name: "ENT", wrong_answers: 6, time_spent_min: 0.43, correct_answers: 3, total_questions: 10, accuracy_percent: 33.33, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 15, attempt_rate_percent: 90 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Forensic Medicine", wrong_answers: 4, time_spent_min: 0.24, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 27, skipped: 0, answered: 33, subject_name: "General Medicine", wrong_answers: 21, time_spent_min: 1.49, correct_answers: 12, total_questions: 33, accuracy_percent: 36.36, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 20.45, attempt_rate_percent: 100 },
        { score: 21, skipped: 1, answered: 24, subject_name: "General Surgery", wrong_answers: 15, time_spent_min: 1.16, correct_answers: 9, total_questions: 25, accuracy_percent: 37.5, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 21, attempt_rate_percent: 96 },
        { score: 5, skipped: 0, answered: 5, subject_name: "Microbiology", wrong_answers: 3, time_spent_min: 0.22, correct_answers: 2, total_questions: 5, accuracy_percent: 40, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 25, attempt_rate_percent: 100 },
        { score: 12, skipped: 1, answered: 28, subject_name: "Obstetrics and Gynaecology", wrong_answers: 20, time_spent_min: 1.33, correct_answers: 8, total_questions: 29, accuracy_percent: 28.57, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 10.34, attempt_rate_percent: 96.55 },
        { score: -4, skipped: 0, answered: 9, subject_name: "Ophthalmology", wrong_answers: 8, time_spent_min: 0.4, correct_answers: 1, total_questions: 9, accuracy_percent: 11.11, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: -11.11, attempt_rate_percent: 100 },
        { score: 16, skipped: 0, answered: 9, subject_name: "Orthopedics", wrong_answers: 4, time_spent_min: 0.43, correct_answers: 5, total_questions: 9, accuracy_percent: 55.56, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 44.44, attempt_rate_percent: 100 },
        { score: 6, skipped: 0, answered: 4, subject_name: "Pathology", wrong_answers: 2, time_spent_min: 0.2, correct_answers: 2, total_questions: 4, accuracy_percent: 50, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 37.5, attempt_rate_percent: 100 },
        { score: 10, skipped: 0, answered: 10, subject_name: "Pediatrics", wrong_answers: 6, time_spent_min: 0.43, correct_answers: 4, total_questions: 10, accuracy_percent: 40, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 25, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Pharmacology", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 15, skipped: 0, answered: 5, subject_name: "Physiology", wrong_answers: 1, time_spent_min: 0.22, correct_answers: 4, total_questions: 5, accuracy_percent: 80, avg_time_per_mcq: 0.04, time_eff_percent: 2500, effort_eff_percent: 75, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Psychiatry", wrong_answers: 4, time_spent_min: 0.23, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 },
        { score: 0, skipped: 0, answered: 5, subject_name: "Radiology", wrong_answers: 4, time_spent_min: 0.26, correct_answers: 1, total_questions: 5, accuracy_percent: 20, avg_time_per_mcq: 0.05, time_eff_percent: 2000, effort_eff_percent: 0, attempt_rate_percent: 100 }
      ]
    }
  ]
};

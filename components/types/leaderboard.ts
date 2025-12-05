export interface LeaderboardEntry {
  score: number;
  student_id: string;
  actual_rank: number;
  best_subject: string;
  student_name: string;
  worst_subject: string;
  predicted_rank: number;
}

export interface StudentSummary {
  score: number;
  percentile: number;
  student_id: string;
  actual_rank: number;
  best_subject: string;
  student_name: string;
  worst_subject: string;
  predicted_rank: number;
  total_students: number;
}

export interface MockTestLeaderboard {
  exam_serial: number;
  leaderboard: LeaderboardEntry[];
  mock_test_date: string;
  mock_test_name: string;
  student_summary: StudentSummary;
  mock_test_datetime: string;
}

export interface LeaderboardData {
  get_all_mock_test_leaderboards_for_student: MockTestLeaderboard[];
}

export interface BattleSubject {
  score: number;
  answered: number;
  subject_name: string;
  wrong_answers: number;
  time_spent_min: number;
  correct_answers: number;
  total_questions: number;
  accuracy_percent: number;
  time_eff_percent: number;
  effort_eff_percent: number;
  attempt_rate_percent: number;
  avg_time_per_mcq_sec: number;
}

export interface BattlePerformance {
  subjects: BattleSubject[];
  battle_id: string;
  battle_date: string;
  battle_title: string;
}

export interface BattleData {
  get_battle_subject_performance: BattlePerformance[];
}

export interface BattleSummary {
  score: number;
  answered: number;
  battle_id: string;
  battle_date: string;
  battle_title: string;
  wrong_answers: number;
  time_spent_min: number;
  correct_answers: number;
  total_questions: number;
  accuracy_percent: number;
  time_eff_percent: number;
  effort_eff_percent: number;
  attempt_rate_percent: number;
  avg_time_per_mcq_sec: number;
}

export interface BattleSummaryData {
  get_battle_performance_summary: BattleSummary[];
}

export interface BattleLeaderboardEntry {
  rank: number;
  score: number;
  student_id: string;
  student_name: string;
}

export interface BattleStudentSummary {
  rank: number;
  score: number;
  percentile: number;
  student_id: string;
  student_name: string;
  total_students: number;
}

export interface BattleLeaderboard {
  battle_id: string;
  battle_date: string;
  leaderboard: BattleLeaderboardEntry[];
  battle_title: string;
  student_summary: BattleStudentSummary;
}

export interface BattleLeaderboardData {
  get_all_battle_leaderboards_for_student: BattleLeaderboard[];
}

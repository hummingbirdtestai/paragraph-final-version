export interface FocusTrends {
  streak_days: number;
  inactive_days: string[];
  total_decks_last_7_days: number;
  average_decks_per_day: number;
  average_session_duration_minutes: number;
  best_focus_subject: string;
}

export interface WeeklySummary {
  week_start: string;
  decks_completed: number;
}

export interface FocusDashboardData {
  focus_trends: FocusTrends;
  weekly_summary: WeeklySummary[];
}

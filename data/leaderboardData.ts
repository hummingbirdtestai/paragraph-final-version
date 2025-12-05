import { LeaderboardData } from '@/types/leaderboard';

export const MOCK_LEADERBOARD_DATA: LeaderboardData[] = [
  {
    get_all_mock_test_leaderboards_for_student: [
      {
        exam_serial: 2,
        leaderboard: [
          {
            score: 65,
            student_id: "04b6b311-6e0b-4255-a183-fcb5e5b5a46c",
            actual_rank: 1,
            best_subject: "Anatomy",
            student_name: "919059858856",
            worst_subject: "Radiology",
            predicted_rank: 224970
          },
          {
            score: 11,
            student_id: "6d021d89-aa88-4daf-ab63-1cd25e599c39",
            actual_rank: 2,
            best_subject: "Anatomy",
            student_name: "sindhu",
            worst_subject: "Radiology",
            predicted_rank: 229834
          }
        ],
        mock_test_date: "09 Nov 2025",
        mock_test_name: "NEETPG Full Scale Mock Test 2",
        student_summary: {
          score: 65,
          percentile: 100,
          student_id: "04b6b311-6e0b-4255-a183-fcb5e5b5a46c",
          actual_rank: 1,
          best_subject: "Anatomy",
          student_name: "919059858856",
          worst_subject: "Radiology",
          predicted_rank: 224970,
          total_students: 2
        },
        mock_test_datetime: "28 Oct 2025, 11:53 AM"
      }
    ]
  }
];

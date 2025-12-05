import { BattleData, BattleSummaryData, BattleLeaderboardData } from '@/types/battle';

export const MOCK_BATTLE_DATA: BattleData[] = [
  {
    get_battle_subject_performance: [
      {
        subjects: [
          {
            score: -3,
            answered: 3,
            subject_name: "Gynaecology",
            wrong_answers: 3,
            time_spent_min: 0.08,
            correct_answers: 0,
            total_questions: 3,
            accuracy_percent: 0,
            time_eff_percent: 1197.6,
            effort_eff_percent: -25,
            attempt_rate_percent: 100,
            avg_time_per_mcq_sec: 1.67
          }
        ],
        battle_id: "6960b6ae-be1a-4366-92cc-19fbc2bfccf8",
        battle_date: "2025-11-10",
        battle_title: "Ob-Gyn Mahasangram 👶💃"
      },
      {
        subjects: [
          {
            score: 4,
            answered: 1,
            subject_name: "Pharmacology",
            wrong_answers: 0,
            time_spent_min: 0.08,
            correct_answers: 1,
            total_questions: 1,
            accuracy_percent: 100,
            time_eff_percent: 400,
            effort_eff_percent: 100,
            attempt_rate_percent: 100,
            avg_time_per_mcq_sec: 5
          }
        ],
        battle_id: "ab38d0d9-121d-4761-8277-4663c35a8306",
        battle_date: "2025-11-09",
        battle_title: "Pharma Dhamaka 💊🔥"
      }
    ]
  }
];

export const MOCK_BATTLE_SUMMARY_DATA: BattleSummaryData[] = [
  {
    get_battle_performance_summary: [
      {
        score: -3,
        answered: 3,
        battle_id: "6960b6ae-be1a-4366-92cc-19fbc2bfccf8",
        battle_date: "2025-11-10",
        battle_title: "Ob-Gyn Mahasangram 👶💃",
        wrong_answers: 3,
        time_spent_min: 0.08,
        correct_answers: 0,
        total_questions: 3,
        accuracy_percent: 0,
        time_eff_percent: 1197.6,
        effort_eff_percent: -25,
        attempt_rate_percent: 100,
        avg_time_per_mcq_sec: 1.67
      },
      {
        score: 4,
        answered: 1,
        battle_id: "ab38d0d9-121d-4761-8277-4663c35a8306",
        battle_date: "2025-11-09",
        battle_title: "Pharma Dhamaka 💊🔥",
        wrong_answers: 0,
        time_spent_min: 0.08,
        correct_answers: 1,
        total_questions: 1,
        accuracy_percent: 100,
        time_eff_percent: 400,
        effort_eff_percent: 100,
        attempt_rate_percent: 100,
        avg_time_per_mcq_sec: 5
      }
    ]
  }
];

export const MOCK_BATTLE_LEADERBOARD_DATA: BattleLeaderboardData[] = [
  {
    get_all_battle_leaderboards_for_student: [
      {
        battle_id: "6960b6ae-be1a-4366-92cc-19fbc2bfccf8",
        battle_date: "2025-11-10",
        leaderboard: [
          {
            rank: 1,
            score: -3,
            student_id: "6aa6d420-30dc-47a8-b709-ffa027a9d74b",
            student_name: "Manu"
          }
        ],
        battle_title: "Ob-Gyn Mahasangram 👶💃",
        student_summary: {
          rank: 1,
          score: -3,
          percentile: 100,
          student_id: "6aa6d420-30dc-47a8-b709-ffa027a9d74b",
          student_name: "Manu",
          total_students: 1
        }
      },
      {
        battle_id: "ab38d0d9-121d-4761-8277-4663c35a8306",
        battle_date: "2025-11-09",
        leaderboard: [
          {
            rank: 1,
            score: 4,
            student_id: "6aa6d420-30dc-47a8-b709-ffa027a9d74b",
            student_name: "Manu"
          },
          {
            rank: 2,
            score: -1,
            student_id: "6d021d89-aa88-4daf-ab63-1cd25e599c39",
            student_name: "sindhu"
          }
        ],
        battle_title: "Pharma Dhamaka 💊🔥",
        student_summary: {
          rank: 1,
          score: 4,
          percentile: 100,
          student_id: "6aa6d420-30dc-47a8-b709-ffa027a9d74b",
          student_name: "Manu",
          total_students: 2
        }
      }
    ]
  }
];

// lib/mockBattleData.ts

export interface Battle {
  id: string;
  title: string;
  description: string;
  scheduled_at: string;
  status: 'waiting' | 'active' | 'completed';
  difficulty: 'easy' | 'medium' | 'hard';
}

export const MOCK_BATTLES: Battle[] = [
  {
    id: '1',
    title: 'Epic Quiz Showdown',
    description: 'Test your knowledge across multiple categories',
    scheduled_at: new Date(Date.now() + 3 * 60 * 1000).toISOString(), // 3 mins later
    status: 'waiting',
    difficulty: 'medium',
  },
  {
    id: '2',
    title: 'Neuro Ninja Battle',
    description: 'Fast-paced brain training challenge',
    scheduled_at: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
    status: 'waiting',
    difficulty: 'hard',
  },
  {
    id: '3',
    title: 'Cardio Clash',
    description: 'Quick-fire questions to keep your mind racing',
    scheduled_at: new Date(Date.now() + 7 * 60 * 1000).toISOString(),
    status: 'waiting',
    difficulty: 'easy',
  },
];

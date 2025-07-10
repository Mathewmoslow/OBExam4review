import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface QuizResult {
  id: string;
  moduleId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: Date;
  incorrectQuestions: string[];
}

export interface StudyProgressEntry {
  progress: number;
  topicsCompleted: string[];
}

export interface UserStats {
  studyStreak: number;
  averageQuizScore: number;
  totalTimeSpent: number;
  achievementsUnlocked: number;
}

export interface AppState {
  userName: string;
  userAvatar: string;
  userLevel: number;
  userXP: number;
  userStats: UserStats;
  studyProgress: Record<string, StudyProgressEntry>;
  quizResults: QuizResult[];
  achievements: string[];
  currentModule: string | null;
  currentTopic: string | null;
  lastStudyDate: string | null;
  preferences: {
    soundEnabled: boolean;
    hapticEnabled: boolean;
    notificationsEnabled: boolean;
    theme: 'dark' | 'light';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };

  setUserName: (name: string) => void;
  setUserAvatar: (avatar: string) => void;
  addQuizResult: (result: QuizResult) => void;
  updateProgress: (moduleId: string, updates: Partial<StudyProgressEntry>) => void;
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStudyStreak: () => void;
  startSession: () => void;
  setCurrentModule: (moduleId: string | null) => void;
  setCurrentTopic: (topicId: string | null) => void;
  updatePreferences: (updates: Partial<AppState['preferences']>) => void;
  resetProgress: () => void;
}

const initialStats: UserStats = {
  studyStreak: 0,
  averageQuizScore: 0,
  totalTimeSpent: 0,
  achievementsUnlocked: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      userName: '',
      userAvatar: '👩‍⚕️',
      userLevel: 1,
      userXP: 0,
      userStats: initialStats,
      studyProgress: {},
      quizResults: [],
      achievements: [],
      currentModule: null,
      currentTopic: null,
      lastStudyDate: null,
      preferences: {
        soundEnabled: true,
        hapticEnabled: true,
        notificationsEnabled: true,
        theme: 'dark',
        difficulty: 'intermediate',
      },

      setUserName: (name) => set({ userName: name }),
      setUserAvatar: (avatar) => set({ userAvatar: avatar }),

      addQuizResult: (result) =>
        set((state) => {
          const results = [...state.quizResults, result];
          const avg =
            results.reduce((acc, r) => acc + r.score, 0) / results.length;
          return {
            quizResults: results,
            userStats: { ...state.userStats, averageQuizScore: avg },
          };
        }),

      updateProgress: (moduleId, updates) =>
        set((state) => ({
          studyProgress: {
            ...state.studyProgress,
            [moduleId]: {
              progress:
                updates.progress ?? state.studyProgress[moduleId]?.progress ?? 0,
              topicsCompleted:
                updates.topicsCompleted ??
                state.studyProgress[moduleId]?.topicsCompleted ?? [],
            },
          },
        })),

      addXP: (amount) =>
        set((state) => {
          const newXP = state.userXP + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          return { userXP: newXP, userLevel: newLevel };
        }),

      unlockAchievement: (achievementId) =>
        set((state) => ({
          achievements: Array.from(new Set([...state.achievements, achievementId])),
          userStats: {
            ...state.userStats,
            achievementsUnlocked: state.userStats.achievementsUnlocked + 1,
          },
        })),

      updateStudyStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const lastStudy = state.lastStudyDate;

          if (!lastStudy) {
            return {
              userStats: { ...state.userStats, studyStreak: 1 },
              lastStudyDate: today,
            };
          }

          const lastDate = new Date(lastStudy);
          const diff = Math.floor(
            (new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diff === 0) {
            return state;
          } else if (diff === 1) {
            return {
              userStats: {
                ...state.userStats,
                studyStreak: state.userStats.studyStreak + 1,
              },
              lastStudyDate: today,
            };
          } else {
            return {
              userStats: { ...state.userStats, studyStreak: 1 },
              lastStudyDate: today,
            };
          }
        }),

      startSession: () => {
        get().updateStudyStreak();
      },

      setCurrentModule: (moduleId) => set({ currentModule: moduleId }),
      setCurrentTopic: (topicId) => set({ currentTopic: topicId }),

      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),

      resetProgress: () =>
        set({
          userXP: 0,
          userLevel: 1,
          studyProgress: {},
          quizResults: [],
          achievements: [],
          userStats: initialStats,
        }),
    }),
    {
      name: 'ob-exam-review-storage',
    }
  )
);

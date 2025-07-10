import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserProgress {
  completedModules: string[];
  completedTopics: string[];
  quizScores: Record<string, number>;
  totalXP: number;
  level: number;
  achievements: string[];
  studyStreak: number;
  lastStudyDate: string | null;
}

interface AppState {
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  progress: UserProgress;
  preferences: {
    soundEnabled: boolean;
    hapticEnabled: boolean;
    notificationsEnabled: boolean;
    theme: 'dark' | 'light';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
  };
  
  // Actions
  setUser: (user: AppState['user']) => void;
  updateProgress: (updates: Partial<UserProgress>) => void;
  addCompletedModule: (moduleId: string) => void;
  addCompletedTopic: (topicId: string) => void;
  updateQuizScore: (quizId: string, score: number) => void;
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  updateStudyStreak: () => void;
  updatePreferences: (updates: Partial<AppState['preferences']>) => void;
  resetProgress: () => void;
}

const initialProgress: UserProgress = {
  completedModules: [],
  completedTopics: [],
  quizScores: {},
  totalXP: 0,
  level: 1,
  achievements: [],
  studyStreak: 0,
  lastStudyDate: null,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      progress: initialProgress,
      preferences: {
        soundEnabled: true,
        hapticEnabled: true,
        notificationsEnabled: true,
        theme: 'dark',
        difficulty: 'intermediate',
      },
      
      setUser: (user) => set({ user }),
      
      updateProgress: (updates) => 
        set((state) => ({
          progress: { ...state.progress, ...updates },
        })),
      
      addCompletedModule: (moduleId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedModules: [...new Set([...state.progress.completedModules, moduleId])],
          },
        })),
      
      addCompletedTopic: (topicId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            completedTopics: [...new Set([...state.progress.completedTopics, topicId])],
          },
        })),
      
      updateQuizScore: (quizId, score) =>
        set((state) => ({
          progress: {
            ...state.progress,
            quizScores: { ...state.progress.quizScores, [quizId]: score },
          },
        })),
      
      addXP: (amount) =>
        set((state) => {
          const newXP = state.progress.totalXP + amount;
          const newLevel = Math.floor(newXP / 1000) + 1;
          
          return {
            progress: {
              ...state.progress,
              totalXP: newXP,
              level: newLevel,
            },
          };
        }),
      
      unlockAchievement: (achievementId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            achievements: [...new Set([...state.progress.achievements, achievementId])],
          },
        })),
      
      updateStudyStreak: () =>
        set((state) => {
          const today = new Date().toDateString();
          const lastStudy = state.progress.lastStudyDate;
          
          if (!lastStudy) {
            return {
              progress: {
                ...state.progress,
                studyStreak: 1,
                lastStudyDate: today,
              },
            };
          }
          
          const lastDate = new Date(lastStudy);
          const dayDiff = Math.floor((new Date().getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (dayDiff === 0) {
            return state; // Already studied today
          } else if (dayDiff === 1) {
            return {
              progress: {
                ...state.progress,
                studyStreak: state.progress.studyStreak + 1,
                lastStudyDate: today,
              },
            };
          } else {
            return {
              progress: {
                ...state.progress,
                studyStreak: 1,
                lastStudyDate: today,
              },
            };
          }
        }),
      
      updatePreferences: (updates) =>
        set((state) => ({
          preferences: { ...state.preferences, ...updates },
        })),
      
      resetProgress: () => set({ progress: initialProgress }),
    }),
    {
      name: 'ob-exam-review-storage',
    }
  )
);

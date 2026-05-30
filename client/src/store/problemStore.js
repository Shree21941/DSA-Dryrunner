import { create } from 'zustand';

export const useProblemStore = create((set) => ({
  // Problem List State
  problems: [],
  isLoadingProblems: false,
  problemsError: null,

  // Current Problem State
  currentProblem: null,
  isLoadingProblem: false,
  problemError: null,

  // Filter State
  selectedDifficulty: null,

  // Actions
  fetchProblems: async (difficulty = null) => {
    set({ isLoadingProblems: true, problemsError: null });
    try {
      let url = '/api/problems';
      if (difficulty) {
        url += `?difficulty=${difficulty}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        set({ problems: data.data, isLoadingProblems: false });
      } else {
        set({ problemsError: data.error, isLoadingProblems: false });
      }
    } catch (error) {
      set({ problemsError: error.message, isLoadingProblems: false });
    }
  },

  fetchProblemById: async (problemId) => {
    set({ isLoadingProblem: true, problemError: null });
    try {
      const response = await fetch(`/api/problems/${problemId}`);
      const data = await response.json();

      if (data.success) {
        set({ currentProblem: data.data, isLoadingProblem: false });
      } else {
        set({ problemError: data.error, isLoadingProblem: false });
      }
    } catch (error) {
      set({ problemError: error.message, isLoadingProblem: false });
    }
  },

  setSelectedDifficulty: (difficulty) => {
    set({ selectedDifficulty: difficulty });
  },

  clearCurrentProblem: () => {
    set({ currentProblem: null });
  },
}));

import { create } from 'zustand';

export const useExecutionStore = create((set) => ({
  // Editor State
  code: '',
  language: 'javascript',

  // Execution State
  isExecuting: false,
  executionSteps: [],
  currentStepIndex: 0,
  testResults: [],
  executionError: null,
  jobId: null,

  // Visualization State
  selectedTestCase: 0,
  showVisualization: false,

  // Actions
  setCode: (code) => {
    set({ code });
  },

  setLanguage: (language) => {
    set({ language });
  },

  submitExecution: async (code, problemId, language = 'javascript') => {
    set({ isExecuting: true, executionError: null, testResults: [] });
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          problemId,
          language,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error);
      }

      set({
        testResults: data.data,
        isExecuting: false,
      });

      return data.data;
    } catch (error) {
      set({ executionError: error.message, isExecuting: false });
      throw error;
    }
  },

  addExecutionStep: (step) => {
    set((state) => ({
      executionSteps: [...state.executionSteps, step],
      currentStepIndex: state.executionSteps.length,
    }));
  },

  setCurrentStepIndex: (index) => {
    set({ currentStepIndex: index });
  },

  nextStep: () => {
    set((state) => ({
      currentStepIndex: Math.min(state.currentStepIndex + 1, state.executionSteps.length - 1),
    }));
  },

  previousStep: () => {
    set((state) => ({
      currentStepIndex: Math.max(state.currentStepIndex - 1, 0),
    }));
  },

  setTestResults: (results) => {
    set({ testResults: results });
  },

  setSelectedTestCase: (index) => {
    set({ selectedTestCase: index });
  },

  resetExecution: () => {
    set({
      executionSteps: [],
      currentStepIndex: 0,
      testResults: [],
      executionError: null,
      jobId: null,
    });
  },
}));

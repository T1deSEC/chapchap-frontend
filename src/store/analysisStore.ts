import { create } from 'zustand'
import type { RoutineAnalysisResult } from '../types'

interface AnalysisStore {
  routineResult: RoutineAnalysisResult | null
  setRoutineResult: (result: RoutineAnalysisResult) => void
  clearRoutineResult: () => void
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  routineResult: null,
  setRoutineResult: (result) => set({ routineResult: result }),
  clearRoutineResult: () => set({ routineResult: null }),
}))

import { create } from 'zustand'
import type { IngredientAnalysisResult, RoutineAnalysisResult } from '../types'

interface AnalysisStore {
  ingredientResult: IngredientAnalysisResult | null
  routineResult: RoutineAnalysisResult | null
  setIngredientResult: (result: IngredientAnalysisResult) => void
  clearIngredientResult: () => void
  setRoutineResult: (result: RoutineAnalysisResult) => void
  clearRoutineResult: () => void
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  ingredientResult: null,
  routineResult: null,
  setIngredientResult: (result) => set({ ingredientResult: result }),
  clearIngredientResult: () => set({ ingredientResult: null }),
  setRoutineResult: (result) => set({ routineResult: result }),
  clearRoutineResult: () => set({ routineResult: null }),
}))

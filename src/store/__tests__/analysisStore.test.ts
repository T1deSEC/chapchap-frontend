// src/store/__tests__/analysisStore.test.ts
import { act } from 'react'
import { useAnalysisStore } from '../analysisStore'
import type { IngredientAnalysisResult, RoutineAnalysisResult } from '../../types'

const mockIngredientResult: IngredientAnalysisResult = {
  productId: 1,
  safetyScore: 85,
  ingredients: [{ name: '나이아신아마이드', role: '미백', safetyLevel: 'safe' }],
  summary: '전반적으로 안전한 성분 구성입니다.',
}

const mockRoutineResult: RoutineAnalysisResult = {
  status: 'warning',
  conflictingIngredients: ['비타민 C', '벤조일 퍼옥사이드'],
  recommendation: '다른 시간대에 사용하세요.',
  suggestedProducts: [],
}

beforeEach(() => {
  useAnalysisStore.setState({
    ingredientResult: null,
    routineResult: null,
  })
})

it('setIngredientResult 저장 후 clear 시 null이 된다', () => {
  act(() => useAnalysisStore.getState().setIngredientResult(mockIngredientResult))
  expect(useAnalysisStore.getState().ingredientResult?.safetyScore).toBe(85)
  act(() => useAnalysisStore.getState().clearIngredientResult())
  expect(useAnalysisStore.getState().ingredientResult).toBeNull()
})

it('setRoutineResult 저장 후 clear 시 null이 된다', () => {
  act(() => useAnalysisStore.getState().setRoutineResult(mockRoutineResult))
  expect(useAnalysisStore.getState().routineResult?.status).toBe('warning')
  act(() => useAnalysisStore.getState().clearRoutineResult())
  expect(useAnalysisStore.getState().routineResult).toBeNull()
})

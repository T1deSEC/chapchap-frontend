// src/store/__tests__/analysisStore.test.ts
import { act } from 'react'
import { useAnalysisStore } from '../analysisStore'
import type { AiIngredientResult, RoutineAnalysisResult } from '../../types'

const mockIngredientResult: AiIngredientResult = {
  safetyScore: 85,
  ingredientAnalysis: [
    { inciName: 'Niacinamide', koName: '나이아신아마이드', safetyLevel: 'safe', assessment: '적합', reason: '미백에 효과적이에요.' },
  ],
  summary: '전반적으로 안전한 성분 구성입니다.',
  recommendations: [],
}

const mockRoutineResult: RoutineAnalysisResult = {
  status: 'caution',
  conflictingPairs: [{ ingredient1: '비타민 C', ingredient2: '벤조일 퍼옥사이드' }],
  recommendation: '다른 시간대에 사용하세요.',
  suggestedAdjustments: [],
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
  expect(useAnalysisStore.getState().routineResult?.status).toBe('caution')
  act(() => useAnalysisStore.getState().clearRoutineResult())
  expect(useAnalysisStore.getState().routineResult).toBeNull()
})

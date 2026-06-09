// src/store/__tests__/analysisStore.test.ts
import { act } from 'react'
import { useAnalysisStore } from '../analysisStore'
import type { RoutineAnalysisResult } from '../../types'

const mockRoutineResult: RoutineAnalysisResult = {
  status: 'caution',
  conflictingPairs: [{ ingredient1: '비타민 C', ingredient2: '벤조일 퍼옥사이드' }],
  recommendation: '다른 시간대에 사용하세요.',
  suggestedAdjustments: [],
}

beforeEach(() => {
  useAnalysisStore.setState({ routineResult: null })
})

it('setRoutineResult 저장 후 clear 시 null이 된다', () => {
  act(() => useAnalysisStore.getState().setRoutineResult(mockRoutineResult))
  expect(useAnalysisStore.getState().routineResult?.status).toBe('caution')
  act(() => useAnalysisStore.getState().clearRoutineResult())
  expect(useAnalysisStore.getState().routineResult).toBeNull()
})

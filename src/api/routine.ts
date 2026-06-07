import apiClient from './client'
import type { RoutineRecord, RoutineAnalysisResult } from '../types'

export interface UpsertRoutinePayload {
  routinePeriod: 'AM' | 'PM'
  products: Array<{ productId: number; stepOrder: number }>
}

export const getRoutineItems = (period: 'AM' | 'PM') =>
  apiClient.get<RoutineRecord>('/api/routine', { params: { period } })

export const upsertRoutine = (payload: UpsertRoutinePayload) =>
  apiClient.put<RoutineRecord>('/api/routine', payload)

export const deleteRoutinePeriod = (period: 'AM' | 'PM') =>
  apiClient.delete('/api/routine', { params: { period } })

export const runAiRoutineAnalysis = (
  productIds: number[],
  routinePeriod: 'AM' | 'PM',
  userSkinType: string
) =>
  apiClient.post<RoutineAnalysisResult>('/api/analysis/routine', {
    productIds,
    routinePeriod,
    userSkinType,
  })

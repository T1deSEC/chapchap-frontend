import apiClient from './client'
import type { RoutineItem, RoutineAnalysisResult } from '../types'

export interface SaveRoutinePayload {
  period: 'AM' | 'PM'
  products: Array<{ productId: number; order: number }>
}

export const getRoutineItems = (period: 'AM' | 'PM') =>
  apiClient.get<RoutineItem[]>('/api/routine', { params: { period } })

export const saveRoutine = (payload: SaveRoutinePayload) =>
  apiClient.post('/api/routine', payload)

export const removeRoutine = (routineId: number) =>
  apiClient.delete(`/api/routine/${routineId}`)

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

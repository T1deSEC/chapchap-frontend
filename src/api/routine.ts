import apiClient from './client'
import type { RoutineItem, RoutineAnalysisResult } from '../types'

export const getRoutineItems = (time: 'morning' | 'evening') =>
  apiClient.get<RoutineItem[]>('/api/routines', { params: { time } })

export const removeRoutineItem = (itemId: number) =>
  apiClient.delete(`/api/routines/item/${itemId}`)

export const runAiRoutineAnalysis = () =>
  apiClient.post<RoutineAnalysisResult>('/api/analysis/routine')

import apiClient from './client'
import type { DiaryEntry } from '../types'

export interface CreateDiaryPayload {
  logDate: string
  skinStatus: string
  keywords?: string[]
  memo?: string
  photoUrl?: string
  amRoutineId?: number
  pmRoutineId?: number
  amExecuted?: boolean
  pmExecuted?: boolean
}

export type UpdateDiaryPayload = Partial<CreateDiaryPayload>

export const getDiaryEntries = (year: number, month: number) =>
  apiClient.get<DiaryEntry[]>('/api/diary', { params: { year, month } })

export const getDiaryEntry = (id: number) =>
  apiClient.get<DiaryEntry>(`/api/diary/${id}`)

export const createDiaryEntry = (payload: CreateDiaryPayload) =>
  apiClient.post<DiaryEntry>('/api/diary', payload)

export const updateDiaryEntry = (id: number, payload: UpdateDiaryPayload) =>
  apiClient.put<DiaryEntry>(`/api/diary/${id}`, payload)

export const deleteDiaryEntry = (id: number) =>
  apiClient.delete(`/api/diary/${id}`)

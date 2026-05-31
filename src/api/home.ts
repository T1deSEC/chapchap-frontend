import apiClient from './client'
import type { DiaryEntry } from '../types'

export type CreateDiaryPayload = Pick<DiaryEntry, 'mood' | 'keywords' | 'note' | 'date'>

export const getDiaryEntries = (year: number, month: number) =>
  apiClient.get<DiaryEntry[]>('/api/diary', { params: { year, month } })

export const getDiaryEntry = (id: number) =>
  apiClient.get<DiaryEntry>(`/api/diary/${id}`)

export const createDiaryEntry = (payload: CreateDiaryPayload) =>
  apiClient.post<DiaryEntry>('/api/diary', payload)

export const deleteDiaryEntry = (id: number) =>
  apiClient.delete(`/api/diary/${id}`)

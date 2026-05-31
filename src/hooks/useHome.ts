import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDiaryEntries,
  getDiaryEntry,
  createDiaryEntry,
  deleteDiaryEntry,
} from '../api/home'
import type { DiaryEntry } from '../types'
import type { CreateDiaryPayload } from '../api/home'

export const useDiaryEntries = (year: number, month: number) =>
  useQuery({
    queryKey: ['diary', year, month],
    queryFn: () => getDiaryEntries(year, month).then((r) => r.data),
  })

export const useDiaryEntry = (id: number) =>
  useQuery({
    queryKey: ['diary', id],
    queryFn: () => getDiaryEntry(id).then((r) => r.data),
    enabled: id > 0,
  })

export const useCreateDiaryMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDiaryPayload) =>
      createDiaryEntry(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  })
}

export const useDeleteDiaryMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteDiaryEntry,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  })
}

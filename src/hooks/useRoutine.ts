import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoutineItems, upsertRoutine, deleteRoutinePeriod, runAiRoutineAnalysis } from '../api/routine'
import { useAnalysisStore } from '../store/analysisStore'
import { useAuthStore } from '../store/authStore'
import type { UpsertRoutinePayload } from '../api/routine'
import type { RoutineRecord } from '../types'

const toPeriod = (time: 'morning' | 'evening'): 'AM' | 'PM' =>
  time === 'morning' ? 'AM' : 'PM'

export const useRoutineItems = (time: 'morning' | 'evening') =>
  useQuery({
    queryKey: ['routine', 'items', time],
    queryFn: () =>
      getRoutineItems(toPeriod(time))
        .then((r) => r.data)
        .catch((err) => {
          if (err?.response?.status === 404) return null as unknown as RoutineRecord
          throw err
        }),
  })

export const useUpsertRoutineMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpsertRoutinePayload) => upsertRoutine(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routine', 'items'] }),
  })
}

export const useDeleteRoutineMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (period: 'AM' | 'PM') => deleteRoutinePeriod(period),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routine', 'items'] }),
  })
}

export const useAiRoutineAnalysisMutation = (
  routine: RoutineRecord | null | undefined,
  time: 'morning' | 'evening'
) => {
  const setRoutineResult = useAnalysisStore((s) => s.setRoutineResult)
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: () =>
      runAiRoutineAnalysis(
        (routine?.products ?? []).map((p) => p.productId),
        toPeriod(time),
        user?.skinType ?? ''
      ).then((r) => r.data),
    onSuccess: (data) => setRoutineResult(data),
  })
}

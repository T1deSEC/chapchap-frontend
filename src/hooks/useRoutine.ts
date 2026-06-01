import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoutineItems, saveRoutine, removeRoutine, runAiRoutineAnalysis } from '../api/routine'
import { useAnalysisStore } from '../store/analysisStore'
import { useAuthStore } from '../store/authStore'
import type { SaveRoutinePayload } from '../api/routine'

const toPeriod = (time: 'morning' | 'evening'): 'AM' | 'PM' =>
  time === 'morning' ? 'AM' : 'PM'

export const useRoutineItems = (time: 'morning' | 'evening') =>
  useQuery({
    queryKey: ['routine', 'items', time],
    queryFn: () => getRoutineItems(toPeriod(time)).then((r) => r.data),
  })

export const useSaveRoutineMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SaveRoutinePayload) => saveRoutine(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routine', 'items'] }),
  })
}

export const useRemoveRoutineItemMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (routineId: number) => removeRoutine(routineId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routine', 'items'] }),
  })
}

export const useAiRoutineAnalysisMutation = (
  items: Array<{ id: number; productId: number }>,
  time: 'morning' | 'evening'
) => {
  const setRoutineResult = useAnalysisStore((s) => s.setRoutineResult)
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: () =>
      runAiRoutineAnalysis(
        items.map((i) => i.productId),
        toPeriod(time),
        user?.skinType ?? ''
      ).then((r) => r.data),
    onSuccess: (data) => setRoutineResult(data),
  })
}

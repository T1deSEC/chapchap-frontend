import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoutineItems, removeRoutineItem, runAiRoutineAnalysis } from '../api/routine'
import { useAnalysisStore } from '../store/analysisStore'

export const useRoutineItems = (time: 'morning' | 'evening') =>
  useQuery({
    queryKey: ['routine', 'items', time],
    queryFn: () => getRoutineItems(time).then((r) => r.data),
  })

export const useRemoveRoutineItemMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => removeRoutineItem(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routine', 'items'] }),
  })
}

export const useAiRoutineAnalysisMutation = () => {
  const setRoutineResult = useAnalysisStore((s) => s.setRoutineResult)
  return useMutation({
    mutationFn: () => runAiRoutineAnalysis().then((r) => r.data),
    onSuccess: (data) => setRoutineResult(data),
  })
}

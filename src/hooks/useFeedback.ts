import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFeedbackHistory, submitFeedback } from '../api/feedback'
import type { ProductFeedbackPayload } from '../types'

export const useFeedbackHistory = () =>
  useQuery({
    queryKey: ['feedback', 'history'],
    queryFn: () => getFeedbackHistory().then((r) => r.data),
  })

export const useSubmitFeedbackMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductFeedbackPayload) => submitFeedback(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feedback', 'history'] }),
  })
}

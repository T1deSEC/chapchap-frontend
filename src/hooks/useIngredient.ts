import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  searchIngredients,
  getProductDetail,
  runAiIngredientAnalysis,
  submitProductFeedback,
} from '../api/ingredient'
import { useAnalysisStore } from '../store/analysisStore'
import type { ProductFeedbackPayload } from '../types'

export const useIngredientSearch = (query: string, filter: string) =>
  useQuery({
    queryKey: ['ingredients', 'search', query, filter],
    queryFn: () => searchIngredients(query, filter).then((r) => r.data),
    enabled: query.length > 0 || filter !== '전체',
  })

export const useProductDetail = (productId: number) =>
  useQuery({
    queryKey: ['products', 'detail', productId],
    queryFn: () => getProductDetail(productId).then((r) => r.data),
    enabled: productId > 0,
  })

export const useAiIngredientAnalysisMutation = () => {
  const setIngredientResult = useAnalysisStore((s) => s.setIngredientResult)
  return useMutation({
    mutationFn: () => runAiIngredientAnalysis().then((r) => r.data),
    onSuccess: (data) => {
      setIngredientResult({
        productId: 0,
        safetyScore: 0,
        ingredients: [],
        summary: JSON.stringify(data),
      })
    },
  })
}

export const useSubmitFeedbackMutation = (productId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductFeedbackPayload) =>
      submitProductFeedback(productId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products', 'detail', productId] }),
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getIngredientRecommendation, generateIngredientRecommendation } from '../api/recommendation'
import type { IngredientRecommendation } from '../types'

export const useIngredientRecommendation = () =>
  useQuery<IngredientRecommendation | null>({
    queryKey: ['ingredient-recommendation'],
    queryFn: () =>
      getIngredientRecommendation()
        .then((r) => r.data)
        .catch((err) => {
          if (err.response?.status === 404) return null
          throw err
        }),
  })

export const useGenerateRecommendationMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => generateIngredientRecommendation().then((r) => r.data),
    onSuccess: (data) => {
      queryClient.setQueryData(['ingredient-recommendation'], data)
    },
  })
}

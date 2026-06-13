import { useQuery, useMutation } from '@tanstack/react-query'
import { searchProducts, getProductDetail, runAiIngredientAnalysis, getProductAiAnalysis } from '../api/ingredient'
import type { AiIngredientResult } from '../types'

export const useProductSearch = (query: string, category: string) =>
  useQuery({
    queryKey: ['products', 'search', query, category],
    queryFn: () => searchProducts(query, category).then((r) => r.data.content),
    enabled: query.length > 0 || category !== '전체',
  })

export const useProductDetail = (productId: number) =>
  useQuery({
    queryKey: ['products', 'detail', productId],
    queryFn: () => getProductDetail(productId).then((r) => r.data),
    enabled: productId > 0,
  })

export const useAiIngredientAnalysisMutation = (
  productId: number,
  skinType: string,
  skinConcerns: string[]
) =>
  useMutation({
    mutationFn: () =>
      runAiIngredientAnalysis(productId, skinType, skinConcerns)
        .then((r) => r.data as AiIngredientResult),
  })

export const useProductAiAnalysis = (productId: number) =>
  useQuery<AiIngredientResult | null>({
    queryKey: ['productAiAnalysis', productId],
    queryFn: () =>
      getProductAiAnalysis(productId)
        .then((r) => r.data)
        .catch((err) => {
          if (err?.response?.status === 404) return null
          throw err
        }),
    staleTime: 0,
  })

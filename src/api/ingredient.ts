import apiClient from './client'
import type { ProductDetail, AiIngredientResult, ProductFeedbackPayload } from '../types'

export interface SearchResult {
  id: number
  brand: string
  name: string
  type: 'product' | 'ingredient'
  description?: string
}

export const searchIngredients = (query: string, filter: string) =>
  apiClient.get<SearchResult[]>('/api/ingredients/search', { params: { query, filter } })

export const getProductDetail = (productId: number) =>
  apiClient.get<ProductDetail>(`/api/products/${productId}`)

export const runAiIngredientAnalysis = () =>
  apiClient.post<AiIngredientResult>('/api/analysis/ingredient')

export const submitProductFeedback = (productId: number, payload: ProductFeedbackPayload) =>
  apiClient.post(`/api/products/${productId}/feedback`, payload)

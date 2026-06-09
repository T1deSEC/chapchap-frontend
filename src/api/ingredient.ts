import apiClient from './client'
import type { ProductDetail, PageResponse } from '../types'

export interface ProductSearchResult {
  id: number
  name: string
  brand: string
  category: string
  imageUrl: string
}

export const searchProducts = (query: string, category: string) =>
  apiClient.get<PageResponse<ProductSearchResult>>('/api/products', { params: { search: query, category } })

export const getProductDetail = (productId: number) =>
  apiClient.get<ProductDetail>(`/api/products/${productId}`)

export const runAiIngredientAnalysis = (
  productId: number,
  userSkinType: string,
  userSkinConcerns: string[]
) =>
  apiClient.post('/api/analysis/ingredient', { productId, userSkinType, userSkinConcerns })

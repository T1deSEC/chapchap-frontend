import apiClient from './client'
import type { Product, PageResponse } from '../types'

export const getRecommendedProducts = () =>
  apiClient.get<Product[]>('/api/recommendations')

export const searchProducts = (search: string, page: number, size = 20) =>
  apiClient.get<PageResponse<Product>>('/api/products', {
    params: { search: search || undefined, page, size },
  })

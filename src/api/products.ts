import apiClient from './client'
import type { Product } from '../types'

export const getRecommendedProducts = () =>
  apiClient.get<Product[]>('/api/recommendations')

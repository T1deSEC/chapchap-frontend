import client from './client'
import type { IngredientRecommendation } from '../types'

export const getIngredientRecommendation = () =>
  client.get<IngredientRecommendation>('/api/recommendations/ingredients')

export const generateIngredientRecommendation = () =>
  client.post<IngredientRecommendation>('/api/recommendations/ingredients')

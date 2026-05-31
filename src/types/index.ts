export interface User {
  id: number
  name: string
  email: string
  skinType: string
}

export interface AuthResponse {
  accessToken: string
  user: User
}

export interface ApiError {
  message: string
  status: number
}

export interface DiaryEntry {
  id: number
  date: string
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible'
  keywords: string[]
  note: string
  products: string[]
}

export interface Product {
  id: number
  name: string
  brand: string
  category: string
  imageUrl: string
  keyIngredients: string[]
  skinTypes: string[]
}

export interface IngredientAnalysisResult {
  productId: number
  safetyScore: number
  ingredients: Array<{
    name: string
    role: string
    safetyLevel: 'safe' | 'caution' | 'warning'
  }>
  summary: string
}

export interface RoutineAnalysisResult {
  status: 'safe' | 'warning' | 'conflict'
  conflictingIngredients: string[]
  recommendation: string
  suggestedProducts: Product[]
}

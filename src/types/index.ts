export interface User {
  id: number
  name: string
  email: string
  skinType: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
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

export interface IngredientItem {
  name: string
  rank: number
  description: string
  safetyLevel: 'safe' | 'caution' | 'warning'
}

export interface SkinImpact {
  label: string
  score: number
  level: string
  color: 'primary' | 'warning' | 'danger'
}

export interface ProductDetail extends Product {
  safetyScore: number
  ingredients: IngredientItem[]
  skinImpacts: SkinImpact[]
}

// AI analysis — matches /api/analysis/ingredient response
export interface AiIngredientResult {
  safetyScore: number
  ingredientAnalysis: Array<{
    name: string
    role: string
    safetyLevel: 'safe' | 'caution' | 'warning'
  }>
  summary: string
  recommendations: string[]
}

// AI routine — matches /api/analysis/routine response
export interface RoutineAnalysisResult {
  status: 'safe' | 'warning' | 'conflict'
  conflictingPairs: Array<{ ingredient1: string; ingredient2: string }>
  recommendation: string
  suggestedAdjustments: string[]
}

export interface RoutineItem {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
  order: number
}

export interface UserProfile {
  id: number
  name: string
  email: string
  skinType: string
  skinConcerns: string[]
  gender?: string
  birthYear?: number
}

export interface SkinProfilePayload {
  skinType: string
  skinConcerns: string[]
  gender?: string
  birthYear?: number
}

export interface WishlistItem {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
}

export interface FeedbackRecord {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
  reaction: 'good' | 'neutral' | 'trouble'
  isEffective: boolean
  memo: string
  createdAt: string
}

export interface ProductFeedbackPayload {
  productId: number
  reaction: 'good' | 'neutral' | 'trouble'
  memo: string
}

export interface Notification {
  id: number
  icon: string
  title: string
  body: string
  read: boolean
  type: 'INGREDIENT_ANALYSIS' | 'ROUTINE_CONFLICT' | 'ROUTINE_CAUTION'
  createdAt: string
}

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

export interface PageResponse<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

// 백엔드 DiaryResponse와 동일한 구조
export interface DiaryEntry {
  id: number
  logDate: string
  skinStatus: string
  keywords: string[]
  memo: string
  photoUrl?: string
  amRoutineId?: number
  pmRoutineId?: number
  amExecuted: boolean
  pmExecuted: boolean
}

export interface Product {
  id: number
  name: string
  brand: string
  category: string
  imageUrl: string
}

// 백엔드 ProductIngredientResponse와 동일한 구조
export interface IngredientItem {
  ingredientId: number
  inciName: string
  koName: string
  concentrationOrder: number
}

export interface SkinImpact {
  label: string
  score: number
  level: string
  color: 'primary' | 'warning' | 'danger'
}

// safetyScore는 ProductDetailPage에서 ingredients로 로컬 계산
export interface ProductDetail extends Product {
  ingredients: IngredientItem[]
}

// 백엔드 IngredientAnalysisResponse와 동일한 구조
export interface AiIngredientResult {
  safetyScore: number
  ingredientAnalysis: Array<{
    inciName: string
    koName: string
    safetyLevel: '안전' | '주의' | '위험'
    assessment: string
    reason: string
  }>
  summary: string
  recommendations: string[]
  skinImpacts: SkinImpact[]
}

// 백엔드 RoutineAnalysisResponse와 동일한 구조
export interface RoutineAnalysisResult {
  status: 'good' | 'caution' | 'conflict'
  conflictingPairs: Array<{ ingredient1: string; ingredient2: string; reason?: string }>
  recommendation: string
  suggestedAdjustments: string[]
}

// 백엔드 RoutineProductItem (productName/brand/imageUrl 포함)
export interface RoutineItem {
  productId: number
  stepOrder: number
  productName: string
  brand: string
  imageUrl: string
}

// 백엔드 RoutineResponse와 동일한 구조
export interface RoutineRecord {
  id: number
  recordDate: string
  routinePeriod: string
  products: RoutineItem[]
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

// 백엔드 WishlistItemResponse와 동일한 구조
export interface WishlistItem {
  productId: number
  productName: string
  brand: string
  category: string
  imageUrl: string
  addedAt?: string
}

export type FeedbackReaction = 'good' | 'neutral' | 'trouble'

// 백엔드 FeedbackResponse와 동일한 구조
export interface FeedbackRecord {
  productId: number
  productName: string
  brand?: string
  imageUrl?: string
  effective: boolean
  reaction: FeedbackReaction
  memo: string
  createdAt: string
}

export interface ProductFeedbackPayload {
  productId: number
  reaction: FeedbackReaction
  memo: string
}

// 백엔드 NotificationResponse와 동일한 구조 (icon은 프론트에서 type으로 결정)
export interface Notification {
  id: number
  type: 'INGREDIENT_ANALYSIS' | 'INGREDIENT_RECOMMENDATION' | 'ROUTINE_CONFLICT' | 'ROUTINE_CAUTION'
  title: string
  body: string
  read: boolean
  createdAt: string
}

export interface RecommendedIngredient {
  ingredientId: number
  inciName: string
  koName: string
  reason: string
  sortOrder: number
}

export interface AvoidIngredient {
  ingredientId: number
  inciName: string
  koName: string
  reason: string
}

export interface RecommendedProduct {
  productId: number
  name: string
  brand: string
  imageUrl: string
  matchScore: number
  rankOrder: number
}

export interface IngredientRecommendation {
  createdAt: string
  summary: string
  recommendedIngredients: RecommendedIngredient[]
  ingredientsToAvoid: AvoidIngredient[]
  recommendedProducts: RecommendedProduct[]
}

export interface NotificationSettings {
  ingredientAnalysisEnabled: boolean
  ingredientRecommendEnabled: boolean
  routineAnalysisEnabled: boolean
}

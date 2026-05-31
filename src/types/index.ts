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

// 성분 탭 전용 타입
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

export interface AiRecommendedProduct {
  id: number
  brand: string
  name: string
  imageUrl: string
  recommendScore: number
}

export interface AiIngredientResult {
  recommendedProducts: AiRecommendedProduct[]
}

export interface ProductFeedbackPayload {
  reaction: '좋음' | '변화 없음' | '트러블 발생'
  rating: number
  usagePeriod: string
  comment: string
}

export interface RoutineItem {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
  order: number
}

export interface RecommendedRoutine {
  id: number
  name: string
  description: string
  skinTypes: string[]
}

export interface UserProfile {
  id: number
  name: string
  email: string
  skinType: string
  skinTone: string
  skinConcerns: string[]
  avatarUrl?: string
}

export interface WishlistItem {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
  tag?: string
}

export interface FeedbackRecord {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
  tags: string[]
  createdAt: string
}

export interface SkinProfilePayload {
  skinType: string
  skinConcerns: string[]
}

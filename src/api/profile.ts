import apiClient from './client'
import type { UserProfile, WishlistItem, FeedbackRecord, SkinProfilePayload } from '../types'

export const getProfile = () =>
  apiClient.get<UserProfile>('/api/profile')

export const updateSkinProfile = (payload: SkinProfilePayload) =>
  apiClient.put<UserProfile>('/api/profile/skin', payload)

export const getWishlist = () =>
  apiClient.get<WishlistItem[]>('/api/profile/wishlist')

export const getFeedbackHistory = () =>
  apiClient.get<FeedbackRecord[]>('/api/profile/feedback-history')

import apiClient from './client'
import type { WishlistItem } from '../types'

export const getWishlist = () =>
  apiClient.get<WishlistItem[]>('/api/wishlist')

export const addToWishlist = (productId: number) =>
  apiClient.post(`/api/wishlist/${productId}`)

export const removeFromWishlist = (productId: number) =>
  apiClient.delete(`/api/wishlist/${productId}`)

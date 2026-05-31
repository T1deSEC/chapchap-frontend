import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateSkinProfile, getWishlist, getFeedbackHistory } from '../api/profile'
import type { SkinProfilePayload } from '../types'

export const useProfile = () => useQuery({ queryKey: ['profile'], queryFn: () => getProfile().then((r) => r.data) })
export const useWishlist = () => useQuery({ queryKey: ['profile', 'wishlist'], queryFn: () => getWishlist().then((r) => r.data) })
export const useFeedbackHistory = () => useQuery({ queryKey: ['profile', 'feedback-history'], queryFn: () => getFeedbackHistory().then((r) => r.data) })
export const useUpdateSkinProfileMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SkinProfilePayload) => updateSkinProfile(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist'

export const useWishlist = () =>
  useQuery({
    queryKey: ['wishlist'],
    queryFn: () => getWishlist().then((r) => r.data),
  })

export const useAddToWishlistMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (productId: number) => addToWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}

export const useRemoveFromWishlistMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (productId: number) => removeFromWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}

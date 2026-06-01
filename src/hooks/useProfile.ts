import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateSkinProfile } from '../api/profile'
import type { SkinProfilePayload } from '../types'

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then((r) => r.data),
  })

export const useUpdateSkinProfileMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SkinProfilePayload) => updateSkinProfile(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}

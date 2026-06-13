import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProfile,
  updateSkinProfile,
  getNotificationSettings,
  updateNotificationSettings,
  updateNickname,
  updatePassword,
} from '../api/profile'
import type { SkinProfilePayload, NotificationSettings } from '../types'
import { useAuthStore } from '../store/authStore'

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then((r) => r.data),
  })

export const useUpdateSkinProfileMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SkinProfilePayload) => updateSkinProfile(payload),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ['profile'] })
      qc.invalidateQueries({ queryKey: ['ingredient-recommendation'] })
      qc.invalidateQueries({ queryKey: ['productAiAnalysis'] })
      useAuthStore.getState().updateUser({ skinType: variables.skinType })
    },
  })
}

export const useNotificationSettings = () =>
  useQuery({
    queryKey: ['notification-settings'],
    queryFn: () => getNotificationSettings().then((r) => r.data),
  })

export const useUpdateNotificationSettingsMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: NotificationSettings) => updateNotificationSettings(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notification-settings'] }),
  })
}

export const useUpdateNicknameMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (nickname: string) => updateNickname(nickname),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}

export const useUpdatePasswordMutation = () =>
  useMutation({
    mutationFn: ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) =>
      updatePassword(currentPassword, newPassword),
  })

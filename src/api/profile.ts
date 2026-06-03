import apiClient from './client'
import type { UserProfile, SkinProfilePayload, NotificationSettings } from '../types'

export const getProfile = () =>
  apiClient.get<UserProfile>('/api/users/me')

export const updateSkinProfile = (payload: SkinProfilePayload) =>
  Promise.all([
    apiClient.put('/api/users/me/skin-profile', {
      skinType: payload.skinType,
      gender: payload.gender,
      birthYear: payload.birthYear,
    }),
    apiClient.put('/api/users/me/skin-concerns', { concerns: payload.skinConcerns }),
  ])

export const getNotificationSettings = () =>
  apiClient.get<NotificationSettings>('/api/users/me/notification-settings')

export const updateNotificationSettings = (payload: NotificationSettings) =>
  apiClient.put('/api/users/me/notification-settings', payload)

export const updateNickname = (nickname: string) =>
  apiClient.put('/api/users/me/nickname', { nickname })

export const updatePassword = (currentPassword: string, newPassword: string) =>
  apiClient.put('/api/users/me/password', { currentPassword, newPassword })

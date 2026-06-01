import apiClient from './client'
import type { UserProfile, SkinProfilePayload } from '../types'

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

import apiClient from './client'
import type { FeedbackRecord, ProductFeedbackPayload } from '../types'

export const getFeedbackHistory = () =>
  apiClient.get<FeedbackRecord[]>('/api/feedback')

export const submitFeedback = (payload: ProductFeedbackPayload) =>
  apiClient.post('/api/feedback', payload)

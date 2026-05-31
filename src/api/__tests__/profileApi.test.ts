import { vi, it, expect, describe } from 'vitest'
import apiClient from '../client'
import { getProfile, updateSkinProfile, getWishlist, getFeedbackHistory } from '../profile'

vi.mock('../client', () => ({ default: { get: vi.fn(), put: vi.fn() } }))
const mockGet = vi.mocked(apiClient.get)
const mockPut = vi.mocked(apiClient.put)

beforeEach(() => vi.clearAllMocks())

describe('profile api', () => {
  it('getProfile은 /api/profile로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: {} })
    await getProfile()
    expect(mockGet).toHaveBeenCalledWith('/api/profile')
  })

  it('updateSkinProfile은 /api/profile/skin으로 PUT 요청을 보낸다', async () => {
    mockPut.mockResolvedValueOnce({ data: {} })
    await updateSkinProfile({ skinType: '건성', skinConcerns: ['여드름'] })
    expect(mockPut).toHaveBeenCalledWith('/api/profile/skin', { skinType: '건성', skinConcerns: ['여드름'] })
  })

  it('getWishlist는 /api/profile/wishlist로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getWishlist()
    expect(mockGet).toHaveBeenCalledWith('/api/profile/wishlist')
  })

  it('getFeedbackHistory는 /api/profile/feedback-history로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getFeedbackHistory()
    expect(mockGet).toHaveBeenCalledWith('/api/profile/feedback-history')
  })
})

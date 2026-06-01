import { vi, it, expect, describe, beforeEach } from 'vitest'
import apiClient from '../client'
import { getProfile, updateSkinProfile } from '../profile'
import { getWishlist } from '../wishlist'
import { getFeedbackHistory } from '../feedback'

vi.mock('../client', () => ({ default: { get: vi.fn(), put: vi.fn() } }))
const mockGet = vi.mocked(apiClient.get)
const mockPut = vi.mocked(apiClient.put)

beforeEach(() => vi.clearAllMocks())

describe('profile api', () => {
  it('getProfile은 /api/users/me로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: {} })
    await getProfile()
    expect(mockGet).toHaveBeenCalledWith('/api/users/me')
  })

  it('updateSkinProfile은 /api/users/me/skin-profile과 /api/users/me/skin-concerns로 PUT 요청을 보낸다', async () => {
    mockPut.mockResolvedValue({ data: {} })
    await updateSkinProfile({ skinType: '건성', skinConcerns: ['여드름'] })
    expect(mockPut).toHaveBeenCalledWith('/api/users/me/skin-profile', {
      skinType: '건성',
      gender: undefined,
      birthYear: undefined,
    })
    expect(mockPut).toHaveBeenCalledWith('/api/users/me/skin-concerns', { concerns: ['여드름'] })
  })

  it('getWishlist는 /api/wishlist로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getWishlist()
    expect(mockGet).toHaveBeenCalledWith('/api/wishlist')
  })

  it('getFeedbackHistory는 /api/feedback으로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getFeedbackHistory()
    expect(mockGet).toHaveBeenCalledWith('/api/feedback')
  })
})

import { vi, it, expect, describe, beforeEach } from 'vitest'
import apiClient from '../client'
import {
  searchProducts,
  getProductDetail,
  runAiIngredientAnalysis,
} from '../ingredient'
import { submitFeedback } from '../feedback'

vi.mock('../client', () => ({ default: { get: vi.fn(), post: vi.fn() } }))
const mockGet = vi.mocked(apiClient.get)
const mockPost = vi.mocked(apiClient.post)

beforeEach(() => vi.clearAllMocks())

describe('ingredient api', () => {
  it('searchProducts는 /api/products로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await searchProducts('나이아신아마이드', '미백')
    expect(mockGet).toHaveBeenCalledWith('/api/products', {
      params: { search: '나이아신아마이드', category: '미백' },
    })
  })

  it('getProductDetail은 /api/products/:id로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: {} })
    await getProductDetail(42)
    expect(mockGet).toHaveBeenCalledWith('/api/products/42')
  })

  it('runAiIngredientAnalysis는 /api/analysis/ingredient로 POST 요청을 보낸다', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })
    await runAiIngredientAnalysis(1, '건성', ['여드름'])
    expect(mockPost).toHaveBeenCalledWith('/api/analysis/ingredient', {
      productId: 1,
      userSkinType: '건성',
      userSkinConcerns: ['여드름'],
    })
  })

  it('submitFeedback은 /api/feedback으로 POST 요청을 보낸다', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })
    const payload = { productId: 1, reaction: 'good' as const, memo: '좋아요' }
    await submitFeedback(payload)
    expect(mockPost).toHaveBeenCalledWith('/api/feedback', payload)
  })
})

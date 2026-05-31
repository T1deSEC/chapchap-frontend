import { vi, it, expect, describe, beforeEach } from 'vitest'
import apiClient from '../client'
import {
  searchIngredients,
  getProductDetail,
  runAiIngredientAnalysis,
  submitProductFeedback,
} from '../ingredient'

vi.mock('../client', () => ({ default: { get: vi.fn(), post: vi.fn() } }))
const mockGet = vi.mocked(apiClient.get)
const mockPost = vi.mocked(apiClient.post)

beforeEach(() => vi.clearAllMocks())

describe('ingredient api', () => {
  it('searchIngredients는 /api/ingredients/search로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await searchIngredients('나이아신아마이드', '미백')
    expect(mockGet).toHaveBeenCalledWith('/api/ingredients/search', {
      params: { query: '나이아신아마이드', filter: '미백' },
    })
  })

  it('getProductDetail은 /api/products/:id로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: {} })
    await getProductDetail(42)
    expect(mockGet).toHaveBeenCalledWith('/api/products/42')
  })

  it('runAiIngredientAnalysis는 /api/analysis/ingredient로 POST 요청을 보낸다', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })
    await runAiIngredientAnalysis()
    expect(mockPost).toHaveBeenCalledWith('/api/analysis/ingredient')
  })

  it('submitProductFeedback은 /api/products/:id/feedback으로 POST 요청을 보낸다', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })
    const payload = { reaction: '좋음' as const, rating: 4, usagePeriod: '2-4주', comment: '' }
    await submitProductFeedback(1, payload)
    expect(mockPost).toHaveBeenCalledWith('/api/products/1/feedback', payload)
  })
})

import { vi, it, expect, describe, beforeEach } from 'vitest'
import apiClient from '../client'
import {
  getDiaryEntries,
  createDiaryEntry,
  getDiaryEntry,
  deleteDiaryEntry,
} from '../home'
import { getRecommendedProducts } from '../products'
import { getNotifications } from '../notifications'

vi.mock('../client', () => ({ default: { get: vi.fn(), post: vi.fn(), delete: vi.fn() } }))
const mockGet = vi.mocked(apiClient.get)
const mockPost = vi.mocked(apiClient.post)
const mockDelete = vi.mocked(apiClient.delete)

beforeEach(() => vi.clearAllMocks())

describe('home api', () => {
  it('getDiaryEntries는 /api/diary?year=&month= 로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getDiaryEntries(2024, 5)
    expect(mockGet).toHaveBeenCalledWith('/api/diary', { params: { year: 2024, month: 5 } })
  })

  it('createDiaryEntry는 /api/diary로 POST 요청을 보낸다', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })
    await createDiaryEntry({ mood: 'great', keywords: [], note: '', date: '2024-05-01' })
    expect(mockPost).toHaveBeenCalledWith('/api/diary', expect.objectContaining({ mood: 'great' }))
  })

  it('getDiaryEntry는 /api/diary/:id로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: {} })
    await getDiaryEntry(42)
    expect(mockGet).toHaveBeenCalledWith('/api/diary/42')
  })

  it('deleteDiaryEntry는 /api/diary/:id로 DELETE 요청을 보낸다', async () => {
    mockDelete.mockResolvedValueOnce({ data: {} })
    await deleteDiaryEntry(42)
    expect(mockDelete).toHaveBeenCalledWith('/api/diary/42')
  })
})

describe('products api', () => {
  it('getRecommendedProducts는 /api/products/recommended로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getRecommendedProducts()
    expect(mockGet).toHaveBeenCalledWith('/api/products/recommended')
  })
})

describe('notifications api', () => {
  it('getNotifications는 /api/notifications로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getNotifications()
    expect(mockGet).toHaveBeenCalledWith('/api/notifications')
  })
})

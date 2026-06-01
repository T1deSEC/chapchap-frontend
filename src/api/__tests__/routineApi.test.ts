import { vi, it, expect, describe, beforeEach } from 'vitest'
import apiClient from '../client'
import { getRoutineItems, removeRoutine, runAiRoutineAnalysis } from '../routine'

vi.mock('../client', () => ({ default: { get: vi.fn(), delete: vi.fn(), post: vi.fn() } }))
const mockGet = vi.mocked(apiClient.get)
const mockDelete = vi.mocked(apiClient.delete)
const mockPost = vi.mocked(apiClient.post)

beforeEach(() => vi.clearAllMocks())

describe('routine api', () => {
  it('getRoutineItems는 /api/routine?period=로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getRoutineItems('AM')
    expect(mockGet).toHaveBeenCalledWith('/api/routine', { params: { period: 'AM' } })
  })

  it('removeRoutine은 /api/routine/:id로 DELETE 요청을 보낸다', async () => {
    mockDelete.mockResolvedValueOnce({ data: {} })
    await removeRoutine(42)
    expect(mockDelete).toHaveBeenCalledWith('/api/routine/42')
  })

  it('runAiRoutineAnalysis는 /api/analysis/routine으로 POST 요청을 보낸다', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })
    await runAiRoutineAnalysis([1, 2], 'AM', '건성')
    expect(mockPost).toHaveBeenCalledWith('/api/analysis/routine', {
      productIds: [1, 2],
      routinePeriod: 'AM',
      userSkinType: '건성',
    })
  })
})

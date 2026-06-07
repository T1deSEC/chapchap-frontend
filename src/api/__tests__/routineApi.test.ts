import { vi, it, expect, describe, beforeEach } from 'vitest'
import apiClient from '../client'
import { getRoutineItems, upsertRoutine, deleteRoutinePeriod, runAiRoutineAnalysis } from '../routine'

vi.mock('../client', () => ({
  default: { get: vi.fn(), put: vi.fn(), delete: vi.fn(), post: vi.fn() },
}))
const mockGet = vi.mocked(apiClient.get)
const mockPut = vi.mocked(apiClient.put)
const mockDelete = vi.mocked(apiClient.delete)
const mockPost = vi.mocked(apiClient.post)

beforeEach(() => vi.clearAllMocks())

describe('routine api', () => {
  it('getRoutineItems는 /api/routine?period=로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: {} } as any)
    await getRoutineItems('AM')
    expect(mockGet).toHaveBeenCalledWith('/api/routine', { params: { period: 'AM' } })
  })

  it('upsertRoutine은 /api/routine으로 PUT 요청을 보낸다', async () => {
    mockPut.mockResolvedValueOnce({ data: {} } as any)
    await upsertRoutine({ routinePeriod: 'AM', products: [{ productId: 1, stepOrder: 1 }] })
    expect(mockPut).toHaveBeenCalledWith('/api/routine', {
      routinePeriod: 'AM',
      products: [{ productId: 1, stepOrder: 1 }],
    })
  })

  it('deleteRoutinePeriod는 /api/routine?period=로 DELETE 요청을 보낸다', async () => {
    mockDelete.mockResolvedValueOnce({ data: {} } as any)
    await deleteRoutinePeriod('PM')
    expect(mockDelete).toHaveBeenCalledWith('/api/routine', { params: { period: 'PM' } })
  })

  it('runAiRoutineAnalysis는 /api/analysis/routine으로 POST 요청을 보낸다', async () => {
    mockPost.mockResolvedValueOnce({ data: {} } as any)
    await runAiRoutineAnalysis([1, 2], 'AM', '건성')
    expect(mockPost).toHaveBeenCalledWith('/api/analysis/routine', {
      productIds: [1, 2],
      routinePeriod: 'AM',
      userSkinType: '건성',
    })
  })
})

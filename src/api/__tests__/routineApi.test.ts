import { vi, it, expect, describe } from 'vitest'
import apiClient from '../client'
import { getRoutineItems, removeRoutineItem, runAiRoutineAnalysis } from '../routine'

vi.mock('../client', () => ({ default: { get: vi.fn(), delete: vi.fn(), post: vi.fn() } }))
const mockGet = vi.mocked(apiClient.get)
const mockDelete = vi.mocked(apiClient.delete)
const mockPost = vi.mocked(apiClient.post)

beforeEach(() => vi.clearAllMocks())

describe('routine api', () => {
  it('getRoutineItems는 /api/routines?time=로 GET 요청을 보낸다', async () => {
    mockGet.mockResolvedValueOnce({ data: [] })
    await getRoutineItems('morning')
    expect(mockGet).toHaveBeenCalledWith('/api/routines', { params: { time: 'morning' } })
  })

  it('removeRoutineItem은 /api/routines/item/:id로 DELETE 요청을 보낸다', async () => {
    mockDelete.mockResolvedValueOnce({ data: {} })
    await removeRoutineItem(42)
    expect(mockDelete).toHaveBeenCalledWith('/api/routines/item/42')
  })

  it('runAiRoutineAnalysis는 /api/analysis/routine으로 POST 요청을 보낸다', async () => {
    mockPost.mockResolvedValueOnce({ data: {} })
    await runAiRoutineAnalysis()
    expect(mockPost).toHaveBeenCalledWith('/api/analysis/routine')
  })
})

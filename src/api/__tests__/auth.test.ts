import { vi, it, expect } from 'vitest'
import apiClient from '../client'
import { login, register } from '../auth'

vi.mock('../client', () => ({
  default: {
    post: vi.fn(),
  },
}))

const mockPost = vi.mocked(apiClient.post)

it('login은 /api/auth/login으로 POST 요청을 보낸다', async () => {
  mockPost.mockResolvedValueOnce({ data: { accessToken: 'tok', user: {} } })
  await login('test@test.com', 'password123')
  expect(mockPost).toHaveBeenCalledWith('/api/auth/login', {
    email: 'test@test.com',
    password: 'password123',
  })
})

it('register는 /api/auth/register로 POST 요청을 보낸다', async () => {
  mockPost.mockResolvedValueOnce({ data: { accessToken: 'tok', user: {} } })
  await register('홍길동', 'test@test.com', 'password123', '복합성')
  expect(mockPost).toHaveBeenCalledWith('/api/auth/register', {
    name: '홍길동',
    email: 'test@test.com',
    password: 'password123',
    skinType: '복합성',
  })
})

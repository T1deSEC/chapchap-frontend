// src/api/__tests__/client.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useAuthStore } from '../../store/authStore'

vi.mock('axios', async () => {
  const actual = await vi.importActual<typeof import('axios')>('axios')
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn(() => ({
        interceptors: {
          request: { use: vi.fn() },
          response: { use: vi.fn() },
        },
      })),
    },
  }
})

describe('authStore integration', () => {
  beforeEach(() => {
    useAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false })
  })

  it('logout 후 accessToken이 null이다', () => {
    useAuthStore.getState().login('test-token', {
      id: 1, name: '홍길동', email: 'test@test.com', skinType: '복합성',
    })
    useAuthStore.getState().logout()
    expect(useAuthStore.getState().accessToken).toBeNull()
  })
})

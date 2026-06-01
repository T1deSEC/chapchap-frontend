import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../authStore'

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
})

describe('useAuthStore', () => {
  it('login stores access token, refresh token, and user', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.login('access-123', 'refresh-456', { id: 1, name: '홍길동', email: 'test@test.com', skinType: '건성' })
    })
    expect(result.current.accessToken).toBe('access-123')
    expect(result.current.refreshToken).toBe('refresh-456')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('setTokens updates access and refresh tokens without changing user', () => {
    const user = { id: 1, name: '홍길동', email: 'test@test.com', skinType: '건성' }
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login('old-access', 'old-refresh', user))
    act(() => result.current.setTokens('new-access', 'new-refresh'))
    expect(result.current.accessToken).toBe('new-access')
    expect(result.current.refreshToken).toBe('new-refresh')
    expect(result.current.user).toEqual(user)
  })

  it('logout clears all auth state', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login('t', 'r', { id: 1, name: 'a', email: 'a@a.com', skinType: '건성' }))
    act(() => result.current.logout())
    expect(result.current.accessToken).toBeNull()
    expect(result.current.refreshToken).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})

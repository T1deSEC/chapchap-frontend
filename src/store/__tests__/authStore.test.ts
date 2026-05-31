// src/store/__tests__/authStore.test.ts
import { act } from 'react'
import { useAuthStore } from '../authStore'

const mockUser = {
  id: 1,
  name: '홍길동',
  email: 'test@test.com',
  skinType: '복합성',
}

beforeEach(() => {
  useAuthStore.setState({
    accessToken: null,
    user: null,
    isAuthenticated: false,
  })
})

it('초기 상태는 미인증이다', () => {
  expect(useAuthStore.getState().isAuthenticated).toBe(false)
  expect(useAuthStore.getState().accessToken).toBeNull()
})

it('login 호출 시 토큰과 유저가 저장된다', () => {
  act(() => useAuthStore.getState().login('token-abc', mockUser))
  const state = useAuthStore.getState()
  expect(state.isAuthenticated).toBe(true)
  expect(state.accessToken).toBe('token-abc')
  expect(state.user?.name).toBe('홍길동')
})

it('logout 호출 시 상태가 초기화된다', () => {
  act(() => useAuthStore.getState().login('token-abc', mockUser))
  act(() => useAuthStore.getState().logout())
  const state = useAuthStore.getState()
  expect(state.isAuthenticated).toBe(false)
  expect(state.accessToken).toBeNull()
  expect(state.user).toBeNull()
})

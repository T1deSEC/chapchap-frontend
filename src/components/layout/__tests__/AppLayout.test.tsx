// src/components/layout/__tests__/AppLayout.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useAuthStore } from '../../../store/authStore'
import AppLayout from '../AppLayout'

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false })
})

function setup(isAuthenticated: boolean) {
  if (isAuthenticated) {
    useAuthStore.setState({
      accessToken: 'token',
      user: { id: 1, name: '홍길동', email: 'test@test.com', skinType: '복합성' },
      isAuthenticated: true,
    })
  }

  return render(
    <MemoryRouter initialEntries={['/home']}>
      <Routes>
        <Route path="/login" element={<div>로그인 페이지</div>} />
        <Route element={<AppLayout />}>
          <Route path="/home" element={<div>홈 페이지</div>} />
        </Route>
      </Routes>
    </MemoryRouter>
  )
}

it('인증 상태에서 Outlet 콘텐츠를 렌더링한다', () => {
  setup(true)
  expect(screen.getByText('홈 페이지')).toBeInTheDocument()
})

it('미인증 상태에서 /login으로 리다이렉트한다', () => {
  setup(false)
  expect(screen.getByText('로그인 페이지')).toBeInTheDocument()
})

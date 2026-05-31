import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import LoginPage from '../LoginPage'
import * as authApi from '../../../api/auth'
import { useAuthStore } from '../../../store/authStore'

vi.mock('../../../api/auth')
const mockLogin = vi.mocked(authApi.login)

function renderLogin() {
  return render(
    <MemoryRouter initialEntries={['/login']}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<div>홈 페이지</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false })
  vi.clearAllMocks()
})

it('이메일과 비밀번호 인풋, 로그인 버튼을 렌더링한다', () => {
  renderLogin()
  expect(screen.getByPlaceholderText('이메일을 입력해주세요')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('비밀번호를 입력해주세요')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: '로그인' })).toBeInTheDocument()
})

it('유효하지 않은 이메일 입력 시 에러 메시지를 표시한다', async () => {
  renderLogin()
  fireEvent.change(screen.getByPlaceholderText('이메일을 입력해주세요'), {
    target: { value: 'notanemail' },
  })
  fireEvent.click(screen.getByRole('button', { name: '로그인' }))
  await screen.findByText('유효한 이메일을 입력해주세요')
})

it('로그인 성공 시 /home으로 이동하고 authStore가 업데이트된다', async () => {
  const mockUser = { id: 1, name: '홍길동', email: 'test@test.com', skinType: '복합성' }
  mockLogin.mockResolvedValueOnce({
    data: { accessToken: 'token-xyz', user: mockUser },
  } as any)

  renderLogin()
  fireEvent.change(screen.getByPlaceholderText('이메일을 입력해주세요'), {
    target: { value: 'test@test.com' },
  })
  fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력해주세요'), {
    target: { value: 'password123' },
  })
  fireEvent.click(screen.getByRole('button', { name: '로그인' }))

  await waitFor(() => screen.getByText('홈 페이지'))
  expect(useAuthStore.getState().isAuthenticated).toBe(true)
  expect(useAuthStore.getState().accessToken).toBe('token-xyz')
})

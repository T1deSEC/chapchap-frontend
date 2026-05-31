import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import RegisterPage from '../RegisterPage'
import * as authApi from '../../../api/auth'
import { useAuthStore } from '../../../store/authStore'

vi.mock('../../../api/auth')
const mockRegister = vi.mocked(authApi.register)

function renderRegister() {
  return render(
    <MemoryRouter initialEntries={['/register']}>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/home" element={<div>홈 페이지</div>} />
      </Routes>
    </MemoryRouter>
  )
}

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, user: null, isAuthenticated: false })
  vi.clearAllMocks()
})

it('이름, 이메일, 비밀번호, 피부타입 선택 UI를 렌더링한다', () => {
  renderRegister()
  expect(screen.getByPlaceholderText('이름을 입력해주세요')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('이메일을 입력해주세요')).toBeInTheDocument()
  expect(screen.getByPlaceholderText('비밀번호를 입력해주세요')).toBeInTheDocument()
  expect(screen.getByText('건성')).toBeInTheDocument()
  expect(screen.getByText('지성')).toBeInTheDocument()
  expect(screen.getByText('복합성')).toBeInTheDocument()
  expect(screen.getByText('민감성')).toBeInTheDocument()
})

it('회원가입 성공 시 /home으로 이동한다', async () => {
  const mockUser = { id: 2, name: '김철수', email: 'new@test.com', skinType: '건성' }
  mockRegister.mockResolvedValueOnce({
    data: { accessToken: 'new-token', user: mockUser },
  } as any)

  renderRegister()
  fireEvent.change(screen.getByPlaceholderText('이름을 입력해주세요'), {
    target: { value: '김철수' },
  })
  fireEvent.change(screen.getByPlaceholderText('이메일을 입력해주세요'), {
    target: { value: 'new@test.com' },
  })
  fireEvent.change(screen.getByPlaceholderText('비밀번호를 입력해주세요'), {
    target: { value: 'password123' },
  })
  fireEvent.click(screen.getByText('건성'))
  fireEvent.click(screen.getByRole('button', { name: /회원가입/ }))

  await waitFor(() => screen.getByText('홈 페이지'))
  expect(useAuthStore.getState().isAuthenticated).toBe(true)
})

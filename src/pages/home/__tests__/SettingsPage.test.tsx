import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import SettingsPage from '../SettingsPage'
import { useAuthStore } from '../../../store/authStore'

beforeEach(() => {
  useAuthStore.setState({
    accessToken: 'tok', user: { id: 1, name: '홍길동', email: 'test@test.com', skinType: '복합성' },
    isAuthenticated: true,
  })
})

function renderSettings() {
  return render(
    <MemoryRouter initialEntries={['/home/settings']}>
      <Routes>
        <Route path="/home/settings" element={<SettingsPage />} />
        <Route path="/login" element={<div>로그인</div>} />
      </Routes>
    </MemoryRouter>
  )
}

it('설정 섹션들을 렌더링한다', () => {
  renderSettings()
  expect(screen.getByText('계정')).toBeInTheDocument()
  expect(screen.getByText('앱 기능')).toBeInTheDocument()
  expect(screen.getByText('기타')).toBeInTheDocument()
})

it('로그아웃 클릭 시 authStore가 초기화되고 /login으로 이동한다', () => {
  renderSettings()
  fireEvent.click(screen.getByText('로그아웃'))
  expect(useAuthStore.getState().isAuthenticated).toBe(false)
  expect(screen.getByText('로그인')).toBeInTheDocument()
})

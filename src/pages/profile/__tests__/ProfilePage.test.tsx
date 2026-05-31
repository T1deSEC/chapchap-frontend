import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ProfilePage from '../ProfilePage'
import * as profileApi from '../../../api/profile'
import { useAuthStore } from '../../../store/authStore'

vi.mock('../../../api/profile')

function renderProfile() {
  useAuthStore.setState({ accessToken: 'tok', user: { id: 1, name: '챱챱유저', email: 'chapchap@gmail.com', skinType: '지성' }, isAuthenticated: true })
  vi.mocked(profileApi.getProfile).mockResolvedValue({ data: { id: 1, name: '챱챱유저', email: 'chapchap@gmail.com', skinType: '지성', skinTone: '밝음', skinConcerns: ['여드름'] } } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/login" element={<div>로그인</div>} />
          <Route path="/profile/feedback-history" element={<div>피드백기록</div>} />
          <Route path="/profile/wishlist" element={<div>찜목록</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('"마이" 헤더를 렌더링한다', () => { renderProfile(); expect(screen.getByText('마이')).toBeInTheDocument() })
it('유저 이름과 이메일을 렌더링한다', async () => { renderProfile(); expect(await screen.findByText('챱챱유저')).toBeInTheDocument(); expect(screen.getByText('chapchap@gmail.com')).toBeInTheDocument() })
it('"피드백 기록" 링크를 렌더링한다', () => { renderProfile(); expect(screen.getByText('피드백 기록')).toBeInTheDocument() })
it('"찜한 제품" 링크를 렌더링한다', () => { renderProfile(); expect(screen.getByText('찜한 제품')).toBeInTheDocument() })
it('로그아웃 클릭 시 /login으로 이동한다', () => {
  renderProfile()
  fireEvent.click(screen.getByText('로그아웃'))
  expect(screen.getByText('로그인')).toBeInTheDocument()
  expect(useAuthStore.getState().isAuthenticated).toBe(false)
})

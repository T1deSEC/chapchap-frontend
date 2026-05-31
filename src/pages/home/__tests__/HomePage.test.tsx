import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import HomePage from '../HomePage'
import * as homeApi from '../../../api/home'
import * as productsApi from '../../../api/products'

vi.mock('../../../api/home')
vi.mock('../../../api/products')

const mockProducts = [
  {
    id: 1, name: '비타C 세럼', brand: '더마로직', category: '세럼',
    imageUrl: '', keyIngredients: ['비타민 C'], skinTypes: ['지성'],
  },
]

function renderHome() {
  vi.mocked(homeApi.getDiaryEntries).mockResolvedValue({ data: [] } as any)
  vi.mocked(productsApi.getRecommendedProducts).mockResolvedValue({ data: mockProducts } as any)

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/home']}>
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/home/diary/write" element={<div>일기작성</div>} />
          <Route path="/home/recommend" element={<div>추천전체</div>} />
          <Route path="/home/notifications" element={<div>알림</div>} />
          <Route path="/home/settings" element={<div>설정</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('CHAPCHAP 헤더와 알림 아이콘을 렌더링한다', () => {
  renderHome()
  expect(screen.getByText('CHAPCHAP')).toBeInTheDocument()
})

it('피부 일기 섹션 헤더를 렌더링한다', () => {
  renderHome()
  expect(screen.getByText('피부 일기')).toBeInTheDocument()
})

it('추천 제품 섹션과 더보기 링크를 렌더링한다', () => {
  renderHome()
  expect(screen.getByText('추천 제품')).toBeInTheDocument()
  expect(screen.getByText('더보기')).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import HomePage from '../HomePage'
import * as homeApi from '../../../api/home'
import * as recommendationApi from '../../../api/recommendation'

vi.mock('../../../api/home')
vi.mock('../../../api/recommendation')

const mockRecommendation = {
  createdAt: '2026-06-10T00:00:00+00:00',
  summary: '테스트 추천',
  recommendedIngredients: [],
  ingredientsToAvoid: [],
  recommendedProducts: [
    { productId: 1, name: '비타C 세럼', brand: '더마로직', imageUrl: '', matchScore: 0.9, rankOrder: 1 },
    { productId: 2, name: '수딩 크림', brand: '스킨랩', imageUrl: '', matchScore: 0.7, rankOrder: 2 },
  ],
}

function renderHome(withRecommendation = true) {
  vi.mocked(homeApi.getDiaryEntries).mockResolvedValue({ data: [] } as any)
  vi.mocked(recommendationApi.getIngredientRecommendation).mockResolvedValue(
    withRecommendation ? ({ data: mockRecommendation } as any) : Promise.reject({ response: { status: 404 } })
  )
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

it('CHAPCHAP 헤더와 알림 아이콘을 렌더링한다', async () => {
  renderHome()
  expect(await screen.findByText('CHAPCHAP')).toBeInTheDocument()
})

it('피부 일기 섹션 헤더를 렌더링한다', async () => {
  renderHome()
  expect(await screen.findByText('피부 일기')).toBeInTheDocument()
})

it('추천 제품 섹션과 더보기 링크를 렌더링한다', async () => {
  renderHome()
  expect(await screen.findByText('추천 제품')).toBeInTheDocument()
  expect(await screen.findByText('더보기')).toBeInTheDocument()
})

it('AI 추천 결과가 있으면 제품 이름을 렌더링한다', async () => {
  renderHome(true)
  expect(await screen.findByText('비타C 세럼')).toBeInTheDocument()
})

it('AI 추천 결과가 없으면 안내 문구를 렌더링한다', async () => {
  renderHome(false)
  expect(await screen.findByText(/성분 탭에서 분석을 먼저 진행해보세요/)).toBeInTheDocument()
})

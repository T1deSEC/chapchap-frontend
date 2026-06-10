import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RecommendPage from '../RecommendPage'
import * as recommendationApi from '../../../api/recommendation'

vi.mock('../../../api/recommendation')

const mockRecommendation = {
  createdAt: '2026-06-10T00:00:00+00:00',
  summary: '테스트 추천',
  recommendedIngredients: [],
  ingredientsToAvoid: [],
  recommendedProducts: [
    { productId: 1, name: '테스트 세럼', brand: 'A', imageUrl: '', matchScore: 0.9, rankOrder: 1 },
    { productId: 2, name: '수딩 크림', brand: 'B', imageUrl: '', matchScore: 0.7, rankOrder: 2 },
  ],
}

function renderRecommend(withRecommendation = true) {
  vi.mocked(recommendationApi.getIngredientRecommendation).mockResolvedValue(
    withRecommendation ? ({ data: mockRecommendation } as any) : Promise.reject({ response: { status: 404 } })
  )
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter><RecommendPage /></MemoryRouter>
    </QueryClientProvider>
  )
}

it('"추천 제품 전체보기" 헤더를 렌더링한다', () => {
  renderRecommend()
  expect(screen.getByText('추천 제품 전체보기')).toBeInTheDocument()
})

it('AI 추천 결과가 있으면 제품 목록을 렌더링한다', async () => {
  renderRecommend(true)
  expect(await screen.findByText('테스트 세럼')).toBeInTheDocument()
  expect(screen.getByText('수딩 크림')).toBeInTheDocument()
})

it('AI 추천 결과가 없으면 빈 상태 문구를 렌더링한다', async () => {
  renderRecommend(false)
  expect(await screen.findByText('추천 제품이 없어요')).toBeInTheDocument()
})

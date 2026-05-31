import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import RecommendPage from '../RecommendPage'
import * as productsApi from '../../../api/products'

vi.mock('../../../api/products')

function renderRecommend() {
  vi.mocked(productsApi.getRecommendedProducts).mockResolvedValue({
    data: [
      { id: 1, name: '테스트 세럼', brand: 'A', category: '세럼', imageUrl: '', keyIngredients: [], skinTypes: ['지성'] },
      { id: 2, name: '수딩 크림', brand: 'B', category: '크림', imageUrl: '', keyIngredients: [], skinTypes: ['건성'] },
    ],
  } as any)
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

it('제품 목록을 렌더링한다', async () => {
  renderRecommend()
  expect(await screen.findByText('테스트 세럼')).toBeInTheDocument()
  expect(screen.getByText('수딩 크림')).toBeInTheDocument()
})

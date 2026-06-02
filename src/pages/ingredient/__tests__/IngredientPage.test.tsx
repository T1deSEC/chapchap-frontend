import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import IngredientPage from '../IngredientPage'
import * as ingredientApi from '../../../api/ingredient'
import * as recommendationApi from '../../../api/recommendation'

vi.mock('../../../api/ingredient')
vi.mock('../../../api/recommendation')

function renderIngredient() {
  vi.mocked(ingredientApi.searchProducts).mockResolvedValue({ data: { content: [], page: { totalElements: 0 } } } as any)
  vi.mocked(recommendationApi.getIngredientRecommendation).mockRejectedValue({ response: { status: 404 } })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/ingredient']}>
        <Routes>
          <Route path="/ingredient" element={<IngredientPage />} />
          <Route path="/ingredient/ai-loading" element={<div>AI로딩</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('"성분" 헤더를 렌더링한다', () => {
  renderIngredient()
  expect(screen.getByText('성분')).toBeInTheDocument()
})

it('AI 추천 섹션 제목을 렌더링한다', () => {
  renderIngredient()
  expect(screen.getByText('내 피부 맞춤 성분 추천')).toBeInTheDocument()
})

it('검색 인풋을 렌더링한다', () => {
  renderIngredient()
  expect(screen.getByPlaceholderText('제품 또는 성분 검색...')).toBeInTheDocument()
})

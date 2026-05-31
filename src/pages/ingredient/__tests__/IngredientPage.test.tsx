import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import IngredientPage from '../IngredientPage'
import * as ingredientApi from '../../../api/ingredient'

vi.mock('../../../api/ingredient')

function renderIngredient() {
  vi.mocked(ingredientApi.searchIngredients).mockResolvedValue({ data: [] } as any)
  vi.mocked(ingredientApi.runAiIngredientAnalysis).mockResolvedValue({
    data: { recommendedProducts: [] },
  } as any)
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

it('"AI 성분 진단" 버튼을 렌더링한다', () => {
  renderIngredient()
  expect(screen.getByText('AI 성분 진단')).toBeInTheDocument()
})

it('카테고리 칩들을 렌더링한다', () => {
  renderIngredient()
  expect(screen.getByText('전체')).toBeInTheDocument()
  expect(screen.getByText('미백')).toBeInTheDocument()
  expect(screen.getByText('보습')).toBeInTheDocument()
})

it('검색 인풋을 렌더링한다', () => {
  renderIngredient()
  expect(screen.getByPlaceholderText('제품 또는 성분 검색...')).toBeInTheDocument()
})

it('AI 성분 진단 버튼 클릭 시 /ingredient/ai-loading으로 이동한다', async () => {
  renderIngredient()
  fireEvent.click(screen.getByText('AI 성분 진단'))
  expect(await screen.findByText('AI로딩')).toBeInTheDocument()
})

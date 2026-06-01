import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ProductDetailPage from '../ProductDetailPage'
import * as ingredientApi from '../../../api/ingredient'

vi.mock('../../../api/ingredient')
vi.mock('../../../hooks/useProfile', () => ({
  useProfile: () => ({ data: { skinConcerns: [] } }),
}))
vi.mock('../../../store/authStore', () => ({
  useAuthStore: (selector: (s: any) => any) => selector({ user: { skinType: '지성' } }),
}))

const mockDetail = {
  id: 1,
  name: '하이드라부스트 모이스처라이저',
  brand: '뷰티 브랜드',
  category: '모이스처라이저',
  imageUrl: '',
  keyIngredients: ['히알루론산'],
  skinTypes: ['건성'],
  safetyScore: 85,
  ingredients: [
    { name: '정제수', rank: 1, description: '베이스 성분', safetyLevel: 'safe' as const },
    { name: '페녹시에탄올', rank: 2, description: '알러지 유발 가능', safetyLevel: 'warning' as const },
  ],
  skinImpacts: [
    { label: '수분 공급', score: 90, level: '매우 높음', color: 'primary' as const },
    { label: '피부 자극', score: 40, level: '보통', color: 'danger' as const },
  ],
}

function renderDetail(id = '1') {
  vi.mocked(ingredientApi.getProductDetail).mockResolvedValue({ data: mockDetail } as any)
  vi.mocked(ingredientApi.runAiIngredientAnalysis).mockResolvedValue({ data: {} } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/ingredient/${id}`]}>
        <Routes>
          <Route path="/ingredient/:productId" element={<ProductDetailPage />} />
          <Route path="/ingredient/:productId/feedback" element={<div>피드백</div>} />
          <Route path="/ingredient/ai-loading" element={<div>AI로딩</div>} />
          <Route path="/ingredient/ai-result" element={<div>AI결과</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('제품명을 렌더링한다', async () => {
  renderDetail()
  expect(await screen.findByText('하이드라부스트 모이스처라이저')).toBeInTheDocument()
})

it('성분 목록을 렌더링한다', async () => {
  renderDetail()
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(screen.getByText('정제수')).toBeInTheDocument()
  expect(screen.getByText('페녹시에탄올')).toBeInTheDocument()
})

it('"피드백 제출" 링크가 올바른 경로를 가진다', async () => {
  renderDetail()
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(screen.getByText('피드백 제출').closest('a')).toHaveAttribute('href', '/ingredient/1/feedback')
})

it('"AI 성분 진단" 버튼을 렌더링한다', async () => {
  renderDetail()
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(screen.getByText('AI 성분 진단')).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ProductDetailPage from '../ProductDetailPage'
import * as ingredientApi from '../../../api/ingredient'
import * as wishlistApi from '../../../api/wishlist'

vi.mock('../../../api/ingredient')
vi.mock('../../../api/wishlist')
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
  ingredients: [
    { ingredientId: 1, inciName: 'Aqua', koName: '정제수', concentrationOrder: 1 },
    { ingredientId: 2, inciName: 'Niacinamide', koName: '나이아신아마이드', concentrationOrder: 2 },
  ],
}

const mockAnalysis = {
  safetyScore: 85,
  summary: '전반적으로 안전한 제품입니다',
  recommendations: [],
  ingredientAnalysis: [
    { inciName: 'Aqua', koName: '정제수', safetyLevel: '안전' as const, assessment: '안전', reason: '기본 용제' },
    { inciName: 'Niacinamide', koName: '나이아신아마이드', safetyLevel: '주의' as const, assessment: '주의', reason: '고농도 주의' },
  ],
  skinImpacts: [
    { label: '보습', score: 72, level: '높음', color: 'primary' as const },
  ],
}

function renderDetail(analysisData: typeof mockAnalysis | null = null) {
  vi.mocked(ingredientApi.getProductDetail).mockResolvedValue({ data: mockDetail } as any)
  vi.mocked(ingredientApi.runAiIngredientAnalysis).mockResolvedValue({ data: {} } as any)
  vi.mocked(ingredientApi.getProductAiAnalysis).mockResolvedValue(
    analysisData ? { data: analysisData } as any : Promise.reject({ response: { status: 404 } })
  )
  vi.mocked(wishlistApi.getWishlist).mockResolvedValue({ data: [] } as any)
  vi.mocked(wishlistApi.addToWishlist).mockResolvedValue({ data: {} } as any)
  vi.mocked(wishlistApi.removeFromWishlist).mockResolvedValue({ data: {} } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/ingredient/1`]}>
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
  expect(screen.getByText('나이아신아마이드')).toBeInTheDocument()
})

it('분석 전에는 분석 전 상태를 표시한다', async () => {
  renderDetail(null)
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(screen.getByText('분석 전')).toBeInTheDocument()
  expect(screen.getByText('AI 성분 진단')).toBeInTheDocument()
})

it('분석 후에는 안전 점수를 표시한다', async () => {
  renderDetail(mockAnalysis)
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(await screen.findByText('85')).toBeInTheDocument()
  expect(screen.getByText('AI 성분 재진단')).toBeInTheDocument()
})

it('"피드백 제출" 링크가 올바른 경로를 가진다', async () => {
  renderDetail()
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(screen.getByText('피드백 제출').closest('a')).toHaveAttribute('href', '/ingredient/1/feedback')
})

it('분석 결과 없으면 피부 영향도 섹션이 없다', async () => {
  renderDetail(null)
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(screen.queryByText('내 피부에 미치는 영향')).not.toBeInTheDocument()
})

it('분석 결과 있으면 피부 영향도 섹션이 표시된다', async () => {
  renderDetail(mockAnalysis)
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(await screen.findByText('내 피부에 미치는 영향')).toBeInTheDocument()
  expect(screen.getByText('보습')).toBeInTheDocument()
})

it('찜 버튼(favorite 아이콘)이 헤더에 렌더링된다', async () => {
  renderDetail()
  await screen.findByText('하이드라부스트 모이스처라이저')
  expect(screen.getByRole('button', { name: '찜' })).toBeInTheDocument()
})

import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ProductFeedbackPage from '../ProductFeedbackPage'
import * as feedbackApi from '../../../api/feedback'

vi.mock('../../../api/feedback')

function renderFeedback(productId = '1', locationState?: object) {
  vi.mocked(feedbackApi.submitFeedback).mockResolvedValue({ data: {} } as any)
  vi.mocked(feedbackApi.deleteFeedback).mockResolvedValue({ data: {} } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter
        initialEntries={[{ pathname: `/ingredient/${productId}/feedback`, state: locationState }]}
      >
        <Routes>
          <Route path="/ingredient/:productId/feedback" element={<ProductFeedbackPage />} />
          <Route path="/ingredient/:productId" element={<div>제품상세</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('"피드백 입력" 헤더를 렌더링한다', () => {
  renderFeedback()
  expect(screen.getByText('피드백 입력')).toBeInTheDocument()
})

it('피부 반응 버튼 3개를 렌더링한다', () => {
  renderFeedback()
  expect(screen.getByText('좋음')).toBeInTheDocument()
  expect(screen.getByText('변화 없음')).toBeInTheDocument()
  expect(screen.getByText('트러블 발생')).toBeInTheDocument()
})

it('별점 버튼 5개를 렌더링한다', () => {
  renderFeedback()
  expect(screen.getAllByRole('button', { name: /별/ })).toHaveLength(5)
})

it('피드백 제출 버튼을 렌더링한다', () => {
  renderFeedback()
  expect(screen.getByText('피드백 제출')).toBeInTheDocument()
})

it('location.state.feedback이 있으면 반응을 pre-fill한다', () => {
  renderFeedback('1', {
    feedback: {
      productId: 1,
      reaction: 'neutral',
      rating: 3,
      usagePeriod: '1-2주',
      memo: '보통이에요',
      createdAt: '2024-01-01T00:00:00Z',
    },
  })
  // '변화 없음' 버튼이 선택 상태 (ring-primary 클래스 포함)
  const neutralBtn = screen.getByText('변화 없음').closest('button')
  expect(neutralBtn?.className).toContain('ring-primary')
})

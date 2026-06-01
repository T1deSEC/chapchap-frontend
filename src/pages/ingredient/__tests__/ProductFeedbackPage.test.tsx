import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import ProductFeedbackPage from '../ProductFeedbackPage'
import * as feedbackApi from '../../../api/feedback'

vi.mock('../../../api/feedback')

function renderFeedback(productId = '1') {
  vi.mocked(feedbackApi.submitFeedback).mockResolvedValue({ data: {} } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/ingredient/${productId}/feedback`]}>
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

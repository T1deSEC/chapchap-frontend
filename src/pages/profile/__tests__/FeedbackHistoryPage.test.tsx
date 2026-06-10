import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import FeedbackHistoryPage from '../FeedbackHistoryPage'
import * as feedbackApi from '../../../api/feedback'

vi.mock('../../../api/feedback')

const mockRecord = {
  productId: 1,
  productName: '이니스프리 그린티 씨드 세럼',
  brand: '이니스프리',
  imageUrl: '',
  reaction: 'good' as const,
  effective: true,
  rating: 4,
  usagePeriod: '2-4주',
  memo: '좋아요',
  createdAt: '2024-07-15T00:00:00Z',
}

function renderFeedbackHistory() {
  vi.mocked(feedbackApi.getFeedbackHistory).mockResolvedValue({ data: [mockRecord] } as any)
  vi.mocked(feedbackApi.deleteFeedback).mockResolvedValue({ data: {} } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/profile/feedback-history']}>
        <Routes>
          <Route path="/profile/feedback-history" element={<FeedbackHistoryPage />} />
          <Route path="/ingredient/:productId/feedback" element={<div>피드백입력</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('"내 피드백 기록" 헤더를 렌더링한다', () => {
  renderFeedbackHistory()
  expect(screen.getByText('내 피드백 기록')).toBeInTheDocument()
})

it('피드백 기록을 렌더링한다', async () => {
  renderFeedbackHistory()
  expect(await screen.findByText('이니스프리 그린티 씨드 세럼')).toBeInTheDocument()
})

it('별점과 사용 기간을 표시한다', async () => {
  renderFeedbackHistory()
  await screen.findByText('이니스프리 그린티 씨드 세럼')
  expect(screen.getByText('2-4주')).toBeInTheDocument()
})

it('수정 버튼이 렌더링된다', async () => {
  renderFeedbackHistory()
  await screen.findByText('이니스프리 그린티 씨드 세럼')
  expect(screen.getByText('수정')).toBeInTheDocument()
})

it('삭제 버튼이 렌더링된다', async () => {
  renderFeedbackHistory()
  await screen.findByText('이니스프리 그린티 씨드 세럼')
  expect(screen.getByText('삭제')).toBeInTheDocument()
})

it('삭제 버튼 클릭 시 deleteFeedback API를 호출한다', async () => {
  renderFeedbackHistory()
  await screen.findByText('이니스프리 그린티 씨드 세럼')
  fireEvent.click(screen.getByText('삭제'))
  await waitFor(() => expect(feedbackApi.deleteFeedback).toHaveBeenCalledWith(1))
})

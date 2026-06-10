import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import FeedbackHistoryPage from '../FeedbackHistoryPage'
import * as feedbackApi from '../../../api/feedback'

vi.mock('../../../api/feedback')

function renderFeedbackHistory() {
  vi.mocked(feedbackApi.getFeedbackHistory).mockResolvedValue({ data: [
    { id: 1, productId: 1, productName: '이니스프리 그린티 씨드 세럼', brand: '이니스프리', imageUrl: '', reaction: 'good', isEffective: true, memo: '좋아요', createdAt: '2024.07.15' },
  ] } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><FeedbackHistoryPage /></MemoryRouter></QueryClientProvider>)
}

it('"내 피드백 기록" 헤더를 렌더링한다', () => { renderFeedbackHistory(); expect(screen.getByText('내 피드백 기록')).toBeInTheDocument() })
it('피드백 기록을 렌더링한다', async () => { renderFeedbackHistory(); expect(await screen.findByText('이니스프리 그린티 씨드 세럼')).toBeInTheDocument(); expect(screen.getByText('7월 15일')).toBeInTheDocument() })

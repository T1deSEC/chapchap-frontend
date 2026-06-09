import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AiAnalysisLoadingPage from '../AiAnalysisLoadingPage'

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <MemoryRouter initialEntries={[{ pathname: '/ingredient/ai-loading', state: { productId: 0 } }]}>
        {children}
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AiAnalysisLoadingPage', () => {
  it('"AI 성분 진단 중..." 텍스트를 렌더링한다', () => {
    render(<AiAnalysisLoadingPage />, { wrapper })
    expect(screen.getByText('AI 성분 진단 중...')).toBeInTheDocument()
  })
})

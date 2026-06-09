import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import AiAnalysisLoadingPage from '../AiAnalysisLoadingPage'

describe('AiAnalysisLoadingPage', () => {
  it('"AI 성분 진단 중..." 텍스트를 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisLoadingPage /></MemoryRouter>)
    expect(screen.getByText('AI 성분 진단 중...')).toBeInTheDocument()
  })
})

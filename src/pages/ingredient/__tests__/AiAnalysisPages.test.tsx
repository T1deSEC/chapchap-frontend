import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAnalysisStore } from '../../../store/analysisStore'
import AiAnalysisLoadingPage from '../AiAnalysisLoadingPage'
import AiAnalysisResultPage from '../AiAnalysisResultPage'

const mockResult = {
  productId: 0,
  safetyScore: 0,
  ingredients: [],
  summary: JSON.stringify({
    recommendedProducts: [
      { id: 1, brand: '디오디너리', name: '나이아신아마이드 10%', imageUrl: '', recommendScore: 95 },
    ],
  }),
}

describe('AiAnalysisLoadingPage', () => {
  it('"AI 성분 진단 중..." 텍스트를 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisLoadingPage /></MemoryRouter>)
    expect(screen.getByText('AI 성분 진단 중...')).toBeInTheDocument()
  })
})

describe('AiAnalysisResultPage', () => {
  beforeEach(() => {
    useAnalysisStore.setState({ ingredientResult: mockResult, routineResult: null })
  })

  it('"AI 성분 진단 결과" 헤더를 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisResultPage /></MemoryRouter>)
    expect(screen.getByText('AI 성분 진단 결과')).toBeInTheDocument()
  })

  it('추천 제품 이름을 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisResultPage /></MemoryRouter>)
    expect(screen.getByText('나이아신아마이드 10%')).toBeInTheDocument()
  })

  it('추천 점수를 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisResultPage /></MemoryRouter>)
    expect(screen.getByText('95% 추천')).toBeInTheDocument()
  })
})

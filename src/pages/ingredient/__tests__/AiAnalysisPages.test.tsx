import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { useAnalysisStore } from '../../../store/analysisStore'
import AiAnalysisLoadingPage from '../AiAnalysisLoadingPage'
import AiAnalysisResultPage from '../AiAnalysisResultPage'

const mockResult = {
  safetyScore: 85,
  ingredientAnalysis: [{ inciName: 'Retinol', koName: '레티놀', assessment: '안티에이징', reason: '세포 재생 촉진', safetyLevel: 'safe' as const }],
  summary: '성분 분석 요약',
  recommendations: ['추천 사항 1'],
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

  it('안전 점수를 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisResultPage /></MemoryRouter>)
    expect(screen.getByText('85')).toBeInTheDocument()
  })

  it('성분 이름을 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisResultPage /></MemoryRouter>)
    expect(screen.getByText('레티놀')).toBeInTheDocument()
  })

  it('분석 요약을 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisResultPage /></MemoryRouter>)
    expect(screen.getByText('성분 분석 요약')).toBeInTheDocument()
  })

  it('추천 사항을 렌더링한다', () => {
    render(<MemoryRouter><AiAnalysisResultPage /></MemoryRouter>)
    expect(screen.getByText('추천 사항 1')).toBeInTheDocument()
  })

  it('결과가 없을 때 "분석 결과가 없습니다" 메시지를 렌더링한다', () => {
    useAnalysisStore.setState({ ingredientResult: null, routineResult: null })
    render(<MemoryRouter><AiAnalysisResultPage /></MemoryRouter>)
    expect(screen.getByText('분석 결과가 없습니다.')).toBeInTheDocument()
  })
})

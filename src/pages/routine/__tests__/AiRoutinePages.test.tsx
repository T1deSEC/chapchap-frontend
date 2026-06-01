import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { useAnalysisStore } from '../../../store/analysisStore'
import AiRoutineLoadingPage from '../AiRoutineLoadingPage'
import AiRoutineResultPage from '../AiRoutineResultPage'

describe('AiRoutineLoadingPage', () => {
  it('"AI 안전 진단 중..." 텍스트를 렌더링한다', () => {
    render(<MemoryRouter><AiRoutineLoadingPage /></MemoryRouter>)
    expect(screen.getByText('AI 안전 진단 중...')).toBeInTheDocument()
  })
})

describe('AiRoutineResultPage', () => {
  it('safe 상태일 때 "안전" 헤딩을 렌더링한다', () => {
    useAnalysisStore.setState({
      routineResult: { status: 'safe', conflictingPairs: [], recommendation: '루틴이 안전합니다.', suggestedAdjustments: [] },
      ingredientResult: null,
    })
    render(
      <MemoryRouter initialEntries={['/routine/ai-result']}>
        <Routes>
          <Route path="/routine/ai-result" element={<AiRoutineResultPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('안전')).toBeInTheDocument()
  })

  it('conflict 상태일 때 "경고" 헤딩과 충돌 성분 쌍을 렌더링한다', () => {
    useAnalysisStore.setState({
      routineResult: {
        status: 'conflict',
        conflictingPairs: [{ ingredient1: '비타민 C', ingredient2: '벤조일 퍼옥사이드' }],
        recommendation: '서로 다른 시간대에 사용하세요',
        suggestedAdjustments: [],
      },
      ingredientResult: null,
    })
    render(
      <MemoryRouter initialEntries={['/routine/ai-result']}>
        <Routes>
          <Route path="/routine/ai-result" element={<AiRoutineResultPage />} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('경고')).toBeInTheDocument()
    expect(screen.getByText('비타민 C')).toBeInTheDocument()
    expect(screen.getByText('벤조일 퍼옥사이드')).toBeInTheDocument()
    expect(screen.getByText('서로 다른 시간대에 사용하세요')).toBeInTheDocument()
  })

  it('"확인" 버튼이 /routine으로 링크된다', () => {
    useAnalysisStore.setState({
      routineResult: { status: 'safe', conflictingPairs: [], recommendation: '', suggestedAdjustments: [] },
      ingredientResult: null,
    })
    render(
      <MemoryRouter initialEntries={['/routine/ai-result']}>
        <Routes>
          <Route path="/routine/ai-result" element={<AiRoutineResultPage />} />
          <Route path="/routine" element={<div>루틴홈</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('확인').closest('a')).toHaveAttribute('href', '/routine')
  })
})

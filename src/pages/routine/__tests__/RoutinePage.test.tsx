import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import RoutinePage from '../RoutinePage'
import * as routineApi from '../../../api/routine'

vi.mock('../../../api/routine')

const mockItems = [
  { id: 1, productId: 1, productName: '비타민 C 세럼', brand: 'Glow Recipe', imageUrl: '', order: 1 },
  { id: 2, productId: 2, productName: '데일리 모이스처라이저', brand: 'The Ordinary', imageUrl: '', order: 2 },
]

function renderRoutine() {
  vi.mocked(routineApi.getRoutineItems).mockResolvedValue({ data: mockItems } as any)
  vi.mocked(routineApi.removeRoutineItem).mockResolvedValue({ data: {} } as any)
  vi.mocked(routineApi.runAiRoutineAnalysis).mockResolvedValue({
    data: { status: 'safe', conflictingIngredients: [], recommendation: '', suggestedProducts: [] },
  } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/routine']}>
        <Routes>
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/routine/ai-loading" element={<div>AI로딩</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('"루틴 관리" 헤더를 렌더링한다', () => {
  renderRoutine()
  expect(screen.getByText('루틴 관리')).toBeInTheDocument()
})

it('"아침"/"저녁" 탭을 렌더링한다', () => {
  renderRoutine()
  expect(screen.getByText('아침')).toBeInTheDocument()
  expect(screen.getByText('저녁')).toBeInTheDocument()
})

it('루틴 아이템 목록을 렌더링한다', async () => {
  renderRoutine()
  expect(await screen.findByText('비타민 C 세럼')).toBeInTheDocument()
  expect(screen.getByText('데일리 모이스처라이저')).toBeInTheDocument()
})

it('"AI 안전 진단" 버튼을 렌더링한다', () => {
  renderRoutine()
  expect(screen.getByText('AI 안전 진단')).toBeInTheDocument()
})

it('AI 안전 진단 버튼 클릭 시 /routine/ai-loading으로 이동한다', async () => {
  renderRoutine()
  fireEvent.click(screen.getByText('AI 안전 진단'))
  expect(await screen.findByText('AI로딩')).toBeInTheDocument()
})

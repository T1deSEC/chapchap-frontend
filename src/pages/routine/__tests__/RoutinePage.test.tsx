import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import RoutinePage from '../RoutinePage'
import * as routineApi from '../../../api/routine'
import * as productsApi from '../../../api/products'

vi.mock('../../../api/routine')
vi.mock('../../../api/products')

const mockRoutine = {
  id: 10,
  recordDate: '2024-05-10',
  routinePeriod: 'AM',
  products: [
    { productId: 1, stepOrder: 1, productName: '비타민 C 세럼', brand: 'Glow Recipe', imageUrl: '' },
    { productId: 2, stepOrder: 2, productName: '데일리 모이스처라이저', brand: 'The Ordinary', imageUrl: '' },
  ],
}

const mockPageResponse = {
  content: [{ id: 3, name: '테스트 크림', brand: 'COSRX', category: '보습', imageUrl: '' }],
  page: { totalElements: 1, totalPages: 1, size: 20, number: 0 },
}

function renderRoutine() {
  vi.mocked(routineApi.getRoutineItems).mockResolvedValue({ data: mockRoutine } as any)
  vi.mocked(routineApi.upsertRoutine).mockResolvedValue({ data: mockRoutine } as any)
  vi.mocked(routineApi.deleteRoutinePeriod).mockResolvedValue({ data: {} } as any)
  vi.mocked(routineApi.runAiRoutineAnalysis).mockResolvedValue({
    data: { status: 'safe', conflictingPairs: [], recommendation: '', suggestedAdjustments: [] },
  } as any)
  vi.mocked(productsApi.searchProducts).mockResolvedValue({ data: mockPageResponse } as any)

  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/routine']}>
        <Routes>
          <Route path="/routine" element={<RoutinePage />} />
          <Route path="/routine/ai-loading" element={<div>AI로딩</div>} />
          <Route path="/ingredient/:productId" element={<div>상세페이지</div>} />
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

it('제품 카드가 /ingredient/:productId 링크를 가진다', async () => {
  renderRoutine()
  const link = await screen.findByRole('link', { name: /비타민 C 세럼/i })
  expect(link).toHaveAttribute('href', '/ingredient/1')
})

it('"AI 안전 진단" 버튼을 렌더링하고, 제품이 있으면 활성화된다', async () => {
  renderRoutine()
  await screen.findByText('비타민 C 세럼')
  const btn = screen.getByText('AI 안전 진단').closest('button')
  expect(btn).not.toBeDisabled()
})

it('AI 안전 진단 버튼 클릭 시 /routine/ai-loading으로 이동한다', async () => {
  renderRoutine()
  await screen.findByText('비타민 C 세럼')
  fireEvent.click(screen.getByText('AI 안전 진단'))
  expect(await screen.findByText('AI로딩')).toBeInTheDocument()
})

it('루틴이 없으면 빈 상태 메시지를 보여준다', async () => {
  vi.mocked(routineApi.getRoutineItems).mockRejectedValueOnce({ response: { status: 404 } })
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  render(
    <QueryClientProvider client={qc}>
      <MemoryRouter><RoutinePage /></MemoryRouter>
    </QueryClientProvider>
  )
  expect(await screen.findByText(/아직 루틴이 없어요/)).toBeInTheDocument()
})

it('제품 추가 버튼 클릭 시 바텀 시트가 열린다', async () => {
  renderRoutine()
  await screen.findByText('비타민 C 세럼')
  fireEvent.click(screen.getByRole('button', { name: '제품 추가' }))
  expect(await screen.findByText('제품 선택')).toBeInTheDocument()
})

it('초기화 버튼 클릭 시 확인 다이얼로그가 열린다', async () => {
  renderRoutine()
  await screen.findByText('비타민 C 세럼')
  fireEvent.click(screen.getByRole('button', { name: '루틴 초기화' }))
  expect(screen.getByText('루틴 초기화')).toBeInTheDocument()
  expect(screen.getByText(/모든 제품이 삭제됩니다/)).toBeInTheDocument()
})

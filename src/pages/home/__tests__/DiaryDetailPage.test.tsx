import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import DiaryDetailPage from '../DiaryDetailPage'
import * as homeApi from '../../../api/home'

vi.mock('../../../api/home')

const mockEntry = {
  id: 5,
  logDate: '2024-05-10',
  skinStatus: 'great',
  keywords: ['건조함', '홍조'],
  memo: '오늘 피부 좋았음',
  amExecuted: false,
  pmExecuted: false,
}

function renderDetail(id = '5') {
  vi.mocked(homeApi.getDiaryEntry).mockResolvedValue({ data: mockEntry } as any)
  vi.mocked(homeApi.deleteDiaryEntry).mockResolvedValue({ data: {} } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={[`/home/diary/${id}`]}>
        <Routes>
          <Route path="/home/diary/:id" element={<DiaryDetailPage />} />
          <Route path="/home" element={<div>홈</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('기분 이모지, 키워드, 메모를 렌더링한다', async () => {
  renderDetail()
  await screen.findByText('😊')
  expect(screen.getByText('#건조함')).toBeInTheDocument()
  expect(screen.getByText('오늘 피부 좋았음')).toBeInTheDocument()
})

it('삭제 버튼 클릭 시 deleteDiaryEntry가 호출된다', async () => {
  renderDetail()
  await screen.findByText('😊')
  fireEvent.click(screen.getByText('삭제'))
  await waitFor(() =>
    expect(homeApi.deleteDiaryEntry).toHaveBeenCalledWith(5)
  )
})

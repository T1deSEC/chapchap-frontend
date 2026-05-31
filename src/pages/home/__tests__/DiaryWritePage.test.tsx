import { render, screen, fireEvent } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import DiaryWritePage from '../DiaryWritePage'
import * as homeApi from '../../../api/home'

vi.mock('../../../api/home')

function renderDiaryWrite() {
  vi.mocked(homeApi.createDiaryEntry).mockResolvedValue({ data: {} } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/home/diary/write']}>
        <Routes>
          <Route path="/home/diary/write" element={<DiaryWritePage />} />
          <Route path="/home" element={<div>홈</div>} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

it('기분 선택 이모지 5개를 렌더링한다', () => {
  renderDiaryWrite()
  expect(screen.getByText('😡')).toBeInTheDocument()
  expect(screen.getByText('😊')).toBeInTheDocument()
})

it('피부 키워드 칩들을 렌더링한다', () => {
  renderDiaryWrite()
  expect(screen.getByText('건조함')).toBeInTheDocument()
  expect(screen.getByText('트러블')).toBeInTheDocument()
})

it('메모 textarea를 렌더링한다', () => {
  renderDiaryWrite()
  expect(screen.getByPlaceholderText(/자세한 내용/)).toBeInTheDocument()
})

it('취소 버튼 클릭 시 /home으로 이동한다', () => {
  renderDiaryWrite()
  fireEvent.click(screen.getByText('취소'))
  expect(screen.getByText('홈')).toBeInTheDocument()
})

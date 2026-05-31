import { render, screen, fireEvent } from '@testing-library/react'
import DiaryCalendar from '../DiaryCalendar'
import type { DiaryEntry } from '../../../../types'

const mockEntries: DiaryEntry[] = [
  { id: 1, date: '2024-05-10', mood: 'great', keywords: [], note: '', products: [] },
  { id: 2, date: '2024-05-15', mood: 'bad',   keywords: [], note: '', products: [] },
]

it('요일 헤더(일~토)를 렌더링한다', () => {
  render(
    <DiaryCalendar year={2024} month={5} entries={mockEntries} onMonthChange={() => {}} />
  )
  expect(screen.getByText('일')).toBeInTheDocument()
  expect(screen.getByText('토')).toBeInTheDocument()
})

it('현재 월/년을 헤더에 표시한다', () => {
  render(
    <DiaryCalendar year={2024} month={5} entries={mockEntries} onMonthChange={() => {}} />
  )
  expect(screen.getByText('5월 2024')).toBeInTheDocument()
})

it('일기가 있는 날에 이모지를 표시한다', () => {
  render(
    <DiaryCalendar year={2024} month={5} entries={mockEntries} onMonthChange={() => {}} />
  )
  expect(screen.getByText('😊')).toBeInTheDocument()
  expect(screen.getByText('😠')).toBeInTheDocument()
})

it('월 변경 버튼 클릭 시 onMonthChange가 호출된다', () => {
  const onMonthChange = vi.fn()
  render(
    <DiaryCalendar year={2024} month={5} entries={[]} onMonthChange={onMonthChange} />
  )
  fireEvent.click(screen.getByLabelText('이전 연도'))
  expect(onMonthChange).toHaveBeenCalledWith(2023, 5)
})

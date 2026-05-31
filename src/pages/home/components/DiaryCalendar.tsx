import { useState } from 'react'
import type { DiaryEntry } from '../../../types'

const MOOD_MAP: Record<string, string> = {
  great: '😊', good: '🙂', neutral: '😐', bad: '😠', terrible: '😡',
}
const DAYS = ['일', '월', '화', '수', '목', '금', '토']
const MONTHS = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월']

interface Props {
  year: number
  month: number
  entries: DiaryEntry[]
  onMonthChange: (year: number, month: number) => void
}

export default function DiaryCalendar({ year, month, entries, onMonthChange }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerYear, setPickerYear] = useState(year)

  const moodByDay: Record<number, string> = {}
  entries.forEach((e) => {
    const [y, m, d] = e.date.split('-').map(Number)
    if (y === year && m === month) {
      moodByDay[d] = e.mood
    }
  })

  const firstDayOfWeek = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const cells = Array(firstDayOfWeek).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  )

  const handlePrevYear = () => {
    onMonthChange(year - 1, month)
  }
  const handleNextYear = () => {
    onMonthChange(year + 1, month)
  }
  const handleMonthSelect = (m: number) => {
    setPickerOpen(false)
    onMonthChange(pickerYear, m)
  }

  return (
    <section>
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="이전 연도"
            onClick={handlePrevYear}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="material-symbols-outlined text-base">chevron_left</span>
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => { setPickerOpen((o) => !o); setPickerYear(year) }}
              className="flex items-center gap-1 text-primary font-medium text-sm"
            >
              <span>{month}월 {year}</span>
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
            {pickerOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 z-10">
                <div className="flex items-center justify-between mb-2">
                  <button
                    type="button"
                    aria-label="피커 이전 연도"
                    onClick={() => setPickerYear((y) => y - 1)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <span className="font-semibold text-sm text-gray-800 dark:text-white">
                    {pickerYear}년
                  </span>
                  <button
                    type="button"
                    aria-label="피커 다음 연도"
                    onClick={() => setPickerYear((y) => y + 1)}
                    className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.map((label, i) => (
                    <button
                      key={`month-${i + 1}`}
                      type="button"
                      onClick={() => handleMonthSelect(i + 1)}
                      className="py-1 text-xs rounded hover:bg-blue-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            aria-label="다음 연도"
            onClick={handleNextYear}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <span className="material-symbols-outlined text-base">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center gap-y-2 text-sm text-gray-500">
        {DAYS.map((d) => (
          <div key={d} className="font-bold text-xs">{d}</div>
        ))}
        {cells.map((day, i) => (
          <div key={i} className="text-gray-800 dark:text-gray-200 font-medium text-xs">
            {day !== null ? (
              moodByDay[day] ? (
                <span className="text-xl">{MOOD_MAP[moodByDay[day]] ?? '😐'}</span>
              ) : (
                day
              )
            ) : null}
          </div>
        ))}
      </div>
    </section>
  )
}

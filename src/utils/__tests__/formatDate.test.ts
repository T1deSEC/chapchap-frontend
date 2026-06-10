import { formatRelativeDate } from '../formatDate'

function isoMinsAgo(n: number) {
  return new Date(Date.now() - n * 60 * 1000).toISOString()
}

describe('formatRelativeDate', () => {
  it('방금 — 0분 이내', () => {
    expect(formatRelativeDate(isoMinsAgo(0))).toBe('방금')
  })
  it('N분 전 — 1~59분', () => {
    expect(formatRelativeDate(isoMinsAgo(30))).toBe('30분 전')
  })
  it('N시간 전 — 1~23시간', () => {
    expect(formatRelativeDate(isoMinsAgo(120))).toBe('2시간 전')
  })
  it('어제', () => {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    yesterday.setHours(10, 0, 0, 0)
    expect(formatRelativeDate(yesterday.toISOString())).toBe('어제')
  })
  it('N월 N일 — 2일 이상 경과', () => {
    const d = new Date('2026-03-05T10:00:00Z')
    expect(formatRelativeDate(d.toISOString())).toBe('3월 5일')
  })
})

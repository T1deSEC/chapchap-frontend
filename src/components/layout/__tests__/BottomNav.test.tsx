// src/components/layout/__tests__/BottomNav.test.tsx
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import BottomNav from '../BottomNav'

function renderWithRouter(initialPath = '/home') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <BottomNav />
    </MemoryRouter>
  )
}

it('4개 탭(홈, 성분, 루틴, 마이)을 렌더링한다', () => {
  renderWithRouter()
  expect(screen.getByText('홈')).toBeInTheDocument()
  expect(screen.getByText('성분')).toBeInTheDocument()
  expect(screen.getByText('루틴')).toBeInTheDocument()
  expect(screen.getByText('마이')).toBeInTheDocument()
})

it('/home 경로에서 홈 탭이 활성 스타일을 가진다', () => {
  renderWithRouter('/home')
  const homeLink = screen.getByText('홈').closest('a')!
  expect(homeLink.className).toContain('text-primary')
})

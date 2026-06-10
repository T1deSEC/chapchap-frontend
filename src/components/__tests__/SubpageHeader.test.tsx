import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { SubpageHeader } from '../SubpageHeader'

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>{children}</MemoryRouter>
)

describe('SubpageHeader', () => {
  it('title을 렌더한다', () => {
    render(<SubpageHeader title="테스트 페이지" />, { wrapper: Wrapper })
    expect(screen.getByText('테스트 페이지')).toBeInTheDocument()
  })

  it('onBack 없으면 뒤로가기 버튼이 렌더된다', () => {
    render(<SubpageHeader title="테스트" />, { wrapper: Wrapper })
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('onBack 제공 시 클릭하면 호출된다', () => {
    const onBack = vi.fn()
    render(<SubpageHeader title="테스트" onBack={onBack} />, { wrapper: Wrapper })
    fireEvent.click(screen.getByRole('button'))
    expect(onBack).toHaveBeenCalledOnce()
  })

  it('rightAction을 렌더한다', () => {
    render(
      <SubpageHeader title="테스트" rightAction={<span data-testid="right">버튼</span>} />,
      { wrapper: Wrapper }
    )
    expect(screen.getByTestId('right')).toBeInTheDocument()
  })
})

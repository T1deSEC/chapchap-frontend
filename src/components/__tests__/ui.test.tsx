// src/components/__tests__/ui.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Chip from '../ui/Chip'
import LoadingSpinner from '../ui/LoadingSpinner'

describe('Button', () => {
  it('children 텍스트를 렌더링한다', () => {
    render(<Button>로그인</Button>)
    expect(screen.getByText('로그인')).toBeInTheDocument()
  })

  it('loading=true 이면 버튼이 비활성화된다', () => {
    render(<Button loading>로그인</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })
})

describe('Input', () => {
  it('label과 error 메시지를 렌더링한다', () => {
    render(<Input label="이메일" error="필수 항목입니다" />)
    expect(screen.getByText('이메일')).toBeInTheDocument()
    expect(screen.getByText('필수 항목입니다')).toBeInTheDocument()
  })
})

describe('Chip', () => {
  it('active 상태에서 primary 배경 클래스를 가진다', () => {
    render(<Chip active>미백</Chip>)
    const chip = screen.getByRole('button', { name: '미백' })
    expect(chip.className).toContain('bg-primary')
  })

  it('클릭 시 onClick이 호출된다', () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick}>미백</Chip>)
    fireEvent.click(screen.getByText('미백'))
    expect(onClick).toHaveBeenCalledOnce()
  })
})

describe('LoadingSpinner', () => {
  it('렌더링된다', () => {
    const { container } = render(<LoadingSpinner />)
    expect(container.firstChild).toBeInTheDocument()
  })
})

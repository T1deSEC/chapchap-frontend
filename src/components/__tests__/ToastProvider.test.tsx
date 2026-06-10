import { render, screen, act } from '@testing-library/react'
import { ToastProvider } from '../ToastProvider'
import { useToast } from '../../hooks/useToast'

function Consumer() {
  const { showSuccess, showError } = useToast()
  return (
    <>
      <button onClick={() => showSuccess('저장되었습니다')}>success</button>
      <button onClick={() => showError('오류 발생')}>error</button>
    </>
  )
}

describe('ToastProvider', () => {
  it('showSuccess 호출 시 토스트 메시지가 나타난다', async () => {
    render(<ToastProvider><Consumer /></ToastProvider>)
    await act(async () => {
      screen.getByText('success').click()
    })
    expect(screen.getByText('✓ 저장되었습니다')).toBeInTheDocument()
  })

  it('showError 호출 시 에러 토스트가 나타난다', async () => {
    render(<ToastProvider><Consumer /></ToastProvider>)
    await act(async () => {
      screen.getByText('error').click()
    })
    expect(screen.getByText('✕ 오류 발생')).toBeInTheDocument()
  })
})

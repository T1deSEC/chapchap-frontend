import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import NotificationPage from '../NotificationPage'
import * as notifApi from '../../../api/notifications'

vi.mock('../../../api/notifications')

function renderNotifications() {
  vi.mocked(notifApi.getNotifications).mockResolvedValue({
    data: [
      { id: 1, icon: 'warning', title: '피부 상태 주의!', body: '건조함이 감지되었어요.', createdAt: '2시간 전' },
    ],
  } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter><NotificationPage /></MemoryRouter>
    </QueryClientProvider>
  )
}

it('"알림" 헤더를 렌더링한다', () => {
  renderNotifications()
  expect(screen.getByText('알림')).toBeInTheDocument()
})

it('알림 항목을 렌더링한다', async () => {
  renderNotifications()
  expect(await screen.findByText('피부 상태 주의!')).toBeInTheDocument()
})

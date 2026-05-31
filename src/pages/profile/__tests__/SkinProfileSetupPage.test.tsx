import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { vi } from 'vitest'
import SkinProfileSetupPage from '../SkinProfileSetupPage'
import * as profileApi from '../../../api/profile'

vi.mock('../../../api/profile')

function renderSetup() {
  vi.mocked(profileApi.updateSkinProfile).mockResolvedValue({ data: {} } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(
    <QueryClientProvider client={qc}>
      <MemoryRouter><Routes><Route path="/" element={<SkinProfileSetupPage />} /></Routes></MemoryRouter>
    </QueryClientProvider>
  )
}

it('"피부 프로필 재설정" 헤더를 렌더링한다', () => { renderSetup(); expect(screen.getByText('피부 프로필 재설정')).toBeInTheDocument() })
it('피부 타입 옵션들을 렌더링한다', () => { renderSetup(); expect(screen.getByText('지성')).toBeInTheDocument(); expect(screen.getByText('건성')).toBeInTheDocument(); expect(screen.getByText('민감성')).toBeInTheDocument() })
it('피부 고민 옵션들을 렌더링한다', () => { renderSetup(); expect(screen.getByText('여드름')).toBeInTheDocument(); expect(screen.getByText('모공')).toBeInTheDocument() })
it('"변경사항 저장하기" 버튼을 렌더링한다', () => { renderSetup(); expect(screen.getByText('변경사항 저장하기')).toBeInTheDocument() })

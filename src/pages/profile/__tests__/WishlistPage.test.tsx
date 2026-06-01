import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import WishlistPage from '../WishlistPage'
import * as wishlistApi from '../../../api/wishlist'

vi.mock('../../../api/wishlist')

function renderWishlist() {
  vi.mocked(wishlistApi.getWishlist).mockResolvedValue({ data: [
    { id: 1, productId: 1, productName: '그린티 씨드 세럼', brand: '이니스프리', imageUrl: '' },
    { id: 2, productId: 2, productName: '시카페어 크림', brand: '닥터자르트', imageUrl: '' },
  ] } as any)
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return render(<QueryClientProvider client={qc}><MemoryRouter><WishlistPage /></MemoryRouter></QueryClientProvider>)
}

it('"찜한 제품" 헤더를 렌더링한다', () => { renderWishlist(); expect(screen.getByText('찜한 제품')).toBeInTheDocument() })
it('찜한 제품 목록을 렌더링한다', async () => { renderWishlist(); expect(await screen.findByText('그린티 씨드 세럼')).toBeInTheDocument(); expect(screen.getByText('시카페어 크림')).toBeInTheDocument() })

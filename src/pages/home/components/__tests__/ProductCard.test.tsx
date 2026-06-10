import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ProductCard from '../ProductCard'
import type { Product } from '../../../../types'

const mockProduct: Product = {
  id: 1,
  name: '비타C 브라이트닝 세럼',
  brand: '더마로직',
  category: '세럼',
  imageUrl: 'https://example.com/img.jpg',
}

it('제품명과 브랜드를 렌더링한다', () => {
  render(<MemoryRouter><ProductCard product={mockProduct} /></MemoryRouter>)
  expect(screen.getByText('비타C 브라이트닝 세럼')).toBeInTheDocument()
  expect(screen.getByText('더마로직')).toBeInTheDocument()
})

it('imageUrl이 있으면 img 태그를 렌더링한다', () => {
  render(<MemoryRouter><ProductCard product={mockProduct} /></MemoryRouter>)
  expect(screen.getByRole('img')).toBeInTheDocument()
})

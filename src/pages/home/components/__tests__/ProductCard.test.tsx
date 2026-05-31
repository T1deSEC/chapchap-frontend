import { render, screen } from '@testing-library/react'
import ProductCard from '../ProductCard'
import type { Product } from '../../../../types'

const mockProduct: Product = {
  id: 1,
  name: '비타C 브라이트닝 세럼',
  brand: '더마로직',
  category: '세럼',
  imageUrl: 'https://example.com/img.jpg',
  keyIngredients: ['비타민 C', '나이아신아마이드'],
  skinTypes: ['복합성', '지성'],
}

it('제품명, 피부타입 배지를 렌더링한다', () => {
  render(<ProductCard product={mockProduct} />)
  expect(screen.getByText('비타C 브라이트닝 세럼')).toBeInTheDocument()
  expect(screen.getByText('복합성')).toBeInTheDocument()
  expect(screen.getByText('지성')).toBeInTheDocument()
})

it('imageUrl이 없으면 img 태그를 렌더링하지 않는다', () => {
  render(<ProductCard product={{ ...mockProduct, imageUrl: '' }} />)
  const img = screen.queryByRole('img')
  expect(img).not.toBeInTheDocument()
})

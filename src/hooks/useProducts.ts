import { useQuery } from '@tanstack/react-query'
import { getRecommendedProducts } from '../api/products'

export const useRecommendedProducts = () =>
  useQuery({
    queryKey: ['products', 'recommended'],
    queryFn: () => getRecommendedProducts().then((r) => r.data),
  })

import { useInfiniteQuery } from '@tanstack/react-query'
import { searchProducts } from '../api/products'

export const useProductSearch = (query: string) =>
  useInfiniteQuery({
    queryKey: ['products', 'search', query],
    queryFn: ({ pageParam }) =>
      searchProducts(query, pageParam as number).then((r) => r.data),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const { number, totalPages } = lastPage
      return number + 1 < totalPages ? number + 1 : undefined
    },
    staleTime: 1000 * 60 * 2,
  })

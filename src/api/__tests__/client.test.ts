import { describe, it, expect } from 'vitest'
import { unwrapApiResponse } from '../client'
import type { AxiosResponse } from 'axios'

const makeResponse = (data: unknown): AxiosResponse =>
  ({ data, status: 200, statusText: 'OK', headers: {}, config: {} as any })

describe('unwrapApiResponse', () => {
  it('unwraps ApiResponse wrapper', () => {
    const payload = { id: 1, name: '홍길동' }
    const res = makeResponse({ success: true, data: payload, message: 'ok' })
    expect(unwrapApiResponse(res).data).toEqual(payload)
  })

  it('passes through non-wrapped response unchanged', () => {
    const payload = { id: 1 }
    const res = makeResponse(payload)
    expect(unwrapApiResponse(res).data).toEqual(payload)
  })

  it('passes through null data unchanged', () => {
    const res = makeResponse(null)
    expect(unwrapApiResponse(res).data).toBeNull()
  })
})

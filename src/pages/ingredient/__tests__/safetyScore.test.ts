import { describe, it, expect } from 'vitest'
import { computeSafetyScore } from '../ProductDetailPage'
import type { IngredientItem } from '../../../types'

const ing = (safetyLevel: 'safe' | 'caution' | 'warning'): IngredientItem =>
  ({ name: 'x', rank: 1, description: '', safetyLevel })

describe('computeSafetyScore', () => {
  it('returns 100 for empty ingredient list', () => {
    expect(computeSafetyScore([])).toBe(100)
  })

  it('returns 100 when all ingredients are safe', () => {
    expect(computeSafetyScore([ing('safe'), ing('safe')])).toBe(100)
  })

  it('returns 30 when all ingredients are warning', () => {
    expect(computeSafetyScore([ing('warning'), ing('warning')])).toBe(30)
  })

  it('averages mixed safety levels (safe=100, caution=60, warning=30)', () => {
    // (100 + 60) / 2 = 80
    expect(computeSafetyScore([ing('safe'), ing('caution')])).toBe(80)
  })
})

import { describe, it, expect } from 'vitest'
import { mapReaction } from '../ProductFeedbackPage'

describe('mapReaction', () => {
  it('maps 좋음 to good', () => expect(mapReaction('좋음')).toBe('good'))
  it('maps 변화 없음 to neutral', () => expect(mapReaction('변화 없음')).toBe('neutral'))
  it('maps 트러블 발생 to trouble', () => expect(mapReaction('트러블 발생')).toBe('trouble'))
})

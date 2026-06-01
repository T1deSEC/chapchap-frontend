# Backend Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all mock/mismatched API calls with the correct Spring Boot REST endpoints, add refresh-token rotation, and align TypeScript types to the actual backend responses.

**Architecture:** ApiResponse unwrapping and refresh-token rotation live entirely in `client.ts` interceptors — all hooks and pages stay unaware of the wrapper. Types are updated first so TypeScript catches downstream breakage at compile time. API files, hooks, and pages follow in dependency order.

**Tech Stack:** React 18, TypeScript, Axios, Zustand (persist), TanStack Query v5, Vitest, @testing-library/react

**Spec:** `docs/superpowers/specs/2026-06-02-frontend-backend-integration.md`

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/types/index.ts` | All shared types |
| Modify | `src/store/authStore.ts` | Add refreshToken |
| Modify | `src/api/client.ts` | Unwrap interceptor + refresh logic |
| Modify | `src/api/auth.ts` | Add refreshTokens, logoutApi |
| **Create** | `src/api/wishlist.ts` | Wishlist CRUD |
| **Create** | `src/api/feedback.ts` | Feedback submit + history |
| Modify | `src/api/profile.ts` | Fix endpoints, remove wishlist/feedback |
| Modify | `src/api/ingredient.ts` | Fix search, AI analysis body, remove feedback |
| Modify | `src/api/routine.ts` | Fix endpoints, add saveRoutine |
| Modify | `src/api/products.ts` | Fix recommendations endpoint |
| Modify | `src/api/home.ts` | Add updateDiaryEntry |
| Modify | `src/api/notifications.ts` | Replace mock with real endpoints |
| **Create** | `src/hooks/useWishlist.ts` | Wishlist hooks |
| **Create** | `src/hooks/useFeedback.ts` | Feedback hooks |
| Modify | `src/hooks/useNotifications.ts` | Add unread/read-all hooks |
| Modify | `src/hooks/useProfile.ts` | Align to new response shape |
| Modify | `src/hooks/useIngredient.ts` | Fix search, AI params, remove feedback |
| Modify | `src/hooks/useRoutine.ts` | Period mapping, fix remove/save |
| Modify | `src/hooks/useHome.ts` | Add updateDiary mutation |
| Modify | `src/pages/auth/LoginPage.tsx` | Pass refreshToken to store |
| Modify | `src/pages/auth/RegisterPage.tsx` | Pass refreshToken to store |
| Modify | `src/pages/profile/WishlistPage.tsx` | Swap to useWishlist hook |
| Modify | `src/pages/profile/FeedbackHistoryPage.tsx` | Swap hook + render reaction |
| Modify | `src/pages/ingredient/ProductDetailPage.tsx` | Client-side safetyScore |
| Modify | `src/pages/ingredient/ProductFeedbackPage.tsx` | Map reaction → API value |
| Modify | `src/pages/ingredient/AiAnalysisResultPage.tsx` | Redesign for real AI response |
| Modify | `src/pages/routine/AiRoutineResultPage.tsx` | Render conflictingPairs + suggestedAdjustments |
| Modify | `src/pages/home/NotificationPage.tsx` | Add read/unread handling |
| Modify | `src/store/analysisStore.ts` | Align to new AI types |

---

## Task 1: Update TypeScript Types

**Files:**
- Modify: `src/types/index.ts`
- Modify: `src/store/analysisStore.ts`

- [ ] **Step 1: Replace `src/types/index.ts` with updated types**

```ts
export interface User {
  id: number
  name: string
  email: string
  skinType: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

export interface ApiError {
  message: string
  status: number
}

export interface DiaryEntry {
  id: number
  date: string
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible'
  keywords: string[]
  note: string
  products: string[]
}

export interface Product {
  id: number
  name: string
  brand: string
  category: string
  imageUrl: string
  keyIngredients: string[]
  skinTypes: string[]
}

export interface IngredientItem {
  name: string
  rank: number
  description: string
  safetyLevel: 'safe' | 'caution' | 'warning'
}

export interface SkinImpact {
  label: string
  score: number
  level: string
  color: 'primary' | 'warning' | 'danger'
}

export interface ProductDetail extends Product {
  safetyScore: number
  ingredients: IngredientItem[]
  skinImpacts: SkinImpact[]
}

// AI analysis — matches /api/analysis/ingredient response
export interface AiIngredientResult {
  safetyScore: number
  ingredientAnalysis: Array<{
    name: string
    role: string
    safetyLevel: 'safe' | 'caution' | 'warning'
  }>
  summary: string
  recommendations: string[]
}

// AI routine — matches /api/analysis/routine response
export interface RoutineAnalysisResult {
  status: 'safe' | 'warning' | 'conflict'
  conflictingPairs: Array<{ ingredient1: string; ingredient2: string }>
  recommendation: string
  suggestedAdjustments: string[]
}

export interface RoutineItem {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
  order: number
}

export interface UserProfile {
  id: number
  name: string
  email: string
  skinType: string
  skinConcerns: string[]
  gender?: string
  birthYear?: number
}

export interface SkinProfilePayload {
  skinType: string
  skinConcerns: string[]
  gender?: string
  birthYear?: number
}

export interface WishlistItem {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
}

export interface FeedbackRecord {
  id: number
  productId: number
  productName: string
  brand: string
  imageUrl: string
  reaction: 'good' | 'neutral' | 'trouble'
  isEffective: boolean
  memo: string
  createdAt: string
}

export interface ProductFeedbackPayload {
  productId: number
  reaction: 'good' | 'neutral' | 'trouble'
  memo: string
}

export interface Notification {
  id: number
  icon: string
  title: string
  body: string
  read: boolean
  type: 'INGREDIENT_ANALYSIS' | 'ROUTINE_CONFLICT' | 'ROUTINE_CAUTION'
  createdAt: string
}
```

- [ ] **Step 2: Update `src/store/analysisStore.ts` to use new AI types**

```ts
import { create } from 'zustand'
import type { AiIngredientResult, RoutineAnalysisResult } from '../types'

interface AnalysisStore {
  ingredientResult: AiIngredientResult | null
  routineResult: RoutineAnalysisResult | null
  setIngredientResult: (result: AiIngredientResult) => void
  clearIngredientResult: () => void
  setRoutineResult: (result: RoutineAnalysisResult) => void
  clearRoutineResult: () => void
}

export const useAnalysisStore = create<AnalysisStore>((set) => ({
  ingredientResult: null,
  routineResult: null,
  setIngredientResult: (result) => set({ ingredientResult: result }),
  clearIngredientResult: () => set({ ingredientResult: null }),
  setRoutineResult: (result) => set({ routineResult: result }),
  clearRoutineResult: () => set({ routineResult: null }),
}))
```

- [ ] **Step 3: Verify TypeScript compilation**

```bash
npx tsc --noEmit
```

Expected: errors only from files that use removed/changed types (`IngredientAnalysisResult`, `AiRecommendedProduct`, `suggestedProducts`, `conflictingIngredients`, `tags`). These will be fixed in later tasks.

- [ ] **Step 4: Commit**

```bash
git add src/types/index.ts src/store/analysisStore.ts
git commit -m "refactor: align types to backend API response shapes"
```

---

## Task 2: Update Auth Store

**Files:**
- Modify: `src/store/authStore.ts`

- [ ] **Step 1: Write failing test**

Create `src/store/__tests__/authStore.test.ts`:

```ts
import { renderHook, act } from '@testing-library/react'
import { useAuthStore } from '../authStore'

beforeEach(() => {
  useAuthStore.setState({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false })
})

describe('useAuthStore', () => {
  it('login stores access token, refresh token, and user', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => {
      result.current.login('access-123', 'refresh-456', { id: 1, name: '홍길동', email: 'test@test.com', skinType: '건성' })
    })
    expect(result.current.accessToken).toBe('access-123')
    expect(result.current.refreshToken).toBe('refresh-456')
    expect(result.current.isAuthenticated).toBe(true)
  })

  it('setTokens updates access and refresh tokens without changing user', () => {
    const user = { id: 1, name: '홍길동', email: 'test@test.com', skinType: '건성' }
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login('old-access', 'old-refresh', user))
    act(() => result.current.setTokens('new-access', 'new-refresh'))
    expect(result.current.accessToken).toBe('new-access')
    expect(result.current.refreshToken).toBe('new-refresh')
    expect(result.current.user).toEqual(user)
  })

  it('logout clears all auth state', () => {
    const { result } = renderHook(() => useAuthStore())
    act(() => result.current.login('t', 'r', { id: 1, name: 'a', email: 'a@a.com', skinType: '건성' }))
    act(() => result.current.logout())
    expect(result.current.accessToken).toBeNull()
    expect(result.current.refreshToken).toBeNull()
    expect(result.current.isAuthenticated).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/store/__tests__/authStore.test.ts
```

Expected: FAIL — `refreshToken` property not found, `setTokens` not defined.

- [ ] **Step 3: Update `src/store/authStore.ts`**

```ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '../types'

interface AuthStore {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
  login: (accessToken: string, refreshToken: string, user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      login: (accessToken, refreshToken, user) =>
        set({ accessToken, refreshToken, user, isAuthenticated: true }),
      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),
      logout: () =>
        set({ accessToken: null, refreshToken: null, user: null, isAuthenticated: false }),
    }),
    { name: 'chapchap-auth' }
  )
)
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/store/__tests__/authStore.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/store/authStore.ts src/store/__tests__/authStore.test.ts
git commit -m "feat: add refreshToken and setTokens to authStore"
```

---

## Task 3: Update API Client Interceptors

**Files:**
- Modify: `src/api/client.ts`

- [ ] **Step 1: Write failing test**

Create `src/api/__tests__/client.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/api/__tests__/client.test.ts
```

Expected: FAIL — `unwrapApiResponse` not exported.

- [ ] **Step 3: Replace `src/api/client.ts`**

```ts
import axios from 'axios'
import type { AxiosResponse } from 'axios'
import { useAuthStore } from '../store/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
})

export function unwrapApiResponse(res: AxiosResponse): AxiosResponse {
  if (
    res.data !== null &&
    typeof res.data === 'object' &&
    'success' in res.data &&
    'data' in res.data
  ) {
    res.data = (res.data as { data: unknown }).data
  }
  return res
}

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false
let failedQueue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = []

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)))
  failedQueue = []
}

apiClient.interceptors.response.use(
  (res) => unwrapApiResponse(res),
  async (error) => {
    const original = error.config

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    // Refresh 요청 자체가 401이면 즉시 로그아웃
    if (original.url?.includes('/api/auth/refresh')) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return apiClient(original)
      })
    }

    original._retry = true
    isRefreshing = true

    const { refreshToken, setTokens, logout } = useAuthStore.getState()

    if (!refreshToken) {
      logout()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    try {
      const res = await apiClient.post<{ accessToken: string; refreshToken: string }>(
        '/api/auth/refresh',
        { refreshToken }
      )
      const { accessToken, refreshToken: newRefresh } = res.data
      setTokens(accessToken, newRefresh)
      processQueue(null, accessToken)
      original.headers.Authorization = `Bearer ${accessToken}`
      return apiClient(original)
    } catch (err) {
      processQueue(err)
      logout()
      window.location.href = '/login'
      return Promise.reject(err)
    } finally {
      isRefreshing = false
    }
  }
)

export default apiClient
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx vitest run src/api/__tests__/client.test.ts
```

Expected: PASS (3 tests)

- [ ] **Step 5: Commit**

```bash
git add src/api/client.ts src/api/__tests__/client.test.ts
git commit -m "feat: add ApiResponse unwrap interceptor and refresh token rotation"
```

---

## Task 4: Auth API + Login/Register Pages

**Files:**
- Modify: `src/api/auth.ts`
- Modify: `src/pages/auth/LoginPage.tsx`
- Modify: `src/pages/auth/RegisterPage.tsx`

- [ ] **Step 1: Update `src/api/auth.ts`**

```ts
import apiClient from './client'
import type { AuthResponse } from '../types'

export const login = (email: string, password: string) =>
  apiClient.post<AuthResponse>('/api/auth/login', { email, password })

export const register = (name: string, email: string, password: string, skinType: string) =>
  apiClient.post<AuthResponse>('/api/auth/register', { name, email, password, skinType })

export const refreshTokens = (refreshToken: string) =>
  apiClient.post<{ accessToken: string; refreshToken: string }>('/api/auth/refresh', { refreshToken })

export const logoutApi = () =>
  apiClient.post('/api/auth/logout')
```

- [ ] **Step 2: Update `src/pages/auth/LoginPage.tsx` — pass refreshToken to store**

Change only the `onSubmit` function and the dev-login button:

```tsx
const onSubmit = async (data: FormData) => {
  const res = await login(data.email, data.password)
  loginStore(res.data.accessToken, res.data.refreshToken, res.data.user)
  navigate('/home')
}
```

And the dev-login button:
```tsx
onClick={() => {
  loginStore('dev-token', 'dev-refresh', {
    id: 1,
    name: '개발자',
    email: 'dev@chapchap.com',
    skinType: '복합성',
  })
  navigate('/home')
}}
```

- [ ] **Step 3: Update `src/pages/auth/RegisterPage.tsx` — pass refreshToken to store**

Change only the `onSubmit` function:

```tsx
const onSubmit = async (data: FormData) => {
  if (!skinType) {
    setSkinTypeError('피부타입을 선택해주세요')
    return
  }
  const res = await registerApi(data.name, data.email, data.password, skinType)
  loginStore(res.data.accessToken, res.data.refreshToken, res.data.user)
  navigate('/home')
}
```

- [ ] **Step 4: Run existing auth tests**

```bash
npx vitest run src/pages/auth/__tests__
```

Expected: PASS. If tests mock `loginStore` with old signature, update them to include the `refreshToken` argument.

- [ ] **Step 5: Commit**

```bash
git add src/api/auth.ts src/pages/auth/LoginPage.tsx src/pages/auth/RegisterPage.tsx
git commit -m "feat: add refresh/logout API and pass refreshToken through auth pages"
```

---

## Task 5: Wishlist Domain

**Files:**
- Create: `src/api/wishlist.ts`
- Create: `src/hooks/useWishlist.ts`
- Modify: `src/pages/profile/WishlistPage.tsx`

- [ ] **Step 1: Create `src/api/wishlist.ts`**

```ts
import apiClient from './client'
import type { WishlistItem } from '../types'

export const getWishlist = () =>
  apiClient.get<WishlistItem[]>('/api/wishlist')

export const addToWishlist = (productId: number) =>
  apiClient.post(`/api/wishlist/${productId}`)

export const removeFromWishlist = (productId: number) =>
  apiClient.delete(`/api/wishlist/${productId}`)
```

- [ ] **Step 2: Create `src/hooks/useWishlist.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWishlist, addToWishlist, removeFromWishlist } from '../api/wishlist'

export const useWishlist = () =>
  useQuery({
    queryKey: ['wishlist'],
    queryFn: () => getWishlist().then((r) => r.data),
  })

export const useAddToWishlistMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (productId: number) => addToWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}

export const useRemoveFromWishlistMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (productId: number) => removeFromWishlist(productId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['wishlist'] }),
  })
}
```

- [ ] **Step 3: Update `src/pages/profile/WishlistPage.tsx` — swap import**

Change line 2 only:

```tsx
import { useWishlist } from '../../hooks/useWishlist'
```

Remove `item.tag` rendering (field no longer exists). Find and remove:
```tsx
{item.tag && <span className="mt-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary dark:bg-primary/20 w-fit">{item.tag}</span>}
```

- [ ] **Step 4: Run existing wishlist test if present, then run full test suite**

```bash
npx vitest run src/pages/profile/__tests__/WishlistPage.test.tsx
```

Expected: PASS (page renders with empty list by default in test)

- [ ] **Step 5: Commit**

```bash
git add src/api/wishlist.ts src/hooks/useWishlist.ts src/pages/profile/WishlistPage.tsx
git commit -m "feat: wishlist API, hook, and page connected to real endpoints"
```

---

## Task 6: Feedback Domain

**Files:**
- Create: `src/api/feedback.ts`
- Create: `src/hooks/useFeedback.ts`
- Modify: `src/pages/profile/FeedbackHistoryPage.tsx`
- Modify: `src/pages/ingredient/ProductFeedbackPage.tsx`

- [ ] **Step 1: Write failing test for reaction mapping**

Create `src/pages/ingredient/__tests__/reactionMapping.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { mapReaction } from '../ProductFeedbackPage'

describe('mapReaction', () => {
  it('maps 좋음 to good', () => expect(mapReaction('좋음')).toBe('good'))
  it('maps 변화 없음 to neutral', () => expect(mapReaction('변화 없음')).toBe('neutral'))
  it('maps 트러블 발생 to trouble', () => expect(mapReaction('트러블 발생')).toBe('trouble'))
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/pages/ingredient/__tests__/reactionMapping.test.ts
```

Expected: FAIL — `mapReaction` not exported.

- [ ] **Step 3: Create `src/api/feedback.ts`**

```ts
import apiClient from './client'
import type { FeedbackRecord, ProductFeedbackPayload } from '../types'

export const getFeedbackHistory = () =>
  apiClient.get<FeedbackRecord[]>('/api/feedback')

export const submitFeedback = (payload: ProductFeedbackPayload) =>
  apiClient.post('/api/feedback', payload)
```

- [ ] **Step 4: Create `src/hooks/useFeedback.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFeedbackHistory, submitFeedback } from '../api/feedback'
import type { ProductFeedbackPayload } from '../types'

export const useFeedbackHistory = () =>
  useQuery({
    queryKey: ['feedback', 'history'],
    queryFn: () => getFeedbackHistory().then((r) => r.data),
  })

export const useSubmitFeedbackMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: ProductFeedbackPayload) => submitFeedback(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feedback', 'history'] }),
  })
}
```

- [ ] **Step 5: Update `src/pages/ingredient/ProductFeedbackPage.tsx`**

Export `mapReaction` and update `handleSubmit`:

```tsx
// Add at top of file (outside component):
export const mapReaction = (
  reaction: '좋음' | '변화 없음' | '트러블 발생'
): 'good' | 'neutral' | 'trouble' => {
  const map = {
    '좋음': 'good',
    '변화 없음': 'neutral',
    '트러블 발생': 'trouble',
  } as const
  return map[reaction]
}
```

Change the import at the top:
```tsx
import { useSubmitFeedbackMutation } from '../../hooks/useFeedback'
```

Change `const { mutate, isPending } = useSubmitFeedbackMutation(Number(productId))` to:
```tsx
const { mutate, isPending } = useSubmitFeedbackMutation()
```

Change `handleSubmit`:
```tsx
const handleSubmit = () => {
  const memo = [usagePeriod, `${rating}점`, comment].filter(Boolean).join(' / ')
  mutate(
    { productId: Number(productId), reaction: mapReaction(reaction), memo },
    { onSuccess: () => navigate(`/ingredient/${productId}`) }
  )
}
```

- [ ] **Step 6: Update `src/pages/profile/FeedbackHistoryPage.tsx`**

Change the import:
```tsx
import { useFeedbackHistory } from '../../hooks/useFeedback'
```

Replace the `record.tags` rendering block:
```tsx
// Old:
{record.tags.length > 0 && (
  <div className="flex gap-2 p-4 pt-3 overflow-x-auto">
    {record.tags.map((tag) => (
      <div key={tag} className="flex h-8 shrink-0 items-center justify-center rounded-full bg-primary/10 px-3 dark:bg-primary/20">
        <p className="text-sm font-medium text-primary dark:text-primary/90">{tag}</p>
      </div>
    ))}
  </div>
)}

// New:
<div className="flex gap-2 p-4 pt-3">
  <div className="flex h-8 shrink-0 items-center justify-center rounded-full bg-primary/10 px-3 dark:bg-primary/20">
    <p className="text-sm font-medium text-primary dark:text-primary/90">
      {record.reaction === 'good' ? '좋음' : record.reaction === 'neutral' ? '변화 없음' : '트러블 발생'}
    </p>
  </div>
</div>
```

- [ ] **Step 7: Run tests**

```bash
npx vitest run src/pages/ingredient/__tests__/reactionMapping.test.ts
npx vitest run src/pages/profile/__tests__/FeedbackHistoryPage.test.tsx
```

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/api/feedback.ts src/hooks/useFeedback.ts src/pages/ingredient/ProductFeedbackPage.tsx src/pages/profile/FeedbackHistoryPage.tsx
git commit -m "feat: feedback domain connected to real API with reaction mapping"
```

---

## Task 7: Profile API + Hooks

**Files:**
- Modify: `src/api/profile.ts`
- Modify: `src/hooks/useProfile.ts`

- [ ] **Step 1: Replace `src/api/profile.ts`**

```ts
import apiClient from './client'
import type { UserProfile, SkinProfilePayload } from '../types'

export const getProfile = () =>
  apiClient.get<UserProfile>('/api/users/me')

export const updateSkinProfile = (payload: SkinProfilePayload) =>
  Promise.all([
    apiClient.put('/api/users/me/skin-profile', {
      skinType: payload.skinType,
      gender: payload.gender,
      birthYear: payload.birthYear,
    }),
    apiClient.put('/api/users/me/skin-concerns', { concerns: payload.skinConcerns }),
  ])
```

- [ ] **Step 2: Replace `src/hooks/useProfile.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProfile, updateSkinProfile } from '../api/profile'
import type { SkinProfilePayload } from '../types'

export const useProfile = () =>
  useQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile().then((r) => r.data),
  })

export const useUpdateSkinProfileMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SkinProfilePayload) => updateSkinProfile(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['profile'] }),
  })
}
```

- [ ] **Step 3: Run profile tests**

```bash
npx vitest run src/pages/profile/__tests__/ProfilePage.test.tsx
npx vitest run src/pages/profile/__tests__/SkinProfileSetupPage.test.tsx
```

Expected: PASS. If tests reference `useWishlist` or `useFeedbackHistory` from `useProfile`, update the imports in those test files to use `useWishlist` and `useFeedback` hooks instead.

- [ ] **Step 4: Commit**

```bash
git add src/api/profile.ts src/hooks/useProfile.ts
git commit -m "refactor: profile API points to /api/users/me with split skin profile update"
```

---

## Task 8: Ingredient/Product API + Hooks + ProductDetailPage

**Files:**
- Modify: `src/api/ingredient.ts`
- Modify: `src/hooks/useIngredient.ts`
- Modify: `src/pages/ingredient/ProductDetailPage.tsx`

- [ ] **Step 1: Write failing test for safetyScore computation**

Create `src/pages/ingredient/__tests__/safetyScore.test.ts`:

```ts
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx vitest run src/pages/ingredient/__tests__/safetyScore.test.ts
```

Expected: FAIL — `computeSafetyScore` not exported.

- [ ] **Step 3: Replace `src/api/ingredient.ts`**

```ts
import apiClient from './client'
import type { ProductDetail } from '../types'

export interface ProductSearchResult {
  id: number
  brand: string
  name: string
  category: string
  imageUrl: string
}

export const searchProducts = (query: string, category: string) =>
  apiClient.get<ProductSearchResult[]>('/api/products', { params: { search: query, category } })

export const getProductDetail = (productId: number) =>
  apiClient.get<ProductDetail>(`/api/products/${productId}`)

export const runAiIngredientAnalysis = (
  productId: number,
  userSkinType: string,
  userSkinConcerns: string[]
) =>
  apiClient.post('/api/analysis/ingredient', { productId, userSkinType, userSkinConcerns })
```

- [ ] **Step 4: Replace `src/hooks/useIngredient.ts`**

```ts
import { useQuery, useMutation } from '@tanstack/react-query'
import { searchProducts, getProductDetail, runAiIngredientAnalysis } from '../api/ingredient'
import { useAnalysisStore } from '../store/analysisStore'
import { useAuthStore } from '../store/authStore'
import { useProfile } from './useProfile'
import type { AiIngredientResult } from '../types'

export const useProductSearch = (query: string, category: string) =>
  useQuery({
    queryKey: ['products', 'search', query, category],
    queryFn: () => searchProducts(query, category).then((r) => r.data),
    enabled: query.length > 0 || category !== '전체',
  })

export const useProductDetail = (productId: number) =>
  useQuery({
    queryKey: ['products', 'detail', productId],
    queryFn: () => getProductDetail(productId).then((r) => r.data),
    enabled: productId > 0,
  })

export const useAiIngredientAnalysisMutation = (productId: number) => {
  const setIngredientResult = useAnalysisStore((s) => s.setIngredientResult)
  const user = useAuthStore((s) => s.user)
  const { data: profile } = useProfile()

  return useMutation({
    mutationFn: () =>
      runAiIngredientAnalysis(
        productId,
        user?.skinType ?? '',
        profile?.skinConcerns ?? []
      ).then((r) => r.data as AiIngredientResult),
    onSuccess: (data) => setIngredientResult(data),
  })
}
```

- [ ] **Step 5: Export `computeSafetyScore` and add AI analysis button to `ProductDetailPage.tsx`**

Add just above the component definition:

```tsx
import type { IngredientItem } from '../../types'

export const computeSafetyScore = (ingredients: IngredientItem[]): number => {
  if (ingredients.length === 0) return 100
  const total = ingredients.reduce((sum, ing) => {
    const score = ing.safetyLevel === 'safe' ? 100 : ing.safetyLevel === 'caution' ? 60 : 30
    return sum + score
  }, 0)
  return Math.round(total / ingredients.length)
}
```

Add import at top of file:
```tsx
import { useNavigate } from 'react-router-dom'
import { useAiIngredientAnalysisMutation } from '../../hooks/useIngredient'
```

Inside the component, after the `useProductDetail` call:
```tsx
const navigate = useNavigate()
const { mutate: runAnalysis, isPending: isAnalyzing } = useAiIngredientAnalysisMutation(Number(productId))

const handleAiAnalysis = () => {
  runAnalysis(undefined, {
    onSuccess: () => navigate('/ingredient/ai-result'),
  })
  navigate('/ingredient/ai-loading')
}
```

Find this block in the render (SVG circle chart):
```tsx
const circumference = 2 * Math.PI * 45
const offset = circumference - (circumference * product.safetyScore) / 100
```
Replace with:
```tsx
const circumference = 2 * Math.PI * 45
const safetyScore = computeSafetyScore(product.ingredients ?? [])
const offset = circumference - (circumference * safetyScore) / 100
```
Change `{product.safetyScore}%` → `{safetyScore}%`.

In the footer buttons section, add an AI analysis button above the existing buttons:
```tsx
<button
  type="button"
  onClick={handleAiAnalysis}
  disabled={isAnalyzing}
  className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-lg font-bold text-white disabled:opacity-50"
>
  <span className="material-symbols-outlined">auto_awesome</span>
  <span>AI 성분 진단</span>
</button>
```

- [ ] **Step 6: Update `IngredientPage.tsx` — swap search hook and remove productless AI button**

Open `src/pages/ingredient/IngredientPage.tsx`. Replace imports:
```tsx
// Before
import { useIngredientSearch, useAiIngredientAnalysisMutation } from '../../hooks/useIngredient'
// After
import { useProductSearch } from '../../hooks/useIngredient'
```

Rename the hook call:
```tsx
// Before
const { data: results = [] } = useIngredientSearch(query, filter)
const { mutate: runAnalysis, isPending } = useAiIngredientAnalysisMutation()
// After
const { data: results = [] } = useProductSearch(query, filter)
```

Remove the `handleAiAnalysis` function and the AI analysis button entirely (AI analysis is now product-specific, triggered from `ProductDetailPage`). Remove this block:
```tsx
const handleAiAnalysis = () => { ... }
```
And the button JSX:
```tsx
<button type="button" onClick={handleAiAnalysis} ...>
  <span ...>auto_awesome</span>
  <p ...>AI 성분 진단</p>
</button>
```

Also update the search result rendering: the `item.type` check is no longer needed since all results are products. Change `item.type === 'ingredient' ? 'science' : 'water_bottle'` to just `'water_bottle'`.

- [ ] **Step 7: Run tests**

```bash
npx vitest run src/pages/ingredient/__tests__/safetyScore.test.ts
npx vitest run src/pages/ingredient/__tests__/ProductDetailPage.test.tsx
npx vitest run src/pages/ingredient/__tests__/IngredientPage.test.tsx
```

Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add src/api/ingredient.ts src/hooks/useIngredient.ts src/pages/ingredient/ProductDetailPage.tsx src/pages/ingredient/IngredientPage.tsx
git commit -m "feat: product search, safetyScore, and AI analysis wired to real API"
```

---

## Task 9: AI Ingredient Result Page Redesign

**Files:**
- Modify: `src/pages/ingredient/AiAnalysisResultPage.tsx`

The old page parsed `raw.summary` as JSON to get `recommendedProducts`. The real API returns `{ safetyScore, ingredientAnalysis[], summary, recommendations[] }` which is now stored directly in the analysis store.

- [ ] **Step 1: Replace `src/pages/ingredient/AiAnalysisResultPage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useAnalysisStore } from '../../store/analysisStore'

const SAFETY_STYLES = {
  safe:    { badge: 'bg-green-500', text: '안전', border: '' },
  caution: { badge: 'bg-yellow-400', text: '주의', border: 'border border-yellow-400' },
  warning: { badge: 'bg-red-500',   text: '위험', border: 'border-2 border-red-500' },
}

export default function AiAnalysisResultPage() {
  const result = useAnalysisStore((s) => s.ingredientResult)

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background-light dark:bg-background-dark gap-4">
        <p className="text-gray-500 dark:text-gray-400">분석 결과가 없습니다.</p>
        <Link to="/ingredient" className="text-primary font-medium">돌아가기</Link>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark overflow-x-hidden pb-24">
      <div className="sticky top-0 z-10 flex items-center justify-between bg-background-light p-4 dark:bg-background-dark border-b border-gray-200 dark:border-gray-800">
        <Link to="/ingredient" className="flex size-10 items-center justify-center text-[#111318] dark:text-white">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <h2 className="flex-1 text-center text-lg font-bold text-[#111318] dark:text-white">AI 성분 진단 결과</h2>
        <div className="size-10" />
      </div>

      <div className="flex flex-col gap-4 p-4">
        {/* 안전 점수 */}
        <div className="flex flex-col items-center gap-2 rounded-xl bg-white dark:bg-gray-900/50 p-6">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">종합 안전 점수</p>
          <p className="text-5xl font-bold text-primary">{result.safetyScore}<span className="text-2xl">점</span></p>
        </div>

        {/* 요약 */}
        {result.summary && (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 p-4">
            <h3 className="font-bold text-[#111318] dark:text-white mb-2">분석 요약</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{result.summary}</p>
          </div>
        )}

        {/* 성분 분석 */}
        {result.ingredientAnalysis.length > 0 && (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 p-4">
            <h3 className="font-bold text-[#111318] dark:text-white mb-3">성분별 분석</h3>
            <div className="flex flex-col gap-2">
              {result.ingredientAnalysis.map((ing) => {
                const style = SAFETY_STYLES[ing.safetyLevel]
                return (
                  <div key={ing.name} className={`rounded-lg p-3 bg-gray-50 dark:bg-gray-800 ${style.border}`}>
                    <div className="flex items-center gap-2">
                      <span className={`flex h-5 w-5 items-center justify-center rounded-full ${style.badge} text-xs font-bold text-white shrink-0`}>
                        {ing.safetyLevel === 'warning' ? '!' : '✓'}
                      </span>
                      <span className="font-semibold text-[#111318] dark:text-white">{ing.name}</span>
                    </div>
                    <p className="mt-1 pl-7 text-sm text-gray-500 dark:text-gray-400">{ing.role}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* 추천 사항 */}
        {result.recommendations.length > 0 && (
          <div className="rounded-xl bg-white dark:bg-gray-900/50 p-4">
            <h3 className="font-bold text-[#111318] dark:text-white mb-3">추천 사항</h3>
            <ul className="flex flex-col gap-2">
              {result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <span className="material-symbols-outlined text-primary text-base mt-0.5 shrink-0">lightbulb</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Run tests**

```bash
npx vitest run src/pages/ingredient/__tests__/AiAnalysisPages.test.tsx
```

Expected: PASS (or update test mocks if they reference old `recommendedProducts` shape)

- [ ] **Step 3: Commit**

```bash
git add src/pages/ingredient/AiAnalysisResultPage.tsx
git commit -m "feat: redesign AI ingredient result page for real analysis response"
```

---

## Task 10: Routine API + Hooks + AI Routine Result Page

**Files:**
- Modify: `src/api/routine.ts`
- Modify: `src/hooks/useRoutine.ts`
- Modify: `src/pages/routine/AiRoutineResultPage.tsx`

- [ ] **Step 1: Replace `src/api/routine.ts`**

```ts
import apiClient from './client'
import type { RoutineItem, RoutineAnalysisResult } from '../types'

export interface SaveRoutinePayload {
  period: 'AM' | 'PM'
  products: Array<{ productId: number; order: number }>
}

export const getRoutineItems = (period: 'AM' | 'PM') =>
  apiClient.get<RoutineItem[]>('/api/routine', { params: { period } })

export const saveRoutine = (payload: SaveRoutinePayload) =>
  apiClient.post('/api/routine', payload)

export const removeRoutine = (routineId: number) =>
  apiClient.delete(`/api/routine/${routineId}`)

export const runAiRoutineAnalysis = (
  productIds: number[],
  routinePeriod: 'AM' | 'PM',
  userSkinType: string
) =>
  apiClient.post<RoutineAnalysisResult>('/api/analysis/routine', {
    productIds,
    routinePeriod,
    userSkinType,
  })
```

- [ ] **Step 2: Replace `src/hooks/useRoutine.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRoutineItems, saveRoutine, removeRoutine, runAiRoutineAnalysis } from '../api/routine'
import { useAnalysisStore } from '../store/analysisStore'
import { useAuthStore } from '../store/authStore'
import type { SaveRoutinePayload } from '../api/routine'

const toPeriod = (time: 'morning' | 'evening'): 'AM' | 'PM' =>
  time === 'morning' ? 'AM' : 'PM'

export const useRoutineItems = (time: 'morning' | 'evening') =>
  useQuery({
    queryKey: ['routine', 'items', time],
    queryFn: () => getRoutineItems(toPeriod(time)).then((r) => r.data),
  })

export const useSaveRoutineMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: SaveRoutinePayload) => saveRoutine(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routine', 'items'] }),
  })
}

export const useRemoveRoutineItemMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (routineId: number) => removeRoutine(routineId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['routine', 'items'] }),
  })
}

export const useAiRoutineAnalysisMutation = (
  items: Array<{ id: number; productId: number }>,
  time: 'morning' | 'evening'
) => {
  const setRoutineResult = useAnalysisStore((s) => s.setRoutineResult)
  const user = useAuthStore((s) => s.user)

  return useMutation({
    mutationFn: () =>
      runAiRoutineAnalysis(
        items.map((i) => i.productId),
        toPeriod(time),
        user?.skinType ?? ''
      ).then((r) => r.data),
    onSuccess: (data) => setRoutineResult(data),
  })
}
```

- [ ] **Step 3: Update `src/pages/routine/RoutinePage.tsx` — pass items and time to AI mutation**

Find the mutation call:
```tsx
const { mutate: runAnalysis, isPending } = useAiRoutineAnalysisMutation()
```
Replace with:
```tsx
const { mutate: runAnalysis, isPending } = useAiRoutineAnalysisMutation(items, time)
```

- [ ] **Step 4: Update `src/pages/routine/AiRoutineResultPage.tsx`**

Replace the sections that use `conflictingIngredients` and `suggestedProducts`:

```tsx
{result.conflictingPairs.length > 0 && (
  <div className="mb-6">
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-blue-500">science</span>
      <h3 className="font-bold text-gray-900 dark:text-gray-100">충돌 성분 쌍:</h3>
    </div>
    <ul className="mt-2 pl-8 flex flex-col gap-1">
      {result.conflictingPairs.map((pair, i) => (
        <li key={i} className="text-gray-700 dark:text-gray-300 text-sm">
          <span className="font-medium">{pair.ingredient1}</span>
          <span className="mx-2 text-red-400">×</span>
          <span className="font-medium">{pair.ingredient2}</span>
        </li>
      ))}
    </ul>
  </div>
)}
```

```tsx
{result.suggestedAdjustments.length > 0 && (
  <div>
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-blue-500">auto_awesome</span>
      <h3 className="font-bold text-gray-900 dark:text-gray-100">루틴 조정 추천:</h3>
    </div>
    <ul className="mt-2 pl-8 flex flex-col gap-2">
      {result.suggestedAdjustments.map((adj, i) => (
        <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
          <span className="material-symbols-outlined text-primary text-base shrink-0">arrow_right</span>
          <span>{adj}</span>
        </li>
      ))}
    </ul>
  </div>
)}
```

Also replace the `result.status === 'safe'` safe-state check:
```tsx
{result.status === 'safe' && result.conflictingPairs.length === 0 && (
  <div className="flex items-center gap-2">
    <span className="material-symbols-outlined text-green-500">check_circle</span>
    <p className="text-gray-700 dark:text-gray-300">{result.recommendation || '현재 루틴에 성분 충돌이 없습니다.'}</p>
  </div>
)}
```

- [ ] **Step 5: Run tests**

```bash
npx vitest run src/pages/routine/__tests__
```

Expected: PASS (update mocks in tests if they reference old type fields)

- [ ] **Step 6: Commit**

```bash
git add src/api/routine.ts src/hooks/useRoutine.ts src/pages/routine/RoutinePage.tsx src/pages/routine/AiRoutineResultPage.tsx
git commit -m "feat: routine API and AI analysis connected to real endpoints"
```

---

## Task 11: Notifications Domain

**Files:**
- Modify: `src/api/notifications.ts`
- Modify: `src/hooks/useNotifications.ts`
- Modify: `src/pages/home/NotificationPage.tsx`

- [ ] **Step 1: Replace `src/api/notifications.ts`**

```ts
import apiClient from './client'
import type { Notification } from '../types'

export const getNotifications = (page = 0, size = 20) =>
  apiClient.get<Notification[]>('/api/notifications', { params: { page, size } })

export const getUnreadCount = () =>
  apiClient.get<{ count: number }>('/api/notifications/unread-count')

export const markAsRead = (id: number) =>
  apiClient.put(`/api/notifications/${id}/read`)

export const markAllAsRead = () =>
  apiClient.put('/api/notifications/read-all')
```

- [ ] **Step 2: Replace `src/hooks/useNotifications.ts`**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from '../api/notifications'

export const useNotifications = (page = 0, size = 20) =>
  useQuery({
    queryKey: ['notifications', page, size],
    queryFn: () => getNotifications(page, size).then((r) => r.data),
  })

export const useUnreadCount = () =>
  useQuery({
    queryKey: ['notifications', 'unread-count'],
    queryFn: () => getUnreadCount().then((r) => r.data.count),
  })

export const useMarkAsReadMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => markAsRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export const useMarkAllAsReadMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => markAllAsRead(),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
```

- [ ] **Step 3: Update `src/pages/home/NotificationPage.tsx`**

```tsx
import { Link } from 'react-router-dom'
import { useNotifications, useMarkAsReadMutation, useMarkAllAsReadMutation } from '../../hooks/useNotifications'
import LoadingSpinner from '../../components/ui/LoadingSpinner'

const TYPE_ICON: Record<string, string> = {
  INGREDIENT_ANALYSIS: 'science',
  ROUTINE_CONFLICT:    'warning',
  ROUTINE_CAUTION:     'info',
}

export default function NotificationPage() {
  const { data: notifications = [], isLoading } = useNotifications()
  const { mutate: markOne } = useMarkAsReadMutation()
  const { mutate: markAll } = useMarkAllAsReadMutation()

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark">
      <div className="sticky top-0 z-10 flex h-14 items-center border-b border-gray-200 dark:border-gray-800 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm px-4">
        <Link to="/home" className="flex size-10 shrink-0 items-center justify-start">
          <span className="material-symbols-outlined text-gray-800 dark:text-gray-200">arrow_back_ios_new</span>
        </Link>
        <h1 className="flex-1 text-center text-lg font-bold text-gray-900 dark:text-gray-100 pr-10">알림</h1>
        {notifications.some((n) => !n.read) && (
          <button
            type="button"
            onClick={() => markAll()}
            className="text-xs font-medium text-primary whitespace-nowrap"
          >
            전체 읽음
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><LoadingSpinner /></div>
      ) : (
        <div className="flex flex-col gap-3 p-4">
          {notifications.map((n) => (
            <button
              key={n.id}
              type="button"
              onClick={() => !n.read && markOne(n.id)}
              className={`flex items-start gap-4 rounded-lg border p-4 text-left w-full transition-colors ${
                n.read
                  ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  : 'border-primary/30 bg-primary/5 dark:bg-primary/10'
              }`}
            >
              <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <span className="material-symbols-outlined text-primary">
                  {TYPE_ICON[n.type] ?? 'notifications'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-base font-bold text-gray-900 dark:text-gray-100">{n.title}</p>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{n.body}</p>
              </div>
              <p className="shrink-0 text-xs text-gray-500 dark:text-gray-400">{n.createdAt}</p>
            </button>
          ))}
          {notifications.length === 0 && (
            <div className="flex flex-col items-center py-16 text-gray-400 dark:text-gray-600 gap-3">
              <span className="material-symbols-outlined text-5xl">notifications_off</span>
              <p className="text-sm">알림이 없습니다.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 4: Run tests**

```bash
npx vitest run src/pages/home/__tests__/NotificationPage.test.tsx
```

Expected: PASS (update test mocks to include `read` and `type` fields in notification fixtures)

- [ ] **Step 5: Commit**

```bash
git add src/api/notifications.ts src/hooks/useNotifications.ts src/pages/home/NotificationPage.tsx
git commit -m "feat: notifications API connected with read/unread handling"
```

---

## Task 12: Home + Products API + Hooks

**Files:**
- Modify: `src/api/home.ts`
- Modify: `src/api/products.ts`
- Modify: `src/hooks/useHome.ts`

- [ ] **Step 1: Update `src/api/home.ts` — add `updateDiaryEntry`**

```ts
import apiClient from './client'
import type { DiaryEntry } from '../types'

export type CreateDiaryPayload = Pick<DiaryEntry, 'mood' | 'keywords' | 'note' | 'date'>
export type UpdateDiaryPayload = Partial<CreateDiaryPayload>

export const getDiaryEntries = (year: number, month: number) =>
  apiClient.get<DiaryEntry[]>('/api/diary', { params: { year, month } })

export const getDiaryEntry = (id: number) =>
  apiClient.get<DiaryEntry>(`/api/diary/${id}`)

export const createDiaryEntry = (payload: CreateDiaryPayload) =>
  apiClient.post<DiaryEntry>('/api/diary', payload)

export const updateDiaryEntry = (id: number, payload: UpdateDiaryPayload) =>
  apiClient.put<DiaryEntry>(`/api/diary/${id}`, payload)

export const deleteDiaryEntry = (id: number) =>
  apiClient.delete(`/api/diary/${id}`)
```

- [ ] **Step 2: Update `src/api/products.ts` — fix recommendations endpoint**

```ts
import apiClient from './client'
import type { Product } from '../types'

export const getRecommendedProducts = () =>
  apiClient.get<Product[]>('/api/recommendations')
```

- [ ] **Step 3: Update `src/hooks/useHome.ts` — add `useUpdateDiaryMutation`**

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getDiaryEntries,
  getDiaryEntry,
  createDiaryEntry,
  updateDiaryEntry,
  deleteDiaryEntry,
} from '../api/home'
import type { CreateDiaryPayload, UpdateDiaryPayload } from '../api/home'

export const useDiaryEntries = (year: number, month: number) =>
  useQuery({
    queryKey: ['diary', year, month],
    queryFn: () => getDiaryEntries(year, month).then((r) => r.data),
  })

export const useDiaryEntry = (id: number) =>
  useQuery({
    queryKey: ['diary', 'detail', id],
    queryFn: () => getDiaryEntry(id).then((r) => r.data),
    enabled: id > 0,
  })

export const useCreateDiaryMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreateDiaryPayload) => createDiaryEntry(payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  })
}

export const useUpdateDiaryMutation = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: UpdateDiaryPayload) => updateDiaryEntry(id, payload).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  })
}

export const useDeleteDiaryMutation = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteDiaryEntry(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['diary'] }),
  })
}
```

- [ ] **Step 4: Run all tests**

```bash
npm test
```

Expected: All tests PASS. Fix any remaining type errors surfaced by `tsc --noEmit`.

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add src/api/home.ts src/api/products.ts src/hooks/useHome.ts
git commit -m "feat: diary update endpoint and recommendations URL fixed"
```

---

## Final Verification

- [ ] **Run full test suite**

```bash
npm test
```

Expected: All tests pass.

- [ ] **TypeScript clean compile**

```bash
npx tsc --noEmit
```

Expected: Zero errors.

- [ ] **Start dev server and smoke-test key flows**

```bash
npm run dev
```

Flows to verify manually (with backend running):
1. 회원가입 → 로그인 → access token 만료 후 자동 재발급 확인
2. 성분 탭에서 제품 검색 → 제품 상세 → safetyScore 표시 확인
3. 피드백 제출 → 피드백 기록 페이지에서 반응 태그 확인
4. 루틴 탭 AI 안전 진단 → 결과 페이지 conflictingPairs 표시 확인
5. 알림 페이지 → 단건/전체 읽음 처리 확인

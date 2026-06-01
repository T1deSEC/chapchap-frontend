# CHAPCHAP 프론트엔드-백엔드 연동 설계

**날짜:** 2026-06-02  
**범위:** 기존 Mock 기반 프론트엔드를 완성된 Spring Boot REST API에 연동

---

## 1. 핵심 인프라 변경 (`src/api/client.ts`)

### 1-1. ApiResponse 언래핑 인터셉터

백엔드는 모든 응답을 `{ success: boolean, data: T, message: string }` 래퍼로 반환한다.  
응답 인터셉터에서 `res.data.data → res.data`로 투명하게 언래핑하면 모든 훅/페이지 코드 변경 없이 처리된다.

```ts
// 응답 인터셉터 추가
apiClient.interceptors.response.use(
  (res) => { res.data = res.data.data ?? res.data; return res },
  ...
)
```

### 1-2. Refresh Token 자동 재발급

JWT AccessToken 만료(401) 시 자동으로 갱신한다.

```
401 응답
  → authStore에서 refreshToken 조회
  → POST /api/auth/refresh { refreshToken }
    → 성공: 새 토큰 store에 저장, 원래 요청 재시도
    → 실패 (refreshToken 만료 등): logout() → /login 리디렉트
```

무한 루프 방지를 위해 `/api/auth/refresh` 요청 자체는 재시도하지 않는다.

---

## 2. 타입 변경 (`src/types/index.ts`)

| 타입 | 변경 내용 |
|------|---------|
| `AuthResponse` | `refreshToken: string` 추가 |
| `User` | 유지. 백엔드 `nickname` → `name`, `userId` → `id`로 매핑 |
| `UserProfile` | `skinTone` 제거, `gender?: string`, `birthYear?: number` 추가 |
| `SkinProfilePayload` | `gender?: string`, `birthYear?: number` 추가 |
| `FeedbackRecord` | `tags: string[]` 제거 → `reaction: 'good' \| 'neutral' \| 'trouble'`, `isEffective: boolean`, `memo: string` 추가 |
| `ProductFeedbackPayload` | `{ reaction, rating, usagePeriod, comment }` → `{ productId: number, reaction: 'good' \| 'neutral' \| 'trouble', memo: string }` |
| `Notification` | `read: boolean`, `type: 'INGREDIENT_ANALYSIS' \| 'ROUTINE_CONFLICT' \| 'ROUTINE_CAUTION'` 추가 |
| `RoutineItem` | 유지. 백엔드 period 매핑은 훅에서 처리 |
| `AiIngredientResult` | `{ safetyScore: number, ingredientAnalysis: IngredientAnalysis[], summary: string, recommendations: string[] }` |
| `ProductDetail.skinImpacts` | 현재 유지. 백엔드가 아직 반환하지 않으면 `[]` 폴백 (섹션 자동 미노출) |

**피드백 폼 매핑 (UI는 변경 없음):**
- `reaction`: `'좋음' → 'good'`, `'변화 없음' → 'neutral'`, `'트러블 발생' → 'trouble'`
- `memo` = `[usagePeriod, \`${rating}점\`, comment].filter(Boolean).join(' / ')`

---

## 3. Store 변경 (`src/store/authStore.ts`)

- `refreshToken: string | null` 필드 추가 (persist 포함)
- `login(accessToken, refreshToken, user)` 시그니처 변경
- `setTokens(accessToken, refreshToken)` 메서드 추가 (silent refresh용)

---

## 4. API 레이어 변경

### 4-1. `src/api/auth.ts`
| 함수 | 변경 |
|------|------|
| `login()` | 유지 |
| `register()` | 유지 |
| `refreshTokens(refreshToken)` | **신규** — `POST /api/auth/refresh` |
| `logoutApi()` | **신규** — `POST /api/auth/logout` |

### 4-2. `src/api/profile.ts` (users API로 역할 수정)
| 함수 | 변경 |
|------|------|
| `getProfile()` | `/api/profile` → `/api/users/me` |
| `updateSkinProfile(payload)` | `/api/profile/skin` → 두 엔드포인트를 `Promise.all`로 병렬 호출: `PUT /api/users/me/skin-profile { skinType, gender, birthYear }` + `PUT /api/users/me/skin-concerns { concerns[] }` |
| `getWishlist()` | 제거 (wishlist.ts로 이동) |
| `getFeedbackHistory()` | 제거 (feedback.ts로 이동) |

### 4-3. `src/api/wishlist.ts` (신규)
- `getWishlist()` — `GET /api/wishlist`
- `addToWishlist(productId)` — `POST /api/wishlist/{productId}`
- `removeFromWishlist(productId)` — `DELETE /api/wishlist/{productId}`

### 4-4. `src/api/feedback.ts` (신규)
- `getFeedbackHistory()` — `GET /api/feedback`
- `submitFeedback({ productId, reaction, memo })` — `POST /api/feedback`

### 4-5. `src/api/ingredient.ts`
| 함수 | 변경 |
|------|------|
| `searchIngredients(query, filter)` | → `searchProducts(query, category)`, 엔드포인트 `/api/products?search=&category=` |
| `getProductDetail()` | 유지 (`/api/products/${productId}`) |
| `runAiIngredientAnalysis()` | body 추가: `{ productId, userSkinType, userSkinConcerns }` |
| `submitProductFeedback()` | 제거 (feedback.ts로 이동) |

### 4-6. `src/api/routine.ts`
| 함수 | 변경 |
|------|------|
| `getRoutineItems(time)` | `/api/routines` → `/api/routine?period=AM\|PM` |
| `removeRoutineItem(itemId)` | `/api/routines/item/${id}` → `/api/routine/${routineId}` |
| `saveRoutine(products, period)` | **신규** — `POST /api/routine` |
| `runAiRoutineAnalysis()` | body 추가: `{ productIds, routinePeriod, userSkinType }` |

### 4-7. `src/api/products.ts`
- `getRecommendedProducts()`: `/api/products/recommended` → `/api/recommendations`

### 4-8. `src/api/home.ts`
- `updateDiaryEntry(id, payload)` 추가 — `PUT /api/diary/${id}`

---

## 5. 훅 변경 (`src/hooks/`)

| 훅 파일 | 변경 |
|---------|------|
| `useProfile.ts` | 새 API 응답 형태에 맞게 수정. `useWishlist`, `useFeedbackHistory` 제거 |
| `useIngredient.ts` | `useIngredientSearch` → `useProductSearch`. AI 분석 뮤테이션에 productId + 유저 컨텍스트 전달. `useSubmitFeedbackMutation` 제거 |
| `useRoutine.ts` | period 매핑 (`morning→AM`, `evening→PM`). `useRemoveRoutineItemMutation` 수정. `useSaveRoutineMutation` 신규 |
| `useProducts.ts` | 유지 (엔드포인트는 products.ts에서 수정됨) |
| `useHome.ts` | `useUpdateDiaryMutation` 추가 |
| `useWishlist.ts` | **신규** — `useWishlist`, `useAddToWishlistMutation`, `useRemoveFromWishlistMutation` |
| `useFeedback.ts` | **신규** — `useFeedbackHistory`, `useSubmitFeedbackMutation` |
| `useNotifications.ts` | **신규** — `useNotifications`, `useUnreadCount`, `useMarkAsReadMutation`, `useMarkAllAsReadMutation` |

---

## 6. 페이지 변경

| 페이지 | 변경 |
|--------|------|
| `LoginPage.tsx` | `loginStore(token, user)` → `loginStore(token, refreshToken, user)` |
| `RegisterPage.tsx` | 동일 |
| `ProductDetailPage.tsx` | `safetyScore` 클라이언트 계산: `ingredients` 배열의 safety_level 분포로 점수 산출 (safe=100, caution=60, warning=30 가중 평균). `skinImpacts`는 백엔드 미지원 시 `[]` 폴백 |
| `ProductFeedbackPage.tsx` | `handleSubmit`에서 폼 데이터 → `{ reaction: 'good'\|'neutral'\|'trouble', memo }` 매핑 추가 |
| `RoutinePage.tsx` | `time: morning/evening` UI 유지, 내부 API 호출 시 `AM/PM` 매핑 (훅에서 처리) |
| `WishlistPage.tsx` | `useWishlist` 훅 교체 (profile → wishlist) |
| `FeedbackHistoryPage.tsx` | `useFeedbackHistory` 훅 교체 (profile → feedback) |
| `NotificationPage.tsx` | 실제 훅으로 교체, 읽음 처리 연동 |

---

## 7. 미결 사항 (백엔드 추가 구현 필요)

### skinImpacts 필드 추가 요청

`GET /api/products/{productId}` 응답에 아래 필드 추가 요청:

```json
"skinImpacts": [
  { "label": "보습", "score": 82, "level": "높음", "color": "primary" }
]
```

**계산 방식 (규칙 기반):**  
성분의 `function_tags`를 집계, `concentration_order` 역수 가중치로 카테고리별 점수 산출.

| label | function_tags |
|-------|--------------|
| 보습 | moisturizer, humectant |
| 미백 | brightening, whitening |
| 항산화 | antioxidant |
| 진정 | soothing, anti-inflammatory |
| 각질케어 | exfoliant, keratolytic |

color/level: score ≥ 60 → `primary`/`높음`, ≥ 30 → `warning`/`중간`, < 30 → `danger`/`낮음`.

---

## 8. 알림 API 연동 (신규 백엔드 구현 반영)

백엔드에 알림 API가 추가됨. 기존 mock `notifications.ts`를 실제 API로 교체한다.

### API (`src/api/notifications.ts` 교체)
- `getNotifications(page?, size?)` — `GET /api/notifications`
- `getUnreadCount()` — `GET /api/notifications/unread-count` → `{ count: number }`
- `markAsRead(id)` — `PUT /api/notifications/{id}/read`
- `markAllAsRead()` — `PUT /api/notifications/read-all`

### 알림 트리거 (백엔드 자동 생성)
| 조건 | 타입 |
|------|------|
| `POST /api/analysis/ingredient` 성공 | `INGREDIENT_ANALYSIS` |
| `POST /api/analysis/routine` → status `conflict` | `ROUTINE_CONFLICT` |
| `POST /api/analysis/routine` → status `caution` | `ROUTINE_CAUTION` |

### 훅 (`src/hooks/useNotifications.ts` 신규)
- `useNotifications(page, size)` — 목록 조회
- `useUnreadCount()` — 배지용 미읽음 수
- `useMarkAsReadMutation()` — 단건 읽음
- `useMarkAllAsReadMutation()` — 전체 읽음

### 페이지
- `NotificationPage.tsx` — 실제 훅으로 교체, 읽음 처리 버튼 연동
- 상단 알림 아이콘 배지 — `useUnreadCount()` 연결 (현재 배지가 구현된 경우)

---

## 9. 구현 순서 (의존성 기준)

1. `types/index.ts` — 타입 기반이므로 가장 먼저
2. `store/authStore.ts` — refreshToken 필드 추가
3. `api/client.ts` — 언래핑 + refresh 인터셉터
4. `api/auth.ts` — refresh/logout 함수 추가
5. `api/profile.ts`, 신규 `api/wishlist.ts`, `api/feedback.ts` — 프로필 도메인
6. `api/ingredient.ts`, `api/routine.ts`, `api/products.ts`, `api/home.ts` — 나머지 도메인
7. 훅 파일 전체 업데이트
8. 페이지 변경 (LoginPage, RegisterPage, ProductDetailPage, ProductFeedbackPage, WishlistPage, FeedbackHistoryPage, NotificationPage)

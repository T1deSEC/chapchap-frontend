# CHAPCHAP Frontend

AI 기반 개인화 뷰티 플랫폼 **CHAPCHAP**의 React 프론트엔드입니다.

🔗 **[배포 서비스](http://54.116.209.11/)** · **[Backend Repo](https://github.com/T1deSEC/chapchap-backend)** · **[Wiki](https://github.com/T1deSEC/chapchap-wiki)**

---

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프레임워크 | React 18 + TypeScript + Vite |
| 스타일링 | Tailwind CSS v3 |
| 라우팅 | React Router v6 |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand |
| 애니메이션 | Framer Motion |
| 드래그&드롭 | dnd-kit (core + sortable) |
| API 통신 | Axios (JWT 인터셉터 + ApiResponse 자동 unwrap) |
| 폼 검증 | React Hook Form + Zod |
| 테스트 | Vitest + React Testing Library |

백엔드: **Spring Boot REST API** (`:8080`)  
DB: **PostgreSQL 16**

---

## 화면 구성 (20개)

| 탭 | 화면 |
|----|------|
| 인증 | 로그인, 회원가입 |
| 홈 | 홈, 일기 작성, 일기 상세, 추천 제품, 알림, 설정 |
| 성분 | 성분 홈, 제품 성분 분석, AI 분석 로딩, AI 분석 결과, 피드백 입력 |
| 루틴 | 루틴 관리, AI 루틴 진단 로딩, AI 루틴 진단 결과 |
| 마이 | 프로필 홈, 피부 프로필 재설정, 찜한 제품, 피드백 기록 |

---

## Quick Start

### 요구사항

- Node.js 18+
- npm 9+
- (API 연동 시) Spring Boot 서버 실행 중

### 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/T1deSEC/chapchap-frontend.git
cd chapchap-frontend

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev
# → http://localhost:5173
```

`/api/*` 요청은 Vite dev 서버가 자동으로 `localhost:8080`으로 프록시합니다.

### 백엔드 없이 UI 확인하기

개발 서버 실행 후 로그인 화면 하단의 **[개발용] 백엔드 없이 로그인** 버튼을 클릭합니다.  
`import.meta.env.DEV === true` 환경에서만 표시되며 프로덕션 빌드에는 포함되지 않습니다.

### 환경변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_API_BASE_URL` | Spring Boot 서버 URL | 빈 값 (Vite proxy 사용) |

---

## 주요 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드 (tsc + vite build)
npm run lint         # ESLint 검사
npm test             # 테스트 1회 실행
npm run test:watch   # 테스트 watch 모드
npm run test:ui      # 테스트 결과 UI 대시보드
```

단일 테스트 파일 실행:
```bash
npx vitest run src/pages/home/__tests__/HomePage.test.tsx
```

---

## 프로젝트 구조

```
src/
├── api/              # Axios API 함수 (도메인별 분리)
│   └── client.ts     # Axios 인스턴스, JWT 인터셉터, ApiResponse 자동 unwrap
├── components/
│   ├── layout/       # AppLayout (AuthGuard), BottomNav, SubpageHeader
│   └── ui/           # Button, Input, Chip, LoadingSpinner, Toast
├── hooks/            # TanStack Query 커스텀 훅 (도메인별 1파일)
├── pages/            # 탭별 서브폴더 (auth/home/ingredient/routine/profile)
├── store/
│   ├── authStore.ts      # 인증 상태 (localStorage persist)
│   └── analysisStore.ts  # AI 분석 결과 임시 저장 (in-memory)
├── types/            # TypeScript 타입 정의 (백엔드 DTO 1:1 대응)
├── App.tsx           # React Router 정의
└── main.tsx          # QueryClientProvider, ToastProvider 루트
```

### 핵심 아키텍처 패턴

**인증 가드**  
모든 보호 경로는 `<AppLayout />`의 자식입니다. AppLayout이 `useAuthStore.isAuthenticated`를 확인해 미인증 시 `/login`으로 리다이렉트합니다. 별도 route-level guard는 없습니다.

**API 응답 자동 unwrap**  
`client.ts` 인터셉터가 `{ success, data, message }` 래퍼를 자동으로 벗겨냅니다. 훅에서 `r.data`는 이미 실제 페이로드입니다.

**AI 분석 2단계 플로우**  
`useAnalysisStore`가 로딩 페이지(API 호출) → 결과 페이지(스토어에서 읽기) 브릿지를 담당합니다. 결과 소비 후 스토어를 초기화해야 합니다.

**루틴 드래그&드롭**  
`RoutinePage`에서 `DndContext` + `SortableContext` + `arrayMove`로 순서 재정렬 후 PUT으로 저장합니다.

---

## 커밋 컨벤션

```
<type>: <한 줄 설명>
```

| type | 사용 시점 |
|------|-----------|
| `feat` | 새 기능 추가 |
| `fix` | 버그 수정 |
| `chore` | 빌드/설정/패키지 변경 |
| `refactor` | 기능 변화 없는 코드 개선 |
| `test` | 테스트 추가/수정 |
| `style` | 포맷, 오타 등 (로직 변화 없음) |

브랜치 접두사: `feat/`, `fix/`, `chore/`, `refactor/`

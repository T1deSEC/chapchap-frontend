# CHAPCHAP Frontend

스킨케어 루틴 관리 및 AI 성분 분석 앱 **CHAPCHAP**의 React 프론트엔드입니다.

---

## 기술 스택

| 역할 | 기술 |
|------|------|
| 프레임워크 | React 18 + TypeScript + Vite |
| 스타일링 | Tailwind CSS v3 |
| 라우팅 | React Router v6 |
| 서버 상태 | TanStack Query v5 |
| 클라이언트 상태 | Zustand |
| API 통신 | Axios (JWT 인터셉터) |
| 폼 검증 | React Hook Form + Zod |
| 테스트 | Vitest + React Testing Library |

백엔드: **Spring Boot REST API** (`localhost:8080`)  
DB: **PostgreSQL**

---

## 화면 구성 (20개)

| 탭 | 화면 |
|----|------|
| 인증 | 로그인, 회원가입 |
| 홈 | 홈, 일기작성, 일기상세, 추천제품, 알림, 설정 |
| 성분 | 성분홈, 제품성분분석, AI로딩, AI결과, 피드백입력 |
| 루틴 | 루틴관리, AI루틴로딩, AI루틴결과 |
| 마이 | 프로필홈, 피부프로필재설정, 찜한제품, 피드백기록 |

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

# 3. 환경변수 설정
# .env 파일이 없으면 생성
echo "VITE_API_BASE_URL=" > .env

# 4. 개발 서버 실행
npm run dev
# → http://localhost:5173
```

### 백엔드 없이 UI 확인하기

개발 서버 실행 후 로그인 화면(`/login`) 하단의 **[개발용] 백엔드 없이 로그인** 버튼을 클릭합니다.  
이 버튼은 `development` 환경에서만 표시되며 프로덕션 빌드에는 포함되지 않습니다.

### 환경변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_API_BASE_URL` | Spring Boot 서버 URL | 빈 값 (Vite proxy 사용) |

`VITE_API_BASE_URL`을 비워두면 Vite dev 서버가 `/api/*` 요청을 `localhost:8080`으로 자동 프록시합니다.

---

## 주요 명령어

```bash
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm test             # 테스트 1회 실행
npm run test:watch   # 테스트 watch 모드
npm run test:ui      # 테스트 결과 UI 대시보드
```

---

## 프로젝트 구조

```
src/
├── api/          # Axios API 함수 (엔드포인트별 분리)
├── components/
│   ├── layout/   # AppLayout (AuthGuard), BottomNav
│   └── ui/       # Button, Input, Chip, LoadingSpinner
├── hooks/        # TanStack Query 커스텀 훅
├── pages/        # 탭별 서브폴더 (auth/home/ingredient/routine/profile)
├── store/        # Zustand 스토어 (authStore, analysisStore)
├── types/        # TypeScript 타입 정의
├── App.tsx       # 라우터 정의
└── main.tsx      # QueryClientProvider 루트
```

---

## GitHub 컨벤션

### 브랜치 전략

```
master          ← 배포 가능한 상태 유지
└── feat/...    ← 신규 기능
└── fix/...     ← 버그 수정
└── chore/...   ← 설정, 의존성, 빌드
└── refactor/...← 리팩토링
```

**브랜치 명명 예시**

```
feat/home-diary-calendar
fix/auth-redirect-loop
chore/update-dependencies
```

### 커밋 메시지

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

**예시**
```
feat: add diary write page with mood selection
fix: resolve auth redirect loop on token expiry
chore: upgrade tanstack query to v5.1
```

### Pull Request

1. `master`에 직접 push 금지 — 반드시 브랜치 생성 후 PR
2. PR 제목은 커밋 메시지 형식과 동일하게 작성
3. 머지 전 `npm test` 통과 확인
4. PR 본문에 **변경 내용 요약** 및 **테스트 방법** 기재

**PR 본문 템플릿**

```markdown
## 변경 내용
- 

## 테스트 방법
1. 

## 스크린샷 (UI 변경 시)
```

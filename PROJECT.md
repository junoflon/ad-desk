# Ad Desk — 인하우스 광고 소재 관리 시스템

## 프로젝트 개요

인하우스 마케팅팀을 위한 광고 소재 검색, 경쟁사 모니터링, 레퍼런스 관리 도구.
로그인 없이 바로 사용 가능한 내부 도구.

## 기술 스택

- **프론트엔드**: Next.js 16, React 19, Tailwind CSS 4, Lucide Icons
- **백엔드**: Next.js API Routes, Prisma ORM
- **데이터베이스**: PostgreSQL + pgvector
- **AI**: Claude API (검색 의도 분석), OpenAI Embeddings (벡터 유사도)
- **크롤링**: Playwright, Meta Ad Library API
- **이미지**: Sharp
- **스케줄링**: node-cron

---

## 진행 히스토리

### 1단계: 초기 세팅 및 UI
- Next.js + Prisma + PostgreSQL 프로젝트 구조
- 전체 페이지 UI 구현 (랜딩, 검색, 보드, 모니터, 블로그, FAQ, 가격)
- DB 스키마: User, Ad, Board, BoardAd, MonitorBrand, MonitorAd, SearchHistory, BlogPost, FaqItem

### 2단계: API 라우트 구현
- 광고 목록/검색 API (`GET /api/ads`, `POST /api/ads/search`)
- 보드 CRUD API (`/api/boards`, `/api/boards/[id]`, `/api/boards/[id]/ads`)
- 모니터링 API (`/api/monitor`, `/api/monitor/[id]`)
- 시드 데이터 API (`POST /api/seed`) — 데모 유저 + 12개 샘플 광고
- 유틸리티: Prisma 싱글톤, API 응답 헬퍼, useApi/useMutation 훅

### 3단계: 페이지 API 연동
- 검색 페이지: API 기반 필터/정렬/페이지네이션, 보드 저장 모달
- 모니터 페이지: API 기반 브랜드 조회/추가/삭제
- 보드 페이지: API 기반 보드 생성/목록
- 블로그/FAQ: API 연동 (이후 삭제)

### 4단계: 컴포넌트 분리
- `components/common/`: AdCard, AdDetailModal, BoardSelectModal
- `components/search/`: SearchBar, FilterPanel
- `components/board/`: BoardCard, CreateBoardModal

### 5단계: 인하우스 도구로 전환
- **SNIPIT 브랜딩 전면 제거** → Ad Desk
- 랜딩페이지 → 대시보드 (통계 카드, 최근 광고, 빠른 검색)
- 블로그, FAQ, 가격 페이지 삭제
- 랜딩 컴포넌트 7개 삭제 (Hero, CTA, Testimonial 등)
- Header: 내비게이션 중심 (대시보드/검색/보드/모니터링)
- Footer: 한 줄 최소화
- 색상 테마 변경 (보라 → 블루 계열)
- 마케팅 문구 전부 제거

### 6단계: AI 검색 고도화
- 시스템 프롬프트 분리, 구조화된 분석 (키워드/카테고리/포맷/의도/추천)
- 검색 페이지 듀얼 모드: 검색어 입력 → AI 검색, 미입력 → 일반 브라우징
- AI 분석 결과 배너 (의도 설명 + 키워드 태그 + 추천 검색어 클릭)
- API 키 없으면 키워드 분할 폴백

### 7단계: 외부 데이터 수집
- Meta Ad Library API 클라이언트 (`lib/meta.ts`)
- `POST /api/collect` — 키워드로 광고 수집 → DB 저장
- `POST /api/collect/monitor` — 모니터링 브랜드 일괄 수집

### 8단계: 인증 → 제거
- NextAuth v5 credentials 인증 구현 후, 인하우스 특성상 불필요하여 제거
- 자동 유저 생성 방식으로 전환 (admin@addesk.local)

### 9단계: 기능 고도화
- **벡터 검색**: pgvector + OpenAI Embeddings, 코사인 유사도 검색
- **크론 스케줄러**: node-cron 6시간 주기 자동 수집
- **웹 크롤러**: Playwright 기반 Meta Ad Library 크롤링
- **이미지 분석**: Sharp — 메타데이터, 주요 색상 추출, 썸네일 생성
- **CSV 내보내기**: 검색 결과/보드를 CSV 다운로드, UI 버튼 추가

---

## API 엔드포인트 목록

### 광고
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/ads` | 광고 목록 (필터/정렬/페이지네이션) |
| POST | `/api/ads/search` | AI 기반 자연어 검색 |
| POST | `/api/ads/embed` | 광고 벡터 임베딩 생성 |
| GET | `/api/ads/similar?q=` | 벡터 유사도 검색 |

### 보드
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/boards` | 보드 목록 |
| POST | `/api/boards` | 보드 생성 |
| GET | `/api/boards/[id]` | 보드 상세 (저장된 광고 포함) |
| PATCH | `/api/boards/[id]` | 보드 수정 |
| DELETE | `/api/boards/[id]` | 보드 삭제 |
| POST | `/api/boards/[id]/ads` | 보드에 광고 저장 |
| DELETE | `/api/boards/[id]/ads` | 보드에서 광고 제거 |

### 모니터링
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/monitor` | 모니터링 브랜드 목록 |
| POST | `/api/monitor` | 브랜드 추가 |
| GET | `/api/monitor/[id]` | 브랜드 상세 (수집된 광고) |
| DELETE | `/api/monitor/[id]` | 브랜드 삭제 |

### 수집
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/collect` | Meta API로 광고 수집 |
| POST | `/api/collect/monitor` | 모니터링 브랜드 일괄 수집 |
| POST | `/api/collect/crawl` | Playwright 웹 크롤링 |

### 기타
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/cron` | 크론 상태 |
| POST | `/api/cron?action=start\|stop\|run` | 크론 제어 |
| GET | `/api/export?type=ads&q=` | CSV 내보내기 |
| POST | `/api/seed` | 시드 데이터 생성 |

---

## 환경변수

```env
# 필수
DATABASE_URL="postgresql://user:pass@host:5432/addesk"

# AI 검색 (선택 — 없으면 키워드 폴백)
ANTHROPIC_API_KEY=""

# 벡터 검색 (선택)
OPENAI_API_KEY=""

# 광고 수집 (선택 — 없으면 크롤러 사용)
META_AD_LIBRARY_TOKEN=""

# 인증 (현재 미사용)
AUTH_SECRET=""

# 앱
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 로컬 개발

```bash
# PostgreSQL 설치 (Mac)
brew install postgresql@17 pgvector
brew services start postgresql@17
createdb addesk

# pgvector 활성화
psql addesk -c "CREATE EXTENSION IF NOT EXISTS vector;"
psql addesk -c 'ALTER TABLE "Ad" ADD COLUMN IF NOT EXISTS embedding vector(1536);'

# 의존성 설치
npm install

# DB 스키마 반영
npx prisma db push

# 개발 서버
npm run dev

# 시드 데이터
curl -X POST http://localhost:3000/api/seed
```

---

## 배포 (Railway)

1. Railway에 PostgreSQL 서비스 추가
2. 환경변수 설정 (DATABASE_URL 등)
3. GitHub 연결 또는 `railway up`
4. Dockerfile 기반 자동 빌드/배포

---

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 대시보드
│   ├── search/page.tsx       # 광고 검색
│   ├── board/page.tsx        # 보드 관리
│   ├── monitor/page.tsx      # 경쟁사 모니터링
│   └── api/
│       ├── ads/              # 광고 CRUD + AI 검색 + 벡터
│       ├── boards/           # 보드 CRUD
│       ├── monitor/          # 모니터링 CRUD
│       ├── collect/          # 수집 (API + 크롤러)
│       ├── cron/             # 크론 스케줄러
│       ├── export/           # CSV 내보내기
│       └── seed/             # 시드 데이터
├── components/
│   ├── common/               # AdCard, AdDetailModal, BoardSelectModal
│   ├── search/               # SearchBar, FilterPanel
│   ├── board/                # BoardCard, CreateBoardModal
│   └── layout/               # Header, Footer
└── lib/
    ├── api.ts                # API 응답 헬퍼
    ├── auth-helpers.ts       # 자동 유저 (로그인 없음)
    ├── crawler.ts            # Playwright 크롤러
    ├── cron.ts               # 크론 스케줄러
    ├── hooks.ts              # useApi, useMutation
    ├── image.ts              # Sharp 이미지 분석
    ├── meta.ts               # Meta Ad Library API
    ├── mockData.ts           # 필터 옵션 + 폴백 데이터
    ├── prisma.ts             # Prisma 싱글톤
    └── vector.ts             # pgvector 벡터 검색
```

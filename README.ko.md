# SolPort - 솔라나 포트폴리오 매니저

SolPort는 솔라나 기반 자산을 관리하고 모니터링하기 위한 웹3 애플리케이션입니다. AI 기반 로보어드바이저로서 포트폴리오 제안, 조정 및 모니터링 기능을 제공합니다.

![SolPort 로고](/public/sol-port.svg)

## 주요 기능

- **AI 투자 상담**: 사용자의 목표와 위험 성향에 맞는 맞춤형 포트폴리오 제안
- **포트폴리오 관리**: 자산 배분, 성과 추적 및 리밸런싱
- **자동화 설정**: 자동 리밸런싱, 자동 납입, 목표 기반 전략 조정
- **자산 분석**: 암호화폐 및 LST(Liquid Staking Token) 분석
- **목표 관리**: 재정 목표 설정 및 달성 추적
- **다국어 지원**: 한국어, 영어 지원

## 기술 스택

- **프론트엔드**: TypeScript, Next.js, React, Tailwind CSS
- **블록체인 연동**: @solana/wallet-adapter, @solana/web3.js
- **상태 관리**: React Context API
- **차트 및 시각화**: Recharts
- **스타일링**: Tailwind CSS, shadcn/ui
- **국제화**: 자체 구현 다국어 시스템

## 시작하기

### 필수 조건

- Node.js 18.0.0 이상
- pnpm 8.0.0 이상
- Solana 지갑 (Phantom, Solflare 등)

### 설치

1. 저장소 클론:

\`\`\`bash
git clone https://github.com/yourusername/sol-port-app.git
cd sol-port-app
\`\`\`

2. 의존성 설치:

\`\`\`bash
pnpm install
\`\`\`

3. 환경 변수 설정:

`.env.local` 파일을 프로젝트 루트에 생성하고 다음 변수를 설정합니다:

\`\`\`
NEXT_PUBLIC_API_BASE_URL=http://your-backend-api-url
BACKEND_API_URL=http://your-backend-api-url
NEXT_PUBLIC_BASE_URL=http://your-frontend-url
\`\`\`

### 개발 서버 실행

\`\`\`bash
pnpm dev
\`\`\`

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하여 애플리케이션을 확인할 수 있습니다.

### 프로덕션 빌드

\`\`\`bash
pnpm build
pnpm start
\`\`\`

## 배포

### Vercel 배포

1. [Vercel](https://vercel.com)에 GitHub 저장소를 연결합니다.
2. 환경 변수를 Vercel 프로젝트 설정에 추가합니다:
   - `NEXT_PUBLIC_API_BASE_URL`
   - `BACKEND_API_URL`
   - `NEXT_PUBLIC_BASE_URL` (배포된 도메인 URL, 예: https://sol-port-app.vercel.app)
3. 배포를 진행합니다.

### 이미지 로딩 문제 해결

배포 후 이미지가 표시되지 않는 경우:

1. Vercel 프로젝트 설정에서 `NEXT_PUBLIC_BASE_URL` 환경 변수가 올바르게 설정되었는지 확인합니다.
2. 환경 변수 값이 슬래시(`/`)로 끝나지 않도록 설정합니다. (예: `https://example.com` O, `https://example.com/` X)
3. 이미지 로더가 올바르게 구성되었는지 확인합니다:

\`\`\`tsx
// OptimizedImage 컴포넌트 사용
import { OptimizedImage } from "@/components/ui/optimized-image"

// 이미지 표시
<OptimizedImage
  src="/path/to/image.png"
  alt="이미지 설명"
  width={100}
  height={100}
/>
\`\`\`

## 프로젝트 구조

\`\`\`
sol-port-app/
├── app/ # Next.js 앱 라우터
│ ├── analysis/ # 자산 분석 페이지
│ ├── automation/ # 자동화 설정 페이지
│ ├── calendar/ # 알림 센터 페이지
│ ├── chat/ # AI 투자 상담 페이지
│ ├── goals/ # 목표 관리 페이지
│ ├── overview/ # 포트폴리오 개요 페이지
│ ├── api/ # API 라우트
│ ├── dashboard-layout.tsx # 대시보드 레이아웃
│ ├── globals.css # 전역 스타일
│ ├── layout.tsx # 루트 레이아웃
│ └── page.tsx # 홈페이지
├── components/ # 리액트 컴포넌트
│ ├── consultation/ # 상담 관련 컴포넌트
│ ├── dashboard/ # 대시보드 컴포넌트
│ ├── ui/ # UI 컴포넌트
│ └── ...
├── context/ # 리액트 컨텍스트
│ ├── app-state-context.tsx # 앱 상태 컨텍스트
│ └── language-context.tsx # 언어 컨텍스트
├── lib/ # 유틸리티 함수
│ ├── api/ # API 클라이언트
│ ├── config.ts # 설정
│ ├── cookies.ts # 쿠키 유틸리티
│ ├── image-loader.ts # 이미지 로더
│ └── utils.ts # 기타 유틸리티
├── public/ # 정적 파일
│ ├── sol-port.svg # 로고
│ └── ...
├── translations/ # 다국어 번역 파일
│ ├── en_US.ts # 영어 번역
│ └── ko_KR.ts # 한국어 번역
├── next.config.mjs # Next.js 설정
├── package.json # 패키지 정보
├── tailwind.config.ts # Tailwind CSS 설정
└── tsconfig.json # TypeScript 설정
\`\`\`

## 주요 컴포넌트

### 1. 대시보드 컴포넌트

- `AssetSummaryCard`: 총 자산 가치 및 일일 변동 표시
- `ReturnCard`: 총 수익률 및 목표 투자액 표시
- `RiskScoreCard`: 포트폴리오 리스크 점수 표시
- `AssetAllocationCard`: 자산 배분 파이 차트 표시
- `PerformanceChartCard`: 포트폴리오 성과 차트 표시
- `LstStakingCard`: LST 스테이킹 수익 표시

### 2. 상담 컴포넌트

- `WalletConnection`: 지갑 연결 인터페이스
- `ChatInterface`: AI 투자 상담 채팅 인터페이스
- `PortfolioConfirmation`: 포트폴리오 확인 및 승인
- `AutomationSettings`: 자동화 설정 인터페이스
- `SetupComplete`: 설정 완료 화면

### 3. 공통 컴포넌트

- `Header`: 앱 헤더
- `Sidebar`: 네비게이션 사이드바
- `LanguagePopup`: 언어 선택 팝업
- `OptimizedImage`: 최적화된 이미지 컴포넌트

## 환경 변수

| 변수명                   | 설명                                     | 예시                            |
| ------------------------ | ---------------------------------------- | ------------------------------- |
| NEXT_PUBLIC_API_BASE_URL | 프론트엔드에서 접근 가능한 API 기본 URL  | http://api.example.com          |
| BACKEND_API_URL          | 백엔드 전용 API URL                      | http://internal-api.example.com |
| NEXT_PUBLIC_BASE_URL     | 프론트엔드 기본 URL (이미지 로딩에 중요) | https://sol-port-app.vercel.app |

## 이미지 최적화

이미지 로딩 문제를 해결하기 위해 커스텀 이미지 로더와 최적화된 이미지 컴포넌트를 구현했습니다:

\`\`\`tsx
// 이미지 로더 사용 예시
import { OptimizedImage } from "@/components/ui/optimized-image"

export function MyComponent() {
return (
<OptimizedImage
      src="/path/to/image.png"
      alt="이미지 설명"
      width={100}
      height={100}
      fallbackText="이미지를 찾을 수 없음"
    />
)
}
\`\`\`

## 기여

1. 이 저장소를 포크합니다.
2. 새 브랜치를 생성합니다: `git checkout -b feature/amazing-feature`
3. 변경사항을 커밋합니다: `git commit -m 'Add amazing feature'`
4. 브랜치를 푸시합니다: `git push origin feature/amazing-feature`
5. Pull Request를 제출합니다.

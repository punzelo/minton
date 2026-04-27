# Badminton Bracket App

배드민턴 대회 운영자가 팀을 등록하고 더블 엘리미네이션 대진표를 자동 생성한 뒤, 경기 결과에 따라 승자조와 패자조를 진행할 수 있는 MVP 웹앱입니다.

## 기술 스택

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## 설치

```bash
npm install
```

## 환경 변수

`.env.example`을 참고해 `.env.local`을 만듭니다.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Supabase 설정

1. Supabase 프로젝트를 생성합니다.
2. SQL Editor에서 `supabase/schema.sql` 내용을 실행합니다.
3. Authentication에서 Email 로그인 방식을 활성화합니다.
4. `.env.local`에 프로젝트 URL과 anon key를 입력합니다.

## 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 빌드

```bash
npm run build
```

## MVP 기능

- 운영자 이메일 회원가입/로그인
- 대회 생성
- 팀 등록/삭제
- 4팀, 8팀, 16팀 기준 더블 엘리미네이션 대진 자동 생성
- 공개 대진표 조회
- 경기 결과 입력
- 승자 다음 경기 이동
- 패자 패자조 이동 또는 탈락 처리

## 주요 폴더

```txt
app/                  Next.js 화면과 API Route
components/           화면 컴포넌트
lib/bracket/          대진 생성 및 결과 이동 로직
lib/supabase/         Supabase 클라이언트
types/                공통 타입
supabase/schema.sql   DB 테이블과 RLS 정책
```

## Vercel 배포

1. GitHub 저장소를 Vercel에 연결합니다.
2. Vercel Project Settings에 환경 변수를 등록합니다.
3. Build Command는 `npm run build`를 사용합니다.
4. Supabase의 Authentication URL 설정에 배포 도메인을 추가합니다.

계정 삭제 기능은 Supabase Auth 관리 API를 사용하므로 Vercel 환경변수에
`SUPABASE_SERVICE_ROLE_KEY`를 반드시 추가해야 합니다. 이 키는 서버 전용이며
`NEXT_PUBLIC_` 접두사를 붙이면 안 됩니다.

# K FOOTBALL — Netlify 배포 가이드

## 📁 폴더 구조
```
kfootball/
├── netlify.toml              ← Netlify 설정
├── netlify/
│   └── functions/
│       └── football.js       ← 서버리스 API 프록시 (CORS 해결!)
└── public/
    └── index.html            ← 앱 본체
```

## 🚀 배포 방법 (5분)

### 1단계 — GitHub 올리기
1. [github.com](https://github.com) 로그인 → New Repository
2. Repository 이름: `kfootball`
3. 이 폴더 파일 전체 업로드 (폴더 구조 그대로)
4. Commit changes

### 2단계 — Netlify 연결
1. [netlify.com](https://netlify.com) 무료 가입
2. **"Add new site" → "Import an existing project"**
3. GitHub 연결 → `kfootball` 레포 선택
4. Build settings:
   - Build command: *(비워두기)*
   - Publish directory: `public`
5. **Deploy site** 클릭

### 3단계 — API 키 환경변수 설정 (핵심!)
1. Netlify 대시보드 → Site → **Site configuration**
2. **Environment variables** → "Add a variable"
3. Key: `FOOTBALL_API_KEY`
4. Value: `dashboard.api-football.com 에서 받은 API 키`
5. **Save** → **Trigger deploy** (재배포)

### 4단계 — 앱에서 API 키 입력
1. 배포된 URL 접속 (예: `your-app.netlify.app`)
2. 상단 ⚙ 버튼 → API 키 입력 → 저장
3. 실데이터 연동 완료!

## 🔑 API 키 발급
- [dashboard.api-football.com/register](https://dashboard.api-football.com/register)
- 무료 가입 → 왼쪽 메뉴 `<>` 클릭 → API Key 복사
- **무료 플랜: 하루 100회 / 신용카드 불필요**

## ✅ 지원 리그
| 리그 | ID |
|------|----|
| K리그1 | 292 |
| K리그2 | 293 |
| K3리그 | 591 |
| K4리그 | 866 |
| 프리미어리그 | 39 |
| 라리가 | 140 |
| 세리에A | 135 |
| 리그앙 | 61 |
| 챔피언스리그 | 2 |

## 🛠 왜 Netlify Functions?
브라우저에서 외부 API를 직접 호출하면 CORS 오류가 발생해요.
Netlify Functions는 **서버에서 API를 대신 호출**하기 때문에 CORS 문제가 완전히 해결돼요.
모바일 사파리, 안드로이드 크롬 어디서든 완벽하게 작동해요.

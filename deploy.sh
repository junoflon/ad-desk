#!/bin/bash
# Ad Desk — 자동 커밋 + 배포 스크립트
# 사용법: ./deploy.sh "커밋 메시지" 또는 ./deploy.sh (자동 메시지)

set -e

# 색상
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}━━━ Ad Desk Deploy ━━━${NC}"

# 1. 변경사항 확인
if git diff --quiet && git diff --staged --quiet; then
  echo -e "${YELLOW}변경사항이 없습니다.${NC}"
  exit 0
fi

# 2. 타입 체크
echo -e "${BLUE}[1/4] 타입 체크...${NC}"
npx tsc --noEmit || { echo "타입 에러 — 수정 후 재시도하세요."; exit 1; }

# 3. 커밋
MSG="${1:-"chore: auto deploy $(date '+%Y-%m-%d %H:%M')"}"
echo -e "${BLUE}[2/4] 커밋: ${MSG}${NC}"
git add -A
git commit -m "$MSG" || { echo "커밋 실패"; exit 1; }

# 4. 리모트 푸시
echo -e "${BLUE}[3/4] 리모트 푸시...${NC}"
if git remote | grep -q origin; then
  git push origin main
  echo -e "${GREEN}푸시 완료${NC}"
else
  echo -e "${YELLOW}리모트(origin)가 설정되지 않았습니다. 수동으로 추가하세요:${NC}"
  echo "  git remote add origin https://github.com/YOUR_USERNAME/ad-desk.git"
  echo "  git push -u origin main"
fi

# 5. Railway 배포 (설치된 경우)
echo -e "${BLUE}[4/4] 배포 확인...${NC}"
if command -v railway &> /dev/null; then
  echo "Railway CLI 감지 — 배포 시작..."
  railway up
  echo -e "${GREEN}Railway 배포 완료${NC}"
elif [ -f "vercel.json" ] || command -v vercel &> /dev/null; then
  echo "Vercel 감지 — GitHub 연결로 자동 배포됩니다."
else
  echo -e "${YELLOW}배포 CLI 미설치. 아래 중 하나를 선택하세요:${NC}"
  echo "  Railway: npm i -g @railway/cli && railway login && railway up"
  echo "  Vercel:  npm i -g vercel && vercel"
  echo "  또는 GitHub에 푸시하면 연결된 서비스에서 자동 배포됩니다."
fi

echo -e "${GREEN}━━━ 완료 ━━━${NC}"

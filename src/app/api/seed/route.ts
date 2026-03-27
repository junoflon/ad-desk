import { prisma } from "@/lib/prisma";
import { success, error } from "@/lib/api";

const sampleAds = [
  {
    platform: "instagram",
    brand: "올리브영",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "지금 이 가격, 다시 없어요! 올영세일 최대 70% 할인",
    category: "뷰티",
    format: "이미지",
    likes: 2340,
    comments: 186,
    shares: 45,
    startDate: new Date("2026-03-01"),
    endDate: new Date("2026-03-15"),
    isActive: false,
  },
  {
    platform: "facebook",
    brand: "무신사",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "이번 봄, 가장 먼저 입는 신상 컬렉션",
    category: "패션",
    format: "캐러셀",
    likes: 1520,
    comments: 89,
    shares: 32,
    startDate: new Date("2026-03-10"),
    isActive: true,
  },
  {
    platform: "instagram",
    brand: "배달의민족",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "오늘 뭐 먹지? 배민이 골라줄게",
    category: "푸드/배달",
    format: "비디오",
    likes: 5670,
    comments: 423,
    shares: 156,
    startDate: new Date("2026-02-20"),
    isActive: true,
  },
  {
    platform: "facebook",
    brand: "토스",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "매달 나가는 구독료, 한눈에 확인하세요",
    category: "금융",
    format: "이미지",
    likes: 3210,
    comments: 267,
    shares: 89,
    startDate: new Date("2026-03-05"),
    isActive: true,
  },
  {
    platform: "instagram",
    brand: "쿠팡",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "로켓배송으로 내일 아침에 만나요",
    category: "이커머스",
    format: "이미지",
    likes: 4100,
    comments: 312,
    shares: 78,
    startDate: new Date("2026-03-12"),
    isActive: true,
  },
  {
    platform: "instagram",
    brand: "나이키",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "Just Do It. 새로운 에어맥스 컬렉션",
    category: "스포츠",
    format: "비디오",
    likes: 8900,
    comments: 654,
    shares: 234,
    startDate: new Date("2026-02-28"),
    isActive: true,
  },
  {
    platform: "facebook",
    brand: "야놀자",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "놀자! 봄 특가 숙소 최대 50% 할인",
    category: "여행",
    format: "캐러셀",
    likes: 2800,
    comments: 198,
    shares: 67,
    startDate: new Date("2026-03-08"),
    endDate: new Date("2026-03-20"),
    isActive: false,
  },
  {
    platform: "instagram",
    brand: "삼성전자",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "Galaxy S26 Ultra, 새로운 AI가 만드는 경험",
    category: "테크",
    format: "비디오",
    likes: 12300,
    comments: 890,
    shares: 456,
    startDate: new Date("2026-03-01"),
    isActive: true,
  },
  {
    platform: "facebook",
    brand: "스타벅스",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "벚꽃 시즌 한정 음료, 지금 만나보세요",
    category: "F&B",
    format: "이미지",
    likes: 6700,
    comments: 534,
    shares: 189,
    startDate: new Date("2026-03-15"),
    isActive: true,
  },
  {
    platform: "instagram",
    brand: "당근",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "우리 동네 중고 직거래, 당근에서 시작하세요",
    category: "라이프스타일",
    format: "이미지",
    likes: 3450,
    comments: 213,
    shares: 56,
    startDate: new Date("2026-03-18"),
    isActive: true,
  },
  {
    platform: "instagram",
    brand: "현대자동차",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "전기차의 새로운 기준, 아이오닉 6",
    category: "자동차",
    format: "비디오",
    likes: 7800,
    comments: 432,
    shares: 198,
    startDate: new Date("2026-02-25"),
    isActive: true,
  },
  {
    platform: "facebook",
    brand: "마켓컬리",
    imageUrl: "/images/placeholder-ad.svg",
    copyText: "새벽배송으로 만나는 제주 유기농 감귤",
    category: "식품",
    format: "이미지",
    likes: 1890,
    comments: 145,
    shares: 34,
    startDate: new Date("2026-03-20"),
    isActive: true,
  },
];

export async function POST() {
  try {
    // Create demo user
    const user = await prisma.user.upsert({
      where: { email: "demo@snipit.im" },
      update: {},
      create: {
        email: "demo@snipit.im",
        name: "데모 유저",
      },
    });

    // Create ads
    for (const ad of sampleAds) {
      await prisma.ad.create({ data: ad });
    }

    // Create sample board
    await prisma.board.create({
      data: {
        name: "2026 봄 캠페인 레퍼런스",
        description: "봄 시즌 캠페인에 참고할 광고 레퍼런스 모음",
        userId: user.id,
      },
    });

    // Create sample monitor brand
    await prisma.monitorBrand.create({
      data: {
        brandName: "올리브영",
        platform: "instagram",
        userId: user.id,
      },
    });

    // Create blog posts
    const blogPosts = [
      {
        title: "보드 기능 업데이트: 저장에서 인사이트 확장까지",
        slug: "board-update",
        content: "더 강력해진 보드 기능을 만나보세요.",
        excerpt: "더 강력해진 보드 기능을 만나보세요. 저장한 광고의 성과 트렌드를 분석하고, AI가 유사 광고를 자동으로 추천합니다.",
        category: "업데이트",
        published: true,
        publishedAt: new Date("2026-03-23"),
      },
      {
        title: "워크스페이스 구조 개편",
        slug: "workspace-restructure",
        content: "팀 단위 협업이 더 쉬워졌습니다.",
        excerpt: "팀 단위 협업이 더 쉬워졌습니다. 역할 기반 권한 관리와 팀 보드 공유 기능을 확인하세요.",
        category: "업데이트",
        published: true,
        publishedAt: new Date("2026-03-18"),
      },
      {
        title: "광고 레퍼런스 검색 통합 출시",
        slug: "search-launch",
        content: "메타, 인스타그램 광고를 한 곳에서 검색할 수 있습니다.",
        excerpt: "메타, 인스타그램 광고를 한 곳에서 검색할 수 있습니다. AI 기반 자연어 검색으로 원하는 레퍼런스를 빠르게 찾아보세요.",
        category: "제품스토리",
        published: true,
        publishedAt: new Date("2026-03-04"),
      },
      {
        title: "스니핏 시작하기 #1: 첫 검색 해보기",
        slug: "getting-started-1",
        content: "스니핏을 처음 사용하시나요?",
        excerpt: "스니핏을 처음 사용하시나요? 가장 효과적으로 광고 레퍼런스를 검색하는 방법을 안내합니다.",
        category: "온보딩",
        published: true,
        publishedAt: new Date("2026-02-28"),
      },
      {
        title: "퍼포먼스 마케터의 레퍼런스 활용법",
        slug: "performance-marketer-tips",
        content: "성과 데이터와 함께 레퍼런스를 분석하면 소재 기획이 달라집니다.",
        excerpt: "성과 데이터와 함께 레퍼런스를 분석하면 소재 기획이 달라집니다. 실전 활용 사례를 공유합니다.",
        category: "활용 인사이트",
        published: true,
        publishedAt: new Date("2026-02-18"),
      },
    ];

    for (const post of blogPosts) {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: {},
        create: post,
      });
    }

    // Create FAQ items
    const faqItems = [
      { question: "스니핏은 어떤 서비스인가요?", answer: "스니핏은 마케터를 위한 AI 기반 광고 레퍼런스 검색 플랫폼입니다. 이미지, 카피, 분위기 등 자연어로 광고를 검색하고, 경쟁사 광고를 자동으로 모니터링하며, 보드에 레퍼런스를 체계적으로 정리할 수 있습니다.", category: "서비스 소개", order: 0 },
      { question: "어떤 플랫폼의 광고를 검색할 수 있나요?", answer: "현재 Meta(Facebook, Instagram) 광고 라이브러리의 광고를 검색할 수 있습니다. 추후 Google, TikTok 등 더 많은 플랫폼을 지원할 예정입니다.", category: "서비스 소개", order: 1 },
      { question: "AI 검색은 어떻게 작동하나요?", answer: "스니핏의 AI 검색은 단순 키워드 매칭이 아닌, 이미지의 시각적 유사도와 텍스트의 의미를 이해하여 검색합니다.", category: "서비스 소개", order: 2 },
      { question: "무료로 사용할 수 있나요?", answer: "네, Free 플랜으로 기본 기능을 무료로 사용할 수 있습니다. 8시간마다 5회 검색, 경쟁사 모니터링 2개가 제공됩니다.", category: "요금 및 플랜", order: 0 },
      { question: "플랜은 언제든지 변경할 수 있나요?", answer: "네, 언제든지 상위 또는 하위 플랜으로 변경할 수 있습니다. 상위 플랜으로 업그레이드 시 즉시 적용되며, 다운그레이드는 다음 결제일부터 적용됩니다.", category: "요금 및 플랜", order: 1 },
      { question: "경쟁사 모니터링은 어떻게 동작하나요?", answer: "모니터링하고 싶은 브랜드를 등록하면, 해당 브랜드의 신규 광고가 자동으로 수집됩니다. 광고 게재 히스토리, 운영 패턴 통계도 확인할 수 있습니다.", category: "기능", order: 0 },
      { question: "보드는 팀원과 공유할 수 있나요?", answer: "네, 보드를 팀원과 공유하거나 공개 링크를 생성하여 외부에 공유할 수 있습니다. Basic 플랜 이상에서 팀 협업 기능을 사용할 수 있습니다.", category: "기능", order: 1 },
      { question: "종료된 광고도 볼 수 있나요?", answer: "네, 스니핏은 한번 수집된 광고는 종료 후에도 아카이브하여 보관합니다.", category: "기능", order: 2 },
    ];

    for (const item of faqItems) {
      await prisma.faqItem.create({ data: item });
    }

    return success({ message: "Seed data created", userId: user.id });
  } catch (e) {
    return error(`Seed failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}

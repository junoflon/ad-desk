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

    return success({ message: "Seed data created", userId: user.id });
  } catch (e) {
    return error(`Seed failed: ${e instanceof Error ? e.message : e}`, 500);
  }
}

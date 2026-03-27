import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "무료",
    priceNote: "오픈 베타 한정",
    features: [
      "8시간마다 5회 검색",
      "경쟁사 모니터링 2개",
      "보드 무제한 생성",
      "팀원 1명",
    ],
    cta: "무료로 시작",
    highlighted: false,
  },
  {
    name: "Light",
    price: "₩12,900",
    priceNote: "/월",
    features: [
      "매일 50회 검색",
      "무제한 탐색",
      "경쟁사 모니터링 5개",
      "보드 무제한 생성",
      "팀원 1명",
    ],
    cta: "Light 시작하기",
    highlighted: false,
  },
  {
    name: "Basic",
    price: "₩32,900",
    priceNote: "/월",
    features: [
      "매일 100회 검색",
      "무제한 탐색",
      "경쟁사 모니터링 20개",
      "보드 무제한 생성",
      "팀원 3명",
      "Light 전체 기능 포함",
    ],
    cta: "Basic 시작하기",
    highlighted: true,
  },
  {
    name: "Premium",
    price: "₩150,000",
    priceNote: "/월",
    features: [
      "매일 500회 검색",
      "경쟁사 모니터링 100개",
      "글로벌 246개국",
      "팀원 5명",
      "우선 지원",
      "Basic 전체 기능 포함",
    ],
    cta: "Premium 시작하기",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              플랜 안내
            </h1>
            <p className="text-text-secondary text-lg">
              팀 규모와 필요에 맞는 플랜을 선택하세요
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative rounded-2xl p-6 border ${
                  plan.highlighted
                    ? "border-primary bg-primary/5"
                    : "border-border bg-bg-card"
                }`}
              >
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-medium px-3 py-1 rounded-full">
                    추천
                  </div>
                )}
                <h3 className="text-text-primary font-bold text-xl mb-2">
                  {plan.name}
                </h3>
                <div className="mb-6">
                  <span className="text-3xl font-bold text-text-primary">
                    {plan.price}
                  </span>
                  <span className="text-text-muted text-sm">
                    {plan.priceNote}
                  </span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2 text-text-secondary text-sm"
                    >
                      <Check
                        size={16}
                        className="text-primary mt-0.5 flex-shrink-0"
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/search"
                  className={`block text-center py-3 rounded-xl font-medium text-sm transition-colors ${
                    plan.highlighted
                      ? "bg-primary hover:bg-primary-dark text-white"
                      : "bg-bg-card-hover hover:bg-border border border-border text-text-secondary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Enterprise */}
          <div className="mt-8 bg-bg-card border border-border rounded-2xl p-8 text-center">
            <h3 className="text-xl font-bold text-text-primary mb-2">
              Enterprise
            </h3>
            <p className="text-text-secondary mb-6">
              대규모 팀을 위한 맞춤형 플랜. 검색 횟수, 경쟁사 수, 팀원 수 모두
              협의 가능합니다.
            </p>
            <Link
              href="mailto:support@snipit.im"
              className="inline-block bg-bg-card-hover hover:bg-border border border-border text-text-secondary px-8 py-3 rounded-xl font-medium text-sm transition-colors"
            >
              문의하기
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

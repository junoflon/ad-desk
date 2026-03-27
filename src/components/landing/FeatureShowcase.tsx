import { Search, BarChart3, Layout } from "lucide-react";

const showcases = [
  {
    icon: Search,
    tag: "AI 검색",
    title: "이미지 검색 & 카피라이팅 검색",
    description:
      "화이트 톤 패브릭 커튼, 할인 강조한 올영세일 화장품 광고, '절대 하지마' 카피가 포함된 광고 등 자연어로 검색하세요.",
    features: [
      "이미지 유사도 기반 검색",
      "카피 텍스트 의미 검색",
      "색상·무드 기반 필터링",
    ],
    gradient: "from-primary/20 to-primary/5",
    accentColor: "text-primary",
    bgAccent: "bg-primary/10",
  },
  {
    icon: BarChart3,
    tag: "모니터링",
    title: "경쟁사 자동 모니터링 & 대시보드",
    description:
      "브랜드를 등록하면 기간 내 광고가 자동으로 수집됩니다. 게재 히스토리와 운영 패턴을 차트로 분석하세요.",
    features: [
      "자동 광고 수집 및 알림",
      "게재 히스토리 타임라인",
      "운영 패턴 통계 차트",
    ],
    gradient: "from-accent/20 to-accent/5",
    accentColor: "text-accent",
    bgAccent: "bg-accent/10",
  },
  {
    icon: Layout,
    tag: "보드",
    title: "콘텐츠 보드 & 추천 광고 큐레이션",
    description:
      "저장 시 성과 정보가 자동으로 포함됩니다. AI가 매일 맞춤 광고를 추천하고, 유사 이미지 탐색으로 인사이트를 얻으세요.",
    features: [
      "성과 정보 자동 첨부",
      "AI 추천 광고 매일 업데이트",
      "유사 이미지 탐색 기능",
    ],
    gradient: "from-primary/20 to-accent/10",
    accentColor: "text-primary",
    bgAccent: "bg-primary/10",
  },
];

export default function FeatureShowcase() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium mb-3">FEATURES</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary">
            핵심 기능을 자세히 살펴보세요
          </h2>
        </div>

        <div className="space-y-8">
          {showcases.map((item, i) => (
            <div
              key={item.tag}
              className={`bg-gradient-to-r ${item.gradient} border border-border rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row gap-8 items-center ${
                i % 2 === 1 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* Text content */}
              <div className="flex-1">
                <div
                  className={`inline-flex items-center gap-2 ${item.bgAccent} rounded-full px-3 py-1 mb-4`}
                >
                  <item.icon size={14} className={item.accentColor} />
                  <span className={`text-sm font-medium ${item.accentColor}`}>
                    {item.tag}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
                  {item.title}
                </h3>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  {item.description}
                </p>
                <ul className="space-y-3">
                  {item.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-center gap-3 text-text-secondary text-sm"
                    >
                      <div
                        className={`w-5 h-5 rounded-full ${item.bgAccent} flex items-center justify-center flex-shrink-0`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.accentColor === "text-primary"
                              ? "bg-primary"
                              : "bg-accent"
                          }`}
                        />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Visual placeholder */}
              <div className="flex-1 w-full">
                <div className="bg-bg-card border border-border rounded-2xl aspect-[4/3] flex items-center justify-center">
                  <div className="text-center">
                    <item.icon
                      size={48}
                      className={`${item.accentColor} mx-auto mb-3 opacity-30`}
                    />
                    <p className="text-text-muted text-sm">
                      {item.tag} 미리보기
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

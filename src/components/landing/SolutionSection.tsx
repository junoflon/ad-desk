import {
  ScanSearch,
  BotMessageSquare,
  Bookmark,
  Palette,
  BarChart3,
  Globe,
} from "lucide-react";

const solutions = [
  {
    category: "찾는 방식을 바꿉니다",
    color: "primary",
    features: [
      {
        icon: ScanSearch,
        title: "이미지·카피·색상 기준 검색",
        desc: "키워드가 아닌, 마케터의 감각으로 검색하세요.",
      },
      {
        icon: Palette,
        title: "업종·포맷·성과·기간 필터",
        desc: "세밀한 필터로 원하는 레퍼런스에 정확히 도달합니다.",
      },
      {
        icon: BotMessageSquare,
        title: "유사 이미지 및 추천 검색어",
        desc: "AI가 비슷한 광고와 관련 키워드를 자동으로 제안합니다.",
      },
    ],
  },
  {
    category: "반복 탐색을 자동화합니다",
    color: "accent",
    features: [
      {
        icon: BarChart3,
        title: "브랜드 단위 자동 모니터링",
        desc: "등록한 브랜드의 신규 광고가 자동으로 수집됩니다.",
      },
      {
        icon: Bookmark,
        title: "꺼진 광고도 자동 저장",
        desc: "종료된 광고도 놓치지 않고 아카이브됩니다.",
      },
      {
        icon: BarChart3,
        title: "경쟁사 운영 패턴 분석",
        desc: "광고 게재 히스토리와 통계를 한눈에 파악합니다.",
      },
    ],
  },
  {
    category: "레퍼런스를 즉시 저장합니다",
    color: "primary",
    features: [
      {
        icon: Bookmark,
        title: "플랫폼 무관 저장",
        desc: "인스타그램, 페이스북 등 어디서든 한 곳에 모읍니다.",
      },
      {
        icon: Bookmark,
        title: "주제별 보드·폴더 분류",
        desc: "프로젝트별, 주제별로 체계적으로 정리하세요.",
      },
      {
        icon: Globe,
        title: "크롬 확장 프로그램",
        desc: "브라우저에서 바로 저장할 수 있는 확장 프로그램을 제공합니다.",
      },
    ],
  },
];

export default function SolutionSection() {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium mb-3">SOLUTION</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            스니핏은 마케터가 원하는 레퍼런스에
            <br />
            가장 정확히 도달하는 새로운 방식을 제시합니다
          </h2>
        </div>

        {/* Solution groups */}
        <div className="space-y-12">
          {solutions.map((group) => (
            <div key={group.category}>
              <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-3">
                <span
                  className={`w-2 h-2 rounded-full ${
                    group.color === "accent" ? "bg-accent" : "bg-primary"
                  }`}
                />
                {group.category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {group.features.map((feature) => (
                  <div
                    key={feature.title}
                    className="bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-1"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl ${
                        group.color === "accent"
                          ? "bg-accent/10"
                          : "bg-primary/10"
                      } flex items-center justify-center mb-4`}
                    >
                      <feature.icon
                        size={20}
                        className={
                          group.color === "accent"
                            ? "text-accent"
                            : "text-primary"
                        }
                      />
                    </div>
                    <h4 className="text-text-primary font-semibold mb-2">
                      {feature.title}
                    </h4>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

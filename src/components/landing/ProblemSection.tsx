import { SearchX, Clock, Eye, FolderOpen } from "lucide-react";

const problems = [
  {
    icon: SearchX,
    title: "검색의 한계",
    desc: "키워드 중심 검색은 마케터가 보고 싶은 무드·카피·포맷을 이해하지 못합니다.",
  },
  {
    icon: Clock,
    title: "지난 광고 접근 불가",
    desc: "종료된 광고는 다시 찾을 수 없고, 어디에도 아카이브되지 않습니다.",
  },
  {
    icon: Eye,
    title: "경쟁사 모니터링 부담",
    desc: "매일 반복적으로 경쟁사 채널을 순회하며 검색하는 건 큰 시간 낭비입니다.",
  },
  {
    icon: FolderOpen,
    title: "레퍼런스 분산",
    desc: "여기저기 흩어진 스크린샷과 링크, 정리되지 않은 레퍼런스 관리의 어려움.",
  },
];

export default function ProblemSection() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium mb-3">PROBLEM</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            레퍼런스를 찾는 일,
            <br />
            생각보다 많은 시간을 빼앗겨요
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            마케터가 매주 레퍼런스 탐색에 쓰는 시간은 평균 5시간 이상입니다.
          </p>
        </div>

        {/* Problem cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem) => (
            <div
              key={problem.title}
              className="bg-bg-card border border-border rounded-2xl p-6 hover:border-border-light transition-colors"
            >
              <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center mb-5">
                <problem.icon size={22} className="text-red-400" />
              </div>
              <h3 className="text-text-primary font-semibold text-lg mb-2">
                {problem.title}
              </h3>
              <p className="text-text-muted text-sm leading-relaxed">
                {problem.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

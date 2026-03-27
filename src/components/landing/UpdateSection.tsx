import Link from "next/link";
import { ArrowRight } from "lucide-react";

const updates = [
  {
    date: "2026.3.23",
    title: "보드 기능 업데이트",
    desc: "저장에서 인사이트 확장까지, 더 강력해진 보드를 만나보세요.",
    tag: "기능 업데이트",
  },
  {
    date: "2026.3.18",
    title: "워크스페이스 구조 개편",
    desc: "팀 단위 협업이 더 쉬워졌습니다. 새로운 워크스페이스를 확인하세요.",
    tag: "기능 업데이트",
  },
  {
    date: "2026.3.4",
    title: "광고 레퍼런스 검색 통합",
    desc: "메타, 인스타그램 광고를 한 곳에서 검색할 수 있습니다.",
    tag: "신규 기능",
  },
];

export default function UpdateSection() {
  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-text-primary">최근 업데이트</h3>
          <Link
            href="/blog"
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            전체보기
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {updates.map((u) => (
            <Link
              href="/blog"
              key={u.title}
              className="bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all hover:-translate-y-1 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  {u.tag}
                </span>
                <span className="text-text-muted text-xs">{u.date}</span>
              </div>
              <h4 className="text-text-primary font-semibold mb-2 group-hover:text-primary transition-colors">
                {u.title}
              </h4>
              <p className="text-text-muted text-sm">{u.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

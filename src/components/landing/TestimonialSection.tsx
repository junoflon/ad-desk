const testimonials = [
  {
    name: "김서영",
    role: "에이전시 마케터 · 4년차",
    content:
      "매번 인스타그램 돌아다니면서 레퍼런스 찾느라 시간 엄청 썼는데, 스니핏으로 검색 퀄리티가 확 올라갔어요.",
  },
  {
    name: "이준혁",
    role: "스타트업 콘텐츠 마케터",
    content:
      "경쟁사 광고를 일일이 캡쳐하고 정리하던 시간이 반 이상 줄었습니다. 자동 모니터링이 진짜 편해요.",
  },
  {
    name: "박하은",
    role: "인하우스 퍼포먼스 마케터 · 3년차",
    content:
      "소재 기획할 때 참고할 만한 광고를 빠르게 찾을 수 있어서, 기획 시간이 크게 단축됐어요.",
  },
  {
    name: "최민재",
    role: "프리랜서 디자이너",
    content:
      "클라이언트한테 레퍼런스 보여줄 때 보드 공유 기능이 정말 유용합니다. 깔끔하게 정리되니까요.",
  },
  {
    name: "정아린",
    role: "브랜드 마케터 · 5년차",
    content:
      "분위기나 무드로 검색할 수 있다는 게 가장 큰 장점이에요. 키워드로는 못 찾던 것들을 찾을 수 있어요.",
  },
  {
    name: "송태호",
    role: "광고 대행사 AE",
    content:
      "제안서 준비할 때 레퍼런스 수집하는 시간이 엄청 줄었어요. 필터로 업종별 광고를 바로 찾을 수 있으니까요.",
  },
];

export default function TestimonialSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-primary text-sm font-medium mb-3">TESTIMONIALS</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
            마케터들의 실제 후기
          </h2>
          <p className="text-text-secondary">
            스니핏을 사용하고 있는 마케터들의 이야기를 들어보세요.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/20 transition-colors"
            >
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                &ldquo;{t.content}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {t.name[0]}
                  </span>
                </div>
                <div>
                  <p className="text-text-primary text-sm font-medium">
                    {t.name}
                  </p>
                  <p className="text-text-muted text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

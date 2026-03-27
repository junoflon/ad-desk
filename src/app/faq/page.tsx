"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApi } from "@/lib/hooks";
import { ChevronDown, Loader2 } from "lucide-react";
import clsx from "clsx";

interface FaqSection {
  category: string;
  items: { q: string; a: string }[];
}

const fallbackFaqs: FaqSection[] = [
  {
    category: "서비스 소개",
    items: [
      {
        q: "스니핏은 어떤 서비스인가요?",
        a: "스니핏은 마케터를 위한 AI 기반 광고 레퍼런스 검색 플랫폼입니다. 이미지, 카피, 분위기 등 자연어로 광고를 검색하고, 경쟁사 광고를 자동으로 모니터링하며, 보드에 레퍼런스를 체계적으로 정리할 수 있습니다.",
      },
      {
        q: "어떤 플랫폼의 광고를 검색할 수 있나요?",
        a: "현재 Meta(Facebook, Instagram) 광고 라이브러리의 광고를 검색할 수 있습니다. 추후 Google, TikTok 등 더 많은 플랫폼을 지원할 예정입니다.",
      },
      {
        q: "AI 검색은 어떻게 작동하나요?",
        a: "스니핏의 AI 검색은 단순 키워드 매칭이 아닌, 이미지의 시각적 유사도와 텍스트의 의미를 이해하여 검색합니다. '화이트 톤 미니멀 화장품 광고'처럼 자연어로 검색하면 AI가 가장 관련성 높은 광고를 찾아드립니다.",
      },
    ],
  },
  {
    category: "요금 및 플랜",
    items: [
      {
        q: "무료로 사용할 수 있나요?",
        a: "네, Free 플랜으로 기본 기능을 무료로 사용할 수 있습니다. 8시간마다 5회 검색, 경쟁사 모니터링 2개가 제공됩니다.",
      },
      {
        q: "플랜은 언제든지 변경할 수 있나요?",
        a: "네, 언제든지 상위 또는 하위 플랜으로 변경할 수 있습니다. 상위 플랜으로 업그레이드 시 즉시 적용되며, 다운그레이드는 다음 결제일부터 적용됩니다.",
      },
    ],
  },
  {
    category: "기능",
    items: [
      {
        q: "경쟁사 모니터링은 어떻게 동작하나요?",
        a: "모니터링하고 싶은 브랜드를 등록하면, 해당 브랜드의 신규 광고가 자동으로 수집됩니다. 광고 게재 히스토리, 운영 패턴 통계도 확인할 수 있습니다.",
      },
      {
        q: "보드는 팀원과 공유할 수 있나요?",
        a: "네, 보드를 팀원과 공유하거나 공개 링크를 생성하여 외부에 공유할 수 있습니다. Basic 플랜 이상에서 팀 협업 기능을 사용할 수 있습니다.",
      },
      {
        q: "종료된 광고도 볼 수 있나요?",
        a: "네, 스니핏은 한번 수집된 광고는 종료 후에도 아카이브하여 보관합니다. 경쟁사 모니터링 중 수집된 광고나 보드에 저장된 광고는 언제든지 다시 확인할 수 있습니다.",
      },
    ],
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const { data: apiFaqs, loading } = useApi<FaqSection[]>("/api/faq");
  const faqs = apiFaqs || fallbackFaqs;

  const toggleItem = (key: string) => {
    setOpenItems((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-bg-dark">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-text-primary mb-4">FAQ</h1>
            <p className="text-text-secondary text-lg">
              자주 묻는 질문을 확인해보세요
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          )}

          <div className="space-y-10">
            {faqs.map((section) => (
              <div key={section.category}>
                <h2 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                  {section.category}
                </h2>
                <div className="space-y-2">
                  {section.items.map((item) => {
                    const key = `${section.category}-${item.q}`;
                    const isOpen = openItems.has(key);
                    return (
                      <div
                        key={key}
                        className="bg-bg-card border border-border rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full flex items-center justify-between p-4 text-left"
                        >
                          <span className="text-text-primary text-sm font-medium pr-4">
                            {item.q}
                          </span>
                          <ChevronDown
                            size={18}
                            className={clsx(
                              "text-text-muted flex-shrink-0 transition-transform",
                              isOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-4 pb-4">
                            <p className="text-text-secondary text-sm leading-relaxed">
                              {item.a}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

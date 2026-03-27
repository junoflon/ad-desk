"use client";

import { useState } from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const sampleQueries = [
    "화이트 톤 미니멀 화장품 광고",
    "할인 강조 식품 배너",
    "감성적인 브랜드 영상 광고",
  ];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8">
          <Sparkles size={14} className="text-primary" />
          <span className="text-primary text-sm font-medium">
            AI 기반 광고 레퍼런스 플랫폼
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary leading-tight mb-6">
          찾고싶을 때 찾아지는
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            콘텐츠 레퍼런스
          </span>
          , 스니핏
        </h1>

        {/* Sub headline */}
        <p className="text-text-secondary text-lg sm:text-xl max-w-2xl mx-auto mb-4">
          그 릴스 분명 봤는데... 도무지 찾을 수가 없어요
        </p>
        <p className="text-text-muted text-base max-w-xl mx-auto mb-10">
          이미지, 카피, 분위기로 검색하고 경쟁사 광고를 자동으로 모니터링하세요.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-6">
          <div className="relative flex items-center bg-bg-card border border-border rounded-2xl p-2 focus-within:border-primary/50 transition-colors">
            <Search size={20} className="text-text-muted ml-4" />
            <input
              type="text"
              placeholder="어떤 광고 레퍼런스를 찾고 계신가요?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-4 py-3 outline-none text-base"
            />
            <Link
              href={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
              className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-xl font-medium text-sm transition-colors flex items-center gap-2"
            >
              검색
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Sample queries */}
        <div className="flex flex-wrap justify-center gap-2 mb-16">
          {sampleQueries.map((query) => (
            <button
              key={query}
              onClick={() => setSearchQuery(query)}
              className="text-text-muted hover:text-text-secondary bg-bg-card hover:bg-bg-card-hover border border-border rounded-full px-4 py-1.5 text-sm transition-colors"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            {
              label: "AI 검색",
              desc: "머릿속 콘텐츠를 찾아내는",
              color: "from-primary to-primary-light",
            },
            {
              label: "경쟁사 모니터링",
              desc: "자동으로 쌓이는",
              color: "from-accent to-accent-dark",
            },
            {
              label: "광고 보드",
              desc: "주목할 레퍼런스를 모아보는",
              color: "from-primary to-accent",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors group"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-4 mx-auto opacity-80 group-hover:opacity-100 transition-opacity`}
              >
                <Search size={18} className="text-white" />
              </div>
              <p className="text-text-muted text-sm mb-1">{item.desc}</p>
              <p className="text-text-primary font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

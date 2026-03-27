"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import {
  Search,
  SlidersHorizontal,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  X,
  ChevronDown,
} from "lucide-react";
import {
  mockAds,
  categories,
  platforms,
  formats,
  sortOptions,
  type MockAd,
} from "@/lib/mockData";
import clsx from "clsx";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [selectedFormat, setSelectedFormat] = useState("전체");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAd, setSelectedAd] = useState<MockAd | null>(null);

  const filteredAds = useMemo(() => {
    let result = [...mockAds];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        (ad) =>
          ad.brand.toLowerCase().includes(q) ||
          ad.copyText.toLowerCase().includes(q) ||
          ad.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "전체") {
      result = result.filter((ad) => ad.category === selectedCategory);
    }
    if (selectedPlatform !== "전체") {
      result = result.filter((ad) => ad.platform === selectedPlatform);
    }
    if (selectedFormat !== "전체") {
      result = result.filter((ad) => ad.format === selectedFormat);
    }

    result.sort((a, b) => {
      if (sortBy === "likes") return b.likes - a.likes;
      if (sortBy === "comments") return b.comments - a.comments;
      return (
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
      );
    });

    return result;
  }, [query, selectedCategory, selectedPlatform, selectedFormat, sortBy]);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-bg-dark">
        {/* Search Bar */}
        <div className="sticky top-16 z-40 bg-bg-dark/95 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex gap-3">
              <div className="flex-1 relative flex items-center bg-bg-card border border-border rounded-xl focus-within:border-primary/50 transition-colors">
                <Search size={18} className="text-text-muted ml-4" />
                <input
                  type="text"
                  placeholder="이미지, 카피, 분위기로 검색해보세요..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-3 py-3 outline-none text-sm"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="mr-3 text-text-muted hover:text-text-secondary"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors",
                  showFilters
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "bg-bg-card border-border text-text-secondary hover:border-border-light"
                )}
              >
                <SlidersHorizontal size={16} />
                필터
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-4 space-y-4">
                {/* Category */}
                <div>
                  <p className="text-text-muted text-xs mb-2">업종</p>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={clsx(
                          "px-3 py-1.5 rounded-lg text-xs transition-colors",
                          selectedCategory === cat
                            ? "bg-primary text-white"
                            : "bg-bg-card border border-border text-text-muted hover:text-text-secondary"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-6">
                  {/* Platform */}
                  <div>
                    <p className="text-text-muted text-xs mb-2">플랫폼</p>
                    <div className="flex gap-2">
                      {platforms.map((p) => (
                        <button
                          key={p}
                          onClick={() => setSelectedPlatform(p)}
                          className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs transition-colors",
                            selectedPlatform === p
                              ? "bg-primary text-white"
                              : "bg-bg-card border border-border text-text-muted hover:text-text-secondary"
                          )}
                        >
                          {p === "전체" ? p : p.charAt(0).toUpperCase() + p.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Format */}
                  <div>
                    <p className="text-text-muted text-xs mb-2">포맷</p>
                    <div className="flex gap-2">
                      {formats.map((f) => (
                        <button
                          key={f}
                          onClick={() => setSelectedFormat(f)}
                          className={clsx(
                            "px-3 py-1.5 rounded-lg text-xs transition-colors",
                            selectedFormat === f
                              ? "bg-primary text-white"
                              : "bg-bg-card border border-border text-text-muted hover:text-text-secondary"
                          )}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Sort & Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-text-muted text-sm">
              <span className="text-text-primary font-medium">
                {filteredAds.length}
              </span>
              개의 광고 레퍼런스
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-bg-card border border-border rounded-lg px-4 py-2 pr-8 text-text-secondary text-sm outline-none focus:border-primary/50"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
              />
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredAds.map((ad) => (
              <div
                key={ad.id}
                onClick={() => setSelectedAd(ad)}
                className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer group"
              >
                {/* Image */}
                <div className="relative aspect-square bg-bg-card-hover">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-2">
                        <span className="text-2xl font-bold text-primary/50">
                          {ad.brand[0]}
                        </span>
                      </div>
                      <p className="text-text-muted text-xs">{ad.format}</p>
                    </div>
                  </div>

                  {/* Status badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className={clsx(
                        "text-xs px-2 py-0.5 rounded-full",
                        ad.isActive
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      )}
                    >
                      {ad.isActive ? "게재중" : "종료"}
                    </span>
                  </div>

                  {/* Save button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/50"
                  >
                    <Bookmark size={14} className="text-white" />
                  </button>

                  {/* Platform badge */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
                      {ad.platform}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        {ad.brand[0]}
                      </span>
                    </div>
                    <span className="text-text-primary text-sm font-medium">
                      {ad.brand}
                    </span>
                    <span className="text-text-muted text-xs ml-auto">
                      {ad.category}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm line-clamp-2 mb-3">
                    {ad.copyText}
                  </p>
                  <div className="flex items-center gap-4 text-text-muted text-xs">
                    <span className="flex items-center gap-1">
                      <Heart size={12} />
                      {ad.likes.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle size={12} />
                      {ad.comments.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Share2 size={12} />
                      {ad.shares.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAds.length === 0 && (
            <div className="text-center py-20">
              <Search size={48} className="text-text-muted mx-auto mb-4 opacity-30" />
              <p className="text-text-secondary mb-2">검색 결과가 없습니다</p>
              <p className="text-text-muted text-sm">
                다른 키워드나 필터를 사용해보세요.
              </p>
            </div>
          )}
        </div>

        {/* Ad Detail Modal */}
        {selectedAd && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setSelectedAd(null)}
          >
            <div
              className="bg-bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-bold">
                      {selectedAd.brand[0]}
                    </span>
                  </div>
                  <div>
                    <p className="text-text-primary font-medium">
                      {selectedAd.brand}
                    </p>
                    <p className="text-text-muted text-xs">
                      {selectedAd.platform} · {selectedAd.category}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAd(null)}
                  className="text-text-muted hover:text-text-secondary"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal body */}
              <div className="p-6">
                {/* Image placeholder */}
                <div className="aspect-video bg-bg-card-hover rounded-xl flex items-center justify-center mb-6">
                  <div className="text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
                      <span className="text-3xl font-bold text-primary/50">
                        {selectedAd.brand[0]}
                      </span>
                    </div>
                    <p className="text-text-muted text-sm">
                      {selectedAd.format} 광고
                    </p>
                  </div>
                </div>

                {/* Copy */}
                <div className="mb-6">
                  <p className="text-text-muted text-xs mb-1">광고 카피</p>
                  <p className="text-text-primary">{selectedAd.copyText}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-bg-dark rounded-xl p-4 text-center">
                    <Heart
                      size={18}
                      className="text-red-400 mx-auto mb-1"
                    />
                    <p className="text-text-primary font-semibold">
                      {selectedAd.likes.toLocaleString()}
                    </p>
                    <p className="text-text-muted text-xs">좋아요</p>
                  </div>
                  <div className="bg-bg-dark rounded-xl p-4 text-center">
                    <MessageCircle
                      size={18}
                      className="text-blue-400 mx-auto mb-1"
                    />
                    <p className="text-text-primary font-semibold">
                      {selectedAd.comments.toLocaleString()}
                    </p>
                    <p className="text-text-muted text-xs">댓글</p>
                  </div>
                  <div className="bg-bg-dark rounded-xl p-4 text-center">
                    <Share2
                      size={18}
                      className="text-green-400 mx-auto mb-1"
                    />
                    <p className="text-text-primary font-semibold">
                      {selectedAd.shares.toLocaleString()}
                    </p>
                    <p className="text-text-muted text-xs">공유</p>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">게재 기간</span>
                    <span className="text-text-secondary">
                      {selectedAd.startDate}
                      {selectedAd.endDate
                        ? ` ~ ${selectedAd.endDate}`
                        : " ~ 진행중"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">상태</span>
                    <span
                      className={
                        selectedAd.isActive
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {selectedAd.isActive ? "게재중" : "종료됨"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">포맷</span>
                    <span className="text-text-secondary">
                      {selectedAd.format}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <button className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2">
                    <Bookmark size={16} />
                    보드에 저장
                  </button>
                  <button className="px-4 py-3 rounded-xl border border-border text-text-secondary hover:border-border-light transition-colors">
                    <Share2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-dark flex items-center justify-center">
          <p className="text-text-muted">로딩중...</p>
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}

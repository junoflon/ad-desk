"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/components/layout/Header";
import AdCard from "@/components/common/AdCard";
import AdDetailModal from "@/components/common/AdDetailModal";
import BoardSelectModal from "@/components/common/BoardSelectModal";
import SearchBar from "@/components/search/SearchBar";
import FilterPanel from "@/components/search/FilterPanel";
import { useApi } from "@/lib/hooks";
import { Search, ChevronDown, Loader2, Sparkles, Tag, Download } from "lucide-react";
import { sortOptions } from "@/lib/mockData";
import type { Ad } from "@/components/common/AdCard";

interface AdsResponse {
  ads: Ad[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AiSearchResponse {
  ads: Ad[];
  query: string;
  analysis: {
    keywords: string[];
    intent: string;
    suggested: string[];
    isAiPowered: boolean;
  };
  total: number;
}

interface BoardItem {
  id: string;
  name: string;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [selectedFormat, setSelectedFormat] = useState("전체");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [page, setPage] = useState(1);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [savingAdId, setSavingAdId] = useState<string | null>(null);

  // AI search state
  const [aiResult, setAiResult] = useState<AiSearchResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeQuery, setActiveQuery] = useState(initialQuery);

  // 일반 검색 (필터/정렬/페이지네이션 - 검색어 없거나 브라우징 모드)
  const apiUrl = !activeQuery
    ? `/api/ads?page=${page}&limit=20&sort=${sortBy}${
        selectedCategory !== "전체" ? `&category=${encodeURIComponent(selectedCategory)}` : ""
      }${selectedPlatform !== "전체" ? `&platform=${encodeURIComponent(selectedPlatform)}` : ""
      }${selectedFormat !== "전체" ? `&format=${encodeURIComponent(selectedFormat)}` : ""}`
    : null;

  const { data: browseData, loading: browseLoading } = useApi<AdsResponse>(apiUrl, [
    page, sortBy, selectedCategory, selectedPlatform, selectedFormat,
  ]);

  const { data: boards } = useApi<BoardItem[]>("/api/boards");

  // AI 검색 실행
  const runAiSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setAiResult(null);
      setActiveQuery("");
      return;
    }

    setAiLoading(true);
    setActiveQuery(q);

    try {
      const res = await fetch("/api/ads/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: q,
          filters: {
            category: selectedCategory,
            platform: selectedPlatform,
            format: selectedFormat,
          },
        }),
      });
      const json = await res.json();
      if (json.success) {
        setAiResult(json.data);
      }
    } catch {
      // 폴백: AI 실패 시 일반 검색으로
      setActiveQuery("");
      setAiResult(null);
    } finally {
      setAiLoading(false);
    }
  }, [selectedCategory, selectedPlatform, selectedFormat]);

  // 디바운스 검색
  useEffect(() => {
    const timer = setTimeout(() => {
      runAiSearch(query);
    }, 500);
    return () => clearTimeout(timer);
  }, [query, runAiSearch]);

  // 필터 변경 시 재검색
  useEffect(() => {
    if (activeQuery) {
      runAiSearch(activeQuery);
    } else {
      setPage(1);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, selectedPlatform, selectedFormat]);

  // 추천 키워드 클릭
  const handleSuggestedClick = (keyword: string) => {
    setQuery(keyword);
  };

  // 결과 결정: AI 검색 결과 or 일반 브라우징
  const isAiMode = !!activeQuery;
  const ads = isAiMode ? (aiResult?.ads || []) : (browseData?.ads || []);
  const loading = isAiMode ? aiLoading : browseLoading;
  const totalCount = isAiMode ? (aiResult?.total || 0) : (browseData?.pagination?.total || ads.length);
  const pagination = !isAiMode ? browseData?.pagination : null;
  const analysis = aiResult?.analysis;

  const handleSaveToBoard = useCallback(
    async (boardId: string) => {
      if (!savingAdId) return;
      await fetch(`/api/boards/${boardId}/ads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adId: savingAdId }),
      });
      setShowBoardModal(false);
      setSavingAdId(null);
    },
    [savingAdId]
  );

  const openBoardModal = (adId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavingAdId(adId);
    setShowBoardModal(true);
  };

  return (
    <>
      <Header />
      <main className="pt-14 min-h-screen bg-bg-dark">
        {/* Search Bar */}
        <div className="sticky top-14 z-40 bg-bg-dark/95 backdrop-blur-xl border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <SearchBar
              query={query}
              onQueryChange={setQuery}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />
            {showFilters && (
              <FilterPanel
                selectedCategory={selectedCategory}
                selectedPlatform={selectedPlatform}
                selectedFormat={selectedFormat}
                onCategoryChange={setSelectedCategory}
                onPlatformChange={setSelectedPlatform}
                onFormatChange={setSelectedFormat}
              />
            )}
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

          {/* AI Analysis Banner */}
          {analysis && !loading && (
            <div className="mb-6 bg-bg-card border border-border rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Sparkles size={16} className="text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-text-secondary text-sm">
                    {analysis.isAiPowered && (
                      <span className="text-primary font-medium">AI </span>
                    )}
                    {analysis.intent}
                  </p>

                  {/* 검색 키워드 태그 */}
                  {analysis.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {analysis.keywords.map((kw, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 text-xs bg-bg-card-hover text-text-muted px-2 py-0.5 rounded"
                        >
                          <Tag size={10} />
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* 추천 검색어 */}
                  {analysis.suggested.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="text-text-muted text-xs">추천:</span>
                      {analysis.suggested.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSuggestedClick(s)}
                          className="text-xs text-primary hover:text-primary-light bg-primary/5 hover:bg-primary/10 px-2.5 py-1 rounded-lg transition-colors"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Sort & Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-text-muted text-sm">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  {isAiMode ? "AI 분석 중..." : "검색중..."}
                </span>
              ) : (
                <>
                  <span className="text-text-primary font-medium">{totalCount}</span>
                  개의 결과
                </>
              )}
            </p>
            <div className="flex items-center gap-3">
              {ads.length > 0 && (
                <a
                  href={`/api/export?type=ads${activeQuery ? `&q=${encodeURIComponent(activeQuery)}` : ""}`}
                  className="flex items-center gap-1.5 text-text-muted hover:text-text-secondary text-xs transition-colors"
                  download
                >
                  <Download size={13} />
                  CSV
                </a>
              )}
            {!isAiMode && (
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
            )}
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onClick={() => setSelectedAd(ad)}
                onSave={openBoardModal}
              />
            ))}
          </div>

          {/* Pagination (browse mode only) */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 rounded-lg border border-border text-text-secondary text-sm hover:border-border-light disabled:opacity-30 transition-colors"
              >
                이전
              </button>
              <span className="text-text-muted text-sm px-3">
                {page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-border text-text-secondary text-sm hover:border-border-light disabled:opacity-30 transition-colors"
              >
                다음
              </button>
            </div>
          )}

          {!loading && ads.length === 0 && (
            <div className="text-center py-20">
              <Search size={48} className="text-text-muted mx-auto mb-4 opacity-30" />
              <p className="text-text-secondary mb-2">검색 결과가 없습니다</p>
              <p className="text-text-muted text-sm">
                다른 키워드나 필터를 사용해보세요.
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
        {selectedAd && (
          <AdDetailModal
            ad={selectedAd}
            onClose={() => setSelectedAd(null)}
            onSaveToBoard={() => {
              setSavingAdId(selectedAd.id);
              setShowBoardModal(true);
            }}
          />
        )}

        {showBoardModal && (
          <BoardSelectModal
            boards={boards || []}
            onSelect={handleSaveToBoard}
            onClose={() => {
              setShowBoardModal(false);
              setSavingAdId(null);
            }}
          />
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

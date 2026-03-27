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
import { Search, ChevronDown, Loader2 } from "lucide-react";
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

interface BoardItem {
  id: string;
  name: string;
}

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedPlatform, setSelectedPlatform] = useState("전체");
  const [selectedFormat, setSelectedFormat] = useState("전체");
  const [sortBy, setSortBy] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [page, setPage] = useState(1);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [savingAdId, setSavingAdId] = useState<string | null>(null);

  const apiUrl = `/api/ads?page=${page}&limit=20&sort=${sortBy}${
    searchQuery ? `&q=${encodeURIComponent(searchQuery)}` : ""
  }${selectedCategory !== "전체" ? `&category=${encodeURIComponent(selectedCategory)}` : ""}${
    selectedPlatform !== "전체" ? `&platform=${encodeURIComponent(selectedPlatform)}` : ""
  }${selectedFormat !== "전체" ? `&format=${encodeURIComponent(selectedFormat)}` : ""}`;

  const { data, loading } = useApi<AdsResponse>(apiUrl, [
    page, sortBy, searchQuery, selectedCategory, selectedPlatform, selectedFormat,
  ]);

  const { data: boards } = useApi<BoardItem[]>("/api/boards");

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(query);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedPlatform, selectedFormat, sortBy]);

  const ads = data?.ads || [];
  const pagination = data?.pagination;

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
      <main className="pt-20 min-h-screen bg-bg-dark">
        {/* Search Bar */}
        <div className="sticky top-16 z-40 bg-bg-dark/95 backdrop-blur-xl border-b border-border">
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
          {/* Sort & Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-text-muted text-sm">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  검색중...
                </span>
              ) : (
                <>
                  <span className="text-text-primary font-medium">
                    {pagination?.total || ads.length}
                  </span>
                  개의 광고 레퍼런스
                </>
              )}
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
            {ads.map((ad) => (
              <AdCard
                key={ad.id}
                ad={ad}
                onClick={() => setSelectedAd(ad)}
                onSave={openBoardModal}
              />
            ))}
          </div>

          {/* Pagination */}
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

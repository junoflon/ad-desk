"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { useApi } from "@/lib/hooks";
import {
  Search,
  FolderOpen,
  Radar,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Ad {
  id: string;
  brand: string;
  copyText?: string;
  platform: string;
  category?: string;
  likes: number;
  startDate?: string;
}

interface AdsResponse {
  ads: Ad[];
  pagination: { total: number };
}

interface Board {
  id: string;
  name: string;
  _count?: { boardAds: number };
}

interface MonitorBrand {
  id: string;
  brandName: string;
  platform: string;
  _count?: { monitorAds: number };
}

export default function DashboardPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const { data: adsData } = useApi<AdsResponse>("/api/ads?limit=5&sort=latest");
  const { data: boards } = useApi<Board[]>("/api/boards");
  const { data: monitors } = useApi<MonitorBrand[]>("/api/monitor");

  const recentAds = adsData?.ads || [];
  const totalAds = adsData?.pagination?.total || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <>
      <Header />
      <main className="pt-14 min-h-screen bg-bg-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quick Search */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="relative">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                placeholder="브랜드, 업종, 키워드로 광고 검색..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-bg-card border border-border rounded-xl pl-11 pr-4 py-3.5 text-text-primary placeholder:text-text-muted text-sm outline-none focus:border-primary/50 transition-colors"
              />
            </div>
          </form>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Link
              href="/search"
              className="bg-bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Search size={17} className="text-primary" />
                </div>
                <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-text-primary">{totalAds}</p>
              <p className="text-text-muted text-xs mt-0.5">수집된 광고</p>
            </Link>
            <Link
              href="/board"
              className="bg-bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FolderOpen size={17} className="text-accent" />
                </div>
                <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-text-primary">{boards?.length || 0}</p>
              <p className="text-text-muted text-xs mt-0.5">보드</p>
            </Link>
            <Link
              href="/monitor"
              className="bg-bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 rounded-lg bg-orange-500/10 flex items-center justify-center">
                  <Radar size={17} className="text-orange-400" />
                </div>
                <ArrowRight size={14} className="text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-2xl font-bold text-text-primary">{monitors?.length || 0}</p>
              <p className="text-text-muted text-xs mt-0.5">모니터링 브랜드</p>
            </Link>
          </div>

          {/* Recent Ads */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-text-primary font-semibold text-sm flex items-center gap-2">
                <TrendingUp size={15} className="text-primary" />
                최근 수집된 광고
              </h2>
              <Link href="/search" className="text-text-muted text-xs hover:text-primary transition-colors">
                전체보기
              </Link>
            </div>
            {recentAds.length > 0 ? (
              <div className="space-y-2">
                {recentAds.map((ad) => (
                  <div
                    key={ad.id}
                    className="bg-bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4 hover:border-border-light transition-colors cursor-pointer"
                    onClick={() => router.push("/search")}
                  >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-primary/60">{ad.brand[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-text-primary text-sm font-medium">{ad.brand}</span>
                        <span className="text-text-muted text-xs">{ad.platform}</span>
                        {ad.category && (
                          <span className="text-text-muted text-xs hidden sm:inline">· {ad.category}</span>
                        )}
                      </div>
                      <p className="text-text-muted text-xs truncate mt-0.5">{ad.copyText}</p>
                    </div>
                    <span className="text-text-muted text-xs flex-shrink-0 hidden sm:block">
                      {ad.startDate ? new Date(ad.startDate).toLocaleDateString("ko-KR") : ""}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-bg-card border border-border rounded-xl p-8 text-center">
                <p className="text-text-muted text-sm">아직 수집된 광고가 없습니다</p>
                <p className="text-text-muted text-xs mt-1">Seed 데이터를 추가하거나 광고를 검색해보세요</p>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {boards && boards.length > 0 && (
              <div>
                <h2 className="text-text-primary font-semibold text-sm mb-3 flex items-center gap-2">
                  <FolderOpen size={15} className="text-accent" />
                  최근 보드
                </h2>
                <div className="space-y-2">
                  {boards.slice(0, 3).map((board) => (
                    <Link
                      key={board.id}
                      href="/board"
                      className="block bg-bg-card border border-border rounded-xl px-4 py-3 hover:border-border-light transition-colors"
                    >
                      <p className="text-text-primary text-sm">{board.name}</p>
                      <p className="text-text-muted text-xs mt-0.5">
                        {board._count?.boardAds || 0}개 광고
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            {monitors && monitors.length > 0 && (
              <div>
                <h2 className="text-text-primary font-semibold text-sm mb-3 flex items-center gap-2">
                  <Radar size={15} className="text-orange-400" />
                  모니터링 중
                </h2>
                <div className="space-y-2">
                  {monitors.slice(0, 3).map((brand) => (
                    <Link
                      key={brand.id}
                      href="/monitor"
                      className="block bg-bg-card border border-border rounded-xl px-4 py-3 hover:border-border-light transition-colors"
                    >
                      <p className="text-text-primary text-sm">{brand.brandName}</p>
                      <p className="text-text-muted text-xs mt-0.5">
                        {brand.platform} · {brand._count?.monitorAds || 0}개 수집
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

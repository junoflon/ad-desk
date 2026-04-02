"use client";

import { useState, useCallback } from "react";
import Header from "@/components/layout/Header";
import { useApi, useMutation } from "@/lib/hooks";
import {
  Plus,
  Trash2,
  Loader2,
  Aperture,
  ChevronDown,
  ChevronRight,
  Heart,
  MessageCircle,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Users,
  Image as ImageIcon,
  FolderOpen,
  X,
} from "lucide-react";

interface TopPost {
  shortcode: string;
  imageUrl: string | null;
  likes: number;
  caption: string | null;
}

interface BrandData {
  id: string;
  brandName: string;
  instagramHandle: string | null;
  isActive: boolean;
  lastCrawledAt: string | null;
  postCount: number;
  topPosts: TopPost[];
  followers: number;
  followerChange: number;
  postsCount: number;
}

interface FolderData {
  id: string;
  name: string;
  color: string;
  brands: BrandData[];
  totalPosts: number;
}

interface FoldersResponse {
  folders: FolderData[];
  stats: { totalBrands: number; totalPosts: number; totalFolders: number };
}

interface Category {
  id: string;
  name: string;
  color: string;
}

interface InsightData {
  brandName: string;
  insight: string;
  topPatterns: string[];
  recommendation: string;
}

export default function InstagramPage() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [handleInput, setHandleInput] = useState("");
  const [brandNameInput, setBrandNameInput] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [expandedFolder, setExpandedFolder] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandData | null>(null);
  const [showPostsModal, setShowPostsModal] = useState(false);
  const [collectingBrand, setCollectingBrand] = useState<string | null>(null);
  const [insightBrand, setInsightBrand] = useState<string | null>(null);

  const { data: foldersData, loading } = useApi<FoldersResponse>(
    `/api/instagram/folders?_=${refreshKey}`,
    [refreshKey]
  );
  const { data: categories } = useApi<Category[]>(
    `/api/monitor/categories?_=${refreshKey}`,
    [refreshKey]
  );
  const { data: insight, loading: insightLoading } = useApi<InsightData>(
    insightBrand ? `/api/instagram/insights?brandId=${insightBrand}` : null,
    [insightBrand]
  );

  const { mutate: trackBrand, loading: tracking } = useMutation("/api/instagram/track");

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleAddBrand = useCallback(async () => {
    if (!handleInput.trim()) return;
    await trackBrand({
      instagramHandle: handleInput.trim(),
      brandName: brandNameInput.trim() || undefined,
      categoryId: selectedCategoryId || undefined,
    });
    setHandleInput("");
    setBrandNameInput("");
    setSelectedCategoryId("");
    setShowAddModal(false);
    refresh();
  }, [handleInput, brandNameInput, selectedCategoryId, trackBrand]);

  const handleDeleteBrand = async (brandId: string) => {
    await fetch("/api/instagram/track", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ brandId }),
    });
    refresh();
  };

  const handleCollect = async (brandId: string) => {
    setCollectingBrand(brandId);
    try {
      await fetch("/api/instagram/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandId }),
      });
      refresh();
    } finally {
      setCollectingBrand(null);
    }
  };

  const handleCollectAll = async () => {
    setCollectingBrand("all");
    try {
      await fetch("/api/instagram/collect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      refresh();
    } finally {
      setCollectingBrand(null);
    }
  };

  const stats = foldersData?.stats;
  const folders = foldersData?.folders || [];

  return (
    <>
      <Header />
      <main className="pt-14 min-h-screen bg-bg-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
                <Aperture size={24} className="text-pink-500" />
                Instagram Tracking
              </h1>
              <p className="text-text-muted text-sm mt-1">
                브랜드별 인스타그램 콘텐츠를 추적하고 경쟁사를 분석하세요
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCollectAll}
                disabled={collectingBrand === "all"}
                className="flex items-center gap-1.5 bg-bg-card border border-border text-text-secondary px-3 py-2 rounded-xl text-sm hover:border-border-light transition-colors disabled:opacity-50"
              >
                <RefreshCw size={15} className={collectingBrand === "all" ? "animate-spin" : ""} />
                전체 수집
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Plus size={15} />
                브랜드 추가
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <p className="text-text-muted text-xs mb-1 flex items-center gap-1">
                <FolderOpen size={12} /> 폴더
              </p>
              <p className="text-xl font-bold text-text-primary">{stats?.totalFolders || 0}</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <p className="text-text-muted text-xs mb-1 flex items-center gap-1">
                <Users size={12} /> 브랜드
              </p>
              <p className="text-xl font-bold text-text-primary">{stats?.totalBrands || 0}</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <p className="text-text-muted text-xs mb-1 flex items-center gap-1">
                <ImageIcon size={12} /> 게시물
              </p>
              <p className="text-xl font-bold text-text-primary">{stats?.totalPosts || 0}</p>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-pink-500" />
            </div>
          )}

          {/* Folders */}
          <div className="space-y-4">
            {folders.map((folder) => (
              <div key={folder.id} className="bg-bg-card border border-border rounded-xl overflow-hidden">
                {/* Folder Header */}
                <button
                  onClick={() =>
                    setExpandedFolder(expandedFolder === folder.id ? null : folder.id)
                  }
                  className="w-full flex items-center justify-between p-4 hover:bg-bg-card-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: folder.color }}
                    />
                    <h3 className="text-text-primary font-semibold">{folder.name}</h3>
                    <span className="text-text-muted text-xs">
                      {folder.brands.length}개 브랜드 · {folder.totalPosts}개 게시물
                    </span>
                  </div>
                  {expandedFolder === folder.id ? (
                    <ChevronDown size={16} className="text-text-muted" />
                  ) : (
                    <ChevronRight size={16} className="text-text-muted" />
                  )}
                </button>

                {/* Brands Grid */}
                {expandedFolder === folder.id && (
                  <div className="border-t border-border p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {folder.brands.map((brand) => (
                        <BrandCard
                          key={brand.id}
                          brand={brand}
                          onCollect={() => handleCollect(brand.id)}
                          onDelete={() => handleDeleteBrand(brand.id)}
                          onViewPosts={() => {
                            setSelectedBrand(brand);
                            setShowPostsModal(true);
                          }}
                          onInsight={() => setInsightBrand(brand.id)}
                          collecting={collectingBrand === brand.id}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {!loading && folders.length === 0 && (
            <div className="text-center py-20">
              <Aperture size={48} className="text-text-muted mx-auto mb-4 opacity-30" />
              <p className="text-text-secondary mb-2">아직 트래킹 중인 브랜드가 없어요</p>
              <p className="text-text-muted text-sm mb-4">
                브랜드의 인스타그램 핸들을 추가하면 게시물을 자동으로 수집해요.
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-2 rounded-xl text-sm font-medium"
              >
                <Plus size={15} />
                첫 브랜드 추가하기
              </button>
            </div>
          )}

          {/* AI Insight Panel */}
          {insightBrand && (
            <div className="fixed bottom-0 left-0 right-0 z-40 bg-bg-card border-t border-border p-6 shadow-2xl">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-text-primary font-bold flex items-center gap-2">
                    <Sparkles size={16} className="text-yellow-400" />
                    AI 인사이트 — {insight?.brandName}
                  </h3>
                  <button onClick={() => setInsightBrand(null)} className="text-text-muted hover:text-text-primary">
                    <X size={18} />
                  </button>
                </div>
                {insightLoading ? (
                  <div className="flex items-center gap-2 text-text-muted text-sm">
                    <Loader2 size={14} className="animate-spin" /> 분석 중...
                  </div>
                ) : insight ? (
                  <div className="space-y-3">
                    <p className="text-text-secondary text-sm">{insight.insight}</p>
                    {insight.topPatterns.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {insight.topPatterns.map((p, i) => (
                          <span
                            key={i}
                            className="bg-pink-500/10 text-pink-400 text-xs px-2 py-1 rounded-lg"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    )}
                    {insight.recommendation && (
                      <p className="text-text-muted text-xs italic">{insight.recommendation}</p>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>

        {/* Add Brand Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-text-primary font-bold text-lg mb-5 flex items-center gap-2">
                <Aperture size={20} className="text-pink-500" />
                브랜드 추가
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-text-muted text-xs mb-1 block">인스타그램 핸들 *</label>
                  <input
                    type="text"
                    placeholder="@oliveyoung_official"
                    value={handleInput}
                    onChange={(e) => setHandleInput(e.target.value)}
                    className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-pink-500/50"
                  />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1 block">브랜드명 (선택)</label>
                  <input
                    type="text"
                    placeholder="올리브영"
                    value={brandNameInput}
                    onChange={(e) => setBrandNameInput(e.target.value)}
                    className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-pink-500/50"
                  />
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1 block">폴더 (선택)</label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => setSelectedCategoryId(e.target.value)}
                    className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-secondary text-sm outline-none focus:border-pink-500/50"
                  >
                    <option value="">폴더 선택</option>
                    {categories?.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-text-secondary text-sm hover:bg-bg-card-hover transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleAddBrand}
                  disabled={tracking || !handleInput.trim()}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white text-sm font-medium transition-colors disabled:opacity-50"
                >
                  {tracking ? "추가중..." : "트래킹 시작"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts Modal */}
        {showPostsModal && selectedBrand && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setShowPostsModal(false)}
          >
            <div
              className="bg-bg-card border border-border rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-text-primary font-bold text-lg flex items-center gap-2">
                  <Aperture size={18} className="text-pink-500" />
                  @{selectedBrand.instagramHandle}
                </h2>
                <button
                  onClick={() => setShowPostsModal(false)}
                  className="text-text-muted hover:text-text-primary"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {selectedBrand.topPosts.map((post) => (
                  <a
                    key={post.shortcode}
                    href={`https://www.instagram.com/p/${post.shortcode}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative aspect-square bg-bg-dark rounded-lg overflow-hidden group"
                  >
                    {post.imageUrl ? (
                      <img
                        src={post.imageUrl}
                        alt={post.caption || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={24} className="text-text-muted" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <span className="text-white text-xs flex items-center gap-1">
                        <Heart size={12} /> {post.likes}
                      </span>
                    </div>
                  </a>
                ))}
              </div>

              {selectedBrand.topPosts.length === 0 && (
                <p className="text-text-muted text-sm text-center py-8">
                  아직 수집된 게시물이 없어요. 수집 버튼을 눌러보세요.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}

function BrandCard({
  brand,
  onCollect,
  onDelete,
  onViewPosts,
  onInsight,
  collecting,
}: {
  brand: BrandData;
  onCollect: () => void;
  onDelete: () => void;
  onViewPosts: () => void;
  onInsight: () => void;
  collecting: boolean;
}) {
  return (
    <div className="bg-bg-dark border border-border rounded-xl p-4">
      {/* Brand Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
            <Aperture size={18} className="text-pink-400" />
          </div>
          <div>
            <h4 className="text-text-primary font-semibold text-sm">{brand.brandName}</h4>
            <a
              href={`https://www.instagram.com/${brand.instagramHandle}/`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted text-xs hover:text-pink-400 flex items-center gap-0.5"
            >
              @{brand.instagramHandle}
              <ExternalLink size={10} />
            </a>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onInsight}
            className="p-1.5 text-text-muted hover:text-yellow-400 transition-colors"
            title="AI 인사이트"
          >
            <Sparkles size={14} />
          </button>
          <button
            onClick={onCollect}
            disabled={collecting}
            className="p-1.5 text-text-muted hover:text-primary transition-colors"
            title="수집"
          >
            <RefreshCw size={14} className={collecting ? "animate-spin" : ""} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
            title="삭제"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1 text-text-secondary">
          <Users size={12} />
          <span>{brand.followers.toLocaleString()}</span>
          {brand.followerChange !== 0 && (
            <span
              className={`flex items-center ${brand.followerChange > 0 ? "text-green-400" : "text-red-400"}`}
            >
              {brand.followerChange > 0 ? (
                <TrendingUp size={10} />
              ) : (
                <TrendingDown size={10} />
              )}
              {brand.followerChange > 0 ? "+" : ""}
              {brand.followerChange.toLocaleString()}
            </span>
          )}
        </div>
        <div className="text-text-muted">
          {brand.postCount}개 게시물
        </div>
        {brand.lastCrawledAt && (
          <div className="text-text-muted">
            마지막 수집: {new Date(brand.lastCrawledAt).toLocaleDateString("ko-KR")}
          </div>
        )}
      </div>

      {/* Top Posts Thumbnails */}
      {brand.topPosts.length > 0 && (
        <button onClick={onViewPosts} className="w-full">
          <div className="grid grid-cols-3 gap-1.5">
            {brand.topPosts.slice(0, 3).map((post) => (
              <div
                key={post.shortcode}
                className="relative aspect-square bg-bg-card rounded-lg overflow-hidden"
              >
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon size={16} className="text-text-muted" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 p-1">
                  <span className="text-white text-[10px] flex items-center gap-0.5">
                    <Heart size={8} /> {post.likes.toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </button>
      )}
    </div>
  );
}

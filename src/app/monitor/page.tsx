"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useApi, useMutation } from "@/lib/hooks";
import {
  Plus,
  Trash2,
  Loader2,
  FolderOpen,
  ChevronRight,
} from "lucide-react";

interface Brand {
  id: string;
  brandName: string;
  platform: string;
  _count?: { monitorAds: number };
}

interface Category {
  id: string;
  name: string;
  color: string;
  brands: Brand[];
}

const COLORS = [
  "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#EC4899", "#06B6D4", "#84CC16",
];

export default function MonitorPage() {
  const [showCatModal, setShowCatModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [catName, setCatName] = useState("");
  const [catColor, setCatColor] = useState(COLORS[0]);
  const [brandName, setBrandName] = useState("");
  const [brandPlatform, setBrandPlatform] = useState("instagram");
  const [brandCategoryId, setBrandCategoryId] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: categories, loading } = useApi<Category[]>(
    `/api/monitor/categories?_=${refreshKey}`,
    [refreshKey]
  );
  const { mutate: createCategory, loading: creatingCat } = useMutation("/api/monitor/categories");
  const { mutate: createBrand, loading: creatingBrand } = useMutation("/api/monitor");

  const refresh = () => setRefreshKey((k) => k + 1);

  const handleCreateCategory = useCallback(async () => {
    if (!catName.trim()) return;
    await createCategory({ name: catName, color: catColor });
    setCatName("");
    setShowCatModal(false);
    refresh();
  }, [catName, catColor, createCategory]);

  const handleCreateBrand = useCallback(async () => {
    if (!brandName.trim()) return;
    await createBrand({
      brandName: brandName.trim(),
      platform: brandPlatform,
      categoryId: brandCategoryId || undefined,
    });
    setBrandName("");
    setShowBrandModal(false);
    refresh();
  }, [brandName, brandPlatform, brandCategoryId, createBrand]);

  const handleDeleteCategory = async (id: string) => {
    await fetch(`/api/monitor/categories/${id}`, { method: "DELETE" });
    refresh();
  };

  const handleDeleteBrand = async (id: string) => {
    await fetch(`/api/monitor/${id}`, { method: "DELETE" });
    refresh();
  };

  const totalBrands = categories?.reduce((s, c) => s + c.brands.length, 0) || 0;

  return (
    <>
      <Header />
      <main className="pt-14 min-h-screen bg-bg-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">모니터링</h1>
              <p className="text-text-muted text-sm mt-1">
                카테고리를 만들고 브랜드를 등록하여 추적하세요
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowBrandModal(true)}
                className="flex items-center gap-1.5 bg-bg-card border border-border text-text-secondary px-3 py-2 rounded-xl text-sm hover:border-border-light transition-colors"
              >
                <Plus size={15} />
                브랜드
              </button>
              <button
                onClick={() => setShowCatModal(true)}
                className="flex items-center gap-1.5 bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                <Plus size={15} />
                카테고리
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <p className="text-text-muted text-xs mb-1">카테고리</p>
              <p className="text-xl font-bold text-text-primary">{categories?.length || 0}</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-4">
              <p className="text-text-muted text-xs mb-1">브랜드</p>
              <p className="text-xl font-bold text-text-primary">{totalBrands}</p>
            </div>
            <div className="bg-bg-card border border-border rounded-xl p-4 hidden sm:block">
              <p className="text-text-muted text-xs mb-1">수집 광고</p>
              <p className="text-xl font-bold text-text-primary">
                {categories?.reduce(
                  (s, c) => s + c.brands.reduce((bs, b) => bs + (b._count?.monitorAds || 0), 0),
                  0
                ) || 0}
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          )}

          {/* Category List */}
          <div className="space-y-4">
            {categories?.map((cat) => (
              <div key={cat.id} className="bg-bg-card border border-border rounded-xl overflow-hidden">
                {/* Category Header → 클릭 시 대시보드 */}
                <Link
                  href={`/monitor/${cat.id}`}
                  className="flex items-center justify-between p-4 hover:bg-bg-card-hover transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: cat.color }}
                    />
                    <h3 className="text-text-primary font-semibold">{cat.name}</h3>
                    <span className="text-text-muted text-xs">{cat.brands.length}개 브랜드</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeleteCategory(cat.id);
                      }}
                      className="p-1.5 text-text-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ChevronRight size={16} className="text-text-muted" />
                  </div>
                </Link>

                {/* Brands */}
                {cat.brands.length > 0 && (
                  <div className="border-t border-border px-4 py-2">
                    {cat.brands.map((brand) => (
                      <div
                        key={brand.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary/60">
                              {brand.brandName[0]}
                            </span>
                          </div>
                          <span className="text-text-secondary text-sm">{brand.brandName}</span>
                          <span className="text-text-muted text-xs">{brand.platform}</span>
                          <span className="text-text-muted text-xs">
                            {brand._count?.monitorAds || 0}건
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteBrand(brand.id)}
                          className="p-1 text-text-muted hover:text-red-400 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {!loading && (!categories || categories.length === 0) && (
            <div className="text-center py-20">
              <FolderOpen size={48} className="text-text-muted mx-auto mb-4 opacity-30" />
              <p className="text-text-secondary mb-2">카테고리가 없습니다</p>
              <p className="text-text-muted text-sm">카테고리를 추가하고 브랜드를 등록해보세요.</p>
            </div>
          )}
        </div>

        {/* Create Category Modal */}
        {showCatModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowCatModal(false)}>
            <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-text-primary font-bold text-lg mb-5">카테고리 추가</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="예: 뷰티, 경쟁사, F&B"
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50"
                />
                <div>
                  <p className="text-text-muted text-xs mb-2">색상</p>
                  <div className="flex gap-2">
                    {COLORS.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCatColor(c)}
                        className="w-7 h-7 rounded-full border-2 transition-all"
                        style={{
                          backgroundColor: c,
                          borderColor: catColor === c ? "#fff" : "transparent",
                          transform: catColor === c ? "scale(1.15)" : "scale(1)",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCatModal(false)} className="flex-1 py-3 rounded-xl border border-border text-text-secondary text-sm hover:bg-bg-card-hover transition-colors">취소</button>
                <button onClick={handleCreateCategory} disabled={creatingCat || !catName.trim()} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors disabled:opacity-50">
                  {creatingCat ? "생성중..." : "만들기"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Brand Modal */}
        {showBrandModal && (
          <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4" onClick={() => setShowBrandModal(false)}>
            <div className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-text-primary font-bold text-lg mb-5">브랜드 추가</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="브랜드명"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50"
                />
                <select
                  value={brandPlatform}
                  onChange={(e) => setBrandPlatform(e.target.value)}
                  className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-secondary text-sm outline-none focus:border-primary/50"
                >
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="meta">Meta (전체)</option>
                </select>
                <select
                  value={brandCategoryId}
                  onChange={(e) => setBrandCategoryId(e.target.value)}
                  className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-secondary text-sm outline-none focus:border-primary/50"
                >
                  <option value="">카테고리 선택 (선택)</option>
                  {categories?.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowBrandModal(false)} className="flex-1 py-3 rounded-xl border border-border text-text-secondary text-sm hover:bg-bg-card-hover transition-colors">취소</button>
                <button onClick={handleCreateBrand} disabled={creatingBrand || !brandName.trim()} className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors disabled:opacity-50">
                  {creatingBrand ? "추가중..." : "추가"}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

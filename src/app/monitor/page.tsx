"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  Plus,
  TrendingUp,
  TrendingDown,
  Eye,
  BarChart3,
  ExternalLink,
} from "lucide-react";

interface MonitorBrand {
  id: string;
  name: string;
  platform: string;
  totalAds: number;
  activeAds: number;
  newAdsThisWeek: number;
  trend: "up" | "down" | "stable";
  lastDetected: string;
}

const mockBrands: MonitorBrand[] = [
  {
    id: "1",
    name: "올리브영",
    platform: "instagram",
    totalAds: 156,
    activeAds: 23,
    newAdsThisWeek: 5,
    trend: "up",
    lastDetected: "2시간 전",
  },
  {
    id: "2",
    name: "무신사",
    platform: "facebook",
    totalAds: 89,
    activeAds: 14,
    newAdsThisWeek: 3,
    trend: "stable",
    lastDetected: "6시간 전",
  },
  {
    id: "3",
    name: "쿠팡",
    platform: "instagram",
    totalAds: 234,
    activeAds: 45,
    newAdsThisWeek: 12,
    trend: "up",
    lastDetected: "1시간 전",
  },
  {
    id: "4",
    name: "배달의민족",
    platform: "facebook",
    totalAds: 67,
    activeAds: 8,
    newAdsThisWeek: 1,
    trend: "down",
    lastDetected: "1일 전",
  },
];

export default function MonitorPage() {
  const [showAddModal, setShowAddModal] = useState(false);

  const totalActive = mockBrands.reduce((sum, b) => sum + b.activeAds, 0);
  const totalNew = mockBrands.reduce((sum, b) => sum + b.newAdsThisWeek, 0);

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">
                경쟁사 모니터링
              </h1>
              <p className="text-text-muted text-sm mt-1">
                등록한 브랜드의 광고를 자동으로 수집하고 분석합니다
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={16} />
              브랜드 추가
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
            <div className="bg-bg-card border border-border rounded-2xl p-5">
              <p className="text-text-muted text-xs mb-1">모니터링 브랜드</p>
              <p className="text-2xl font-bold text-text-primary">
                {mockBrands.length}
              </p>
            </div>
            <div className="bg-bg-card border border-border rounded-2xl p-5">
              <p className="text-text-muted text-xs mb-1">현재 게재중 광고</p>
              <p className="text-2xl font-bold text-text-primary">
                {totalActive}
              </p>
            </div>
            <div className="bg-bg-card border border-border rounded-2xl p-5">
              <p className="text-text-muted text-xs mb-1">이번 주 신규 광고</p>
              <p className="text-2xl font-bold text-accent">{totalNew}</p>
            </div>
            <div className="bg-bg-card border border-border rounded-2xl p-5">
              <p className="text-text-muted text-xs mb-1">총 수집 광고</p>
              <p className="text-2xl font-bold text-text-primary">
                {mockBrands.reduce((sum, b) => sum + b.totalAds, 0)}
              </p>
            </div>
          </div>

          {/* Brand list */}
          <div className="space-y-4">
            {mockBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {brand.name[0]}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-text-primary font-semibold">
                          {brand.name}
                        </h3>
                        <span className="text-xs bg-bg-card-hover text-text-muted px-2 py-0.5 rounded-full">
                          {brand.platform}
                        </span>
                      </div>
                      <p className="text-text-muted text-sm mt-0.5">
                        마지막 감지: {brand.lastDetected}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-8">
                    <div className="text-center">
                      <p className="text-text-primary font-semibold">
                        {brand.totalAds}
                      </p>
                      <p className="text-text-muted text-xs">총 광고</p>
                    </div>
                    <div className="text-center">
                      <p className="text-text-primary font-semibold">
                        {brand.activeAds}
                      </p>
                      <p className="text-text-muted text-xs">게재중</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1">
                        <p className="text-accent font-semibold">
                          +{brand.newAdsThisWeek}
                        </p>
                        {brand.trend === "up" && (
                          <TrendingUp size={14} className="text-green-400" />
                        )}
                        {brand.trend === "down" && (
                          <TrendingDown size={14} className="text-red-400" />
                        )}
                      </div>
                      <p className="text-text-muted text-xs">이번 주</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg bg-bg-card-hover text-text-muted hover:text-text-secondary transition-colors">
                        <Eye size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-bg-card-hover text-text-muted hover:text-text-secondary transition-colors">
                        <BarChart3 size={16} />
                      </button>
                      <button className="p-2 rounded-lg bg-bg-card-hover text-text-muted hover:text-text-secondary transition-colors">
                        <ExternalLink size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mobile stats */}
                <div className="sm:hidden flex items-center gap-4 mt-4 pt-4 border-t border-border">
                  <div className="flex-1 text-center">
                    <p className="text-text-primary font-semibold text-sm">
                      {brand.totalAds}
                    </p>
                    <p className="text-text-muted text-xs">총 광고</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-text-primary font-semibold text-sm">
                      {brand.activeAds}
                    </p>
                    <p className="text-text-muted text-xs">게재중</p>
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-accent font-semibold text-sm">
                      +{brand.newAdsThisWeek}
                    </p>
                    <p className="text-text-muted text-xs">이번 주</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Brand Modal */}
        {showAddModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setShowAddModal(false)}
          >
            <div
              className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-text-primary font-bold text-lg mb-6">
                브랜드 추가
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-text-secondary text-sm block mb-1.5">
                    브랜드명
                  </label>
                  <input
                    type="text"
                    placeholder="예: 올리브영"
                    className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-text-secondary text-sm block mb-1.5">
                    플랫폼
                  </label>
                  <select className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-secondary text-sm outline-none focus:border-primary/50">
                    <option>Instagram</option>
                    <option>Facebook</option>
                    <option>Meta (전체)</option>
                  </select>
                </div>
                <div>
                  <label className="text-text-secondary text-sm block mb-1.5">
                    브랜드 URL (선택)
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/oliveyoung"
                    className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-bg-card-hover transition-colors"
                >
                  취소
                </button>
                <button className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors">
                  추가하기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

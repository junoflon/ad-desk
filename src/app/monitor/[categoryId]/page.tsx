"use client";

import { useState, use } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { useApi } from "@/lib/hooks";
import {
  ArrowLeft,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Film,
  Image as ImageIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

interface StatsData {
  category: { id: string; name: string; color: string };
  period: { from: string; to: string };
  totalAds: number;
  contentTypeRatio: { name: string; value: number }[];
  dailyUploads: { date: string; count: number }[];
  followerTrends: {
    brandName: string;
    current: number;
    change: number;
    history: { date: string; followers: number }[];
  }[];
  brandStats: { brandName: string; platform: string; adsCount: number }[];
}

const ChartTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-card border border-border rounded-lg px-3 py-2 text-xs">
      <p className="text-text-primary">{label}: <span className="font-medium">{payload[0].value.toLocaleString()}</span></p>
    </div>
  );
};

const CONTENT_LABELS: Record<string, string> = {
  post: "게시물",
  reels: "릴스",
  story: "스토리",
  carousel: "캐러셀",
};

export default function CategoryDashboard({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = use(params);

  // 기간 선택
  const today = new Date().toISOString().slice(0, 10);
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(thirtyDaysAgo);
  const [to, setTo] = useState(today);

  const { data: stats, loading } = useApi<StatsData>(
    `/api/monitor/categories/${categoryId}/stats?from=${from}&to=${to}`,
    [from, to]
  );

  return (
    <>
      <Header />
      <main className="pt-14 min-h-screen bg-bg-dark">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back + Title */}
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/monitor"
              className="p-2 rounded-lg bg-bg-card border border-border text-text-muted hover:text-text-primary transition-colors"
            >
              <ArrowLeft size={16} />
            </Link>
            {stats?.category && (
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stats.category.color }}
                />
                <h1 className="text-xl font-bold text-text-primary">
                  {stats.category.name}
                </h1>
              </div>
            )}
          </div>

          {/* Date Range Picker */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <div className="flex items-center gap-2 bg-bg-card border border-border rounded-xl px-3 py-2">
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="bg-transparent text-text-primary text-sm outline-none"
              />
              <span className="text-text-muted text-sm">~</span>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="bg-transparent text-text-primary text-sm outline-none"
              />
            </div>
            <div className="flex gap-1.5">
              {[
                { label: "7일", days: 7 },
                { label: "30일", days: 30 },
                { label: "90일", days: 90 },
              ].map(({ label, days }) => (
                <button
                  key={days}
                  onClick={() => {
                    setFrom(new Date(Date.now() - days * 86400000).toISOString().slice(0, 10));
                    setTo(today);
                  }}
                  className="px-3 py-1.5 rounded-lg text-xs bg-bg-card border border-border text-text-muted hover:text-text-primary hover:border-border-light transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          )}

          {stats && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="bg-bg-card border border-border rounded-xl p-4">
                  <p className="text-text-muted text-xs mb-1">총 콘텐츠</p>
                  <p className="text-xl font-bold text-text-primary">{stats.totalAds}</p>
                </div>
                <div className="bg-bg-card border border-border rounded-xl p-4">
                  <p className="text-text-muted text-xs mb-1">브랜드</p>
                  <p className="text-xl font-bold text-text-primary">{stats.brandStats.length}</p>
                </div>
                <div className="bg-bg-card border border-border rounded-xl p-4">
                  <p className="text-text-muted text-xs mb-1">게시물</p>
                  <p className="text-xl font-bold text-text-primary">
                    {stats.contentTypeRatio.find((c) => c.name === "post")?.value || 0}
                  </p>
                </div>
                <div className="bg-bg-card border border-border rounded-xl p-4">
                  <p className="text-text-muted text-xs mb-1">릴스</p>
                  <p className="text-xl font-bold text-text-primary">
                    {stats.contentTypeRatio.find((c) => c.name === "reels")?.value || 0}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                {/* 일별 업로드 */}
                <div className="bg-bg-card border border-border rounded-xl p-4">
                  <h3 className="text-text-secondary text-xs font-medium mb-3">업로드 일자별 추이</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={stats.dailyUploads}>
                      <defs>
                        <linearGradient id="colorUpload" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={stats.category.color} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={stats.category.color} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" tick={{ fill: "#5E5E76", fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip content={<ChartTooltip />} />
                      <Area type="monotone" dataKey="count" stroke={stats.category.color} strokeWidth={2} fill="url(#colorUpload)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* 게시물/릴스 비율 */}
                <div className="bg-bg-card border border-border rounded-xl p-4">
                  <h3 className="text-text-secondary text-xs font-medium mb-3">콘텐츠 유형 비율</h3>
                  <div className="flex items-center gap-6">
                    <ResponsiveContainer width={140} height={140}>
                      <PieChart>
                        <Pie
                          data={stats.contentTypeRatio}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={60}
                          strokeWidth={0}
                        >
                          {stats.contentTypeRatio.map((_, i) => (
                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex flex-col gap-3">
                      {stats.contentTypeRatio.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-text-secondary text-sm flex items-center gap-1">
                            {item.name === "reels" ? <Film size={13} /> : <ImageIcon size={13} />}
                            {CONTENT_LABELS[item.name] || item.name}
                          </span>
                          <span className="text-text-primary text-sm font-medium">{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 팔로워 증감 */}
              {stats.followerTrends.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-text-secondary text-xs font-medium mb-3 flex items-center gap-1.5">
                    <Users size={14} />
                    팔로워 증감
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {stats.followerTrends.map((brand) => (
                      <div key={brand.brandName} className="bg-bg-card border border-border rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-text-primary text-sm font-medium">{brand.brandName}</span>
                          <div className="flex items-center gap-1">
                            {brand.change > 0 ? (
                              <TrendingUp size={14} className="text-green-400" />
                            ) : brand.change < 0 ? (
                              <TrendingDown size={14} className="text-red-400" />
                            ) : (
                              <Minus size={14} className="text-text-muted" />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                brand.change > 0 ? "text-green-400" : brand.change < 0 ? "text-red-400" : "text-text-muted"
                              }`}
                            >
                              {brand.change > 0 ? "+" : ""}{brand.change.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <p className="text-text-primary text-lg font-bold mb-2">
                          {brand.current.toLocaleString()}
                        </p>
                        {brand.history.length > 1 && (
                          <ResponsiveContainer width="100%" height={60}>
                            <AreaChart data={brand.history}>
                              <Area
                                type="monotone"
                                dataKey="followers"
                                stroke={brand.change >= 0 ? "#10B981" : "#EF4444"}
                                strokeWidth={1.5}
                                fill={brand.change >= 0 ? "#10B98120" : "#EF444420"}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 브랜드별 현황 */}
              <div>
                <h3 className="text-text-secondary text-xs font-medium mb-3">브랜드별 콘텐츠 수</h3>
                <div className="bg-bg-card border border-border rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={Math.max(120, stats.brandStats.length * 40)}>
                    <BarChart data={stats.brandStats} layout="vertical">
                      <XAxis type="number" hide />
                      <YAxis
                        type="category"
                        dataKey="brandName"
                        tick={{ fill: "#A1A1B5", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        width={80}
                      />
                      <Tooltip content={<ChartTooltip />} />
                      <Bar dataKey="adsCount" radius={[0, 4, 4, 0]} barSize={18}>
                        {stats.brandStats.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {!loading && !stats && (
            <div className="text-center py-20">
              <p className="text-text-muted">데이터를 불러올 수 없습니다.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

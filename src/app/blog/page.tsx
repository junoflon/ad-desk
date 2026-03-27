"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useApi } from "@/lib/hooks";
import { ArrowRight, Loader2 } from "lucide-react";
import clsx from "clsx";

const blogCategories = [
  "전체",
  "제품스토리",
  "활용 인사이트",
  "온보딩",
  "업데이트",
];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  coverImage?: string;
  publishedAt?: string;
}

const fallbackPosts: BlogPost[] = [
  {
    id: "1",
    title: "보드 기능 업데이트: 저장에서 인사이트 확장까지",
    slug: "board-update",
    excerpt:
      "더 강력해진 보드 기능을 만나보세요. 저장한 광고의 성과 트렌드를 분석하고, AI가 유사 광고를 자동으로 추천합니다.",
    category: "업데이트",
    publishedAt: "2026-03-23",
  },
  {
    id: "2",
    title: "워크스페이스 구조 개편",
    slug: "workspace-restructure",
    excerpt:
      "팀 단위 협업이 더 쉬워졌습니다. 역할 기반 권한 관리와 팀 보드 공유 기능을 확인하세요.",
    category: "업데이트",
    publishedAt: "2026-03-18",
  },
  {
    id: "3",
    title: "광고 레퍼런스 검색 통합 출시",
    slug: "search-launch",
    excerpt:
      "메타, 인스타그램 광고를 한 곳에서 검색할 수 있습니다. AI 기반 자연어 검색으로 원하는 레퍼런스를 빠르게 찾아보세요.",
    category: "제품스토리",
    publishedAt: "2026-03-04",
  },
  {
    id: "4",
    title: "스니핏 시작하기 #1: 첫 검색 해보기",
    slug: "getting-started-1",
    excerpt:
      "스니핏을 처음 사용하시나요? 가장 효과적으로 광고 레퍼런스를 검색하는 방법을 안내합니다.",
    category: "온보딩",
    publishedAt: "2026-02-28",
  },
  {
    id: "5",
    title: "스니핏 시작하기 #2: 경쟁사 모니터링 설정",
    slug: "getting-started-2",
    excerpt:
      "경쟁사 광고를 자동으로 모니터링하는 방법을 단계별로 알려드립니다.",
    category: "온보딩",
    publishedAt: "2026-02-25",
  },
  {
    id: "6",
    title: "스니핏 시작하기 #3: 보드 활용법",
    slug: "getting-started-3",
    excerpt:
      "보드를 활용하여 레퍼런스를 체계적으로 정리하고 팀과 공유하는 방법을 소개합니다.",
    category: "온보딩",
    publishedAt: "2026-02-22",
  },
  {
    id: "7",
    title: "퍼포먼스 마케터의 레퍼런스 활용법",
    slug: "performance-marketer-tips",
    excerpt:
      "성과 데이터와 함께 레퍼런스를 분석하면 소재 기획이 달라집니다. 실전 활용 사례를 공유합니다.",
    category: "활용 인사이트",
    publishedAt: "2026-02-18",
  },
  {
    id: "8",
    title: "에이전시에서 스니핏을 활용하는 5가지 방법",
    slug: "agency-use-cases",
    excerpt:
      "광고 대행사에서 스니핏으로 제안서 준비 시간을 단축하고 클라이언트 소통을 개선하는 방법.",
    category: "활용 인사이트",
    publishedAt: "2026-02-14",
  },
];

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("전체");

  const { data: apiPosts, loading } = useApi<BlogPost[]>(
    `/api/blog${selectedCategory !== "전체" ? `?category=${encodeURIComponent(selectedCategory)}` : ""}`,
    [selectedCategory]
  );

  const posts = apiPosts || fallbackPosts;
  const filteredPosts =
    !apiPosts && selectedCategory !== "전체"
      ? posts.filter((p) => p.category === selectedCategory)
      : posts;

  return (
    <>
      <Header />
      <main className="pt-24 pb-20 min-h-screen bg-bg-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-text-primary mb-4">
              스니핏로그
            </h1>
            <p className="text-text-secondary text-lg">
              스니핏의 업데이트와 활용 인사이트를 확인하세요
            </p>
          </div>

          {/* Coffee chat banner */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6 mb-10 text-center">
            <p className="text-text-primary font-medium mb-1">
              스니핏 팀에게 다양한 의견을 들려주세요
            </p>
            <p className="text-text-muted text-sm">
              커피챗 참여 시 Basic 플랜 1개월 이용권을 드립니다
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mb-8">
            {blogCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm transition-colors",
                  selectedCategory === cat
                    ? "bg-primary text-white"
                    : "bg-bg-card border border-border text-text-muted hover:text-text-secondary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-bg-card border border-border rounded-2xl p-6 hover:border-primary/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {post.category}
                  </span>
                  <span className="text-text-muted text-xs">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                <h2 className="text-text-primary font-semibold text-lg mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                  {post.title}
                  <ArrowRight
                    size={16}
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </h2>
                <p className="text-text-muted text-sm leading-relaxed">
                  {post.excerpt}
                </p>
              </article>
            ))}
          </div>

          {!loading && filteredPosts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-text-muted">해당 카테고리의 글이 없습니다.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";

import { useState } from "react";
import Header from "@/components/layout/Header";
import {
  Plus,
  MoreHorizontal,
  FolderOpen,
  Grid3X3,
  Lock,
  Globe,
} from "lucide-react";

interface Board {
  id: string;
  name: string;
  description: string;
  adCount: number;
  isPublic: boolean;
  folder?: string;
  updatedAt: string;
}

const mockBoards: Board[] = [
  {
    id: "1",
    name: "2026 봄 캠페인 레퍼런스",
    description: "봄 시즌 캠페인에 참고할 광고 레퍼런스 모음",
    adCount: 24,
    isPublic: false,
    folder: "프로젝트",
    updatedAt: "2시간 전",
  },
  {
    id: "2",
    name: "경쟁사 뷰티 광고",
    description: "올리브영, 쿠팡 등 뷰티 카테고리 경쟁사 광고",
    adCount: 56,
    isPublic: false,
    folder: "경쟁사",
    updatedAt: "1일 전",
  },
  {
    id: "3",
    name: "미니멀 디자인 모음",
    description: "화이트톤 미니멀한 디자인의 광고 레퍼런스",
    adCount: 18,
    isPublic: true,
    updatedAt: "3일 전",
  },
  {
    id: "4",
    name: "카피라이팅 영감",
    description: "인상적인 카피라이팅이 돋보이는 광고",
    adCount: 42,
    isPublic: false,
    folder: "인사이트",
    updatedAt: "5일 전",
  },
  {
    id: "5",
    name: "비디오 광고 트렌드",
    description: "최근 트렌드를 반영한 비디오 광고 모음",
    adCount: 31,
    isPublic: true,
    updatedAt: "1주 전",
  },
];

export default function BoardPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const folders = [...new Set(mockBoards.filter((b) => b.folder).map((b) => b.folder))];

  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-bg-dark">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-text-primary">내 보드</h1>
              <p className="text-text-muted text-sm mt-1">
                저장한 광고 레퍼런스를 보드별로 관리하세요
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
            >
              <Plus size={16} />새 보드
            </button>
          </div>

          {/* Folders */}
          {folders.length > 0 && (
            <div className="mb-8">
              <h2 className="text-text-secondary text-sm font-medium mb-3">
                폴더
              </h2>
              <div className="flex flex-wrap gap-3">
                {folders.map((folder) => (
                  <button
                    key={folder}
                    className="flex items-center gap-2 bg-bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-text-secondary hover:border-primary/30 transition-colors"
                  >
                    <FolderOpen size={16} className="text-primary" />
                    {folder}
                    <span className="text-text-muted text-xs">
                      (
                      {mockBoards.filter((b) => b.folder === folder).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Boards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {mockBoards.map((board) => (
              <div
                key={board.id}
                className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer group"
              >
                {/* Cover */}
                <div className="aspect-[2/1] bg-bg-card-hover flex items-center justify-center">
                  <Grid3X3
                    size={32}
                    className="text-text-muted opacity-20"
                  />
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-text-primary font-semibold group-hover:text-primary transition-colors">
                      {board.name}
                    </h3>
                    <button className="text-text-muted hover:text-text-secondary">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  <p className="text-text-muted text-sm mb-3 line-clamp-1">
                    {board.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-text-muted">
                    <div className="flex items-center gap-3">
                      <span>{board.adCount}개 광고</span>
                      <span className="flex items-center gap-1">
                        {board.isPublic ? (
                          <>
                            <Globe size={12} /> 공개
                          </>
                        ) : (
                          <>
                            <Lock size={12} /> 비공개
                          </>
                        )}
                      </span>
                    </div>
                    <span>{board.updatedAt}</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Create new board card */}
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-bg-card border border-dashed border-border rounded-2xl flex flex-col items-center justify-center py-16 hover:border-primary/30 transition-colors group"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                <Plus size={20} className="text-primary" />
              </div>
              <p className="text-text-muted text-sm group-hover:text-text-secondary transition-colors">
                새 보드 만들기
              </p>
            </button>
          </div>
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <div
              className="bg-bg-card border border-border rounded-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-text-primary font-bold text-lg mb-6">
                새 보드 만들기
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-text-secondary text-sm block mb-1.5">
                    보드 이름
                  </label>
                  <input
                    type="text"
                    placeholder="예: 2026 봄 캠페인 레퍼런스"
                    className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50"
                  />
                </div>
                <div>
                  <label className="text-text-secondary text-sm block mb-1.5">
                    설명 (선택)
                  </label>
                  <textarea
                    placeholder="보드에 대한 간단한 설명을 입력하세요"
                    rows={3}
                    className="w-full bg-bg-dark border border-border rounded-xl px-4 py-3 text-text-primary text-sm placeholder:text-text-muted outline-none focus:border-primary/50 resize-none"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">공개 보드</span>
                  <button className="w-10 h-6 bg-border rounded-full relative">
                    <div className="w-4 h-4 bg-text-muted rounded-full absolute top-1 left-1 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-3 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-bg-card-hover transition-colors"
                >
                  취소
                </button>
                <button className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors">
                  만들기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}

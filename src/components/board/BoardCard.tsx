"use client";

import { MoreHorizontal, Grid3X3, Lock, Globe } from "lucide-react";

interface BoardCardProps {
  board: {
    id: string;
    name: string;
    description?: string;
    adCount?: number;
    isPublic?: boolean;
    updatedAt?: string;
    _count?: { boardAds: number };
  };
  onClick?: () => void;
}

export default function BoardCard({ board, onClick }: BoardCardProps) {
  const adCount = board.adCount ?? board._count?.boardAds ?? 0;
  const isPublic = board.isPublic ?? false;

  return (
    <div
      onClick={onClick}
      className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer group"
    >
      {/* Cover */}
      <div className="aspect-[2/1] bg-bg-card-hover flex items-center justify-center">
        <Grid3X3 size={32} className="text-text-muted opacity-20" />
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-text-primary font-semibold group-hover:text-primary transition-colors">
            {board.name}
          </h3>
          <button
            onClick={(e) => e.stopPropagation()}
            className="text-text-muted hover:text-text-secondary"
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
        {board.description && (
          <p className="text-text-muted text-sm mb-3 line-clamp-1">
            {board.description}
          </p>
        )}
        <div className="flex items-center justify-between text-xs text-text-muted">
          <div className="flex items-center gap-3">
            <span>{adCount}개 광고</span>
            <span className="flex items-center gap-1">
              {isPublic ? (
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
          {board.updatedAt && <span>{board.updatedAt}</span>}
        </div>
      </div>
    </div>
  );
}

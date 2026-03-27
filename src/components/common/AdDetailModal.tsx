"use client";

import { Heart, MessageCircle, Share2, Bookmark, X } from "lucide-react";
import type { Ad } from "./AdCard";

interface AdDetailModalProps {
  ad: Ad;
  onClose: () => void;
  onSaveToBoard?: () => void;
}

export default function AdDetailModal({ ad, onClose, onSaveToBoard }: AdDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-card border border-border rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold">{ad.brand[0]}</span>
            </div>
            <div>
              <p className="text-text-primary font-medium">{ad.brand}</p>
              <p className="text-text-muted text-xs">
                {ad.platform} · {ad.category}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Image placeholder */}
          <div className="aspect-video bg-bg-card-hover rounded-xl flex items-center justify-center mb-6">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-3xl font-bold text-primary/50">
                  {ad.brand[0]}
                </span>
              </div>
              <p className="text-text-muted text-sm">{ad.format} 광고</p>
            </div>
          </div>

          {/* Copy */}
          <div className="mb-6">
            <p className="text-text-muted text-xs mb-1">광고 카피</p>
            <p className="text-text-primary">{ad.copyText}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-bg-dark rounded-xl p-4 text-center">
              <Heart size={18} className="text-red-400 mx-auto mb-1" />
              <p className="text-text-primary font-semibold">
                {ad.likes.toLocaleString()}
              </p>
              <p className="text-text-muted text-xs">좋아요</p>
            </div>
            <div className="bg-bg-dark rounded-xl p-4 text-center">
              <MessageCircle size={18} className="text-blue-400 mx-auto mb-1" />
              <p className="text-text-primary font-semibold">
                {ad.comments.toLocaleString()}
              </p>
              <p className="text-text-muted text-xs">댓글</p>
            </div>
            <div className="bg-bg-dark rounded-xl p-4 text-center">
              <Share2 size={18} className="text-green-400 mx-auto mb-1" />
              <p className="text-text-primary font-semibold">
                {ad.shares.toLocaleString()}
              </p>
              <p className="text-text-muted text-xs">공유</p>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-text-muted">게재 기간</span>
              <span className="text-text-secondary">
                {ad.startDate
                  ? new Date(ad.startDate).toLocaleDateString("ko-KR")
                  : "-"}
                {ad.endDate
                  ? ` ~ ${new Date(ad.endDate).toLocaleDateString("ko-KR")}`
                  : " ~ 진행중"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">상태</span>
              <span className={ad.isActive ? "text-green-400" : "text-red-400"}>
                {ad.isActive ? "게재중" : "종료됨"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-text-muted">포맷</span>
              <span className="text-text-secondary">{ad.format}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onSaveToBoard}
              className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Bookmark size={16} />
              보드에 저장
            </button>
            <button className="px-4 py-3 rounded-xl border border-border text-text-secondary hover:border-border-light transition-colors">
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

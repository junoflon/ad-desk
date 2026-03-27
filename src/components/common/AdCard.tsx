"use client";

import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import clsx from "clsx";

export interface Ad {
  id: string;
  platform: string;
  brand: string;
  brandLogo?: string;
  imageUrl: string;
  copyText?: string;
  category?: string;
  format?: string;
  likes: number;
  comments: number;
  shares: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  country?: string;
}

interface AdCardProps {
  ad: Ad;
  onClick?: () => void;
  onSave?: (adId: string, e: React.MouseEvent) => void;
}

export default function AdCard({ ad, onClick, onSave }: AdCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:-translate-y-1 cursor-pointer group"
    >
      {/* Image */}
      <div className="relative aspect-square bg-bg-card-hover">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl font-bold text-primary/50">
                {ad.brand[0]}
              </span>
            </div>
            <p className="text-text-muted text-xs">{ad.format}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className={clsx(
              "text-xs px-2 py-0.5 rounded-full",
              ad.isActive
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            )}
          >
            {ad.isActive ? "게재중" : "종료"}
          </span>
        </div>

        {/* Save button */}
        {onSave && (
          <button
            onClick={(e) => onSave(ad.id, e)}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/50"
          >
            <Bookmark size={14} className="text-white" />
          </button>
        )}

        {/* Platform badge */}
        <div className="absolute bottom-3 left-3">
          <span className="text-xs bg-black/60 text-white px-2 py-0.5 rounded-full">
            {ad.platform}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">
              {ad.brand[0]}
            </span>
          </div>
          <span className="text-text-primary text-sm font-medium">
            {ad.brand}
          </span>
          <span className="text-text-muted text-xs ml-auto">
            {ad.category}
          </span>
        </div>
        <p className="text-text-secondary text-sm line-clamp-2 mb-3">
          {ad.copyText}
        </p>
        <div className="flex items-center gap-4 text-text-muted text-xs">
          <span className="flex items-center gap-1">
            <Heart size={12} />
            {ad.likes.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {ad.comments.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Share2 size={12} />
            {ad.shares.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

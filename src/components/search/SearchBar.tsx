"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

export default function SearchBar({
  query,
  onQueryChange,
  showFilters,
  onToggleFilters,
}: SearchBarProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 relative flex items-center bg-bg-card border border-border rounded-xl focus-within:border-primary/50 transition-colors">
        <Search size={18} className="text-text-muted ml-4" />
        <input
          type="text"
          placeholder="브랜드, 카피, 업종으로 검색해보세요..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted px-3 py-3 outline-none text-sm"
        />
        {query && (
          <button
            onClick={() => onQueryChange("")}
            className="mr-3 text-text-muted hover:text-text-secondary"
          >
            <X size={16} />
          </button>
        )}
      </div>
      <button
        onClick={onToggleFilters}
        className={clsx(
          "flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors",
          showFilters
            ? "bg-primary/10 border-primary/30 text-primary"
            : "bg-bg-card border-border text-text-secondary hover:border-border-light"
        )}
      >
        <SlidersHorizontal size={16} />
        필터
      </button>
    </div>
  );
}

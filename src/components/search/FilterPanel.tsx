"use client";

import clsx from "clsx";
import { categories, platforms, formats } from "@/lib/mockData";

interface FilterPanelProps {
  selectedCategory: string;
  selectedPlatform: string;
  selectedFormat: string;
  onCategoryChange: (v: string) => void;
  onPlatformChange: (v: string) => void;
  onFormatChange: (v: string) => void;
}

export default function FilterPanel({
  selectedCategory,
  selectedPlatform,
  selectedFormat,
  onCategoryChange,
  onPlatformChange,
  onFormatChange,
}: FilterPanelProps) {
  return (
    <div className="mt-4 space-y-4">
      {/* Category */}
      <div>
        <p className="text-text-muted text-xs mb-2">업종</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs transition-colors",
                selectedCategory === cat
                  ? "bg-primary text-white"
                  : "bg-bg-card border border-border text-text-muted hover:text-text-secondary"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Platform */}
        <div>
          <p className="text-text-muted text-xs mb-2">플랫폼</p>
          <div className="flex gap-2">
            {platforms.map((p) => (
              <button
                key={p}
                onClick={() => onPlatformChange(p)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs transition-colors",
                  selectedPlatform === p
                    ? "bg-primary text-white"
                    : "bg-bg-card border border-border text-text-muted hover:text-text-secondary"
                )}
              >
                {p === "전체" ? p : p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <p className="text-text-muted text-xs mb-2">포맷</p>
          <div className="flex gap-2">
            {formats.map((f) => (
              <button
                key={f}
                onClick={() => onFormatChange(f)}
                className={clsx(
                  "px-3 py-1.5 rounded-lg text-xs transition-colors",
                  selectedFormat === f
                    ? "bg-primary text-white"
                    : "bg-bg-card border border-border text-text-muted hover:text-text-secondary"
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

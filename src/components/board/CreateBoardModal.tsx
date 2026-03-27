"use client";

interface CreateBoardModalProps {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescChange: (v: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
}

export default function CreateBoardModal({
  name,
  description,
  onNameChange,
  onDescChange,
  onSubmit,
  onClose,
  loading,
}: CreateBoardModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
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
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
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
              value={description}
              onChange={(e) => onDescChange(e.target.value)}
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
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-border text-text-secondary text-sm font-medium hover:bg-bg-card-hover transition-colors"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            disabled={loading || !name.trim()}
            className="flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? "생성중..." : "만들기"}
          </button>
        </div>
      </div>
    </div>
  );
}

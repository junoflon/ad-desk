"use client";

interface Board {
  id: string;
  name: string;
}

interface BoardSelectModalProps {
  boards: Board[];
  onSelect: (boardId: string) => void;
  onClose: () => void;
}

export default function BoardSelectModal({
  boards,
  onSelect,
  onClose,
}: BoardSelectModalProps) {
  return (
    <div
      className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-card border border-border rounded-2xl w-full max-w-sm p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-text-primary font-bold text-lg mb-4">
          보드에 저장
        </h3>
        {boards.length > 0 ? (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => onSelect(board.id)}
                className="w-full text-left px-4 py-3 rounded-xl bg-bg-dark border border-border hover:border-primary/30 text-text-primary text-sm transition-colors"
              >
                {board.name}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-text-muted text-sm py-4 text-center">
            보드가 없습니다. 먼저 보드를 생성해주세요.
          </p>
        )}
        <button
          onClick={onClose}
          className="w-full mt-4 py-2.5 rounded-xl border border-border text-text-secondary text-sm hover:bg-bg-card-hover transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}

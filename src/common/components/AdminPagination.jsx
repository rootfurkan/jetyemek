import React from "react";

export default function AdminPagination({
  currentPage,
  totalPages,
  onPageChange,
  label,
  showPageNumbers = false,
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50/50">
      <p className="text-[10px] font-bold text-stone-400">
        {label || `Sayfa ${currentPage} / ${totalPages}`}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          title="Önceki sayfa"
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_left
          </span>
        </button>

        {showPageNumbers &&
          Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (page) => (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 rounded-xl text-xs font-black border transition-all ${
                  currentPage === page
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-stone-500 border-stone-200 hover:text-primary"
                }`}
              >
                {page}
              </button>
            ),
          )}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
          title="Sonraki sayfa"
        >
          <span className="material-symbols-outlined text-[18px]">
            chevron_right
          </span>
        </button>
      </div>
    </div>
  );
}

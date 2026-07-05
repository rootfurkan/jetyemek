import React from 'react';

export default function ConfirmDeleteModal({
  isOpen,
  title = 'Kaydı Sil',
  message = 'Bu kaydı silmek istediğine emin misin?',
  confirmLabel = 'Sil',
  cancelLabel = 'İptal',
  onClose,
  onConfirm,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined">delete</span>
          </div>
          <div>
            <h4 className="text-lg font-black text-stone-800">{title}</h4>
            <p className="text-xs text-stone-500 font-semibold mt-1 leading-relaxed">
              {message}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-black transition-all"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-black transition-all"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

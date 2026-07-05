import React from 'react';
import Modal from './Modal.jsx';

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Emin misiniz?',
  message,
  confirmLabel = 'Evet, Devam Et',
  cancelLabel = 'İptal',
  danger = false,
  icon = 'help',
}) {
  const handleConfirm = () => {
    onConfirm && onConfirm();
    onClose && onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center gap-5">
        {/* Icon */}
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            danger ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
          }`}
        >
          <span
            className="material-symbols-outlined text-[36px] select-none"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            {icon}
          </span>
        </div>

        {/* Message */}
        {message && (
          <p className="text-sm text-stone-600 leading-relaxed max-w-xs">{message}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-full border border-stone-200 text-stone-700 font-bold text-sm hover:bg-stone-50 transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 py-3 rounded-full font-bold text-sm text-white transition-all active:scale-95 cursor-pointer shadow-md ${
              danger
                ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-200'
                : 'bg-primary hover:bg-secondary shadow-primary/20'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

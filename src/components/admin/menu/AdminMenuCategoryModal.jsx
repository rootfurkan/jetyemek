import React from 'react';

export default function AdminMenuCategoryModal({
  newCategoryName,
  setNewCategoryName,
  onClose,
  onSubmit,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-[28px] p-6 max-w-md w-full shadow-2xl relative border border-stone-100 space-y-5"
      >
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-stone-800">
              Yeni Kategori Ekle
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Kategori eklendikten sonra yeni ürün formunda seçilebilir.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
            Kategori Adı
          </label>
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Örn: Çorbalar"
            className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
            autoFocus
          />
        </div>

        <div className="flex gap-3 pt-4 border-t border-stone-100 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-full font-bold text-xs text-stone-600 transition-all cursor-pointer"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-7 py-2.5 bg-primary hover:bg-primary-container text-white rounded-full font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            Kategoriyi Ekle
          </button>
        </div>
      </form>
    </div>
  );
}

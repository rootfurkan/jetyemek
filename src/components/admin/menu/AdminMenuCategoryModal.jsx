import React, { useState } from 'react';

// Kategori ekleme, düzenleme ve silme modalını gösterir.
export default function AdminMenuCategoryModal({
  categories,
  categoryCounts,
  newCategoryName,
  setNewCategoryName,
  onAddCategory,
  onRenameCategory,
  onDeleteCategory,
  onClose,
}) {
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingValue, setEditingValue] = useState('');

  const startEditing = (category) => {
    setEditingCategory(category);
    setEditingValue(category);
  };

  const cancelEditing = () => {
    setEditingCategory(null);
    setEditingValue('');
  };

  const submitEdit = async (event) => {
    event.preventDefault();
    if (!editingCategory) return;
    await onRenameCategory(editingCategory, editingValue);
    cancelEditing();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-6 max-w-2xl w-full shadow-2xl relative border border-stone-100 space-y-5">
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-stone-800">
              Kategori Yönetimi
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Var olan kategorileri düzenleyebilir, silebilir veya yeni kategori ekleyebilirsiniz.
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

        <form onSubmit={onAddCategory} className="bg-stone-50 border border-stone-100 rounded-2xl p-4">
          <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
            Yeni Kategori Adı
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Örn: Çorbalar"
              className="flex-1 bg-white hover:bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
              autoFocus
            />
            <button
              type="submit"
              className="px-5 py-3 bg-primary hover:bg-primary-container text-white rounded-xl font-bold text-xs transition-all cursor-pointer shadow-md"
            >
              Ekle
            </button>
          </div>
        </form>

        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {categories.length === 0 ? (
            <div className="text-center py-8 bg-stone-50 rounded-2xl border border-dashed border-stone-200">
              <p className="text-sm font-bold text-stone-600">Henüz kategori yok.</p>
              <p className="text-xs text-stone-400 mt-1">Yeni kategori ekleyerek başlayabilirsiniz.</p>
            </div>
          ) : (
            categories.map((category) => {
              const isEditing = editingCategory === category;
              const productCount = categoryCounts[category] || 0;

              return (
                <div
                  key={category}
                  className="bg-white border border-stone-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                >
                  {isEditing ? (
                    <form onSubmit={submitEdit} className="flex-1 flex flex-col sm:flex-row gap-2">
                      <input
                        value={editingValue}
                        onChange={(event) => setEditingValue(event.target.value)}
                        className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm font-semibold focus:outline-none focus:border-primary"
                      />
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold"
                        >
                          İptal
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold"
                        >
                          Kaydet
                        </button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div>
                        <p className="text-sm font-black text-stone-800">{category}</p>
                        <p className="text-[11px] text-stone-400 font-semibold mt-0.5">
                          {productCount} ürün
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => startEditing(category)}
                          className="w-9 h-9 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-500 hover:text-primary flex items-center justify-center transition-all"
                          title="Düzenle"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteCategory(category)}
                          className="w-9 h-9 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-all"
                          title="Sil"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="flex gap-3 pt-4 border-t border-stone-100 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-full font-bold text-xs text-stone-600 transition-all cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}

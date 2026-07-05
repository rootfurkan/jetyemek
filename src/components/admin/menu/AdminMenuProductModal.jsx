import React from 'react';

const emptyOptionGroup = {
  title: '',
  type: 'single',
  required: false,
  options: [{ name: '', price: '' }],
};

// Ürün ekleme ve düzenleme modalını yönetir.
export default function AdminMenuProductModal({
  editingProduct,
  categoryOptions,
  newProductName,
  setNewProductName,
  newProductPrice,
  setNewProductPrice,
  newProductDesc,
  setNewProductDesc,
  newProductCat,
  setNewProductCat,
  newProductImg,
  setNewProductImg,
  newProductTag,
  setNewProductTag,
  hasExtraOptions,
  setHasExtraOptions,
  extraOptionGroups,
  setExtraOptionGroups,
  onClose,
  onSubmit,
}) {
  // Ek seçenek grubunu günceller.
  const updateGroup = (groupIndex, patch) => {
    setExtraOptionGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex ? { ...group, ...patch } : group,
      ),
    );
  };

  // Ek seçenek içindeki tek seçeneği günceller.
  const updateOption = (groupIndex, optionIndex, patch) => {
    setExtraOptionGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              options: group.options.map((option, optIndex) =>
                optIndex === optionIndex ? { ...option, ...patch } : option,
              ),
            }
          : group,
      ),
    );
  };

  // Ek seçenek grubunu kaldırır.
  const removeGroup = (groupIndex) => {
    setExtraOptionGroups((prev) =>
      prev.length === 1
        ? [emptyOptionGroup]
        : prev.filter((_, index) => index !== groupIndex),
    );
  };

  // Ek seçenek satırını kaldırır.
  const removeOption = (groupIndex, optionIndex) => {
    setExtraOptionGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex
          ? {
              ...group,
              options:
                group.options.length === 1
                  ? [{ name: '', price: '' }]
                  : group.options.filter((_, optIndex) => optIndex !== optionIndex),
            }
          : group,
      ),
    );
  };

  // Seçili gruba yeni seçenek satırı ekler.
  const addOption = (groupIndex) => {
    setExtraOptionGroups((prev) =>
      prev.map((group, index) =>
        index === groupIndex
          ? { ...group, options: [...group.options, { name: '', price: '' }] }
          : group,
      ),
    );
  };

  // Yeni ek seçenek grubu oluşturur.
  const addGroup = () => {
    setExtraOptionGroups((prev) => [...prev, emptyOptionGroup]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form
        onSubmit={onSubmit}
        className="bg-white rounded-[32px] p-6 md:p-8 max-w-lg w-full shadow-2xl relative border border-stone-100 space-y-5 flex flex-col justify-between max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center border-b border-stone-100 pb-3">
          <div>
            <h3 className="text-lg font-black text-stone-800">
              {editingProduct ? 'Ürünü Düzenle' : 'Menüye Yeni Lezzet Ekle'}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              {editingProduct
                ? 'Değişiklikler kaydedilecek.'
                : 'Bu ürün anında müşteri menüsüne yansıyacak.'}
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

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Ürün Adı *
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Double Cheesy Bacon Burger"
              value={newProductName}
              onChange={(e) => setNewProductName(e.target.value)}
              className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                Fiyat (₺) *
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="Örn: 245.00"
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(e.target.value)}
                className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                Kategori
              </label>
              <select
                value={newProductCat}
                onChange={(e) => setNewProductCat(e.target.value)}
                className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
              >
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
              Açıklama / İçerik
            </label>
            <textarea
              rows="2"
              placeholder="Örn: Double beef patty, karamelize soğan, barbekü sos ve cheddar peyniri."
              value={newProductDesc}
              onChange={(e) => setNewProductDesc(e.target.value)}
              className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
            />
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50/60 p-4 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-black text-stone-700 uppercase tracking-wider">
                  Ek Seçenek
                </h4>
                <p className="text-[11px] text-stone-400 font-semibold mt-0.5">
                  Kapalıysa müşteri ürünü direkt sepete ekler.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasExtraOptions}
                  onChange={(e) => setHasExtraOptions(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[3px] after:start-[3px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
            </div>

            {hasExtraOptions && (
              <div className="space-y-6">
                {extraOptionGroups.map((group, groupIndex) => (
                  <div
                    key={groupIndex}
                    className="bg-white border border-stone-200 rounded-2xl p-4 space-y-4 relative shadow-sm"
                  >
                    <button
                      type="button"
                      onClick={() => removeGroup(groupIndex)}
                      className="absolute top-3 right-3 text-stone-300 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[20px]">
                        close
                      </span>
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                          Grup Başlığı
                        </label>
                        <input
                          type="text"
                          value={group.title}
                          onChange={(e) =>
                            updateGroup(groupIndex, { title: e.target.value })
                          }
                          placeholder="Örn: Ekstra Soslar"
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-stone-800 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1">
                          Seçim Türü
                        </label>
                        <select
                          value={group.type}
                          onChange={(e) =>
                            updateGroup(groupIndex, { type: e.target.value })
                          }
                          className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-stone-800 outline-none"
                        >
                          <option value="single">Tekli Seçim</option>
                          <option value="multi">Çoklu Seçim</option>
                        </select>
                      </div>
                    </div>

                    {group.type === 'single' && (
                      <div className="flex items-center gap-2 mt-2">
                        <input
                          type="checkbox"
                          id={`req-${groupIndex}`}
                          checked={group.required}
                          onChange={(e) =>
                            updateGroup(groupIndex, {
                              required: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-primary rounded border-stone-300"
                        />
                        <label
                          htmlFor={`req-${groupIndex}`}
                          className="text-xs text-stone-600 font-semibold cursor-pointer select-none"
                        >
                          Bu gruptan en az 1 seçim zorunlu olsun
                        </label>
                      </div>
                    )}

                    <div className="space-y-2 pt-3 border-t border-stone-100">
                      {group.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="grid grid-cols-[1fr_110px_36px] gap-2 items-center"
                        >
                          <input
                            type="text"
                            value={option.name}
                            onChange={(e) =>
                              updateOption(groupIndex, optionIndex, {
                                name: e.target.value,
                              })
                            }
                            placeholder="Seçenek adı"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-stone-800 outline-none"
                          />
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={option.price}
                            onChange={(e) =>
                              updateOption(groupIndex, optionIndex, {
                                price: e.target.value,
                              })
                            }
                            placeholder="TL"
                            className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-stone-800 outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => removeOption(groupIndex, optionIndex)}
                            className="h-10 rounded-xl bg-stone-50 border border-stone-200 text-stone-400 hover:text-red-500 hover:bg-red-50 cursor-pointer flex items-center justify-center transition-colors"
                          >
                            <span className="material-symbols-outlined text-[18px]">
                              delete
                            </span>
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => addOption(groupIndex)}
                        className="w-full border border-dashed border-stone-300 text-stone-500 bg-stone-50 hover:bg-stone-100 hover:border-stone-400 hover:text-stone-700 rounded-xl py-2.5 text-xs font-bold cursor-pointer transition-all mt-2"
                      >
                        + Alt Seçenek Ekle
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addGroup}
                  className="w-full border-2 border-dashed border-primary/40 text-primary bg-primary/5 hover:bg-primary/10 rounded-xl py-3.5 text-xs font-black cursor-pointer transition-all uppercase tracking-wide"
                >
                  + Yeni Seçenek Grubu Ekle
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                Fotoğraf URL
              </label>
              <input
                type="url"
                placeholder="Resim internet linki"
                value={newProductImg}
                onChange={(e) => setNewProductImg(e.target.value)}
                className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">
                Etiket / Durum
              </label>
              <select
                value={newProductTag}
                onChange={(e) => setNewProductTag(e.target.value)}
                className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
              >
                <option value="">Yok / Normal Ürün</option>
                <option value="En Çok Satan">En Çok Satan</option>
                <option value="Popüler">Popüler</option>
                <option value="Vegan">Vegan</option>
                <option value="%25 İndirim">%25 İndirim</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-stone-100 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-full font-bold text-xs text-stone-600 transition-all cursor-pointer"
          >
            İptal Et
          </button>
          <button
            type="submit"
            className="px-7 py-2.5 bg-primary hover:bg-primary-container text-white rounded-full font-bold text-xs transition-all cursor-pointer shadow-md"
          >
            {editingProduct ? 'Değişiklikleri Kaydet' : 'Kaydet ve Menüye Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
}

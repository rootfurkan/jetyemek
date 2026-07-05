import React from 'react';

export default function AdminMenuProductCard({
  product,
  editingPrice,
  setEditingPrice,
  onPriceUpdate,
  onToggleStatus,
  onEdit,
  onDelete,
  formatProductTag,
}) {
  const isActive = product.status === 'Active';

  return (
    <div
      className={`bg-white rounded-[24px] overflow-hidden shadow-soft border-2 transition-all flex flex-col justify-between group ${
        !isActive
          ? 'border-transparent opacity-65 grayscale hover:grayscale-0 hover:opacity-100'
          : 'border-transparent hover:border-primary/20'
      }`}
    >
      <div className="relative h-44 overflow-hidden bg-stone-100">
        <img
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={product.name}
          src={product.image}
          referrerPolicy="no-referrer"
        />

        <div className="absolute top-3 right-3 flex flex-col gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm ${
              isActive
                ? 'bg-green-50 text-green-600 border border-green-200'
                : 'bg-stone-800 text-white'
            }`}
          >
            {isActive ? 'Açık / Satışta' : 'Kapalı / Yok'}
          </span>

          {product.tag && (
            <span className="bg-primary text-white px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider shadow-sm text-center">
              {formatProductTag(product.tag)}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1.5">
            <h3 className="font-extrabold text-stone-800 text-sm leading-tight line-clamp-1">
              {product.name}
            </h3>
          </div>
          <p className="text-stone-500 text-xs font-medium leading-relaxed line-clamp-2">
            {product.description}
          </p>

          <div className="mt-3 flex items-center gap-2">
            {editingPrice?.id === product.id ? (
              <>
                <input
                  type="number"
                  step="0.01"
                  value={editingPrice.value}
                  onChange={(e) =>
                    setEditingPrice({ id: product.id, value: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onPriceUpdate(product.id);
                    if (e.key === 'Escape') setEditingPrice(null);
                  }}
                  className="w-24 border border-primary/40 rounded-lg px-2 py-1 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                  autoFocus
                />
                <button
                  onClick={() => onPriceUpdate(product.id)}
                  className="text-emerald-600 hover:text-emerald-700 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    check
                  </span>
                </button>
                <button
                  onClick={() => setEditingPrice(null)}
                  className="text-stone-400 hover:text-stone-600 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">
                    close
                  </span>
                </button>
              </>
            ) : (
              <button
                onClick={() =>
                  setEditingPrice({
                    id: product.id,
                    value: product.price.toString(),
                  })
                }
                className="flex items-center gap-1.5 group/price cursor-pointer"
                title="Fiyatı güncelle"
              >
                <span className="font-black text-primary text-base">
                  {product.price?.toFixed(2)} ₺
                </span>
                <span className="material-symbols-outlined text-[14px] text-stone-300 group-hover/price:text-primary transition-colors">
                  edit
                </span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={() => onToggleStatus(product)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
            <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">
              {isActive ? 'Aktif' : 'Pasif'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(product)}
              className="p-1.5 text-stone-400 hover:text-primary hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
              title="Düzenle"
            >
              <span className="material-symbols-outlined text-[18px]">
                edit
              </span>
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-rose-50 rounded-lg transition-all cursor-pointer"
              title="Sil"
            >
              <span className="material-symbols-outlined text-[18px]">
                delete
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

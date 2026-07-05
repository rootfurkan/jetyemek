import React from "react";

// Restoran komisyon oranını modal üzerinden günceller.
export default function RestaurantCommissionModal({
  commissionModal,
  closeCommissionModal,
  handleUpdateCommission,
  commissionValue,
  setCommissionValue,
}) {
  if (!commissionModal) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleUpdateCommission}
        className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h4 className="text-lg font-black text-stone-800">
              Komisyon Oranı
            </h4>
            <p className="text-xs text-stone-400 font-semibold mt-1">
              {commissionModal.name}
            </p>
          </div>
          <button
            type="button"
            onClick={closeCommissionModal}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div>
          <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
            Yeni Komisyon Oranı (%)
          </label>
          <div className="relative">
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={commissionValue}
              onChange={(event) => setCommissionValue(event.target.value)}
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-stone-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary"
              autoFocus
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-black">
              %
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={closeCommissionModal}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
          >
            Kaydet
          </button>
        </div>
      </form>
    </div>
  );
}

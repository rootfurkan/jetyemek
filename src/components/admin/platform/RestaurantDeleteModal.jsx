import React from "react";

export default function RestaurantDeleteModal({
  deleteModal,
  closeDeleteModal,
  handleDeleteRestaurant,
}) {
  if (!deleteModal) return null;

  return (
    <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-rose-50 text-primary flex items-center justify-center mb-3">
              <span className="material-symbols-outlined">delete</span>
            </div>
            <h4 className="text-lg font-black text-stone-800">
              Restoranı Sil
            </h4>
            <p className="text-xs text-stone-500 font-semibold mt-2 leading-relaxed">
              <span className="font-black text-stone-800">
                {deleteModal.name}
              </span>{" "}
              restoranını platformdan kaldırmak istediğine emin misin?
            </p>
          </div>
          <button
            type="button"
            onClick={closeDeleteModal}
            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={closeDeleteModal}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={handleDeleteRestaurant}
            className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
          >
            Sil
          </button>
        </div>
      </div>
    </div>
  );
}

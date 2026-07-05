import React from "react";
import TableEmptyState from "../../../common/components/TableEmptyState.jsx";

export default function RestaurantListTable({
  filteredRestaurants,
  handleToggleRestStatus,
  openCommissionModal,
  openDeleteModal,
}) {
  return (
    <div className="bg-white rounded-[28px] shadow-soft border border-stone-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
              <th className="px-6 py-4">Restoran Bilgisi</th>
              <th className="px-4 py-4">Kategori</th>
              <th className="px-4 py-4 text-center">Komisyon Oranı</th>
              <th className="px-4 py-4 text-center">Ortalama Puan</th>
              <th className="px-4 py-4">Sistem Durumu</th>
              <th className="px-6 py-4 text-right">İşlemler</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
            {filteredRestaurants.length === 0 ? (
              <TableEmptyState colSpan="6" message="Restoran bulunamadı." />
            ) : (
              filteredRestaurants.map((rest) => (
                <tr
                  key={rest.id}
                  className="hover:bg-stone-50/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={rest.image || rest.img}
                        alt={rest.name}
                        className="w-10 h-10 object-cover rounded-xl shadow-sm border border-stone-100"
                      />
                      <div>
                        <p className="font-extrabold text-stone-800 text-xs">
                          {rest.name}
                        </p>
                        <p className="text-[10px] text-stone-400 font-semibold">
                          {rest.city}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      {rest.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center font-extrabold text-stone-800">
                    %{(parseFloat(rest.commission) || 0).toFixed(1)}
                  </td>
                  <td className="px-4 py-4 text-center text-amber-500 font-black">
                    <div className="flex items-center justify-center gap-0.5">
                      <span className="material-symbols-outlined text-[14px]">
                        star
                      </span>
                      {rest.rating}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                        rest.status === "Aktif"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : "bg-stone-100 text-stone-500 border border-stone-200"
                      }`}
                    >
                      {rest.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={() => handleToggleRestStatus(rest.id)}
                        className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                        title="Aktif/Pasif Durumu Değiştir"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          sync
                        </span>
                      </button>
                      <button
                        onClick={() => openCommissionModal(rest)}
                        className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                        title="Komisyon Oranını Güncelle"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          percent
                        </span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(rest)}
                        className="p-1.5 hover:bg-rose-50 border border-rose-100 rounded-lg shadow-sm text-primary"
                        title="Restoranı Sil"
                      >
                        <span className="material-symbols-outlined text-[16px]">
                          delete
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";

export default function AdminOrdersTab({
  orders,
  paginatedOrders,
  ordersPerPage,
  ordersPage,
  setOrdersPage,
  totalOrderPages,
  orderStatusModal,
  openOrderStatusModal,
  closeOrderStatusModal,
  handleUpdateOrderStatus,
  orderStatusOptions,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-3">
        <div>
          <h3 className="text-base font-extrabold text-stone-400 uppercase tracking-wider">
            Genel Sipariş Akışı
          </h3>
          <p className="text-stone-500 text-xs font-semibold mt-1">
            Platformdaki anlık işlem hareketliliği ve statü takipleri.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                <th className="px-6 py-4">Sipariş No</th>
                <th className="px-4 py-4">Müşteri</th>
                <th className="px-4 py-4">Restoran</th>
                <th className="px-4 py-4">Tutar</th>
                <th className="px-4 py-4">Durum</th>
                <th className="px-4 py-4">Tarih / Zaman</th>
                <th className="px-6 py-4 text-right">Durum Değiştir</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
              {paginatedOrders.map((ord) => (
                <tr
                  key={ord.id}
                  className="hover:bg-stone-50/40 transition-colors"
                >
                  <td className="px-6 py-4 font-bold text-stone-800">
                    {ord.id}
                  </td>
                  <td className="px-4 py-4 font-bold text-stone-700">
                    {ord.customer}
                  </td>
                  <td className="px-4 py-4">{ord.restaurant}</td>
                  <td className="px-4 py-4 font-extrabold text-stone-800">
                    {ord.total.toFixed(2)} ₺
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                        ord.status === "Teslim Edildi"
                          ? "bg-green-50 text-green-700 border border-green-200"
                          : ord.status === "Hazırlanıyor" ||
                              ord.status === "Yolda"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-stone-400 whitespace-nowrap">
                    {ord.time}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => openOrderStatusModal(ord)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-stone-200 text-stone-500 hover:text-primary hover:bg-rose-50 hover:border-rose-100 transition-all"
                      title="Durumu Güncelle"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        edit_square
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {orders.length > ordersPerPage && (
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50/50">
            <p className="text-[10px] font-bold text-stone-400">
              {orders.length} sipariş içinde sayfa {ordersPage} /{" "}
              {totalOrderPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrdersPage((page) => Math.max(1, page - 1))}
                disabled={ordersPage === 1}
                className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                title="Önceki sayfa"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_left
                </span>
              </button>

              {Array.from(
                { length: totalOrderPages },
                (_, index) => index + 1,
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setOrdersPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-black border transition-all ${
                    ordersPage === page
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-stone-500 border-stone-200 hover:text-primary"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() =>
                  setOrdersPage((page) => Math.min(totalOrderPages, page + 1))
                }
                disabled={ordersPage === totalOrderPages}
                className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                title="Sonraki sayfa"
              >
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        )}
      </div>

      {orderStatusModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-black text-stone-800">
                  Sipariş Durumu
                </h4>
                <p className="text-xs text-stone-500 font-semibold mt-1">
                  #{orderStatusModal.id} için yeni durumu seç
                </p>
              </div>
              <button
                type="button"
                onClick={closeOrderStatusModal}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-2">
              {orderStatusOptions.map((option) => {
                const isActive =
                  orderStatusModal.deliveryStatus === option.deliveryStatus;

                return (
                  <button
                    key={option.deliveryStatus}
                    type="button"
                    onClick={() => handleUpdateOrderStatus(option)}
                    className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border text-left transition-all ${
                      isActive
                        ? "border-primary bg-rose-50 text-primary"
                        : "border-stone-100 bg-stone-50 text-stone-700 hover:border-rose-100 hover:bg-rose-50/60"
                    }`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-[20px]">
                        {option.icon}
                      </span>
                      <span className="text-xs font-black">{option.label}</span>
                    </span>
                    {isActive && (
                      <span className="material-symbols-outlined text-[18px]">
                        check
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

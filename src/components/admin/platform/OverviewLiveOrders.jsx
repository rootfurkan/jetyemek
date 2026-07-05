import React from "react";

export default function OverviewLiveOrders({
  orders,
  setActiveTab,
  handleUpdateOrderStatus,
  orderStatusOptions,
}) {
  return (
    <div className="lg:col-span-2 bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 space-y-4">
      <div className="flex justify-between items-center border-b border-stone-50 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-stone-800">
            Canlı Sistem Sipariş Akışı
          </h3>
          <p className="text-stone-400 text-xs font-semibold mt-0.5">
            Platformdaki anlık işlem hareketliliği
          </p>
        </div>
        <button
          onClick={() => setActiveTab("orders")}
          className="text-primary hover:text-primary-container text-xs font-bold"
        >
          Tüm Siparişleri İzle
        </button>
      </div>

      <div className="space-y-3">
        {orders.slice(0, 4).map((ord, idx) => (
          <div
            key={idx}
            className="bg-stone-50/50 hover:bg-stone-50 border border-stone-200/40 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-50 border border-rose-100 text-primary rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
                {ord.id.split("-")[1] || ord.id}
              </div>
              <div>
                <h4 className="font-extrabold text-stone-800 text-xs">
                  {ord.customer} &bull; {ord.restaurant}
                </h4>
                <p className="text-stone-500 text-[10px] font-bold tracking-wide mt-0.5">
                  {ord.total.toFixed(2)} ₺ &bull; {ord.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                  ord.status === "Teslim Edildi"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : ord.status === "Hazırlanıyor" || ord.status === "Yolda"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {ord.status}
              </span>

              <button
                onClick={() => handleUpdateOrderStatus(orderStatusOptions[3], ord)}
                className="bg-white hover:bg-stone-100 text-stone-700 p-1.5 rounded-lg border border-stone-200 shadow-sm text-[10px] font-bold"
                title="Teslim Edildi İşaretle"
              >
                <span className="material-symbols-outlined text-[14px]">
                  done
                </span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

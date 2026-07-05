import React from "react";

export default function AdminOverviewTab({
  coreStats,
  monthlyOrderBars,
  topRestaurants,
  maxRestaurantRevenue,
  orders,
  deliveryCouriers,
  availableCouriers,
  hideSidebar,
  navigate,
  setActiveTab,
  formatCurrency,
  handleUpdateOrderStatus,
  orderStatusOptions,
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {coreStats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-5 rounded-[24px] shadow-soft border border-stone-100 flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer hover:border-primary/25"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-rose-50 text-primary rounded-xl">
                <span className="material-symbols-outlined text-[20px]">
                  {stat.icon}
                </span>
              </div>

              <div
                className={`flex items-center gap-0.5 text-xs font-bold ${
                  stat.isPositive ? "text-green-600" : "text-primary"
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {stat.isPositive ? "trending_up" : "trending_down"}
                </span>
                {stat.change}
              </div>
            </div>

            <div>
              <p className="text-stone-400 font-bold text-xs tracking-wide">
                {stat.title}
              </p>
              <h3 className="text-2xl font-black text-stone-800 tracking-tight mt-1">
                {stat.value}
              </h3>
              <p className="text-[10px] text-stone-400 font-semibold mt-1">
                {stat.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-base font-extrabold text-stone-800">
                Platform İşlem Hacmi Trendi (GMV)
              </h4>
              <p className="text-stone-400 text-xs font-semibold">
                Aylık bazda brüt platform satışları ve dönüşüm hacmi
              </p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500">
                <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block"></span>
                Sipariş Hacmi
              </span>
            </div>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 px-2 pt-4">
            {monthlyOrderBars.map((month, idx) => (
              <div
                key={idx}
                className="flex-1 flex flex-col items-center gap-2 group h-full justify-end"
              >
                <div
                  className="w-full bg-primary hover:bg-primary-container hover:scale-x-105 transition-all rounded-t-lg relative"
                  style={{ height: `${month.height}%` }}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                    {month.orderCount} Sipariş / {formatCurrency(month.revenue)}
                  </div>
                </div>
                <span className="text-[9px] font-bold text-stone-400 uppercase">
                  {month.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-extrabold text-stone-800">
              En Popüler Restoranlar
            </h4>
            <p className="text-stone-400 text-xs font-semibold mb-6">
              En çok satış yapan iş ortakları
            </p>
          </div>

          <div className="space-y-4">
            {topRestaurants.length === 0 ? (
              <p className="text-sm text-stone-400 font-semibold">
                Henüz satış verisi yok.
              </p>
            ) : (
              topRestaurants.map((restaurant, idx) => (
                <div key={restaurant.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-50 border border-stone-100 rounded-xl overflow-hidden flex items-center justify-center text-stone-400">
                    {restaurant.image ? (
                      <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-[20px]">
                        storefront
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-2 text-xs font-bold text-stone-700 mb-1">
                      <span className="truncate">
                        {idx + 1}. {restaurant.name}
                      </span>
                      <span>{formatCurrency(restaurant.revenue)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${Math.max(
                            8,
                            (restaurant.revenue / maxRestaurantRevenue) * 100,
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-stone-400 font-bold mt-1">
                      {restaurant.orderCount} sipariş
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-4 border-t border-stone-100 mt-4 text-center">
            <button
              onClick={() => {
                if (hideSidebar) {
                  navigate("/admin/restaurants");
                } else {
                  setActiveTab("restaurants");
                }
              }}
              className="text-primary hover:text-primary-container text-xs font-bold hover:underline"
            >
              Tüm İş Ortaklarını Gör &rarr;
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                        : ord.status === "Hazırlanıyor" ||
                            ord.status === "Yolda"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                    }`}
                  >
                    {ord.status}
                  </span>

                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        handleUpdateOrderStatus(orderStatusOptions[3], ord)
                      }
                      className="bg-white hover:bg-stone-100 text-stone-700 p-1.5 rounded-lg border border-stone-200 shadow-sm text-[10px] font-bold"
                      title="Teslim Edildi İşaretle"
                    >
                      <span className="material-symbols-outlined text-[14px]">
                        done
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider">
              Kurye Dağılım Durumu
            </h4>
            <p className="text-stone-500 text-xs font-semibold mt-1">
              Sistemdeki kuryelerin durum özeti
            </p>
          </div>

          <div className="space-y-4 my-6">
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block"></span>
                Teslimatta
              </span>
              <span className="text-stone-800">
                {deliveryCouriers.length} Kurye
              </span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>
                Müsait / Beklemede
              </span>
              <span className="text-stone-800">
                {availableCouriers.length} Kurye
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <button
              onClick={() => setActiveTab("couriers")}
              className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all"
            >
              <span>Kurye Haritasını Aç</span>
              <span className="material-symbols-outlined text-[15px]">map</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";

export default function OverviewTopRestaurants({
  topRestaurants,
  maxRestaurantRevenue,
  hideSidebar,
  navigate,
  setActiveTab,
  formatCurrency,
}) {
  return (
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
  );
}

import React from "react";

export default function OverviewSalesChart({ monthlyOrderBars, formatCurrency }) {
  return (
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
  );
}

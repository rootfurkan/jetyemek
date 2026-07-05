import React from "react";

export default function OverviewCourierSummary({
  deliveryCouriers,
  availableCouriers,
  setActiveTab,
}) {
  return (
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
          <span className="text-stone-800">{deliveryCouriers.length} Kurye</span>
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
  );
}

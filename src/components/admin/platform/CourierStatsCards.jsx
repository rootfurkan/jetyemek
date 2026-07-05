import React from "react";

// Tek bir kurye istatistik kartını çizer.
function CourierStatCard({ label, value, icon, iconClass }) {
  return (
    <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
      <div>
        <p className="text-stone-400 font-bold text-xs tracking-wide">
          {label}
        </p>
        <h3 className="text-2xl font-black text-stone-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${iconClass}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
    </div>
  );
}

// Kurye özet istatistiklerini gösterir.
export default function CourierStatsCards({
  activeCount,
  deliveryCount,
  availableCount,
}) {
  return (
    <div className="space-y-4">
      <CourierStatCard
        label="Aktif Kuryeler"
        value={activeCount}
        icon="motorcycle"
        iconClass="bg-rose-50 text-primary"
      />
      <CourierStatCard
        label="Teslimatta"
        value={deliveryCount}
        icon="local_shipping"
        iconClass="bg-amber-50 text-amber-500"
      />
      <CourierStatCard
        label="Müsait"
        value={availableCount}
        icon="check_circle"
        iconClass="bg-green-50 text-green-600"
      />
    </div>
  );
}

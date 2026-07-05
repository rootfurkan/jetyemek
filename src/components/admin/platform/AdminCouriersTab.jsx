import React from "react";

export default function AdminCouriersTab({
  couriers,
  activeCouriers,
  deliveryCouriers,
  availableCouriers,
  assignableOrders,
  selectedOrderToAssign,
  setSelectedOrderToAssign,
  selectedCourierToAssign,
  setSelectedCourierToAssign,
  handleAssignOrder,
  courierMapRoutes,
  getCourierMapVisual,
}) {
  return (          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Courier Status metrics list */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">
                      Aktif Kuryeler
                    </p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">
                      {activeCouriers.length}
                    </h3>
                  </div>
                  <div className="p-3 bg-rose-50 text-primary rounded-xl">
                    <span className="material-symbols-outlined">
                      motorcycle
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">
                      Teslimatta
                    </p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">
                      {deliveryCouriers.length}
                    </h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                    <span className="material-symbols-outlined">
                      local_shipping
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">
                      Müsait
                    </p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">
                      {availableCouriers.length}
                    </h3>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <span className="material-symbols-outlined">
                      check_circle
                    </span>
                  </div>
                </div>
              </div>

              {/* LIVE COURIER DEMO MAP */}
              <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-soft lg:col-span-2 relative min-h-[280px] overflow-hidden flex flex-col justify-between">
                <style>{`
                  @keyframes courierDemoRide {
                    0% { offset-distance: 0%; }
                    100% { offset-distance: 100%; }
                  }
                  .courier-demo-ride {
                    offset-rotate: auto 0deg;
                    animation: courierDemoRide var(--ride-duration) linear infinite;
                  }
                  .courier-demo-paused {
                    offset-distance: var(--park-position);
                  }
                `}</style>
                <div
                  className="absolute inset-0 z-0 opacity-40"
                  style={{
                    backgroundImage:
                      "radial-gradient(#e5bdb6 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                  }}
                ></div>

                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-800">
                      Canlı Kurye Haritası (İstanbul)
                    </h4>
                    <p className="text-[10px] text-stone-400 font-bold tracking-wide mt-0.5">
                      Demo şehir planı üzerinde hareketli kurye görünümü
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm">
                      <span className="material-symbols-outlined text-[15px]">
                        zoom_in
                      </span>
                    </button>
                    <button className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm">
                      <span className="material-symbols-outlined text-[15px]">
                        zoom_out
                      </span>
                    </button>
                  </div>
                </div>

                <div className="w-full h-64 border border-stone-100 bg-[#f3efe7] rounded-2xl relative overflow-hidden shadow-inner">
                  <svg
                    className="absolute inset-0 w-full h-full"
                    viewBox="0 0 560 240"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <defs>
                      <linearGradient
                        id="courierWater"
                        x1="0"
                        x2="1"
                        y1="0"
                        y2="1"
                      >
                        <stop offset="0%" stopColor="#dbeafe" />
                        <stop offset="100%" stopColor="#bae6fd" />
                      </linearGradient>
                      <filter
                        id="softRoadShadow"
                        x="-10%"
                        y="-10%"
                        width="120%"
                        height="120%"
                      >
                        <feDropShadow
                          dx="0"
                          dy="1"
                          stdDeviation="1"
                          floodColor="#78716c"
                          floodOpacity="0.16"
                        />
                      </filter>
                    </defs>
                    <path
                      d="M 0 196 C 76 176, 126 216, 198 198 S 322 178, 394 204 S 496 222, 560 198 L 560 240 L 0 240 Z"
                      fill="url(#courierWater)"
                      opacity="0.9"
                    />
                    <path
                      d="M 10 196 C 88 184, 132 214, 204 198 S 322 184, 390 206 S 486 220, 550 204"
                      fill="none"
                      stroke="#7dd3fc"
                      strokeWidth="2"
                      opacity="0.65"
                    />

                    <rect
                      x="20"
                      y="18"
                      width="102"
                      height="48"
                      rx="12"
                      fill="#fffaf5"
                      stroke="#e7e5e4"
                    />
                    <rect
                      x="138"
                      y="22"
                      width="72"
                      height="40"
                      rx="10"
                      fill="#fef3c7"
                      stroke="#fde68a"
                      opacity="0.9"
                    />
                    <rect
                      x="392"
                      y="22"
                      width="126"
                      height="54"
                      rx="14"
                      fill="#fffaf5"
                      stroke="#e7e5e4"
                    />
                    <rect
                      x="72"
                      y="148"
                      width="98"
                      height="44"
                      rx="12"
                      fill="#fffaf5"
                      stroke="#e7e5e4"
                    />
                    <rect
                      x="194"
                      y="158"
                      width="80"
                      height="42"
                      rx="12"
                      fill="#dcfce7"
                      stroke="#bbf7d0"
                    />
                    <rect
                      x="360"
                      y="146"
                      width="136"
                      height="48"
                      rx="14"
                      fill="#fffaf5"
                      stroke="#e7e5e4"
                    />
                    <rect
                      x="468"
                      y="92"
                      width="58"
                      height="36"
                      rx="10"
                      fill="#f5f5f4"
                      stroke="#e7e5e4"
                    />
                    <rect
                      x="20"
                      y="84"
                      width="54"
                      height="34"
                      rx="9"
                      fill="#f5f5f4"
                      stroke="#e7e5e4"
                    />

                    <path
                      d="M 18 72 C 96 58, 158 54, 216 74 S 326 140, 536 142"
                      fill="none"
                      stroke="#c9c2b8"
                      strokeWidth="22"
                      strokeLinecap="round"
                      filter="url(#softRoadShadow)"
                    />
                    <path
                      d="M 24 116 C 110 94, 168 92, 242 118 S 382 154, 500 112"
                      fill="none"
                      stroke="#c9c2b8"
                      strokeWidth="22"
                      strokeLinecap="round"
                      filter="url(#softRoadShadow)"
                    />
                    <path
                      d="M 78 178 C 146 134, 218 146, 280 108 S 390 66, 520 78"
                      fill="none"
                      stroke="#d5cec4"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 64 38 C 122 76, 158 126, 216 126 S 330 82, 456 46"
                      fill="none"
                      stroke="#ddd6cc"
                      strokeWidth="13"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 512 190 C 420 166, 364 156, 296 178 S 156 210, 42 172"
                      fill="none"
                      stroke="#ddd6cc"
                      strokeWidth="13"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 282 24 C 268 82, 286 128, 250 170 S 180 216, 102 206"
                      fill="none"
                      stroke="#ddd6cc"
                      strokeWidth="13"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 18 72 C 96 58, 158 54, 216 74 S 326 140, 536 142"
                      fill="none"
                      stroke="#f8fafc"
                      strokeWidth="2"
                      strokeDasharray="12 12"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <path
                      d="M 24 116 C 110 94, 168 92, 242 118 S 382 154, 500 112"
                      fill="none"
                      stroke="#f8fafc"
                      strokeWidth="2"
                      strokeDasharray="12 12"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    <path
                      d="M 78 178 C 146 134, 218 146, 280 108 S 390 66, 520 78"
                      fill="none"
                      stroke="#f8fafc"
                      strokeWidth="1.6"
                      strokeDasharray="10 10"
                      strokeLinecap="round"
                      opacity="0.9"
                    />
                    {courierMapRoutes.map((route, index) => (
                      <path
                        key={index}
                        d={route.path}
                        fill="none"
                        stroke={index % 2 === 0 ? "#b51c00" : "#16a34a"}
                        strokeWidth="2"
                        strokeDasharray="8 10"
                        strokeLinecap="round"
                        opacity="0.34"
                      />
                    ))}
                    <circle
                      cx="250"
                      cy="116"
                      r="5"
                      fill="#b51c00"
                      opacity="0.82"
                    />
                    <circle
                      cx="425"
                      cy="150"
                      r="5"
                      fill="#b51c00"
                      opacity="0.82"
                    />
                    <circle
                      cx="178"
                      cy="64"
                      r="4"
                      fill="#16a34a"
                      opacity="0.8"
                    />
                    <text
                      x="32"
                      y="44"
                      fill="#78716c"
                      fontSize="9"
                      fontWeight="700"
                    >
                      Beşiktaş
                    </text>
                    <text
                      x="400"
                      y="54"
                      fill="#78716c"
                      fontSize="9"
                      fontWeight="700"
                    >
                      Kadıköy
                    </text>
                    <text
                      x="206"
                      y="184"
                      fill="#166534"
                      fontSize="8"
                      fontWeight="700"
                    >
                      Park
                    </text>
                    <text
                      x="18"
                      y="226"
                      fill="#0369a1"
                      fontSize="8"
                      fontWeight="700"
                    >
                      Sahil hattı
                    </text>
                  </svg>

                  {couriers.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs font-bold text-stone-400">
                        Kurye verisi bulunamadı.
                      </p>
                    </div>
                  ) : (
                    couriers.map((courier, index) => {
                      const visual = getCourierMapVisual(courier, index);

                      return (
                        <div
                          key={courier.id}
                          className={`absolute left-0 top-0 group cursor-pointer ${visual.colorClass} ${visual.isMoving ? "courier-demo-ride" : "courier-demo-paused"}`}
                          style={{
                            offsetPath: `path('${visual.path}')`,
                            "--ride-duration": `${visual.duration}s`,
                            "--park-position": `${18 + ((index * 13) % 70)}%`,
                            animationDelay: `-${index * 3.2}s`,
                          }}
                        >
                          <span
                            className={`material-symbols-outlined text-[28px] select-none drop-shadow-md ${visual.pulseClass}`}
                          >
                            {visual.icon}
                          </span>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[8px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 transition-opacity">
                            {courier.name} - {courier.status}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="relative z-10 flex justify-between items-center text-[9px] font-bold text-stone-400 uppercase tracking-wider mt-3">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full inline-block"></span>{" "}
                    Teslimatta
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-amber-500 rounded-full inline-block"></span>{" "}
                    Müsait / Hazır
                  </span>
                </div>
              </div>
            </div>

            {/* Lower bento: Courier table list & Manual assignment form */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Courier list table */}
              <div className="xl:col-span-2 bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
                <div className="p-5 border-b border-stone-100">
                  <h4 className="text-base font-extrabold text-stone-800">
                    Sistem Kurye Listesi
                  </h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                        <th className="px-6 py-3">Kurye Adı</th>
                        <th className="px-4 py-3">Araç Türü</th>
                        <th className="px-4 py-3">Aktif Bölgesi</th>
                        <th className="px-4 py-3 text-center">
                          Toplam Teslimat
                        </th>
                        <th className="px-6 py-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                      {couriers.map((courier) => (
                        <tr
                          key={courier.id}
                          className="hover:bg-stone-50/40 transition-colors"
                        >
                          <td className="px-6 py-3.5 font-bold text-stone-800">
                            {courier.name}
                          </td>
                          <td className="px-4 py-3.5">{courier.vehicle}</td>
                          <td className="px-4 py-3.5 text-stone-500">
                            {courier.zone}
                          </td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-stone-800">
                            {courier.ordersDelivered}
                          </td>
                          <td className="px-6 py-3.5">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                                courier.status === "Müsait"
                                  ? "bg-green-50 text-green-700 border border-green-200"
                                  : courier.status === "Teslimatta"
                                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                              }`}
                            >
                              {courier.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Manual Courier Assignment panel */}
              <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-stone-800">
                    Manuel Sipariş Atama
                  </h4>
                  <p className="text-stone-400 text-xs font-semibold mb-6">
                    Restoran tarafından hazırlanan siparişleri müsait bir
                    kuryeye manuel olarak atayın.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Hazırlanan Siparişi Seçin
                    </label>
                    <select
                      value={selectedOrderToAssign}
                      onChange={(e) => setSelectedOrderToAssign(e.target.value)}
                      className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    >
                      {assignableOrders.length === 0 ? (
                        <option value="">Atanacak sipariş yok</option>
                      ) : (
                        assignableOrders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.id} ({order.restaurant} - {order.status})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Müsait Kuryeyi Seçin
                    </label>
                    <select
                      value={selectedCourierToAssign}
                      onChange={(e) =>
                        setSelectedCourierToAssign(e.target.value)
                      }
                      className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    >
                      {availableCouriers.length === 0 ? (
                        <option value="">Müsait kurye yok</option>
                      ) : (
                        availableCouriers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.status} &bull; {c.zone})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl space-y-2 text-[11px] font-bold text-stone-500">
                    <div className="flex justify-between">
                      <span>Tahmini Teslimat Süresi:</span>
                      <span className="text-stone-800">25 - 30 dk</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mesafe:</span>
                      <span className="text-stone-800">3.2 km</span>
                    </div>
                  </div>

                  <button
                    onClick={handleAssignOrder}
                    disabled={
                      !selectedOrderToAssign || !selectedCourierToAssign
                    }
                    className="w-full py-3 bg-primary hover:bg-primary-container text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed"
                  >
                    Siparişi Ata ve Bildirim Gönder
                  </button>
                </div>
              </div>
            </div>
          </div>
  );
}

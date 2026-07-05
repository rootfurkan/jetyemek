import React from "react";

export default function CourierAssignmentPanel({
  assignableOrders,
  availableCouriers,
  selectedOrderToAssign,
  setSelectedOrderToAssign,
  selectedCourierToAssign,
  setSelectedCourierToAssign,
  handleAssignOrder,
}) {
  return (
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
  );
}


import React from "react";

// Kuryeleri tablo halinde listeler.
export default function CourierListTable({ couriers }) {
  return (              <div className="xl:col-span-2 bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
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
  );
}

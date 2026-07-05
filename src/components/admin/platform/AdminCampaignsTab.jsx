import React from "react";
import ConfirmDeleteModal from "../../../common/components/ConfirmDeleteModal.jsx";
import StatCard from "../../../common/components/StatCard.jsx";
import StatusBadge from "../../../common/components/StatusBadge.jsx";
import TableEmptyState from "../../../common/components/TableEmptyState.jsx";

export default function AdminCampaignsTab({
  promos,
  activePromos,
  totalCampaignUsage,
  couponPromoCount,
  newCampaignName,
  setNewCampaignName,
  newCampaignCode,
  setNewCampaignCode,
  newCampaignType,
  setNewCampaignType,
  newCampaignDiscount,
  setNewCampaignDiscount,
  newCampaignMin,
  setNewCampaignMin,
  handleLaunchCampaign,
  getCampaignTypeLabel,
  getCampaignRateText,
  getCampaignUsageText,
  getCampaignProgress,
  handleToggleCampaignStatus,
  openCampaignDeleteModal,
  campaignDeleteModal,
  closeCampaignDeleteModal,
  handleDeleteCampaign,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <StatCard
            label="Toplam Kupon Kullanımı"
            value={totalCampaignUsage}
            icon="shopping_cart_checkout"
          />
          <StatCard
            label="Aktif Kampanya"
            value={activePromos.length}
            icon="savings"
            color="warning"
          />
          <StatCard
            label="Kupon Kampanyası"
            value={couponPromoCount}
            icon="trending_up"
            color="success"
          />
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-soft lg:col-span-2 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-extrabold text-stone-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">
                auto_awesome
              </span>
              Platform Kampanya Oluşturucu
            </h4>
            <p className="text-stone-400 text-xs font-semibold mb-6">
              Tüm platformda veya belirli restoranlarda geçerli yeni bir
              indirim kuponu tanımlayın.
            </p>
          </div>

          <form onSubmit={handleLaunchCampaign} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Kampanya / Promosyon Adı
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Hafta Sonu İndirimi"
                  value={newCampaignName}
                  onChange={(event) => setNewCampaignName(event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Kampanya Türü
                </label>
                <select
                  value={newCampaignType}
                  onChange={(event) => setNewCampaignType(event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                >
                  <option value="free_delivery">Teslimat Ücreti Bedava</option>
                  <option value="coupon_fixed">Sabit Tutar Kuponu</option>
                  <option value="coupon_percent">Yüzde İndirim Kuponu</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Kupon Kodu
                </label>
                <input
                  type="text"
                  required={newCampaignType !== "free_delivery"}
                  disabled={newCampaignType === "free_delivery"}
                  placeholder="Örn: HAFTA50"
                  value={newCampaignCode}
                  onChange={(event) => setNewCampaignCode(event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary disabled:opacity-45"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  {newCampaignType === "coupon_percent"
                    ? "İndirim Yüzdesi (%)"
                    : "İndirim Tutarı (TL)"}
                </label>
                <input
                  type="number"
                  required
                  disabled={newCampaignType === "free_delivery"}
                  value={newCampaignDiscount}
                  onChange={(event) =>
                    setNewCampaignDiscount(event.target.value)
                  }
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary disabled:opacity-45"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Minimum Sepet Tutarı (₺)
                </label>
                <input
                  type="number"
                  required
                  value={newCampaignMin}
                  onChange={(event) => setNewCampaignMin(event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-6 py-3 bg-primary hover:bg-primary-container text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-sm transition-all"
              >
                Yeni Kampanyayı Yayına Al
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-stone-100">
          <h4 className="text-base font-extrabold text-stone-800 uppercase tracking-wider">
            Platform Promosyonları
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                <th className="px-6 py-4">Kupon Kodu</th>
                <th className="px-4 py-4">Kupon Türü</th>
                <th className="px-4 py-4">İndirim Oranı</th>
                <th className="px-4 py-4">Şart / Limit</th>
                <th className="px-4 py-4">Kullanım Dağılımı</th>
                <th className="px-6 py-4">Durum</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
              {promos.length === 0 ? (
                <TableEmptyState colSpan="7" message="Henüz kampanya bulunmuyor." />
              ) : (
                promos.map((promo) => (
                  <tr
                    key={promo.id}
                    className="hover:bg-stone-50/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-extrabold text-stone-800 text-xs tracking-wide">
                        {promo.code || "Otomatik Kampanya"}
                      </p>
                      <p className="text-[10px] text-stone-400 font-semibold">
                        {promo.name || promo.description}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      {getCampaignTypeLabel(promo.type)}
                    </td>
                    <td className="px-4 py-4 font-black text-primary">
                      {getCampaignRateText(promo)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">
                        Min. {Number(promo.minOrder || 0)} ₺
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col w-28">
                        <span className="text-[10px] text-stone-400 font-bold mb-1">
                          {getCampaignUsageText(promo)}
                        </span>
                        <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${getCampaignProgress(promo)}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={promo.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCampaignStatus(promo)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
                            promo.status === "Aktif"
                              ? "bg-green-50 text-green-700 border-green-200 hover:bg-green-100"
                              : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
                          }`}
                          title={
                            promo.status === "Aktif"
                              ? "Pasife Al"
                              : "Aktife Al"
                          }
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {promo.status === "Aktif"
                              ? "toggle_on"
                              : "toggle_off"}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={() => openCampaignDeleteModal(promo)}
                          className="w-9 h-9 rounded-xl border border-rose-100 bg-rose-50 text-primary hover:bg-rose-100 flex items-center justify-center transition-all active:scale-95"
                          title="Kampanyayı Sil"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            delete
                          </span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={Boolean(campaignDeleteModal)}
        title="Kampanyayı Sil"
        message={`${
          campaignDeleteModal?.code ||
          campaignDeleteModal?.name ||
          "Bu kampanya"
        } silinsin mi?`}
        onClose={closeCampaignDeleteModal}
        onConfirm={handleDeleteCampaign}
      />
    </div>
  );
}

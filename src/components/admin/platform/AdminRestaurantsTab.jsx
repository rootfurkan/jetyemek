import React from "react";

export default function AdminRestaurantsTab({
  searchQuery,
  setSearchQuery,
  showAddRestaurant,
  setShowAddRestaurant,
  handleAddRestaurantSubmit,
  newRestName,
  setNewRestName,
  newRestCategory,
  setNewRestCategory,
  newRestComm,
  setNewRestCommission,
  newRestCity,
  setNewRestCity,
  newRestEmail,
  setNewRestEmail,
  newRestPassword,
  setNewRestPassword,
  filteredRestaurants,
  handleToggleRestStatus,
  openCommissionModal,
  openDeleteModal,
  commissionModal,
  closeCommissionModal,
  handleUpdateCommission,
  commissionValue,
  setCommissionValue,
  deleteModal,
  closeDeleteModal,
  handleDeleteRestaurant,
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-extrabold text-stone-400 uppercase tracking-wider">
            Restoran Listesi & Onay Kuyruğu
          </h3>
          <p className="text-stone-500 text-xs font-semibold mt-1">
            Platformdaki tüm aktif restoranların yönetimi ve yeni restoran
            onayı.
          </p>
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Restoran ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 w-full text-stone-700 placeholder-stone-400 transition-all"
            />
          </div>
          <button
            onClick={() => setShowAddRestaurant(true)}
            className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Yeni Restoran Ekle
          </button>
        </div>
      </div>

      {showAddRestaurant && (
        <form
          onSubmit={handleAddRestaurantSubmit}
          className="bg-gradient-to-br from-stone-50 to-rose-50/30 p-6 rounded-[24px] border border-stone-200/50 space-y-4 shadow-sm max-w-2xl animate-fade-in"
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="material-symbols-outlined text-primary text-xl">
              storefront
            </span>
            <h4 className="text-sm font-black text-stone-800 uppercase tracking-wider">
              Yeni Restoran Kaydı Tanımla
            </h4>
          </div>
          <p className="text-xs text-stone-500">
            Eklenen restoran anında müşteri paneline ve giriş sistemine
            yansıyacak.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Restoran Adı *
              </label>
              <input
                type="text"
                required
                placeholder="Örn: Lezzet Sofrası"
                value={newRestName}
                onChange={(e) => setNewRestName(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Kategori / Mutfak
              </label>
              <select
                value={newRestCategory}
                onChange={(e) => setNewRestCategory(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              >
                <option>Burger & Fast Food</option>
                <option>İtalyan & Pizza</option>
                <option>Ev Yemekleri</option>
                <option>Kebap & Izgara</option>
                <option>Tatlı & Kahve</option>
                <option>Asya Mutfağı</option>
                <option>Pizza</option>
                <option>Vegan</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Komisyon Oranı (%)
              </label>
              <input
                type="number"
                required
                value={newRestComm}
                onChange={(e) => setNewRestCommission(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Şehir / Bölge
              </label>
              <input
                type="text"
                required
                value={newRestCity}
                onChange={(e) => setNewRestCity(e.target.value)}
                className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="border-t border-stone-200 pt-4">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">key</span>
              Panel Giriş Bilgileri (Opsiyonel)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Giriş E-postası
                </label>
                <input
                  type="email"
                  placeholder="ornek@jetyemek.com"
                  value={newRestEmail}
                  onChange={(e) => setNewRestEmail(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Giriş Şifresi
                </label>
                <input
                  type="text"
                  placeholder="Şifre (boş = rest123)"
                  value={newRestPassword}
                  onChange={(e) => setNewRestPassword(e.target.value)}
                  className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddRestaurant(false)}
              className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-bold text-stone-600 cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[16px]">
                add_business
              </span>
              Restoranı Kaydet & Yayınla
            </button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-[28px] shadow-soft border border-stone-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                <th className="px-6 py-4">Restoran Bilgisi</th>
                <th className="px-4 py-4">Kategori</th>
                <th className="px-4 py-4 text-center">Komisyon Oranı</th>
                <th className="px-4 py-4 text-center">Ortalama Puan</th>
                <th className="px-4 py-4">Sistem Durumu</th>
                <th className="px-6 py-4 text-right">İşlemler</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
              {filteredRestaurants.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-8 text-center text-stone-400 font-bold"
                  >
                    Restoran bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredRestaurants.map((rest) => (
                  <tr
                    key={rest.id}
                    className="hover:bg-stone-50/40 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={rest.image || rest.img}
                          alt={rest.name}
                          className="w-10 h-10 object-cover rounded-xl shadow-sm border border-stone-100"
                        />
                        <div>
                          <p className="font-extrabold text-stone-800 text-xs">
                            {rest.name}
                          </p>
                          <p className="text-[10px] text-stone-400 font-semibold">
                            {rest.city}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                        {rest.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-center font-extrabold text-stone-800">
                      %{(parseFloat(rest.commission) || 0).toFixed(1)}
                    </td>
                    <td className="px-4 py-4 text-center text-amber-500 font-black">
                      <div className="flex items-center justify-center gap-0.5">
                        <span className="material-symbols-outlined text-[14px]">
                          star
                        </span>
                        {rest.rating}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                          rest.status === "Aktif"
                            ? "bg-green-50 text-green-700 border border-green-200"
                            : "bg-stone-100 text-stone-500 border border-stone-200"
                        }`}
                      >
                        {rest.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleToggleRestStatus(rest.id)}
                          className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                          title="Aktif/Pasif Durumu Değiştir"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            sync
                          </span>
                        </button>
                        <button
                          onClick={() => openCommissionModal(rest)}
                          className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                          title="Komisyon Oranını Güncelle"
                        >
                          <span className="material-symbols-outlined text-[16px]">
                            percent
                          </span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(rest)}
                          className="p-1.5 hover:bg-rose-50 border border-rose-100 rounded-lg shadow-sm text-primary"
                          title="Restoranı Sil"
                        >
                          <span className="material-symbols-outlined text-[16px]">
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

      {commissionModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateCommission}
            className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-black text-stone-800">
                  Komisyon Oranı
                </h4>
                <p className="text-xs text-stone-400 font-semibold mt-1">
                  {commissionModal.name}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCommissionModal}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                Yeni Komisyon Oranı (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={commissionValue}
                  onChange={(event) => setCommissionValue(event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-stone-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-black">
                  %
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeCommissionModal}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
              >
                Kaydet
              </button>
            </div>
          </form>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="w-11 h-11 rounded-2xl bg-rose-50 text-primary flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined">delete</span>
                </div>
                <h4 className="text-lg font-black text-stone-800">
                  Restoranı Sil
                </h4>
                <p className="text-xs text-stone-500 font-semibold mt-2 leading-relaxed">
                  <span className="font-black text-stone-800">
                    {deleteModal.name}
                  </span>{" "}
                  restoranını platformdan kaldırmak istediğine emin misin?
                </p>
              </div>
              <button
                type="button"
                onClick={closeDeleteModal}
                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={closeDeleteModal}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer"
              >
                İptal
              </button>
              <button
                type="button"
                onClick={handleDeleteRestaurant}
                className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

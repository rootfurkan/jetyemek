import React from "react";

// Yeni restoran oluşturma formunu gösterir.
export default function RestaurantCreateForm({
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
  setShowAddRestaurant,
}) {
  return (
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
        Eklenen restoran anında müşteri paneline ve giriş sistemine yansıyacak.
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
  );
}

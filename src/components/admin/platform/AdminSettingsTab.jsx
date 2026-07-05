import React from 'react';

// Platform sistem ayarları formunu gösterir.
export default function AdminSettingsTab({
  settingsLoading,
  settingsSaving,
  baseCommission,
  setBaseCommission,
  baseDeliveryFee,
  setBaseDeliveryFee,
  emailNotifs,
  setEmailNotifs,
  smsNotifs,
  setSmsNotifs,
  visibleAdminAvatar,
  visibleAdminName,
  adminProfileName,
  setAdminProfileName,
  adminEmail,
  setAdminProfileEmail,
  adminAvatar,
  setAdminAvatar,
  handleResetSystemSettings,
  handleSaveSystemSettings,
}) {
  return (
    <div className="space-y-6 pb-24 animate-fade-in">
      {settingsLoading && (
        <div className="bg-white border border-stone-100 rounded-2xl px-5 py-3 text-xs font-bold text-stone-500 shadow-soft flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[18px] animate-spin">
            progress_activity
          </span>
          Sistem ayarları yükleniyor...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">settings_suggest</span>
              Sistem Genel Parametreleri
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Varsayılan Komisyon Ücreti (%)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">
                    %
                  </span>
                  <input
                    type="number"
                    value={baseCommission}
                    onChange={(event) => setBaseCommission(event.target.value)}
                    className="w-full pl-10 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-400 font-semibold mt-1">
                  Platformdaki tüm restoranlar için taban komisyon oranı.
                </p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Varsayılan Teslimat Ücreti (₺)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">
                    ₺
                  </span>
                  <input
                    type="text"
                    value={baseDeliveryFee}
                    onChange={(event) => setBaseDeliveryFee(event.target.value)}
                    className="w-full pl-10 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <p className="text-[10px] text-stone-400 font-semibold mt-1">
                  Sistem başlangıç kurye taşıma bedeli parametresi.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              Platform Sistem Bildirimleri
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="flex gap-3 items-center">
                  <span className="material-symbols-outlined text-stone-500">mail</span>
                  <div>
                    <p className="text-xs font-extrabold text-stone-800 leading-tight">
                      E-posta Bildirimleri
                    </p>
                    <p className="text-[10px] text-stone-400 font-semibold mt-0.5">
                      Yeni restoran kayıtları ve platform haftalık mutabakat özetleri
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifs}
                    onChange={() => setEmailNotifs(!emailNotifs)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="flex gap-3 items-center">
                  <span className="material-symbols-outlined text-stone-500">sms</span>
                  <div>
                    <p className="text-xs font-extrabold text-stone-800 leading-tight">
                      SMS Uyarıları
                    </p>
                    <p className="text-[10px] text-stone-400 font-semibold mt-0.5">
                      Kritik sunucu yükü, ödeme gecikmeleri veya sistem kesintileri
                    </p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={smsNotifs}
                    onChange={() => setSmsNotifs(!smsNotifs)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={visibleAdminAvatar}
                alt={visibleAdminName}
                className="w-24 h-24 rounded-full border-4 border-rose-50 object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>

            <h4 className="text-sm font-black text-stone-800">{visibleAdminName}</h4>
            <p className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wide mt-0.5">
              Süper Admin
            </p>

            <div className="w-full space-y-4 mt-6">
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  value={adminProfileName}
                  onChange={(event) => setAdminProfileName(event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  E-posta Adresi
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(event) => setAdminProfileEmail(event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                  Profil Fotoğrafı URL
                </label>
                <input
                  type="url"
                  value={adminAvatar}
                  onChange={(event) => setAdminAvatar(event.target.value)}
                  placeholder="https://..."
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-[20px] p-4 shadow-2xl border border-stone-100 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={handleResetSystemSettings}
            disabled={settingsLoading || settingsSaving}
            className="px-5 py-3 bg-stone-100 hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed text-stone-600 font-bold text-xs rounded-full transition-all cursor-pointer"
          >
            İptal Et
          </button>
          <button
            type="button"
            onClick={handleSaveSystemSettings}
            disabled={settingsLoading || settingsSaving}
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-xs rounded-full transition-all cursor-pointer shadow-md shadow-primary/20"
          >
            {settingsSaving ? 'Kaydediliyor...' : 'Sistem Ayarlarını Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
}

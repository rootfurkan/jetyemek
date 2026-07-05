import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice.js';
import { ToastProvider } from '../common/components/Toast.jsx';
import api from '../services/api.js';

const DEFAULT_ADMIN_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCW3F7uh6g1Kznczffnq89_eaBUXJq8xASo0zbD3eje_5FDbt5YvAYODYbkYpUnOEh1Hw2G6gPOlJBj9uGmtICPXc7xJGIts_Pe7soyVnnalozY_lL_RLoT8N3gng22vnqC7Q9hGG5FCSn-TtpYKjeTzSZuIxZvnd0sQnEKV_eeRZPLl6XSdbmnYHOffUF_DfOylLNs5qVH5kcor9EUg-LfQCi8dLcsRuaNNac3lG-cjyMYLGlcECKbklmwsAXuYFS93v2MYPGR6Ug';

// Admin panelinin sidebar, header ve içerik alanını kurar.
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const [platformSettings, setPlatformSettings] = useState(null);

  const activePath = location.pathname;
  const menuItems = [
    { name: 'Sistem Özeti', icon: 'monitoring', path: '/admin' },
    { name: 'Restoranlar', icon: 'storefront', path: '/admin/restaurants' },
    { name: 'Kullanıcılar', icon: 'people', path: '/admin/users' },
    { name: 'Tüm Siparişler', icon: 'receipt_long', path: '/admin/orders' },
    { name: 'Kuryeler', icon: 'sports_motorsports', path: '/admin/couriers' },
    { name: 'Kampanyalar', icon: 'campaign', path: '/admin/campaigns' },
    { name: 'Yorumlar', icon: 'reviews', path: '/admin/reviews' },
    { name: 'Finansal Analiz', icon: 'payments', path: '/admin/finance' },
    { name: 'Sistem Ayarları', icon: 'settings_suggest', path: '/admin/settings' },
  ];

// Admin çıkışını yapıp login sayfasına döndürür.
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  useEffect(() => {
// Header ve sidebar için platform ayarlarını yükler.
    async function loadPlatformSettings() {
      try {
        const response = await api.get('/settings');
        setPlatformSettings((response.data || [])[0] || null);
      } catch (error) {
        setPlatformSettings(null);
      }
    }

// Ayarlar değişince admin bilgilerini ekrana yansıtır.
    const handleSettingsUpdated = (event) => {
      setPlatformSettings(event.detail || null);
    };

    loadPlatformSettings();
    window.addEventListener('platformSettingsUpdated', handleSettingsUpdated);

    return () => {
      window.removeEventListener('platformSettingsUpdated', handleSettingsUpdated);
    };
  }, []);

  const adminName = platformSettings?.adminName || currentUser?.name || 'Platform Admin';
  const adminEmail = platformSettings?.adminEmail || currentUser?.email || 'admin@jetyemek.com';
  const adminAvatar = platformSettings?.adminAvatar || currentUser?.avatar || DEFAULT_ADMIN_AVATAR;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-50/40 flex text-stone-800 font-sans antialiased">
        <aside className="w-72 bg-white border-r border-rose-100/10 flex flex-col py-6 px-4 shrink-0 fixed top-0 bottom-0 left-0 z-40 shadow-sm">
          <div
            onClick={() => navigate('/')}
            className="mb-8 px-3 flex items-center gap-2 cursor-pointer group active:scale-95 transition-all"
          >
            <div className="w-10 h-10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-3xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-primary font-sans select-none leading-tight">JetYemek</h1>
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Admin Paneli</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1.5">
            {menuItems.map((item) => {
              const isActive = activePath === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                    isActive
                      ? 'bg-rose-50 text-primary border border-rose-100 shadow-sm'
                      : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.name}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
            <div className="flex items-center gap-3 px-4 py-2 mb-1">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-rose-100 flex-shrink-0 bg-rose-50">
                <img
                  src={adminAvatar}
                  alt={adminName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-stone-800 truncate">{adminName}</p>
                <p className="text-[10px] text-primary font-semibold truncate">{adminEmail}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 h-11 rounded-xl text-xs font-extrabold text-stone-500 hover:bg-red-50 hover:text-red-500 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Çıkış Yap
            </button>
          </div>
        </aside>

        <div className="flex-1 pl-72 flex flex-col min-h-screen">
          <header className="h-16 border-b border-stone-100/80 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
            <div>
              <h2 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">Sistem Kontrol Merkezi</h2>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                ● Sistem Aktif
              </span>
              <div className="hidden sm:block text-right">
                <p className="text-xs font-black text-stone-800 leading-tight">{adminName}</p>
                <p className="text-[10px] font-bold text-stone-400 leading-tight">{adminEmail}</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-rose-50 overflow-hidden border border-rose-100">
                <img
                  src={adminAvatar}
                  alt={adminName}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </header>

          <main className="flex-grow p-8 bg-stone-50/40">
            <Outlet />
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}

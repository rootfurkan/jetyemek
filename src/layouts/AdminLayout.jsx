import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice.js';
import { ToastProvider } from '../common/components/Toast.jsx';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const activePath = location.pathname;
  const menuItems = [
    { name: 'Sistem Özeti', icon: 'monitoring', path: '/admin' },
    { name: 'Restoranlar', icon: 'storefront', path: '/admin/restaurants' },
    { name: 'Kullanıcılar', icon: 'people', path: '/admin/users' },
    { name: 'Tüm Siparişler', icon: 'receipt_long', path: '/admin/orders' },
    { name: 'Kuryeler', icon: 'sports_motorsports', path: '/admin/couriers' },
    { name: 'Kampanyalar', icon: 'campaign', path: '/admin/campaigns' },
    { name: 'Finansal Analiz', icon: 'payments', path: '/admin/finance' },
    { name: 'Sistem Ayarları', icon: 'settings_suggest', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

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
            {currentUser && (
              <div className="flex items-center gap-3 px-4 py-2 mb-1">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 flex-shrink-0 bg-stone-100">
                  {currentUser.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-stone-300 text-[18px] w-full h-full flex items-center justify-center">admin_panel_settings</span>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-stone-800 truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-primary font-semibold uppercase tracking-wide">Admin</p>
                </div>
              </div>
            )}

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
              <div className="w-8 h-8 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="material-symbols-outlined text-stone-300 text-[18px] w-full h-full flex items-center justify-center">admin_panel_settings</span>
                )}
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

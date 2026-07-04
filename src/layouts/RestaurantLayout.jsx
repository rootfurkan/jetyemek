import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice.js';
import { ToastProvider } from '../common/components/Toast.jsx';

export default function RestaurantLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login', { replace: true });
  };

  const activePath = location.pathname;

  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-50/40 flex text-stone-800 font-sans antialiased">
      {/* 1. Left Fixed Sidebar Navigation Panel */}
      <aside className="w-72 bg-white border-r border-rose-100/10 flex flex-col py-6 px-4 shrink-0 fixed top-0 bottom-0 left-0 z-40 shadow-sm">
        {/* Brand Header */}
        <div className="mb-8 px-3 flex items-center gap-3">
          <div 
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-md shadow-primary/10 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">fastfood</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-primary leading-tight select-none cursor-pointer" onClick={() => navigate('/')}>CraveDash</h1>
            <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Restoran Paneli</p>
          </div>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 space-y-1.5">
          {[
            { name: 'Genel Bakış', icon: 'dashboard', path: '/restaurant' },
            { name: 'Canlı Siparişler', icon: 'notifications_active', path: '/restaurant/orders' },
            { name: 'Menü Yönetimi', icon: 'restaurant_menu', path: '/restaurant/menu' },
            { name: 'Değerlendirmeler', icon: 'star', path: '/restaurant/reviews' },
            { name: 'Finansal Rapor', icon: 'payments', path: '/restaurant/finance' },
            { name: 'Restoran Ayarları', icon: 'settings', path: '/restaurant/settings' },
          ].map((item) => {
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

        {/* Footer actions inside Sidebar */}
        <div className="pt-4 border-t border-stone-100 flex flex-col gap-2">
          {currentUser && (
            <div className="flex items-center gap-3 px-4 py-2 mb-1">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-200 flex-shrink-0">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-stone-800 truncate">{currentUser.name}</p>
                <p className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">Restoran</p>
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

      {/* 2. Right Main View Panel (Offsetted by Sidebar Width) */}
      <div className="flex-1 pl-72 flex flex-col min-h-screen">
        <header className="h-16 border-b border-stone-100/80 bg-white flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <h2 className="text-sm font-extrabold text-stone-800 uppercase tracking-wider">
              {currentUser?.name || 'Restoran Paneli'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase tracking-wider">● Açık</span>
            <div className="w-8 h-8 rounded-full bg-stone-100 overflow-hidden border border-stone-200">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbFlmGUJoFqTdp_jj1c_h9q9nHWfua_407ovHmjpcgVSjMMJHdZzWRfQAfyF-7W7zedVonUz_0hGgC0xWv5ELAjQpUB5gOH75fWXWzTu9CwkuHItfDaqRqTgfG4mCp3-yZIdmkyeJxHILqjP2UuG7sWmRqq2FoiJSf2cnGTyO_dK9vatCfnz3oB7A-JPSMp223cPtz4wu0jLv6zH3HlmjYRT_ftlM0FTEWpQ5tPsPlFLc7EddyiS6KxhI33yDZJYZq1WdSNqmIu5A" alt="Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-grow p-8">
          <Outlet />
        </main>
      </div>
      </div>
    </ToastProvider>
  );
}

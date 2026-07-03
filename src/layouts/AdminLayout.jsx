import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/auth/authSlice.js';
import { ToastProvider } from '../common/components/Toast.jsx';

export default function AdminLayout() {
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
      <div className="min-h-screen bg-[#0d0f12] text-stone-300 flex font-sans antialiased">
      {/* Sidebar Panel for Platform Super Admin */}
      <aside className="w-72 bg-[#16121a] border-r border-stone-800 flex flex-col py-6 px-4 shrink-0 fixed top-0 bottom-0 left-0 z-40">
        {/* Brand Header with platform tag */}
        <div className="mb-8 px-3 flex items-center gap-3">
          <div 
            onClick={() => navigate('/')}
            className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-md shadow-primary/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[24px]">shield</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-white leading-tight cursor-pointer" onClick={() => navigate('/')}>CraveDash</h1>
            <p className="text-[10px] font-extrabold text-[#79a2ff] uppercase tracking-wider">Platform Super Admin</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1">
          {[
            { name: 'Sistem Özeti', icon: 'monitoring', path: '/admin' },
            { name: 'Restoranlar', icon: 'storefront', path: '/admin/restaurants' },
            { name: 'Kullanıcılar', icon: 'people', path: '/admin/users' },
            { name: 'Tüm Siparişler', icon: 'receipt_long', path: '/admin/orders' },
            { name: 'Kuryeler', icon: 'sports_motorsports', path: '/admin/couriers' },
            { name: 'Kampanyalar', icon: 'campaign', path: '/admin/campaigns' },
            { name: 'Finansal Analiz', icon: 'finance', path: '/admin/finance' },
            { name: 'Sistem Ayarları', icon: 'settings_suggest', path: '/admin/settings' },
          ].map((item) => {
            const isActive = activePath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-bold uppercase tracking-wide transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20 font-black' 
                    : 'text-stone-400 hover:bg-[#1a2026] hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* Kullanıcı Bilgisi & Çıkış */}
        <div className="pt-4 border-t border-stone-800 flex flex-col gap-2">
          {currentUser && (
            <div className="flex items-center gap-3 px-4 py-2 mb-1">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-stone-700 flex-shrink-0">
                <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-wide">Super Admin</p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 h-11 rounded-xl text-xs font-bold text-stone-400 hover:bg-red-950/40 hover:text-red-400 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Main viewport */}
      <div className="flex-1 pl-72 flex flex-col min-h-screen">
        <header className="h-16 border-b border-stone-800/80 bg-[#12161a] flex items-center justify-between px-8 sticky top-0 z-30">
          <div>
            <h2 className="text-xs font-extrabold text-[#79a2ff] uppercase tracking-widest">Sistem Kontrol Merkezi</h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider">● Sistem Aktif</span>
            <div className="w-8 h-8 rounded-full bg-stone-700 overflow-hidden border border-stone-600">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1OnzU0H07Jl19OAJhRmnrjZ1nAia79SjMtiOy3icj_YvZO5DNspysFfERiG-MU5GAqwRkXTj-VdE5FNzuC503l8VsgNko6DqRo3LlwHUacAkoepZaI4yDBXXY4qRe44OrrodkHRwmf9nEd3gnRjdgAgTorRBJeWhqfVu9Q9BWI8BafCM9juKMCEArpEvFb5Czp_JVB6lLvLJxMMRdTywYRRpHSle7Bg_4btImvyUWekAuCeN2AcTlYQ" alt="Super Admin Avatar" className="w-full h-full object-cover" />
            </div>
          </div>
        </header>

        <main className="flex-grow p-8 bg-[#0b0c0f]">
          <Outlet />
        </main>
      </div>
      </div>
    </ToastProvider>
  );
}

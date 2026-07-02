import React from 'react';

export default function Sidebar({ 
  activeSubSection, 
  setActiveSubSection, 
  userProfile, 
  onChangeAvatar,
  onEnterAdmin,
  onEnterSuperAdmin
}) {
  const menuItems = [
    { id: 'orders', label: 'Siparişlerim', icon: 'receipt_long' },
    { id: 'profile', label: 'Kişisel Bilgiler', icon: 'person' },
    { id: 'cards', label: 'Kartlarım', icon: 'credit_card' },
    { id: 'preferences', label: 'Tercihler', icon: 'notifications' }
  ];

  return (
    <aside className="w-full md:w-72 flex flex-col gap-6 shrink-0">
      {/* Profile Summary Card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-100 flex flex-col items-center text-center relative overflow-hidden group">
        <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-secondary"></div>
        <div className="relative mb-4 mt-2">
          <img 
            className="w-24 h-24 rounded-full object-cover border-4 border-rose-50 shadow-inner group-hover:scale-105 transition-transform duration-300" 
            alt={`${userProfile.name} ${userProfile.surname}`} 
            src={userProfile.avatar} 
          />
          <button 
            onClick={onChangeAvatar}
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-secondary hover:scale-110 active:scale-95 transition-all flex items-center justify-center cursor-pointer border border-white"
          >
            <span className="material-symbols-outlined text-sm select-none">
              edit
            </span>
          </button>
        </div>
        <h3 className="text-lg font-bold text-stone-800">
          {userProfile.name} {userProfile.surname}
        </h3>
        <p className="text-xs text-stone-500 font-mono mt-0.5">
          {userProfile.email}
        </p>
      </div>

      {/* Vertical Navigation Panel */}
      <div className="flex-1 flex flex-col justify-between">
        <nav className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col p-2 gap-1">
          {menuItems.map((item) => {
            const isActive = activeSubSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSubSection(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`flex items-center gap-4 p-4 rounded-2xl text-left font-semibold text-sm transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-rose-50/75 text-primary shadow-sm shadow-rose-50' 
                    : 'text-stone-600 hover:bg-stone-50/70 hover:text-stone-900'
                }`}
              >
                <span 
                  className={`material-symbols-outlined text-[20px] select-none ${
                    isActive ? 'text-primary' : 'text-stone-400'
                  }`}
                  style={{ fontVariationSettings: isActive ? "'FILL' 1" : undefined }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Restaurant panel switch button */}
        {onEnterAdmin && (
          <button 
            onClick={onEnterAdmin}
            className="flex items-center gap-4 text-stone-700 bg-stone-100 hover:bg-stone-200 p-4 transition-all mt-4 rounded-2xl border border-stone-200 shadow-sm cursor-pointer font-black text-sm"
          >
            <span className="material-symbols-outlined text-[20px] select-none text-stone-500">
              storefront
            </span>
            <span>Restoran Paneli</span>
          </button>
        )}

        {/* Super Admin panel switch button */}
        {onEnterSuperAdmin && (
          <button 
            onClick={onEnterSuperAdmin}
            className="flex items-center gap-4 text-white bg-primary hover:bg-primary-container p-4 transition-all mt-3 rounded-2xl shadow-md shadow-primary/10 cursor-pointer font-black text-sm"
          >
            <span className="material-symbols-outlined text-[20px] select-none text-white">
              admin_panel_settings
            </span>
            <span>Admin Paneli</span>
          </button>
        )}

        {/* Quick logout link button at the bottom */}
        <button 
          onClick={() => alert("Kullanıcı çıkış işlemi (Frontend demosu)")}
          className="flex items-center gap-4 text-stone-500 hover:text-primary p-4 hover:bg-rose-50/20 transition-all mt-4 bg-white rounded-2xl shadow-sm border border-stone-100/80 cursor-pointer font-semibold text-sm"
        >
          <span className="material-symbols-outlined text-[20px] select-none text-stone-400">
            logout
          </span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}

import React from 'react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  cartCount, 
  cartTotal, 
  onSearch, 
  userProfile,
  onEnterAdmin,
  onEnterSuperAdmin
}) {
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 lg:px-12 w-full h-16 bg-white shadow-sm border-b border-rose-100/10">
      <div className="flex items-center gap-8 w-full max-w-7xl mx-auto justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('home')} 
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer group active:scale-95 transition-all"
        >
          <img 
            alt="CraveDash" 
            className="h-9 w-9 object-contain group-hover:rotate-12 transition-transform duration-300" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCunmBa2Z-w7wmi2EaRd2bMI_kcEtLye08ui8Jcne9IWLdSWtvdm4qgwBNp7FK6ePYgO1GmFkGUQzPfMGKqA_DSqd3As4QQgCPjdova7gSMHy9h_14We2VGn3pwlJO5_BhLo0Dv1QRZqPf0IC1W9XZM3UKX_4Oqu8VBcOMHcZt-tghg5UYwBVjO4v5-J2Q4f9AWW9ceRqZYUfPsxbzm7wnqe9UWFJKWBZ5KmNCp9-Q6p1d9gM9NxdPH7YkiIWNyUAZNkS2sGpIV8Mo" 
            referrerPolicy="no-referrer"
          />
          <span className="text-xl font-extrabold tracking-tight text-primary font-sans select-none">
            CraveDash
          </span>
        </div>

        {/* Navigation links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6">
          <button 
            onClick={() => setCurrentTab('home')} 
            className={`font-semibold text-sm transition-colors duration-200 pb-1 ${
              currentTab === 'home' || currentTab === 'restaurant'
                ? 'text-primary border-b-2 border-primary' 
                : 'text-stone-500 hover:text-primary'
            }`}
          >
            Anasayfa
          </button>
          <button 
            onClick={() => setCurrentTab('cart')} 
            className={`font-semibold text-sm transition-colors duration-200 pb-1 ${
              currentTab === 'cart' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-stone-500 hover:text-primary'
            }`}
          >
            Sepetim
          </button>
          <button 
            onClick={() => {
              setCurrentTab('account');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className={`font-semibold text-sm transition-colors duration-200 pb-1 ${
              currentTab === 'account' 
                ? 'text-primary border-b-2 border-primary' 
                : 'text-stone-500 hover:text-primary'
            }`}
          >
            Siparişlerim
          </button>
        </nav>

        {/* Global Search Input */}
        <div className="hidden sm:block flex-grow max-w-md relative mx-4 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors text-[20px]">
            search
          </span>
          <input 
            onChange={(e) => onSearch && onSearch(e.target.value)}
            className="w-full bg-rose-50/40 hover:bg-rose-50/60 border border-stone-200/50 focus:border-rose-200 focus:bg-white rounded-full py-2 pl-11 pr-4 text-sm focus:ring-4 focus:ring-primary/5 transition-all text-stone-800 placeholder-stone-400 focus:outline-none" 
            placeholder="Yemek veya restoran ara..." 
            type="text" 
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Admin Panel Quick switch button */}
          <button 
            onClick={onEnterAdmin} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-[11px] font-black uppercase tracking-wide cursor-pointer transition-all active:scale-95 border border-stone-200 shadow-sm whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[15px] text-stone-500">storefront</span>
            Restoran Paneli
          </button>

          <button 
            onClick={onEnterSuperAdmin} 
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary-container rounded-full text-[11px] font-black uppercase tracking-wide cursor-pointer transition-all active:scale-95 shadow-sm shadow-primary/10 whitespace-nowrap"
          >
            <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
            Admin Paneli
          </button>

          <button className="material-symbols-outlined text-stone-500 hover:text-primary transition-colors cursor-pointer select-none text-[22px] p-1.5 rounded-full hover:bg-stone-50">
            favorite
          </button>

          {/* Cart Icon & Badge */}
          <button 
            onClick={() => setCurrentTab('cart')}
            className={`relative p-2 rounded-full flex items-center gap-1.5 hover:bg-stone-50 active:scale-95 transition-all cursor-pointer ${
              currentTab === 'cart' ? 'bg-rose-50 text-primary' : 'text-stone-600'
            }`}
          >
            <span className="material-symbols-outlined text-[22px] select-none">
              shopping_cart
            </span>
            {cartCount > 0 && (
              <>
                <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-extrabold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
                <span className="hidden lg:inline font-bold text-xs pr-1">
                  {cartTotal.toFixed(2)} TL
                </span>
              </>
            )}
          </button>

          <div className="h-6 w-[1px] bg-stone-200 hidden sm:block"></div>

          {/* Profile Quick Toggle */}
          <div 
            onClick={() => setCurrentTab('account')}
            className="flex items-center gap-2 cursor-pointer group select-none active:scale-95 transition-all"
          >
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
              <img 
                className="w-full h-full object-cover" 
                alt="Account" 
                src={userProfile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
              />
            </div>
            <span className="hidden md:inline font-semibold text-xs text-stone-700 group-hover:text-primary transition-colors">
              {userProfile?.name || "Hesabım"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../features/auth/authSlice.js';

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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const restaurantsList = useSelector((state) => state.restaurants?.list) || [];
  const menuItems = useSelector((state) => state.menu?.items) || [];

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredRestaurants = debouncedSearchTerm 
    ? restaurantsList.filter(r => 
        r.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        r.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      ).slice(0, 3) 
    : [];

  const filteredItems = debouncedSearchTerm
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleResultClick = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setIsDropdownOpen(false);
    if (onSearch) onSearch(""); 
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    if (val.trim().length > 0) {
      setIsDropdownOpen(true);
    } else {
      setIsDropdownOpen(false);
    }
    if (onSearch) onSearch(val); 
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getGreetingText = () => {
    if (!currentUser) return "Merhaba";
    if (currentUser.role === 'admin') {
      return `Merhaba, ${currentUser.name} (Admin)`;
    }
    if (currentUser.role === 'restaurant') {
      return `Merhaba, ${currentUser.name} (Restoran)`;
    }
    return `Merhaba, ${currentUser.name}`;
  };
  return (
    <header className="sticky top-0 z-50 flex justify-between items-center px-4 md:px-8 lg:px-12 w-full h-16 bg-white shadow-sm border-b border-rose-100/10">
      <div className="flex items-center gap-8 w-full max-w-7xl mx-auto justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setCurrentTab('home')} 
          className="flex items-center gap-2 flex-shrink-0 cursor-pointer group active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-primary text-3xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
          <span className="text-xl font-extrabold tracking-tight text-primary font-sans select-none">
            JetYemek
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

        {/* Global Search Input & Dropdown */}
        <div ref={dropdownRef} className="hidden sm:block flex-grow max-w-md relative mx-4 group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-primary transition-colors text-[20px]">
            search
          </span>
          <input 
            value={searchTerm}
            onChange={handleInputChange}
            onFocus={() => { if (searchTerm.trim().length > 0) setIsDropdownOpen(true); }}
            className="w-full bg-rose-50/40 hover:bg-rose-50/60 border border-stone-200/50 focus:border-rose-200 focus:bg-white rounded-full py-2 pl-11 pr-4 text-sm focus:ring-4 focus:ring-primary/5 transition-all text-stone-800 placeholder-stone-400 focus:outline-none" 
            placeholder="Yemek veya restoran ara..." 
            type="text" 
          />
          
          {/* Dropdown UI */}
          {isDropdownOpen && debouncedSearchTerm.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-stone-100 overflow-hidden z-[60]">
              {filteredRestaurants.length === 0 && filteredItems.length === 0 ? (
                <div className="p-8 text-center text-stone-500">
                  <span className="material-symbols-outlined text-4xl mb-2 text-stone-300">search_off</span>
                  <p className="text-sm font-medium">"{debouncedSearchTerm}" için sonuç bulunamadı.</p>
                </div>
              ) : (
                <div className="max-h-[60vh] overflow-y-auto no-scrollbar py-2">
                  {/* Restoranlar Bölümü */}
                  {filteredRestaurants.length > 0 && (
                    <div className="mb-2">
                      <div className="px-4 py-1.5 text-[10px] font-black tracking-wider text-stone-400 uppercase">Restoranlar</div>
                      <div className="flex flex-col">
                        {filteredRestaurants.map((restaurant) => (
                          <div 
                            key={`res-${restaurant.id}`}
                            onClick={() => handleResultClick(restaurant.id)}
                            className="px-4 py-2.5 flex items-center gap-3 hover:bg-stone-50 cursor-pointer transition-colors"
                          >
                            <img src={restaurant.image} alt={restaurant.name} className="w-10 h-10 rounded-full object-cover border border-stone-100 shadow-sm" />
                            <div>
                              <p className="text-sm font-bold text-stone-800">{restaurant.name}</p>
                              <p className="text-xs text-stone-500">{restaurant.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Yemekler Bölümü */}
                  {filteredItems.length > 0 && (
                    <div>
                      <div className="px-4 py-1.5 text-[10px] font-black tracking-wider text-stone-400 uppercase border-t border-stone-100 mt-1 pt-3">Yemekler / Ürünler</div>
                      <div className="flex flex-col">
                        {filteredItems.map((item) => {
                          const restaurant = restaurantsList.find(r => r.id === item.restaurantId);
                          return (
                            <div 
                              key={`item-${item.id}`}
                              onClick={() => handleResultClick(item.restaurantId)}
                              className="px-4 py-2.5 flex items-center justify-between hover:bg-stone-50 cursor-pointer transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                {item.image ? (
                                  <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover shadow-sm" />
                                ) : (
                                  <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-stone-400 text-[20px]">restaurant</span>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm font-bold text-stone-800 line-clamp-1">{item.name}</p>
                                  <p className="text-[11px] font-medium text-stone-500 line-clamp-1">
                                    {restaurant ? restaurant.name : "Restoran Bilinmiyor"}
                                  </p>
                                </div>
                              </div>
                              <span className="text-sm font-black text-primary whitespace-nowrap pl-2">{item.price} TL</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Admin Panel Quick switch button */}
          {isAuthenticated && currentUser?.role === 'restaurant' && (
            <button 
              onClick={onEnterAdmin} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-full text-[11px] font-black uppercase tracking-wide cursor-pointer transition-all active:scale-95 border border-stone-200 shadow-sm whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[15px] text-stone-500">storefront</span>
              Restoran Paneli
            </button>
          )}

          {isAuthenticated && currentUser?.role === 'admin' && (
            <button 
              onClick={onEnterSuperAdmin} 
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white hover:bg-primary-container rounded-full text-[11px] font-black uppercase tracking-wide cursor-pointer transition-all active:scale-95 shadow-sm shadow-primary/10 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[15px]">admin_panel_settings</span>
              Admin Paneli
            </button>
          )}

          <button 
            onClick={() => setCurrentTab('favorites')}
            className={`material-symbols-outlined transition-colors cursor-pointer select-none text-[22px] p-1.5 rounded-full hover:bg-stone-50 ${
              currentTab === 'favorites' ? 'text-primary' : 'text-stone-500 hover:text-primary'
            }`}
          >
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

          {/* Profile / Login Switcher */}
          {!isAuthenticated ? (
            <button 
              onClick={() => navigate('/login')}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-primary hover:bg-primary-container text-white rounded-full text-xs font-bold transition-all active:scale-95 shadow-md shadow-primary/10 cursor-pointer border-none"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              Giriş Yap
            </button>
          ) : (
            <div className="flex items-center gap-4">
              <div 
                onClick={() => setCurrentTab('account')}
                className="flex items-center gap-2 cursor-pointer group select-none active:scale-95 transition-all"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/20 group-hover:border-primary transition-colors">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Account" 
                    src={currentUser?.avatar || userProfile?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
                  />
                </div>
                <span className="hidden md:inline font-semibold text-xs text-stone-700 group-hover:text-primary transition-colors">
                  {getGreetingText()}
                </span>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-1 px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-primary rounded-full text-[11px] font-black uppercase tracking-wide cursor-pointer transition-all active:scale-95 border border-rose-200"
                title="Çıkış Yap"
              >
                <span className="material-symbols-outlined text-[15px]">logout</span>
                Çıkış Yap
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

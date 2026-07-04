import React, { useState } from 'react';
import { GOURMET_MENU } from '../data.jsx';
import { useToast } from '../common/components/Toast.jsx';

const formatProductTag = (tag) => {
  if (tag === 'Hot') return 'Popüler';
  if (tag === 'Bestseller') return 'En Çok Satan';
  if (tag === 'Promo') return '%25 İndirim';
  if (tag === '%25 Off') return '%25 İndirim';
  if (tag === 'New') return 'Yeni';
  return tag;
};

export default function MenuView({ onAddToCart, currentCartItems = [] }) {
  const addToast = useToast();
  const [selectedSection, setSelectedSection] = useState('Popüler');
  const [menuSearch, setMenuSearch] = useState('');

  const sections = ['Popüler', 'Burgerler', 'Yan Ürünler', 'İçecekler', 'Tatlılar'];

  // Filter items based on active section and live search input
  let displayedItems = GOURMET_MENU.filter(item => {
    const matchesSection = selectedSection === 'Popüler' || item.category === selectedSection;
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const handleAddClick = (item) => {
    onAddToCart && onAddToCart(item);
    // Simple custom alert or toast
    console.log(`Added ${item.name} to cart.`);
  };

  const getItemCountInCart = (itemId) => {
    const found = currentCartItems.find(c => c.id === itemId);
    return found ? found.quantity : 0;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section Banner */}
      <section className="relative h-80 md:h-[420px] w-full overflow-hidden rounded-[40px] shadow-lg">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[2000ms] hover:scale-105" 
          style={{ 
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdsrEu0cTgCoAyw-HYvB8hMUEXf8mijFgr2COUjT4SaGIGbQCLEVqNQtdK2e8Xtrby-L_i53rdRO3Shm6qKK1umC71PCYlkfY6Z2b4_U_drhT2luNRMPPsD2jsqX-9OZ69M1Fi545TVlxKaRypp9Q4UECwSHEIIl5rniNqVMGek6mD8eUWyFk4BxBAKJPrLuOUrTh9B7n4t4Dz5XlQ9UTGshFgZcdvb7UW042vdbpVrbqKLA00vLZ26EyNZZ11_HqBZvBwZ-sCcRU')` 
          }}
        ></div>
        <div className="absolute inset-0 hero-gradient"></div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-6 text-center">
          {/* Circular/Rounded Restaurant Brand Logo */}
          <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-[24px] p-3 mb-5 shadow-2xl transform rotate-3 hover:rotate-0 transition-all duration-500 flex items-center justify-center overflow-hidden border border-rose-50">
            <img 
              className="w-full h-full object-contain" 
              alt="Hearty Delights Brand Logo" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbFlmGUJoFqTdp_jj1c_h9q9nHWfua_407ovHmjpcgVSjMMJHdZzWRfQAfyF-7W7zedVonUz_0hGgC0xWv5ELAjQpUB5gOH75fWXWzTu9CwkuHItfDaqRqTgfG4mCp3-yZIdmkyeJxHILqjP2UuG7sWmRqq2FoiJSf2cnGTyO_dK9vatCfnz3oB7A-JPSMp223cPtz4wu0jLv6zH3HlmjYRT_ftlM0FTEWpQ5tPsPlFLc7EddyiS6KxhI33yDZJYZq1WdSNqmIu5A" 
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2 tracking-tight select-none">
            Gourmet Burger House
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1 text-white/95">
            <span className="text-xs font-bold bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/25">
              Hamburger & Pizza
            </span>
            <div className="flex items-center gap-1 text-xs font-bold bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-full border border-amber-500/30">
              <span className="material-symbols-outlined text-[15px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span>4.8</span>
              <span className="opacity-80 font-medium">(2k+ değerlendirme)</span>
            </div>
          </div>
        </div>
      </section>

      {/* Campaigns & Flash Deals Inside Restaurant */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-primary-container text-on-primary-container flex justify-between items-center group cursor-pointer shadow-md hover:shadow-lg transition-all border border-rose-100/10">
          <div className="z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-full">
              Günün Fırsatı
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mt-3 leading-tight">
              2 Menü Al 1 Bedava
            </h3>
            <p className="text-xs mt-1 text-rose-100 font-medium">
              Sadece bugüne özel siparişlerde geçerlidir!
            </p>
            <button 
              onClick={() => addToast({ message: 'Menü fırsatı seçildi! Lütfen dilediğiniz burgerleri sepete ekleyin.', type: 'info' })}
              className="mt-4 px-6 py-2.5 bg-white hover:bg-rose-50 text-primary font-extrabold text-xs rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Şimdi Sipariş Ver
            </button>
          </div>
          <div className="absolute right-4 bottom-4 w-28 h-28 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all select-none">
            <span className="material-symbols-outlined text-[110px] text-white">local_offer</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-tertiary-container text-on-tertiary-container flex justify-between items-center group cursor-pointer shadow-md hover:shadow-lg transition-all border border-sky-100/10">
          <div className="z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-full">
              Özel İndirim
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mt-3 leading-tight">
              %25 İndirim Fırsatı
            </h3>
            <p className="text-xs mt-1 text-sky-100 font-medium">
              Tüm pizza çeşitlerinde geçerli anında indirim.
            </p>
            <button 
              onClick={() => {
                setSelectedSection('Popüler');
                addToast({ message: 'Pizza ve popüler lezzetler filtrelendi!', type: 'info' });
              }}
              className="mt-4 px-6 py-2.5 bg-white hover:bg-sky-50 text-tertiary font-extrabold text-xs rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              Menüyü İncele
            </button>
          </div>
          <div className="absolute right-4 bottom-4 w-28 h-28 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all select-none">
            <span className="material-symbols-outlined text-[110px] text-white">confirmation_number</span>
          </div>
        </div>
      </section>

      {/* Categories sub-navigation Bar (Popüler, Burgerler, etc.) */}
      <nav className="sticky top-16 z-30 bg-surface/90 backdrop-blur-md border-b border-stone-200/30 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {sections.map(sec => {
            const isActive = selectedSection === sec;
            return (
              <button
                key={sec}
                onClick={() => setSelectedSection(sec)}
                className={`px-5 py-2 rounded-full font-bold text-xs whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-primary text-white shadow-md shadow-primary/20' 
                    : 'text-stone-500 hover:text-stone-800 hover:bg-stone-50'
                }`}
              >
                {sec}
              </button>
            );
          })}
        </div>

        {/* Local live Search input inside Gourmet Burger menu */}
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
            search
          </span>
          <input 
            value={menuSearch}
            onChange={(e) => setMenuSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200/60 rounded-full text-xs focus:ring-4 focus:ring-primary/5 focus:outline-none transition-all placeholder-stone-400" 
            placeholder="Menüde ara..." 
            type="text" 
          />
        </div>
      </nav>

      {/* Menu Dishes Grid */}
      <section className="pb-8">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            restaurant_menu
          </span>
          <h2 className="text-xl font-bold text-stone-800 tracking-tight">
            {selectedSection} Lezzetler
          </h2>
        </div>

        {displayedItems.length === 0 ? (
          <div className="py-12 text-center text-stone-500 bg-stone-50 rounded-3xl border border-dashed border-stone-200">
            <p className="font-semibold text-stone-700">Aradığınız kriterlerde bir yemek bulunamadı.</p>
            <p className="text-xs text-stone-400 mt-1">Lütfen arama teriminizi değiştirmeyi veya diğer kategorilere bakmayı deneyin.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedItems.map((item) => {
              const inCartQty = getItemCountInCart(item.id);
              return (
                <div 
                  key={item.id}
                  className="group bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col h-full hover:-translate-y-0.5"
                >
                  {/* Photo area */}
                  <div className="relative h-48 overflow-hidden bg-stone-100 shrink-0">
                    {item.tag && (
                      <div className="absolute top-3 right-3 z-10 flex gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest text-white shadow-sm ${
                          item.tag.includes('%') ? 'bg-secondary' : 'bg-primary'
                        }`}>
                          {formatProductTag(item.tag)}
                        </span>
                      </div>
                    )}
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt={item.name} 
                      src={item.image} 
                    />
                  </div>

                  {/* Body Details Area */}
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h4 className="text-base font-extrabold text-stone-800 group-hover:text-primary transition-colors line-clamp-1">
                          {item.name}
                        </h4>
                        <span className="text-primary font-extrabold text-base whitespace-nowrap bg-rose-50/50 px-2.5 py-0.5 rounded-lg border border-rose-100/20">
                          ₺{item.price}
                        </span>
                      </div>
                      <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-5 border-t border-stone-100/60 pt-4 flex items-center justify-between">
                      <div className="flex items-center text-xs text-stone-400 font-medium gap-1">
                        <span className="material-symbols-outlined text-[16px] text-stone-300">timer</span> 
                        <span>{item.time || '15-20 dk'}</span>
                      </div>

                      {/* Dynamic additive trigger badge button */}
                      <button 
                        onClick={() => handleAddClick(item)}
                        className="brand-gradient-bg w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-rose-900/10 hover:scale-110 active:scale-95 transition-all cursor-pointer relative"
                      >
                        <span className="material-symbols-outlined font-extrabold select-none text-[20px]">
                          add
                        </span>
                        {inCartQty > 0 && (
                          <span className="absolute -top-2 -right-2 bg-secondary border-2 border-white text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm animate-pulse-once">
                            {inCartQty}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

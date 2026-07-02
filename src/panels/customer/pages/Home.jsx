import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { FOOD_CATEGORIES } from '../../../data.jsx';

export default function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Load datasets from Redux state
  const sponsorRestaurants = useSelector((state) => state.restaurants.sponsorList);
  const restaurantGrid = useSelector((state) => state.restaurants.gridList);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [activeSort, setActiveSort] = useState(null); // 'rating', 'minOrder'
  const [searchQuery, setSearchQuery] = useState('');
  
  const scrollContainerRef = useRef(null);

  // Filter & sort logic
  let displayedRestaurants = [...restaurantGrid];

  // 1. Category filter
  if (selectedCategory) {
    displayedRestaurants = displayedRestaurants.filter(
      r => r.tag === selectedCategory
    );
  }

  // 2. Search query filter
  if (searchQuery) {
    displayedRestaurants = displayedRestaurants.filter(r => 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 3. Sorting
  if (activeSort === 'rating') {
    displayedRestaurants.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (activeSort === 'minOrder') {
    displayedRestaurants.sort((a, b) => {
      const valA = parseInt(a.minOrder.replace(/\D/g, '')) || 0;
      const valB = parseInt(b.minOrder.replace(/\D/g, '')) || 0;
      return valA - valB;
    });
  }

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const onCouponClaim = () => {
    alert("Harika! 'İLK50' kupon kodu sepetinize başarıyla tanımlandı. 50 TL indirim kazandınız!");
  };

  return (
    <div className="space-y-10 animate-fade-in">
      {/* 1. Campaign Slider Banner */}
      <section className="py-2">
        <div className="relative overflow-hidden rounded-[32px] bg-primary-container h-[360px] md:h-[400px] group shadow-xl shadow-rose-100/30">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105" 
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdjrsT9Ktj1yZGgop0d8nrS1TsyeJIP4RonQZLlchh1vlAM3nmjFdF6UNKbgug-T12zhD7iCHI9cGKLIZrOfuHK1x8_pul3qzJ4_sjG1yQXWPNmAe43xo7PvPFVy7QSqmCguNviM-K3-Ww1N4kJVBm5-gV2c8u451IRcAV6kTEWilXjikql8G4_3f9Ys9tLQQx0zKehgs4zJDZvBqbEV2XnxJnE3QzIwghdO9OKBBTzSyY6lbAV0r7xSoXwwphKDnMC3uGq2w8XjA')` 
            }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-16">
            <span className="bg-white/25 backdrop-blur-md text-white text-[11px] font-extrabold uppercase tracking-widest w-fit px-3.5 py-1.5 rounded-full mb-4">
              SINIRLI SÜRE
            </span>
            <h1 className="text-white text-4xl md:text-5xl font-extrabold leading-tight mb-6 tracking-tight">
              İlk Siparişine<br />%50 İndirim
            </h1>
            <button 
              onClick={onCouponClaim}
              className="bg-white hover:bg-rose-50 text-primary px-10 py-4 rounded-full font-extrabold text-sm md:text-base hover:shadow-2xl hover:-translate-y-0.5 transition-all w-fit cursor-pointer active:scale-95 shadow-lg shadow-black/20"
            >
              Kuponu Al
            </button>
          </div>
          <div className="absolute bottom-6 left-8 md:left-16 flex gap-2 select-none">
            <div className="w-10 h-1.5 bg-white rounded-full"></div>
            <div className="w-10 h-1.5 bg-white/30 rounded-full"></div>
            <div className="w-10 h-1.5 bg-white/30 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* 2. Sponsored Restaurants Section */}
      <section className="relative">
        <div className="flex justify-between items-end mb-6">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[28px] select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified
            </span>
            <h2 className="text-2xl font-bold text-stone-800 tracking-tight">
              Sponsorlu Restoranlar
            </h2>
          </div>
          <div className="flex gap-2 select-none">
            <button 
              onClick={() => handleScroll('left')}
              className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 active:scale-90 transition-all cursor-pointer shadow-sm flex items-center justify-center text-stone-600"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            <button 
              onClick={() => handleScroll('right')}
              className="p-2.5 rounded-full border border-stone-200 bg-white hover:bg-stone-50 hover:border-stone-300 active:scale-90 transition-all cursor-pointer shadow-sm flex items-center justify-center text-stone-600"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>
        </div>

        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-2 -mx-2 px-2"
        >
          {sponsorRestaurants.map((rest) => (
            <div 
              key={rest.id}
              onClick={() => navigate('/restaurant/' + rest.id)}
              className="min-w-[280px] sm:min-w-[310px] max-w-[310px] group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-stone-100 hover:border-rose-100/50 transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100 shrink-0">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={rest.name} 
                  src={rest.image} 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-xs font-bold text-stone-800 shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>{rest.rating}</span>
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <h3 className="text-base font-bold text-stone-800 group-hover:text-primary transition-colors line-clamp-1">
                  {rest.name}
                </h3>
                <div className="flex items-center gap-4 text-stone-500 text-xs mt-3">
                  <div className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-stone-400">schedule</span>
                    <span>{rest.time}</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-bold">
                    <span className="material-symbols-outlined text-[16px]">delivery_dining</span>
                    <span>{rest.deliveryFee}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Category Circles Selector */}
      <section>
        <h2 className="text-lg font-bold text-stone-800 mb-6 tracking-tight">
          Bugün Ne Yemek İstersin?
        </h2>
        <div className="flex items-center gap-5 overflow-x-auto no-scrollbar pb-3">
          {FOOD_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? null : cat.id)}
                className="flex flex-col items-center gap-2.5 min-w-[76px] group cursor-pointer focus:outline-none"
              >
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 active:scale-90 ${
                    isSelected 
                      ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105' 
                      : 'bg-rose-50/50 hover:bg-rose-50 text-stone-600 group-hover:scale-105 group-hover:text-primary border border-stone-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[28px] select-none">
                    {cat.icon}
                  </span>
                </div>
                <span 
                  className={`text-[12px] font-bold transition-colors ${
                    isSelected ? 'text-primary' : 'text-stone-500 group-hover:text-primary'
                  }`}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. Sorting & Filters Bar */}
      <div className="sticky top-16 z-30 bg-white/85 backdrop-blur-md py-4 border-b border-stone-200/40 flex gap-3 overflow-x-auto no-scrollbar items-center justify-between">
        <div className="flex gap-2.5">
          <button 
            onClick={() => setActiveSort(activeSort === 'rating' ? null : 'rating')}
            className={`px-5 py-2.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              activeSort === 'rating'
                ? 'border-primary bg-primary text-white'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">grade</span>
            En Yüksek Puan
          </button>

          <button 
            onClick={() => setActiveSort(activeSort === 'minOrder' ? null : 'minOrder')}
            className={`px-5 py-2.5 rounded-full border text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
              activeSort === 'minOrder'
                ? 'border-primary bg-primary text-white'
                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">sort</span>
            Minimum Sipariş
          </button>
        </div>

        {(selectedCategory || activeSort || searchQuery) && (
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setActiveSort(null);
              setSearchQuery('');
            }}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Local Live Search for Restaurant List */}
      <div className="sm:hidden relative w-full mb-4">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-[20px]">
          search
        </span>
        <input 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-stone-50 border border-stone-200 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" 
          placeholder="Yemek veya restoran ara..." 
          type="text" 
        />
      </div>

      {/* 5. Restaurants Grid Section */}
      <section>
        {displayedRestaurants.length === 0 ? (
          <div className="py-16 text-center text-stone-500 bg-stone-50 rounded-3xl border border-dashed border-stone-200/80">
            <span className="material-symbols-outlined text-5xl text-stone-300 select-none">
              restaurant
            </span>
            <p className="mt-4 font-bold">Aradığınız kriterlere uygun restoran bulunamadı.</p>
            <button 
              onClick={() => {
                setSelectedCategory(null);
                setActiveSort(null);
                setSearchQuery('');
              }}
              className="mt-3 text-sm text-primary hover:underline font-semibold"
            >
              Tüm restoranları gör
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedRestaurants.map((rest) => (
              <div 
                key={rest.id}
                onClick={() => navigate('/restaurant/' + rest.id)}
                className="group relative bg-white rounded-3xl overflow-hidden border border-stone-100 hover:border-rose-100/40 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative h-48 overflow-hidden bg-stone-100 shrink-0">
                  <img 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    alt={rest.name}
                    src={rest.image} 
                  />
                  {!rest.isOpen && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-white/90 text-stone-800 px-4 py-1.5 rounded-full font-bold text-xs shadow-md">
                        Geçici Olarak Kapalı
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3 right-3 z-10 flex gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        alert(`${rest.name} favorilere eklendi!`);
                      }}
                      className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-stone-600 hover:text-primary hover:bg-white active:scale-90 transition-all shadow-sm flex items-center justify-center cursor-pointer border border-white/50"
                    >
                      <span className="material-symbols-outlined text-[18px]">favorite</span>
                    </button>
                  </div>
                </div>

                <div className="p-5 flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <h3 className="font-bold text-stone-800 leading-tight group-hover:text-primary transition-colors text-base truncate">
                        {rest.name}
                      </h3>
                      <div className="bg-stone-50 border border-stone-100 px-2 py-0.5 rounded-lg flex items-center gap-1 shrink-0">
                        <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-xs font-bold text-stone-700">{rest.rating}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 text-stone-500 text-xs mt-3">
                      <span className="bg-stone-100/80 text-stone-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        {rest.category}
                      </span>
                      <div className="flex items-center gap-1 text-stone-400">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>
                        <span>{rest.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-stone-100 mt-4 pt-3 flex items-center justify-between">
                    <span className="text-xs text-stone-400">Min. Sipariş</span>
                    <span className="text-xs font-extrabold text-primary bg-rose-50/50 px-2.5 py-1 rounded-lg">
                      {rest.minOrder}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

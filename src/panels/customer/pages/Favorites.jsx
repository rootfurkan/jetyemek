import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toggleFavorite } from '../../../features/auth/authSlice.js';
import { useToast } from '../../../common/components/Toast.jsx';

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToast = useToast();

  // Load state from Redux
  const favoritedIds = useSelector((state) => state.auth.favorites) || [];
  const sponsorRestaurants = useSelector((state) => state.restaurants.sponsorList) || [];
  const restaurantGrid = useSelector((state) => state.restaurants.gridList) || [];

  // Combine lists to search for favorited restaurants
  const allRestaurants = [];
  const seenIds = new Set();

  [...sponsorRestaurants, ...restaurantGrid].forEach(rest => {
    if (!seenIds.has(rest.id)) {
      seenIds.add(rest.id);
      allRestaurants.push(rest);
    }
  });

  const favoriteRestaurants = allRestaurants.filter(rest => favoritedIds.includes(rest.id));

  const handleToggleFavorite = (rest, e) => {
    e.stopPropagation();
    dispatch(toggleFavorite(rest.id));
    addToast({ message: `${rest.name} favorilerden çıkarıldı.`, type: 'info' });
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary text-3xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
          favorite
        </span>
        <h1 className="text-2xl font-bold text-stone-800 tracking-tight">Favori Restoranlarım</h1>
      </div>

      {favoriteRestaurants.length === 0 ? (
        <div className="py-20 text-center max-w-xl mx-auto bg-white rounded-[32px] border border-stone-100 shadow-sm p-8">
          <span className="material-symbols-outlined text-6xl text-rose-200 select-none">
            favorite
          </span>
          <h2 className="text-xl font-bold text-stone-800 mt-4">Favori Restoranınız Yok</h2>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Beğendiğiniz restoranları favorilerinize ekleyerek daha hızlı sipariş verebilirsiniz.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="mt-6 px-8 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-full shadow-md active:scale-95 transition-all cursor-pointer border-none"
          >
            Lezzetleri Keşfet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteRestaurants.map((rest) => (
            <div 
              key={rest.id}
              onClick={() => navigate('/restaurant/' + rest.id)}
              className="group relative bg-white rounded-3xl overflow-hidden border border-stone-100 hover:border-rose-100/40 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100 shrink-0">
                <img 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  alt={rest.name} 
                  src={rest.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80"} 
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-xl text-xs font-bold text-stone-800 shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span>{rest.rating}</span>
                </div>
                <div className="absolute top-3 left-3 z-10 flex gap-2">
                  <button 
                    onClick={(e) => handleToggleFavorite(rest, e)}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full text-primary hover:bg-white active:scale-90 transition-all shadow-sm flex items-center justify-center cursor-pointer border border-white/50"
                  >
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      favorite
                    </span>
                  </button>
                </div>
              </div>
              <div className="p-5 flex-grow flex flex-col justify-between">
                <h3 className="text-base font-bold text-stone-800 group-hover:text-primary transition-colors line-clamp-1">
                  {rest.name}
                </h3>
                <p className="text-xs text-stone-400 mt-1 font-semibold">{rest.category}</p>
                <div className="flex items-center gap-4 text-stone-500 text-xs mt-3 border-t border-stone-50 pt-3">
                  <div className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-stone-400">schedule</span>
                    <span>{rest.time || '25-35 dk'}</span>
                  </div>
                  <div className="flex items-center gap-1 font-medium">
                    <span className="material-symbols-outlined text-[16px] text-stone-400">shopping_bag</span>
                    <span>{rest.minOrder || '150 TL'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

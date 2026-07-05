import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { toggleFavoriteAsync } from '../../../features/auth/authSlice.js';
import { useToast } from '../../../common/components/Toast.jsx';

export default function Favorites() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const addToast = useToast();

  // Auth kontrolü
  const { isAuthenticated } = useSelector((state) => state.auth);

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
    dispatch(toggleFavoriteAsync(rest.id));
    addToast({ message: `${rest.name} favorilerden çıkarıldı.`, type: 'info' });
  };

  // Giriş yapılmamış kullanıcı için şık ekran
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        <div className="max-w-sm mx-auto">
          {/* İkon */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-rose-50 border-4 border-rose-100 flex items-center justify-center">
              <span
                className="material-symbols-outlined text-5xl text-rose-300 select-none"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 left-1/2 translate-x-4 w-8 h-8 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-amber-400 text-lg select-none">lock</span>
            </div>
          </div>

          {/* Metin */}
          <h2 className="text-2xl font-bold text-stone-800 tracking-tight">Favori Restoranlarım</h2>
          <p className="text-stone-500 text-sm mt-3 leading-relaxed">
            Favori restoranlarınızı görüntüleyebilmek ve yeni favoriler ekleyebilmek için giriş yapmanız gerekmektedir.
          </p>

          {/* Butonlar */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
            <Link
              to="/login"
              className="px-8 py-3 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold rounded-full shadow-lg shadow-rose-300/40 transition-all hover:-translate-y-px active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">login</span>
              Giriş Yap
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-white border-2 border-rose-200 text-rose-700 font-bold rounded-full hover:bg-rose-50 transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">person_add</span>
              Kayıt Ol
            </Link>
          </div>

          {/* Devam Et Linki */}
          <button
            onClick={() => navigate('/')}
            className="mt-5 text-stone-400 text-xs font-medium hover:text-stone-600 transition-colors cursor-pointer border-none bg-transparent underline underline-offset-2"
          >
            Giriş yapmadan devam et →
          </button>
        </div>
      </div>
    );
  }

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

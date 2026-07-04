import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { addToCart } from '../../../features/cart/cartSlice.js';
import { fetchReviews } from '../../../features/reviews/reviewsSlice.js';
import { useToast } from '../../../common/components/Toast.jsx';
import Modal from '../../../common/components/Modal.jsx';

export default function RestaurantMenu() {
  const dispatch = useDispatch();
  const addToast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: restaurantId } = useParams();

  // Redux'tan veri al
  const allMenuItems = useSelector((state) => state.menu.items);
  const restaurants = useSelector((state) => state.restaurants.list);
  const currentCartItems = useSelector((state) => state.cart.items);
  const allReviews = useSelector((state) => state.reviews.list) || [];
  const { isAuthenticated } = useSelector((state) => state.auth);

  // Bu restorana ait menü ürünlerini filtrele
  const menuItems = allMenuItems.filter(item => item.restaurantId === restaurantId);
  const restaurantReviews = allReviews.filter(r => r.restaurantId === restaurantId);

  React.useEffect(() => {
    if (restaurantId) {
      dispatch(fetchReviews(restaurantId));
    }
  }, [dispatch, restaurantId]);

  // Restoran bilgisini al
  const restaurant = restaurants.find(r => r.id === restaurantId) || {
    name: 'Restoran',
    category: '',
    rating: '5.0',
    image: '',
  };

  const [selectedSection, setSelectedSection] = useState('Popüler');
  const [menuSearch, setMenuSearch] = useState('');
  
  // Modals state
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [selectedExtraOption, setSelectedExtraOption] = useState(null);

  // Customize options
  const [wrapOption, setWrapOption] = useState('Tek lavaş');
  const [drinkOption, setDrinkOption] = useState('Kola');
  const [grammageOption, setGrammageOption] = useState('90gr');
  const [sauceOption, setSauceOption] = useState('İstemiyorum');

  const sections = ['Popüler', ...new Set(menuItems.map(i => i.category).filter(c => c && c !== 'Popüler'))];

  // Filter items based on active section and live search input
  let displayedItems = menuItems.filter(item => {
    const matchesSection = selectedSection === 'Popüler' || item.category === selectedSection;
    const matchesSearch = item.name.toLowerCase().includes(menuSearch.toLowerCase()) || 
                          item.description.toLowerCase().includes(menuSearch.toLowerCase());
    return matchesSection && matchesSearch;
  });

  const handleAddClick = (item) => {
    if (!isAuthenticated) {
      addToast({ message: 'Sipariş vermek ve sepetinizi yönetmek için lütfen giriş yapın.', type: 'warning' });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    const itemOptions = item.extraOptions?.options || [];
    if (itemOptions.length === 0) {
      dispatch(addToCart({
        ...item,
        restaurantId,
        restaurantName: restaurant.name
      }));
      addToast({ message: `${item.name} sepete eklendi!`, type: 'success' });
      return;
    }

    setWrapOption('Tek lavaş');
    setDrinkOption('Kola');
    setGrammageOption('90gr');
    setSauceOption('İstemiyorum');
    setSelectedExtraOption(itemOptions[0]);
    setCustomizingItem(item);
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
            {restaurant.name}
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-1 text-white/95">
            <span className="text-xs font-bold bg-white/20 px-3.5 py-1.5 rounded-full backdrop-blur-md border border-white/25">
              {restaurant.category || 'Restoran'}
            </span>
            <button 
              onClick={() => setShowReviewsModal(true)}
              className="flex items-center gap-1 text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-4.5 py-1.5 rounded-full border border-amber-500/30 hover:scale-102 active:scale-95 transition-all cursor-pointer shadow-sm select-none"
            >
              <span className="material-symbols-outlined text-[15px] text-amber-400" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              <span>{restaurantReviews.length > 0 ? (restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length).toFixed(1) : '0.0'}</span>
              <span className="opacity-80 font-medium">({restaurantReviews.length} değerlendirme • Yorumları Gör)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Campaigns & Flash Deals Inside Restaurant */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-rose-900 to-red-800 text-white flex justify-between items-center group cursor-pointer shadow-md hover:shadow-lg transition-all border border-rose-800/10">
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
              className="mt-4 px-6 py-2.5 bg-white hover:bg-rose-50 text-rose-900 font-extrabold text-xs rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 border-none"
            >
              Şimdi Sipariş Ver
            </button>
          </div>
          <div className="absolute right-4 bottom-4 w-28 h-28 opacity-10 group-hover:opacity-20 group-hover:scale-110 transition-all select-none">
            <span className="material-symbols-outlined text-[110px] text-white">local_offer</span>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl p-6 md:p-8 bg-gradient-to-br from-amber-900 to-amber-700 text-white flex justify-between items-center group cursor-pointer shadow-md hover:shadow-lg transition-all border border-amber-800/10">
          <div className="z-10">
            <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 text-white px-2.5 py-1 rounded-full">
              Özel İndirim
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white mt-3 leading-tight">
              %25 İndirim Fırsatı
            </h3>
            <p className="text-xs mt-1 text-amber-100 font-medium">
              Tüm pizza çeşitlerinde geçerli anında indirim.
            </p>
            <button 
              onClick={() => {
                setSelectedSection('Popüler');
                addToast({ message: 'Pizza ve popüler lezzetler filtrelendi!', type: 'info' });
              }}
              className="mt-4 px-6 py-2.5 bg-white hover:bg-amber-50 text-amber-900 font-extrabold text-xs rounded-full shadow-sm hover:shadow-md transition-all active:scale-95 border-none"
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
      <nav className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200/30 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
                  <div className="relative h-48 overflow-hidden bg-stone-100 shrink-0">
                    {item.tag && (
                      <div className="absolute top-3 right-3 z-10 flex gap-2">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase tracking-widest text-white shadow-sm ${
                          item.tag.includes('%') ? 'bg-secondary' : 'bg-primary'
                        }`}>
                          {item.tag}
                        </span>
                      </div>
                    )}
                    <img 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                      alt={item.name} 
                      src={item.image} 
                    />
                  </div>

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

                      <button 
                        onClick={() => handleAddClick(item)}
                        className="brand-gradient-bg w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md shadow-rose-900/10 hover:scale-110 active:scale-95 transition-all cursor-pointer relative"
                      >
                        <span className="material-symbols-outlined font-extrabold select-none text-[20px]">
                          add
                        </span>
                        {inCartQty > 0 && (
                          <span className="absolute -top-2 -right-2 bg-secondary border-2 border-white text-white text-[9px] font-black w-5 h-5 flex items-center justify-center rounded-full shadow-sm">
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

      {/* Reviews Modal */}
      <Modal
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        title="Müşteri Değerlendirmeleri"
      >
        <div className="space-y-4 text-left">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/50 mb-6 flex justify-between items-center">
            <div>
              <p className="text-2xl font-black text-stone-800">
                {restaurantReviews.length > 0 ? (restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length).toFixed(1) : '0.0'}
              </p>
              <div className="flex gap-0.5 text-amber-500 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: i < (restaurantReviews.length > 0 ? Math.round(restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length) : 0) ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                ))}
              </div>
            </div>
            <div className="text-right text-xs text-stone-500 font-semibold">
              <p>{restaurantReviews.length} Toplam Puanlama</p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                %{restaurantReviews.length > 0 ? Math.round((restaurantReviews.filter(r => r.rating >= 4).length / restaurantReviews.length) * 100) : 0} Olumlu Geri Dönüş
              </p>
            </div>
          </div>
          <div className="divide-y divide-stone-100 max-h-[350px] overflow-y-auto pr-1">
            {restaurantReviews.length === 0 ? (
              <p className="text-center text-xs text-stone-500 py-4 font-semibold">Henüz hiç değerlendirme yapılmamış.</p>
            ) : restaurantReviews.map(review => (
              <div key={review.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <span className="font-bold text-stone-800 text-sm">{review.user}</span>
                    <div className="flex gap-0.5 text-amber-500 mt-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span
                          key={i}
                          className="material-symbols-outlined text-[12px]"
                          style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : undefined }}
                        >
                          star
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-stone-400 font-semibold">{review.date}</span>
                </div>
                {review.items && (
                  <span className="text-[9px] font-bold bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded inline-block mt-1">
                    {review.items}
                  </span>
                )}
                <p className="text-xs text-stone-600 leading-relaxed font-medium mt-1.5">{review.comment}</p>
                {review.reply && (
                  <div className="mt-2 bg-stone-50 p-2.5 rounded-lg border-l-2 border-primary">
                    <div className="flex items-center gap-1 mb-0.5 text-primary">
                      <span className="material-symbols-outlined text-[12px]">storefront</span>
                      <span className="font-extrabold text-[9px] uppercase">İşletme Yanıtı</span>
                    </div>
                    <p className="text-stone-500 text-[11px] font-medium italic">{review.reply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Customize Options Modal */}
      <Modal
        isOpen={!!customizingItem}
        onClose={() => {
          setCustomizingItem(null);
          setSelectedExtraOption(null);
        }}
        title={customizingItem ? `${customizingItem.name} Seçenekleri` : "Ürün Seçenekleri"}
      >
        {customizingItem && (() => {
          const customOptions = customizingItem.extraOptions?.options || [];
          if (customOptions.length > 0) {
            const selectedOption = selectedExtraOption || customOptions[0];
            const optionPrice = Number(selectedOption?.price) || 0;
            const currentPrice = Number(customizingItem.price) + optionPrice;

            const handleConfirmAdd = () => {
              const finalName = selectedOption?.name
                ? `${customizingItem.name} (${selectedOption.name})`
                : customizingItem.name;
              const finalId = selectedOption?.name
                ? `${customizingItem.id}-${selectedOption.name.replace(/\s+/g, '')}`
                : customizingItem.id;

              dispatch(addToCart({
                ...customizingItem,
                id: finalId,
                name: finalName,
                price: currentPrice,
                restaurantId,
                restaurantName: restaurant.name
              }));

              addToast({ message: `${finalName} sepete eklendi!`, type: 'success' });
              setCustomizingItem(null);
              setSelectedExtraOption(null);
            };

            return (
              <div className="space-y-6 text-left">
                <div className="border-b border-stone-100 pb-4">
                  <p className="text-xs text-stone-500 leading-relaxed font-semibold">{customizingItem.description}</p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-700 uppercase tracking-wide">
                    {customizingItem.extraOptions.title || 'Ek Secenek'}
                  </h4>
                  <div className="flex flex-col gap-2">
                    {customOptions.map((option) => (
                      <button
                        key={option.name}
                        type="button"
                        onClick={() => setSelectedExtraOption(option)}
                        className={`flex justify-between items-center py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          selectedOption?.name === option.name
                            ? 'border-primary bg-rose-50/20 text-primary'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{option.name}</span>
                        <span className="font-extrabold text-primary">
                          {Number(option.price) > 0 ? `+${Number(option.price)} TL` : 'Ucretsiz'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-stone-100 pt-4 flex items-center justify-between mt-6">
                  <div>
                    <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Toplam Fiyat</p>
                    <p className="text-xl font-black text-primary">₺{currentPrice}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmAdd}
                    className="brand-gradient-bg text-white font-extrabold text-xs px-8 py-3.5 rounded-xl hover:scale-102 active:scale-98 transition-all cursor-pointer border-none shadow-md shadow-rose-900/10"
                  >
                    Sepete Ekle
                  </button>
                </div>
              </div>
            );
          }

          const isCigkofta = customizingItem.category === 'Çiğ Köfte' || 
                             customizingItem.category === 'Dürümler' || 
                             customizingItem.name.toLowerCase().includes('çiğ') || 
                             customizingItem.name.toLowerCase().includes('cig');
          const isMenu = customizingItem.category === 'Menüler' || 
                         customizingItem.name.toLowerCase().includes('menü') || 
                         customizingItem.name.toLowerCase().includes('menu');
          const isBurger = customizingItem.category === 'Burgerler' || 
                           customizingItem.name.toLowerCase().includes('burger');

          // Addons price calculation
          let addonPrice = 0;
          if (isBurger) {
            if (grammageOption === '120gr') addonPrice += 100;
            if (grammageOption === '150gr') addonPrice += 200;
          }
          if (sauceOption === 'Ketçap' || sauceOption === 'Mayonez') {
            addonPrice += 20;
          }

          const currentPrice = customizingItem.price + addonPrice;

          const handleConfirmAdd = () => {
            let details = [];
            if (isCigkofta) details.push(wrapOption);
            if (isMenu) details.push(drinkOption);
            if (isBurger) details.push(grammageOption);
            if (sauceOption !== 'İstemiyorum') details.push(sauceOption);

            const detailsText = details.join(', ');
            const finalName = details.length > 0 
              ? `${customizingItem.name} (${detailsText})` 
              : customizingItem.name;
            const finalId = details.length > 0 
              ? `${customizingItem.id}-${details.join('-').replace(/\s+/g, '')}` 
              : customizingItem.id;

            dispatch(addToCart({
              ...customizingItem,
              id: finalId,
              name: finalName,
              price: currentPrice,
              restaurantId,
              restaurantName: restaurant.name
            }));
            
            addToast({ message: `${finalName} sepete eklendi!`, type: 'success' });
            setCustomizingItem(null);
          };

          return (
            <div className="space-y-6 text-left">
              {/* Product Info Description */}
              <div className="border-b border-stone-100 pb-4">
                <p className="text-xs text-stone-500 leading-relaxed font-semibold">{customizingItem.description}</p>
              </div>

              {/* Wrap Option (Çiğköfte only) */}
              {isCigkofta && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-700 uppercase tracking-wide">Lavaş Tercihi</h4>
                  <div className="flex gap-3">
                    {['Tek lavaş', 'İki lavaş'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setWrapOption(opt)}
                        className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          wrapOption === opt
                            ? 'border-primary bg-rose-50/20 text-primary'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Drink Option (Menus only) */}
              {isMenu && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-700 uppercase tracking-wide">İçecek Tercihi</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {['Kola', 'Gazoz', 'Ice Tea', 'Ayran', 'Su'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setDrinkOption(opt)}
                        className={`py-3 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          drinkOption === opt
                            ? 'border-primary bg-rose-50/20 text-primary'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Meat Weight Option (Burgers only) */}
              {isBurger && (
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-stone-700 uppercase tracking-wide">Köfte Gramajı Tercihi</h4>
                  <div className="flex flex-col gap-2">
                    {[
                      { label: '90gr (Varsayılan)', value: '90gr', extra: 0 },
                      { label: '120gr (+100 TL)', value: '120gr', extra: 100 },
                      { label: '150gr (+200 TL)', value: '150gr', extra: 200 }
                    ].map(opt => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setGrammageOption(opt.value)}
                        className={`flex justify-between items-center py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          grammageOption === opt.value
                            ? 'border-primary bg-rose-50/20 text-primary'
                            : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {opt.extra > 0 && <span className="font-extrabold text-primary">+{opt.extra} ₺</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sauce Option (All items) */}
              <div className="space-y-2">
                <h4 className="text-xs font-black text-stone-700 uppercase tracking-wide">Ekstra Sos Tercihi</h4>
                <div className="flex flex-col gap-2">
                  {[
                    { label: 'İstemiyorum (Ücretsiz)', value: 'İstemiyorum', extra: 0 },
                    { label: 'Ketçap (+20 TL)', value: 'Ketçap', extra: 20 },
                    { label: 'Mayonez (+20 TL)', value: 'Mayonez', extra: 20 }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setSauceOption(opt.value)}
                      className={`flex justify-between items-center py-3 px-4 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        sauceOption === opt.value
                          ? 'border-primary bg-rose-50/20 text-primary'
                          : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{opt.label}</span>
                      {opt.extra > 0 && <span className="font-extrabold text-primary">+{opt.extra} ₺</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer pricing CTA */}
              <div className="border-t border-stone-100 pt-4 flex items-center justify-between mt-6">
                <div>
                  <p className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Toplam Fiyat</p>
                  <p className="text-xl font-black text-primary">₺{currentPrice}</p>
                </div>
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="brand-gradient-bg text-white font-extrabold text-xs px-8 py-3.5 rounded-xl hover:scale-102 active:scale-98 transition-all cursor-pointer border-none shadow-md shadow-rose-900/10"
                >
                  Sepete Ekle
                </button>
              </div>
            </div>
          );
        })()}
      </Modal>
    </div>
  );
}

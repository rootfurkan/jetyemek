import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { removeFromCart, addToCart, clearCart } from '../../../features/cart/cartSlice.js';
import { setActiveOrder, addPlatformOrder } from '../../../features/orders/ordersSlice.js';
import { addAddress, addCard } from '../../../features/auth/authSlice.js';
import { createOrder, createAddress, getCards, createCard } from '../../../services/api.js';
import { useToast } from '../../../common/components/Toast.jsx';
import CreditCardForm, { validateCardForm } from '../../../common/components/CreditCardForm.jsx';
import Modal from '../../../common/components/Modal.jsx';

const CARD_LOGOS = {
  Visa: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHQVFbGuXYR69Yf-GNnywtqpwzCkHMwBpL6ZZ6h4SdtqFJcEoy6119eRON1z7sfhQnyZDCF_pJbHR6MbTUVAclhpk_ihlKrlrw2SLeL12VS-9noEP5rLnLZ6h9pwAS088OmcXR9LtdoT4Itk-fhhrSRiYInxW__VeoIx4vabjI4s1p93n2hEkUqg8slUDKQ5NdYWEqKpygeGleqadagqDYSbT483UWXQ_w8x6csqaWbG1rXSToszFwNQ',
  Mastercard: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCepLVd8hsizjFucB5HUGRh9P5WIbXle5yDNhxbFZ4IUL4x-UUkzX8Twd9ThLtYulSUXTlhtuaaVFRS4E8y5h0Ced3Fz_jI3E5m4xVrkEaQF6VNkeccJLSAtlN4ITJwO_hYI8F-o-V5HRmx33xv3iuacoJjXQWrraAK8fMmgFSeJPme2Oz95nnutZMot7FnWfo_9W0yzrvN_Goq-eetI761mTfWrpRY5le3T5J84fwXs1hlITDhkgaqKA',
  Troy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLelAgxpKLxx0GanhzDVSzQhxrz60C6J5aMlVsXXABIhdJvrKukQjpRc6hCKy6r1W1qap8gzXhmMPbW-3W_n8RTM7lmUMvBkT7P8rSLW0ITqspe8dXjqUhr-FDCv_H5aXzuEEEcrKiMa7bjj29OIAzIE9jr-6dwD7weg4YCMEI1VCCr4DXb7Hd7zB-XGY-i-PPMWphcZZtSGzxHe2WLjfxHPSwhrhtzf5GxFweYc5GbNcezzcgjQZ8Wg',
};

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const addToast = useToast();

  // Redux states
  const cartItems = useSelector((state) => state.cart.items);
  const addresses = useSelector((state) => state.auth.addresses);
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);

  // Saved cards from Redux (in-memory) — also loaded from DB
  const savedCardsFromRedux = useSelector((state) => state.auth.savedCards) || [];

  const [deliveryType, setDeliveryType] = useState('kurye');
  const [paymentType, setPaymentType] = useState('card');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New address modal state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');
  const [newAddrIcon, setNewAddrIcon] = useState('home');
  const [isSavingAddress, setIsSavingAddress] = useState(false);

  // Selected address
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  // Coupon
  const [couponApplied, setCouponApplied] = useState(null);
  const [couponInput, setCouponInput] = useState('');

  // Saved cards state (loaded from DB)
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null); // null = yeni kart formu

  // Live credit card form
  const [cardFields, setCardFields] = useState({ cardNumber: '', cardName: '', cardExpiry: '', cardCVV: '' });
  const [cardErrors, setCardErrors] = useState({});
  const [saveCardForLater, setSaveCardForLater] = useState(false);
  const [newCardType, setNewCardType] = useState('Visa');

  // Saved address id güncelleme (addresses değişince)
  useEffect(() => {
    if (selectedAddressId === null && addresses.length > 0) {
      setSelectedAddressId(addresses[0]?.id || null);
    }
  }, [addresses]);

  // Kayıtlı kartları DB'den yükle
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) return;
    const allCards = [...savedCardsFromRedux];
    if (allCards.length > 0) {
      setSavedCards(allCards);
      // Varsayılan kartı seç
      const def = allCards.find((c) => c.isDefault);
      setSelectedCardId(def?.id || allCards[0]?.id || null);
    } else {
      getCards(currentUser.id)
        .then((cards) => {
          setSavedCards(cards);
          if (cards.length > 0) {
            const def = cards.find((c) => c.isDefault);
            setSelectedCardId(def?.id || cards[0]?.id || null);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated, currentUser?.id, savedCardsFromRedux.length]);

  // Calculations
  const subtotal = cartItems.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const deliveryFee = 0;
  const discount = couponApplied === 'İLK50' ? 50.0 : 0.0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const activeAddress = addresses.find((a) => a.id === selectedAddressId) || addresses[0];

  const handleApplyCouponBtn = (e) => {
    e.preventDefault();
    const cleanCoupon = couponInput.toUpperCase().trim();
    if (cleanCoupon === 'İLK50') {
      if (subtotal > 200) {
        setCouponApplied('İLK50');
        setCouponInput('');
        addToast({ message: "'İLK50' kupon kodu uygulandı! 50 TL indirim kazandınız.", type: 'success' });
      } else {
        addToast({ message: "Kupon uygulanamadı: Sepet tutarı 200 TL'den fazla olmalı.", type: 'error' });
      }
    } else {
      addToast({ message: "Geçersiz kupon kodu. 'İLK50' kodunu deneyebilirsiniz!", type: 'error' });
    }
  };

  const onSubmitCheckout = async () => {
    if (!isAuthenticated) {
      addToast({ message: 'Sipariş vermek için lütfen giriş yapın.', type: 'warning' });
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (cartItems.length === 0) {
      addToast({ message: 'Sepetinizde ürün bulunmamaktadır!', type: 'error' });
      return;
    }

    // Kart validasyonu — sadece yeni kart formu açıksa
    if (paymentType === 'card' && !selectedCardId) {
      const { isValid, errors } = validateCardForm(cardFields);
      if (!isValid) {
        setCardErrors(errors);
        addToast({ message: 'Lütfen geçerli bir kredi kartı bilgisi giriniz!', type: 'error' });
        return;
      }
    }
    setCardErrors({});
    setIsSubmitting(true);

    try {
      const firstItem = cartItems[0];
      const restaurantName = firstItem?.restaurantName || firstItem?.restaurant || 'Restoran';
      const restaurantImage = firstItem?.image || '';

      // Yeni kartı kaydet (checkbox işaretliyse)
      if (paymentType === 'card' && !selectedCardId && saveCardForLater) {
        try {
          const cleanNum = cardFields.cardNumber.replace(/\s/g, '');
          const cardPayload = {
            userId: currentUser.id,
            name: cardFields.cardName || 'Kartım',
            type: newCardType,
            number: cleanNum.substring(cleanNum.length - 4),
            expiry: cardFields.cardExpiry,
            isDefault: savedCards.length === 0,
            logo: CARD_LOGOS[newCardType],
          };
          const savedCard = await createCard(cardPayload);
          dispatch(addCard(savedCard));
          setSavedCards((prev) => [...prev, savedCard]);
          addToast({ message: 'Kartınız profilinize kaydedildi!', type: 'success' });
        } catch (_) {/* kart kaydedilemese de sipariş devam eder */}
      }

      const date = new Date();
      const months = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
      const formattedDate = `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;

      // Seçili kayıtlı kart
      const selectedCard = savedCards.find((c) => c.id === selectedCardId);
      const paymentMethod =
        paymentType !== 'card'
          ? 'Kapıda Ödeme'
          : selectedCard
          ? `${selectedCard.type} **** ${selectedCard.number}`
          : 'Kredi Kartı';

      const orderPayload = {
        userId: String(currentUser?.id),
        customerName: currentUser?.name + (currentUser?.surname ? ' ' + currentUser.surname : ''),
        restaurant: restaurantName,
        restaurantId: firstItem?.restaurantId || '',
        items: cartItems.map((i) => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price, note: i.note || null })),
        itemsSummary: `${cartItems.reduce((a, c) => a + c.quantity, 0)} Ürün`,
        total,
        address: activeAddress?.details || 'Adres belirtilmedi',
        paymentMethod,
        status: 'Hazırlanıyor',
        deliveryStatus: 'preparing',
        progress: 0,
        date: formattedDate,
        createdAt: date.toISOString(),
        image: restaurantImage,
      };

      const savedOrder = await createOrder(orderPayload);

      dispatch(setActiveOrder({ ...savedOrder }));
      dispatch(addPlatformOrder({
        id: savedOrder.id,
        customer: orderPayload.customerName,
        restaurant: restaurantName,
        total,
        status: 'Hazırlanıyor',
        time: 'Şimdi',
      }));

      dispatch(clearCart());
      addToast({ message: 'Siparişiniz başarıyla oluşturuldu!', type: 'success' });
      navigate('/profile', { state: { section: 'orders' } });
    } catch (err) {
      console.error('Sipariş oluşturma hatası:', err);
      addToast({ message: 'Sipariş oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Stepper */}
      <div className="flex items-center justify-center max-w-2xl mx-auto py-2">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">1</div>
          <span className="text-xs font-bold text-primary">Menü</span>
        </div>
        <div className="h-[2px] bg-primary flex-grow mx-4 max-w-[120px]"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">2</div>
          <span className="text-xs font-bold text-primary">Sepetim</span>
        </div>
        <div className="h-[2px] bg-stone-200 flex-grow mx-4 max-w-[120px]"></div>
        <div className="flex flex-col items-center gap-2 opacity-50">
          <div className="w-10 h-10 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center font-bold">3</div>
          <span className="text-xs font-semibold text-stone-500">Ödeme</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-16 text-center max-w-xl mx-auto bg-white rounded-[32px] border border-stone-100 shadow-sm p-8">
          <span className="material-symbols-outlined text-6xl text-rose-200 select-none">shopping_basket</span>
          <h2 className="text-xl font-bold text-stone-800 mt-4">Sepetiniz Boş</h2>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">Görünüşe göre sepetinize henüz hiçbir lezzet eklemediniz.</p>
          <button onClick={() => navigate('/')} className="mt-6 px-8 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-full shadow-md active:scale-95 transition-all cursor-pointer border-none">
            Lezzetleri Keşfet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sol Sütun */}
          <div className="lg:col-span-8 space-y-6">
            {/* Teslimat Tipi */}
            <div className="bg-rose-50/50 p-1 rounded-2xl flex items-center shadow-sm border border-rose-100/30">
              <button onClick={() => setDeliveryType('kurye')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${deliveryType === 'kurye' ? 'bg-white text-primary shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>
                <span className="material-symbols-outlined text-[18px]">delivery_dining</span>
                Kurye ile Gelsin
              </button>
              <button onClick={() => setDeliveryType('gelal')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${deliveryType === 'gelal' ? 'bg-white text-primary shadow-sm' : 'text-stone-500 hover:text-stone-800'}`}>
                <span className="material-symbols-outlined text-[18px]">takeout_dining</span>
                Gel-Al
              </button>
            </div>

            {/* Sepet Ürünleri */}
            <section className="bg-white rounded-3xl shadow-sm overflow-hidden border border-stone-100">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-lg font-bold text-stone-800">Sepetim ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} Ürün)</h2>
              </div>
              <div className="divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4 items-center group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                      <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-stone-800 text-sm">{item.name}</h3>
                      <p className="text-[10px] text-stone-400 font-medium mt-0.5">{item.description || 'Özel tarif'}</p>
                      {item.note && (
                        <p className="text-[11px] text-stone-500 italic mt-1 bg-stone-50 border border-stone-200 px-2 py-1 rounded-md inline-block">Not: {item.note}</p>
                      )}
                      <p className="text-primary font-extrabold text-sm mt-1">₺{item.price * item.quantity}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-50 border border-stone-200/50 rounded-full px-2 py-1 select-none">
                      <button onClick={() => dispatch(removeFromCart(item.id))} className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 text-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer border border-stone-200/40">
                        <span className="material-symbols-outlined text-[16px] font-bold">remove</span>
                      </button>
                      <span className="font-bold text-stone-800 text-sm w-4 text-center">{item.quantity}</span>
                      <button onClick={() => dispatch(addToCart(item))} className="w-7 h-7 rounded-full bg-primary hover:bg-secondary text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer">
                        <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Teslimat Adresi */}
            {deliveryType === 'kurye' && (
              <section className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-stone-800">Teslimat Adresi</h2>
                  <button onClick={() => setIsEditingAddress(!isEditingAddress)} className="text-primary font-bold text-xs hover:underline cursor-pointer">
                    {isEditingAddress ? 'Tamam' : 'Değiştir'}
                  </button>
                </div>

                {!isEditingAddress ? (
                  <div className="bg-rose-50/20 p-4 rounded-2xl border border-rose-100/30 flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>{activeAddress?.icon || 'home'}</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm">{activeAddress?.title || 'Adres Seçin'}</h4>
                      <p className="text-xs text-stone-500 leading-relaxed mt-0.5">{activeAddress?.details || 'Teslimat adresi seçmek için Değiştir butonuna basın.'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider">Adreslerim</p>
                      <button type="button" onClick={() => setShowAddressModal(true)} className="flex items-center gap-1 text-primary font-bold text-xs hover:underline cursor-pointer border-none bg-transparent">
                        <span className="material-symbols-outlined text-[14px]">add</span>
                        Yeni Adres Ekle
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map((addr) => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${selectedAddressId === addr.id ? 'border-primary bg-rose-50/20' : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50/50'}`}
                        >
                          <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">{addr.icon}</span>
                          <div className="text-left">
                            <p className="text-xs font-bold text-stone-800">{addr.title}</p>
                            <p className="text-[11px] text-stone-400 line-clamp-2 mt-0.5">{addr.details}</p>
                          </div>
                        </div>
                      ))}
                      {addresses.length === 0 && (
                        <p className="text-xs text-stone-400 col-span-2 py-4 text-center">Kayıtlı adresiniz bulunmuyor. Yeni adres ekleyin.</p>
                      )}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Ödeme Yöntemi */}
            <section className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
              <h2 className="text-base font-bold text-stone-800 mb-4">Ödeme Yöntemi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <label className="relative cursor-pointer">
                  <input checked={paymentType === 'card'} onChange={() => setPaymentType('card')} className="peer hidden" name="payment" type="radio" />
                  <div className="block p-4 border border-stone-200 rounded-2xl peer-checked:border-primary peer-checked:bg-rose-50/10 transition-all select-none">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                      <span className="font-bold text-stone-800 text-xs">Kredi / Banka Kartı</span>
                    </div>
                  </div>
                </label>
                <label className="relative cursor-pointer">
                  <input checked={paymentType === 'door'} onChange={() => setPaymentType('door')} className="peer hidden" name="payment" type="radio" />
                  <div className="block p-4 border border-stone-200 rounded-2xl peer-checked:border-primary peer-checked:bg-rose-50/10 transition-all select-none">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-stone-500 text-[20px]">payments</span>
                      <span className="font-bold text-stone-800 text-xs">Kapıda Ödeme</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Kayıtlı Kartlar */}
              {paymentType === 'card' && savedCards.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Kayıtlı Kartlarım</p>
                  <div className="space-y-2">
                    {savedCards.map((card) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedCardId(card.id)}
                        className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${selectedCardId === card.id ? 'border-primary bg-rose-50/20' : 'border-stone-100 hover:border-stone-200'}`}
                      >
                        <div className="w-10 h-7 bg-stone-50 border border-stone-100 rounded-lg flex items-center justify-center p-1 shrink-0">
                          {card.logo ? (
                            <img className="h-full object-contain" alt={card.type} src={card.logo} />
                          ) : (
                            <span className="material-symbols-outlined text-stone-400 text-[16px]">credit_card</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-stone-800">{card.name}</p>
                          <p className="text-[11px] text-stone-400 font-mono">**** **** **** {card.number}</p>
                        </div>
                        {selectedCardId === card.id && (
                          <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                        )}
                      </div>
                    ))}

                    {/* Yeni Kart ile Öde seçeneği */}
                    <div
                      onClick={() => setSelectedCardId(null)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border cursor-pointer transition-all ${selectedCardId === null ? 'border-primary bg-rose-50/20' : 'border-stone-100 hover:border-stone-200'}`}
                    >
                      <div className="w-10 h-7 bg-rose-50 border border-rose-100 rounded-lg flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[16px]">add</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-stone-800">Farklı Kart ile Öde</p>
                        <p className="text-[11px] text-stone-400">Yeni kart bilgisi gir</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Yeni Kart Formu */}
              {paymentType === 'card' && selectedCardId === null && (
                <div className="mt-4 border-t border-stone-100 pt-5 space-y-4">
                  {/* Kart Tipi */}
                  <div>
                    <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">Kart Tipi</label>
                    <div className="flex gap-2">
                      {['Visa', 'Mastercard', 'Troy'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setNewCardType(type)}
                          className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${newCardType === type ? 'border-primary bg-rose-50/20 text-primary' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}
                        >
                          <span>{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <CreditCardForm
                    cardNumber={cardFields.cardNumber}
                    cardName={cardFields.cardName}
                    cardExpiry={cardFields.cardExpiry}
                    cardCVV={cardFields.cardCVV}
                    onChange={(fields) => { setCardFields(fields); if (Object.keys(cardErrors).length) setCardErrors({}); }}
                    errors={cardErrors}
                  />

                  {/* Kartı Kaydet Checkbox */}
                  {isAuthenticated && (
                    <label className="flex items-center gap-3 cursor-pointer select-none bg-stone-50 p-3.5 rounded-xl border border-stone-200/60 hover:bg-stone-100/50 transition-colors">
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={saveCardForLater}
                          onChange={(e) => setSaveCardForLater(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${saveCardForLater ? 'bg-rose-600 border-rose-600' : 'border-stone-300'}`}>
                          {saveCardForLater && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-stone-800">Bu kartı sonraki alışverişlerim için kaydet</p>
                        <p className="text-[11px] text-stone-500 mt-0.5">Profil sayfanızda yönetebilirsiniz</p>
                      </div>
                    </label>
                  )}
                </div>
              )}
            </section>
          </div>

          {/* Sağ Sütun — Sipariş Özeti */}
          <div className="lg:col-span-4">
            <div className="sticky top-20 space-y-4">
              <section className="bg-white rounded-3xl shadow-xl p-6 border border-stone-100">
                <h2 className="text-base font-bold text-stone-800 mb-6">Sipariş Özeti</h2>
                <div className="space-y-4 mb-6 text-sm text-left">
                  <div className="flex justify-between text-stone-500 font-medium">
                    <span>Ara Toplam</span>
                    <span>₺{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-stone-500 font-medium">
                    <span>Teslimat Ücreti</span>
                    <span className="text-green-600 font-bold">Ücretsiz</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-stone-500 font-medium">
                      <span>İndirim ({couponApplied})</span>
                      <span className="text-primary font-bold">-₺{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="pt-4 border-t border-stone-100 flex justify-between items-center">
                    <span className="font-bold text-stone-800">Toplam</span>
                    <span className="text-2xl font-black text-primary">₺{total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Kupon */}
                <div className="space-y-3">
                  {couponApplied ? (
                    <div className="bg-green-50 text-green-700 px-3.5 py-3 rounded-2xl flex items-center gap-3 border border-dashed border-green-200 text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px]">local_offer</span>
                      <span className="flex-grow text-left">İLK50 Kuponu Uygulandı</span>
                      <button onClick={() => setCouponApplied(null)} className="material-symbols-outlined text-stone-500 hover:text-primary transition-colors cursor-pointer select-none text-[16px]">close</button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCouponBtn} className="flex gap-2">
                      <input value={couponInput} onChange={(e) => setCouponInput(e.target.value)} className="flex-grow rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 placeholder-stone-400" placeholder="Kupon Kodu Girin" type="text" />
                      <button type="submit" className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-4 rounded-xl cursor-pointer transition-colors">Uygula</button>
                    </form>
                  )}

                  <button
                    onClick={onSubmitCheckout}
                    disabled={isSubmitting}
                    className="w-full brand-gradient-bg text-white font-bold h-14 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        İşleniyor...
                      </>
                    ) : (
                      <>
                        <span>Siparişi Onayla</span>
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-[10px] text-center text-stone-400 mt-4 leading-relaxed font-medium">
                  "Siparişi Onayla" butonuna basarak Kullanıcı Sözleşmesi'ni ve KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
                </p>
              </section>

              <div className="flex flex-wrap gap-2 justify-center">
                <div className="px-3.5 py-1.5 bg-stone-100/80 border border-stone-200/20 flex items-center gap-1.5 rounded-full text-[10px] font-bold text-stone-500">
                  <span className="material-symbols-outlined text-sm text-stone-400" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                  SSL Güvenli Ödeme
                </div>
                <div className="px-3.5 py-1.5 bg-stone-100/80 border border-stone-200/20 flex items-center gap-1.5 rounded-full text-[10px] font-bold text-stone-500">
                  <span className="material-symbols-outlined text-sm text-stone-400">schedule</span>
                  30 Dakikada Teslimat
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yeni Adres Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => { setShowAddressModal(false); setNewAddrTitle(''); setNewAddrDetails(''); }}
        title="Yeni Teslimat Adresi Ekle"
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!newAddrTitle.trim() || !newAddrDetails.trim()) {
              addToast({ message: 'Lütfen tüm alanları doldurun!', type: 'error' });
              return;
            }
            setIsSavingAddress(true);
            try {
              const addrPayload = {
                userId: String(currentUser?.id),
                title: newAddrTitle,
                details: newAddrDetails,
                icon: newAddrIcon,
              };
              // ⚡ KRITIK: Adres kaydederken cart temizlenmemeli!
              // Sadece addAddress dispatch yapıyoruz, clearCart YOK.
              const savedAddr = await createAddress(addrPayload);
              dispatch(addAddress(savedAddr));
              setSelectedAddressId(savedAddr.id);
              setShowAddressModal(false);
              setNewAddrTitle('');
              setNewAddrDetails('');
              addToast({ message: 'Adres başarıyla eklendi ve seçildi!', type: 'success' });
            } catch (err) {
              addToast({ message: 'Adres kaydedilirken hata oluştu.', type: 'error' });
            } finally {
              setIsSavingAddress(false);
            }
          }}
          className="space-y-4 text-left"
        >
          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Adres Başlığı</label>
            <input type="text" placeholder="Evim, İş Yeri vb." value={newAddrTitle} onChange={(e) => setNewAddrTitle(e.target.value)} className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none" />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Adres İkonu</label>
            <div className="flex gap-2">
              {[{ name: 'Ev', icon: 'home' }, { name: 'İş', icon: 'work' }, { name: 'Diğer', icon: 'place' }].map((opt) => (
                <button key={opt.icon} type="button" onClick={() => setNewAddrIcon(opt.icon)}
                  className={`flex-1 py-3 px-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${newAddrIcon === opt.icon ? 'border-primary bg-rose-50/20 text-primary' : 'border-stone-200 text-stone-600 hover:bg-stone-50'}`}>
                  <span className="material-symbols-outlined text-[16px]">{opt.icon}</span>
                  <span>{opt.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-500 mb-1 uppercase tracking-wider">Açık Adres Detayı</label>
            <textarea placeholder="Mahalle, sokak, daire, kat no ve detaylar..." value={newAddrDetails} onChange={(e) => setNewAddrDetails(e.target.value)} rows="3" className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none" />
          </div>

          <div className="flex gap-3 pt-4 border-t border-stone-100 justify-end">
            <button type="button" onClick={() => { setShowAddressModal(false); setNewAddrTitle(''); setNewAddrDetails(''); }}
              className="px-5 py-2.5 bg-stone-100 hover:bg-stone-200 rounded-full font-bold text-xs text-stone-600 transition-all cursor-pointer">
              İptal Et
            </button>
            <button type="submit" disabled={isSavingAddress}
              className="px-7 py-2.5 bg-primary hover:bg-primary-container text-white rounded-full font-bold text-xs transition-all cursor-pointer shadow-md disabled:opacity-60">
              {isSavingAddress ? 'Kaydediliyor...' : 'Adresi Kaydet'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

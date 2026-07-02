import React, { useState } from 'react';
import { useToast } from '../common/components/Toast.jsx';
import CreditCardForm, { validateCardForm } from '../common/components/CreditCardForm.jsx';

export default function CartView({ 
  cartItems = [], 
  onUpdateQty, 
  onRemoveItem, 
  userProfile, 
  addresses = [], 
  onPlaceOrder, 
  couponApplied, 
  onApplyCoupon, 
  onRemoveCoupon 
}) {
  const addToast = useToast();

  const [deliveryType, setDeliveryType] = useState('kurye'); // 'kurye' or 'gelal'
  const [paymentType, setPaymentType] = useState('card'); // 'card' or 'door'
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  
  // Local checkout inputs
  const [selectedAddressId, setSelectedAddressId] = useState(addresses[0]?.id || 1);
  const [couponInput, setCouponInput] = useState('');
  
  // Live credit card state (for shared CreditCardForm)
  const [cardFields, setCardFields] = useState({ cardNumber: '', cardName: '', cardExpiry: '', cardCVV: '' });
  const [cardErrors, setCardErrors] = useState({});

  // Calculations
  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const deliveryFee = deliveryType === 'kurye' ? 0 : 0; // free delivery
  const discount = couponApplied === 'İLK50' ? 50.0 : 0.0;
  const total = Math.max(0, subtotal + deliveryFee - discount);

  const activeAddress = addresses.find(a => a.id === selectedAddressId) || addresses[0];

  const handleApplyCouponBtn = (e) => {
    e.preventDefault();
    if (couponInput.toUpperCase() === 'İLK50') {
      onApplyCoupon('İLK50');
      setCouponInput('');
      addToast({ message: "'İLK50' kupon kodu uygulandı! 50 TL indirim kazandınız.", type: 'success' });
    } else {
      addToast({ message: "Geçersiz kupon kodu. Denemek için 'İLK50' kodunu girebilirsiniz!", type: 'error' });
    }
  };

  const onSubmitCheckout = () => {
    if (cartItems.length === 0) {
      addToast({ message: 'Sepetinizde ürün bulunmamaktadır!', type: 'error' });
      return;
    }

    if (paymentType === 'card') {
      const { isValid, errors } = validateCardForm(cardFields);
      if (!isValid) {
        setCardErrors(errors);
        addToast({ message: 'Lütfen geçerli bir kredi kartı bilgisi giriniz!', type: 'error' });
        return;
      }
    }

    setCardErrors({});

    // Call checkout trigger
    const newOrderObj = {
      restaurant: "Gourmet Burger House",
      items: `${cartItems.length} Ürün`,
      total: total,
      status: "Hazırlanıyor",
      progress: 25,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnwB_MVSxUiwXYE8nQxNr-r1o2uxGhZBRtr03Uuw9KIAXk9sUIx3KqcmmATWOz7xP_dHgPI27PeRPZy6BKQaW0BBdxEHQfNYFTHY77m8eIksWiKmup-apWL0XdGQpKD4kjcdl_GxqEBXtf70s6SF4bnneCgZlLCoERRjVvoQNLhR7xcajFv7jtIpmfrGmTXueIg7SvTaGduuGEycSChy-kgj3YI73F1jXbbCkC2XFdJZmSPWM4gdgIhg",
      detailsList: cartItems.map(item => `${item.quantity} Adet ${item.name}`).join(', ')
    };

    onPlaceOrder && onPlaceOrder(newOrderObj);
    addToast({ message: 'Siparişiniz başarıyla verildi! Afiyet olsun 🎉', type: 'success', duration: 4500 });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. Stepper Progress Widget */}
      <div className="flex items-center justify-center max-w-2xl mx-auto py-2">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">
            1
          </div>
          <span className="text-xs font-bold text-primary">Menü</span>
        </div>
        <div className="h-[2px] bg-primary flex-grow mx-4 max-w-[120px]"></div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold shadow-md shadow-primary/20">
            2
          </div>
          <span className="text-xs font-bold text-primary">Sepetim</span>
        </div>
        <div className="h-[2px] bg-stone-200 flex-grow mx-4 max-w-[120px]"></div>
        <div className="flex flex-col items-center gap-2 opacity-50">
          <div className="w-10 h-10 rounded-full bg-stone-300 text-stone-600 flex items-center justify-center font-bold">
            3
          </div>
          <span className="text-xs font-semibold text-stone-500">Ödeme</span>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="py-16 text-center max-w-xl mx-auto bg-white rounded-[32px] border border-stone-100 shadow-sm p-8">
          <span className="material-symbols-outlined text-6xl text-rose-200 select-none">
            shopping_basket
          </span>
          <h2 className="text-xl font-bold text-stone-800 mt-4">Sepetiniz Boş</h2>
          <p className="text-xs text-stone-500 mt-2 leading-relaxed">
            Görünüşe göre sepetinize henüz hiçbir lezzet eklemediniz. Hemen leziz menülerimizi incelemeye başlayın!
          </p>
          <button 
            onClick={() => onUpdateQty && onUpdateQty('home')}
            className="mt-6 px-8 py-3 bg-primary hover:bg-secondary text-white font-bold rounded-full shadow-md active:scale-95 transition-all cursor-pointer"
          >
            Lezzetleri Keşfet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart items, Address and Payment details */}
          <div className="lg:col-span-8 space-y-6">
            {/* Delivery Preference Switch */}
            <div className="bg-rose-50/50 p-1 rounded-2xl flex items-center shadow-sm border border-rose-100/30">
              <button 
                onClick={() => setDeliveryType('kurye')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  deliveryType === 'kurye'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">delivery_dining</span>
                Kurye ile Gelsin
              </button>
              <button 
                onClick={() => setDeliveryType('gelal')}
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  deliveryType === 'gelal'
                    ? 'bg-white text-primary shadow-sm'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">takeout_dining</span>
                Gel-Al
              </button>
            </div>

            {/* Cart Items List */}
            <section className="bg-white rounded-3xl shadow-sm overflow-hidden border border-stone-100">
              <div className="p-6 border-b border-stone-100">
                <h2 className="text-lg font-bold text-stone-800">
                  Sepetim ({cartItems.reduce((acc, curr) => acc + curr.quantity, 0)} Ürün)
                </h2>
              </div>
              <div className="divide-y divide-stone-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-4 items-center group">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-100">
                      <img className="w-full h-full object-cover" alt={item.name} src={item.image} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-stone-800 text-sm">{item.name}</h3>
                      <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                        {item.category === 'Burgerler' || item.id.includes('burger') 
                          ? 'Ekstra Karamelize Soğan, Cheddar' 
                          : 'Baharatlı, Özel Sos'
                        }
                      </p>
                      <p className="text-primary font-extrabold text-sm mt-1">₺{item.price * item.quantity}</p>
                    </div>

                    {/* Quantity selectors */}
                    <div className="flex items-center gap-3 bg-stone-50 border border-stone-200/50 rounded-full px-2 py-1 select-none">
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-white hover:bg-rose-50 text-primary flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer border border-stone-200/40"
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">remove</span>
                      </button>
                      <span className="font-bold text-stone-800 text-sm w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQty(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-primary hover:bg-secondary text-white flex items-center justify-center shadow-sm active:scale-90 transition-transform cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px] font-bold">add</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Delivery Address Section */}
            {deliveryType === 'kurye' && (
              <section className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-base font-bold text-stone-800">Teslimat Adresi</h2>
                  <button 
                    onClick={() => setIsEditingAddress(!isEditingAddress)}
                    className="text-primary font-bold text-xs hover:underline cursor-pointer"
                  >
                    {isEditingAddress ? 'Tamam' : 'Değiştir'}
                  </button>
                </div>

                {!isEditingAddress ? (
                  <div className="bg-rose-50/20 p-4 rounded-2xl border border-rose-100/30 flex gap-4 items-center">
                    <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {activeAddress?.icon || 'home'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm">{activeAddress?.title || 'Seçili Adres'}</h4>
                      <p className="text-xs text-stone-500 leading-relaxed mt-0.5">{activeAddress?.details}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-2">Adreslerim</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {addresses.map(addr => (
                        <div 
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-3 items-start ${
                            selectedAddressId === addr.id
                              ? 'border-primary bg-rose-50/20'
                              : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50/50'
                          }`}
                        >
                          <span className="material-symbols-outlined text-primary text-[18px] mt-0.5">
                            {addr.icon}
                          </span>
                          <div className="text-left">
                            <p className="text-xs font-bold text-stone-800">{addr.title}</p>
                            <p className="text-[11px] text-stone-400 line-clamp-2 mt-0.5">{addr.details}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Payment Method Selection */}
            <section className="bg-white rounded-3xl shadow-sm p-6 border border-stone-100">
              <h2 className="text-base font-bold text-stone-800 mb-4">Ödeme Yöntemi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="relative cursor-pointer">
                  <input 
                    checked={paymentType === 'card'} 
                    onChange={() => setPaymentType('card')}
                    className="peer hidden" 
                    name="payment" 
                    type="radio" 
                  />
                  <div className="block p-4 border border-stone-200 rounded-2xl peer-checked:border-primary peer-checked:bg-rose-50/10 transition-all select-none">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        credit_card
                      </span>
                      <span className="font-bold text-stone-800 text-xs">Kredi / Banka Kartı</span>
                    </div>
                  </div>
                </label>

                <label className="relative cursor-pointer">
                  <input 
                    checked={paymentType === 'door'} 
                    onChange={() => setPaymentType('door')}
                    className="peer hidden" 
                    name="payment" 
                    type="radio" 
                  />
                  <div className="block p-4 border border-stone-200 rounded-2xl peer-checked:border-primary peer-checked:bg-rose-50/10 transition-all select-none">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-stone-500 text-[20px]">
                        payments
                      </span>
                      <span className="font-bold text-stone-800 text-xs">Kapıda Ödeme</span>
                    </div>
                  </div>
                </label>
              </div>

              {/* Shared CreditCardForm with flip animation */}
              {paymentType === 'card' && (
                <div className="mt-8 border-t border-stone-100 pt-6">
                  <CreditCardForm
                    cardNumber={cardFields.cardNumber}
                    cardName={cardFields.cardName}
                    cardExpiry={cardFields.cardExpiry}
                    cardCVV={cardFields.cardCVV}
                    onChange={(fields) => {
                      setCardFields(fields);
                      if (Object.keys(cardErrors).length) setCardErrors({});
                    }}
                    errors={cardErrors}
                  />
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Checkout Order Summary Sidebar */}
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

                {/* Coupon Code Panel */}
                <div className="space-y-3">
                  {couponApplied ? (
                    <div className="bg-green-50 text-green-700 px-3.5 py-3 rounded-2xl flex items-center gap-3 border border-dashed border-green-200 text-xs font-bold">
                      <span className="material-symbols-outlined text-[16px]">local_offer</span>
                      <span className="flex-grow text-left">İLK50 Kuponu Uygulandı</span>
                      <button 
                        onClick={onRemoveCoupon}
                        className="material-symbols-outlined text-stone-500 hover:text-primary transition-colors cursor-pointer select-none text-[16px]"
                      >
                        close
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCouponBtn} className="flex gap-2">
                      <input 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-grow rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/25 placeholder-stone-400" 
                        placeholder="Kupon Kodu Girin" 
                        type="text" 
                      />
                      <button 
                        type="submit"
                        className="bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs px-4 rounded-xl cursor-pointer transition-colors"
                      >
                        Uygula
                      </button>
                    </form>
                  )}

                  {/* Giant Checkout submit CTA */}
                  <button 
                    onClick={onSubmitCheckout}
                    className="w-full brand-gradient-bg text-white font-bold h-14 rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <span>Siparişi Onayla</span>
                    <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                  </button>
                </div>

                <p className="text-[10px] text-center text-stone-400 mt-4 leading-relaxed font-medium">
                  "Siparişi Onayla" butonuna basarak Kullanıcı Sözleşmesi'ni ve KVKK Aydınlatma Metni'ni kabul etmiş olursunuz.
                </p>
              </section>

              {/* Security trust badges */}
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
    </div>
  );
}

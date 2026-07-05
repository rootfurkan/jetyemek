import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../common/components/Toast.jsx';
import { updateRestaurant as updateRestaurantState } from '../../features/restaurants/restaurantsSlice.js';
import api, { updateRestaurant } from '../../services/api.js';

const defaultWorkingHours = [
  { day: 'Pazartesi', start: '09:00', end: '22:00', closed: false },
  { day: 'Salı', start: '09:00', end: '22:00', closed: false },
  { day: 'Çarşamba', start: '09:00', end: '22:00', closed: false },
  { day: 'Perşembe', start: '09:00', end: '22:00', closed: false },
  { day: 'Cuma', start: '09:00', end: '23:00', closed: false },
  { day: 'Cumartesi', start: '10:00', end: '23:00', closed: false },
  { day: 'Pazar', start: '10:00', end: '21:00', closed: true },
];

// Sayısal ayar değerini güvenli biçimde okur.
function getNumber(value, fallback = '') {
  const match = String(value || '').match(/\d+/);
  return match ? match[0] : fallback;
}

// Girilen adrese göre harita bağlantısı üretir.
function buildMapUrl(address) {
  const query = encodeURIComponent(address || 'İstanbul');
  return `https://www.google.com/maps?q=${query}&output=embed`;
}

// Restoran ayarları ekranını yönetir.
export default function AdminSettings() {
  const dispatch = useDispatch();
  const addToast = useToast();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const restaurants = useSelector((state) => state.restaurants.list);
  const [remoteRestaurant, setRemoteRestaurant] = useState(null);
  const [isRestaurantLookupLoading, setIsRestaurantLookupLoading] = useState(false);
  const restaurantFromState = useMemo(() => (
    restaurants.find((item) => item.id === currentUser?.restaurantId) ||
    restaurants.find((item) => item.email && item.email === currentUser?.email)
  ), [restaurants, currentUser?.restaurantId, currentUser?.email]);
  const restaurant = restaurantFromState || remoteRestaurant;

  const [form, setForm] = useState({
    name: '',
    category: '',
    description: '',
    minOrderAmount: '',
    deliveryTime: '',
    deliveryZones: '',
    phone: '',
    email: '',
    address: '',
    image: '',
    bannerImage: '',
    isOpen: true,
    holidayMode: false,
    holidayStart: '',
    holidayEnd: '',
    workingHours: defaultWorkingHours,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (restaurantFromState) {
      setRemoteRestaurant(null);
      setIsRestaurantLookupLoading(false);
      return;
    }

    if (!currentUser?.restaurantId && !currentUser?.email) {
      setIsRestaurantLookupLoading(false);
      return;
    }

    let isCancelled = false;

    async function findRestaurant() {
      setIsRestaurantLookupLoading(true);

      try {
        let foundRestaurant = null;

        if (currentUser?.restaurantId) {
          try {
            const response = await api.get(`/restaurants/${encodeURIComponent(currentUser.restaurantId)}`);
            foundRestaurant = response.data;
          } catch (_) {
            foundRestaurant = null;
          }
        }

        if (!foundRestaurant && currentUser?.email) {
          const response = await api.get(`/restaurants?email=${encodeURIComponent(currentUser.email)}`);
          foundRestaurant = response.data?.[0] || null;
        }

        if (!isCancelled) {
          setRemoteRestaurant(foundRestaurant);
        }
      } catch (_) {
        if (!isCancelled) {
          setRemoteRestaurant(null);
        }
      } finally {
        if (!isCancelled) {
          setIsRestaurantLookupLoading(false);
        }
      }
    }

    findRestaurant();

    return () => {
      isCancelled = true;
    };
  }, [restaurantFromState, currentUser?.restaurantId, currentUser?.email]);

  useEffect(() => {
    if (!restaurant) return;

    setForm({
      name: restaurant.name || '',
      category: restaurant.category || '',
      description: restaurant.description || '',
      minOrderAmount: getNumber(restaurant.minOrder, '100'),
      deliveryTime: getNumber(restaurant.time, '30'),
      deliveryZones: restaurant.deliveryZones || restaurant.city || '',
      phone: restaurant.phone || '',
      email: restaurant.email || currentUser?.email || '',
      address: restaurant.address || restaurant.city || '',
      image: restaurant.image || '',
      bannerImage: restaurant.bannerImage || '',
      isOpen: restaurant.isOpen !== false,
      holidayMode: Boolean(restaurant.holidayMode),
      holidayStart: restaurant.holidayStart || '',
      holidayEnd: restaurant.holidayEnd || '',
      workingHours: restaurant.workingHours?.length ? restaurant.workingHours : defaultWorkingHours,
    });
  }, [restaurant, currentUser?.email]);

  const mapUrl = useMemo(() => buildMapUrl(form.address), [form.address]);

  // Tek bir restoran ayarı alanını günceller.
  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Çalışma saatindeki seçili günü düzenler.
  const handleHourChange = (index, field, value) => {
    setForm((prev) => ({
      ...prev,
      workingHours: prev.workingHours.map((item, itemIndex) => (
        itemIndex === index ? { ...item, [field]: value } : item
      )),
    }));
  };

  // Seçili günü açık veya kapalı yapar.
  const handleToggleDayClosed = (index) => {
    setForm((prev) => ({
      ...prev,
      workingHours: prev.workingHours.map((item, itemIndex) => (
        itemIndex === index ? { ...item, closed: !item.closed } : item
      )),
    }));
  };

  // Restoran ayarlarını db.json tarafına kaydeder.
  const handleSaveChanges = async () => {
    if (!restaurant?.id) {
      addToast({ message: 'Restoran bilgisi bulunamadı.', type: 'error' });
      return;
    }

    if (!form.name.trim() || !form.category.trim()) {
      addToast({ message: 'Restoran adı ve kategori alanı boş bırakılamaz.', type: 'error' });
      return;
    }

    const deliveryTime = Number(form.deliveryTime || 0);
    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim(),
      minOrder: `${Number(form.minOrderAmount || 0)} TL`,
      time: `${deliveryTime}-${deliveryTime + 10} dk`,
      deliveryZones: form.deliveryZones.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      city: form.address.trim() || form.deliveryZones.trim(),
      image: form.image.trim(),
      bannerImage: form.bannerImage.trim(),
      isOpen: form.isOpen && !form.holidayMode,
      status: form.isOpen && !form.holidayMode ? 'Aktif' : 'Pasif',
      holidayMode: form.holidayMode,
      holidayStart: form.holidayStart,
      holidayEnd: form.holidayEnd,
      workingHours: form.workingHours,
    };

    try {
      setIsSaving(true);
      const savedRestaurant = await updateRestaurant(restaurant.id, payload);
      dispatch(updateRestaurantState(savedRestaurant));
      addToast({ message: 'Mağaza ayarları başarıyla kaydedildi.', type: 'success' });
    } catch (error) {
      addToast({ message: 'Ayarlar kaydedilirken bir sorun oluştu.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isRestaurantLookupLoading) {
    return (
      <div className="bg-white rounded-[24px] border border-stone-100 shadow-soft p-8">
        <h2 className="text-xl font-black text-stone-800">Restoran bilgileri yükleniyor</h2>
        <p className="text-sm text-stone-500 mt-2">Mağaza ayarları hazırlanıyor.</p>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="bg-white rounded-[24px] border border-stone-100 shadow-soft p-8">
        <h2 className="text-xl font-black text-stone-800">Restoran bulunamadı</h2>
        <p className="text-sm text-stone-500 mt-2">Bu kullanıcıya bağlı restoran kaydı sistemde bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div>
        <h2 className="text-3xl font-black text-stone-800 tracking-tight">Mağaza Ayarları</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">storefront</span>
              İşletme Profili
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="relative self-center sm:self-start">
                  <div className="w-24 h-24 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-center overflow-hidden shadow-inner">
                    {form.image ? (
                      <img className="w-full h-full object-cover" alt={form.name} src={form.image} referrerPolicy="no-referrer" />
                    ) : (
                      <span className="material-symbols-outlined text-3xl text-stone-300">restaurant</span>
                    )}
                  </div>
                  <p className="text-center mt-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wide">Logo</p>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Restoran Adı</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(event) => updateField('name', event.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Mutfak / İşletme Türü</label>
                    <input
                      type="text"
                      value={form.category}
                      onChange={(event) => updateField('category', event.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                      placeholder="Hamburger, Pizza, Ev Yemekleri..."
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Açıklama / Slogan</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Logo / Kapak Görseli URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(event) => updateField('image', event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Banner Görseli URL</label>
                <input
                  type="url"
                  value={form.bannerImage}
                  onChange={(event) => updateField('bannerImage', event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  placeholder="Restoran detay sayfasındaki üst görsel"
                />
                <div className="mt-3 h-32 rounded-2xl overflow-hidden border border-stone-100 bg-stone-100 flex items-center justify-center">
                  {form.bannerImage ? (
                    <img className="w-full h-full object-cover" alt={`${form.name} banner`} src={form.bannerImage} referrerPolicy="no-referrer" />
                  ) : (
                    <span className="text-xs font-bold text-stone-400">Banner önizlemesi</span>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">delivery_dining</span>
              Teslimat Ayarları
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Minimum Sipariş Tutarı (TL)</label>
                <input
                  type="number"
                  min="0"
                  value={form.minOrderAmount}
                  onChange={(event) => updateField('minOrderAmount', event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Ortalama Teslimat Süresi (dk)</label>
                <input
                  type="number"
                  min="0"
                  value={form.deliveryTime}
                  onChange={(event) => updateField('deliveryTime', event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Teslimat Bölgeleri</label>
                <textarea
                  rows="2"
                  value={form.deliveryZones}
                  onChange={(event) => updateField('deliveryZones', event.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none resize-none"
                  placeholder="Beşiktaş, Şişli, Kadıköy..."
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">location_on</span>
              İletişim ve Adres Bilgileri
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Telefon Numarası</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(event) => updateField('phone', event.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">E-posta</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField('email', event.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Açık Adres</label>
                  <textarea
                    rows="4"
                    value={form.address}
                    onChange={(event) => updateField('address', event.target.value)}
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none resize-none"
                    placeholder="Mahalle, cadde, no, ilçe, il..."
                  />
                </div>
              </div>

              <div className="min-h-[260px] rounded-2xl overflow-hidden border border-stone-100 shadow-sm bg-stone-100">
                <iframe
                  title="Restoran konumu"
                  src={mapUrl}
                  className="w-full h-full min-h-[260px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">toggle_on</span>
                  Mağaza Durumu
                </h3>
                <p className="text-xs text-stone-400 font-semibold mt-1">Kapalı yapıldığında müşteriler restoranınızdan sipariş veremez.</p>
              </div>

              <button
                type="button"
                onClick={() => updateField('isOpen', !form.isOpen)}
                className={`w-14 h-8 rounded-full p-1 transition-all ${form.isOpen ? 'bg-primary' : 'bg-stone-300'}`}
              >
                <span className={`block w-6 h-6 rounded-full bg-white shadow transition-all ${form.isOpen ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>
          </section>

          <section className="bg-gradient-to-br from-primary to-secondary rounded-[24px] p-6 shadow-lg shadow-primary/10 border-2 border-primary/20 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">beach_access</span>
                <h3 className="text-base font-extrabold">Tatil Modu</h3>
              </div>

              <button
                type="button"
                onClick={() => updateField('holidayMode', !form.holidayMode)}
                className={`w-14 h-8 rounded-full p-1 transition-all ${form.holidayMode ? 'bg-white/45' : 'bg-white/20'}`}
              >
                <span className={`block w-6 h-6 rounded-full bg-white shadow transition-all ${form.holidayMode ? 'translate-x-6' : 'translate-x-0'}`}></span>
              </button>
            </div>

            <p className="text-white/80 text-xs font-semibold leading-relaxed mb-5">
              Tatil modu aktifken restoranınız geçici olarak siparişe kapatılır.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-extrabold text-white/70 uppercase tracking-wider mb-1">Başlangıç</label>
                <input
                  type="date"
                  disabled={!form.holidayMode}
                  value={form.holidayStart}
                  onChange={(event) => updateField('holidayStart', event.target.value)}
                  className="w-full bg-white/15 border-none rounded-xl p-2 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-white/70 uppercase tracking-wider mb-1">Bitiş</label>
                <input
                  type="date"
                  disabled={!form.holidayMode}
                  value={form.holidayEnd}
                  onChange={(event) => updateField('holidayEnd', event.target.value)}
                  className="w-full bg-white/15 border-none rounded-xl p-2 text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-40"
                />
              </div>
            </div>
          </section>

          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              Çalışma Saatleri
            </h3>

            <div className="space-y-3.5">
              {form.workingHours.map((item, index) => (
                <div
                  key={item.day}
                  className={`flex items-center justify-between py-2 border-b border-stone-50 last:border-0 gap-3 ${item.closed ? 'opacity-55' : ''}`}
                >
                  <span className="w-20 font-bold text-xs text-stone-700">{item.day}</span>

                  <div className="flex items-center gap-1.5">
                    <input
                      type="time"
                      disabled={item.closed}
                      value={item.start}
                      onChange={(event) => handleHourChange(index, 'start', event.target.value)}
                      className="bg-stone-50 border border-stone-200/50 rounded-lg p-1 text-center text-xs font-bold w-20 disabled:opacity-45 focus:outline-none"
                    />
                    <span className="text-stone-400 font-bold">-</span>
                    <input
                      type="time"
                      disabled={item.closed}
                      value={item.end}
                      onChange={(event) => handleHourChange(index, 'end', event.target.value)}
                      className="bg-stone-50 border border-stone-200/50 rounded-lg p-1 text-center text-xs font-bold w-20 disabled:opacity-45 focus:outline-none"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleDayClosed(index)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all ${item.closed ? 'bg-rose-50 text-primary' : 'bg-green-50 text-green-700'}`}
                  >
                    {item.closed ? 'KAPALI' : 'AÇIK'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-[20px] p-4 shadow-2xl border border-stone-100 flex items-center justify-between gap-4">
          <p className="hidden md:block text-stone-500 text-xs font-semibold">Yaptığınız güncellemeleri kaydetmeyi unutmayın.</p>

          <div className="flex gap-2 w-full md:w-auto justify-end ml-auto">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs rounded-full transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              İptal Et
            </button>

            <button
              type="button"
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-black text-xs rounded-full transition-all cursor-pointer whitespace-nowrap shadow-md shadow-primary/20 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

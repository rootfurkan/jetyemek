import React, { useState } from 'react';

export default function AdminSettings() {
  // Store details state
  const [storeName, setStoreName] = useState('Hearty Delights');
  const [cuisineType, setCuisineType] = useState('Burger & Fast Food');
  const [description, setDescription] = useState('Şehrin en taze malzemeleriyle hazırlanan, sevgi dolu burgerler ve el yapımı özel soslar.');
  const [minOrder, setMinOrder] = useState('150');
  const [deliveryTime, setDeliveryTime] = useState('35');
  const [deliveryZones, setDeliveryZones] = useState('Kadıköy, Moda, Fenerbahçe, Göztepe, Bostancı.');
  const [phone, setPhone] = useState('0216 123 45 67');
  const [email, setEmail] = useState('hello@heartydelights.com');
  const [address, setAddress] = useState('Caferağa Mah. Dr. Esat Işık Cad. No:42, Kadıköy/İstanbul');
  const [holidayMode, setHolidayMode] = useState(false);
  const [holidayStart, setHolidayStart] = useState('');
  const [holidayEnd, setHolidayEnd] = useState('');

  // Weekly hours dataset
  const [workingHours, setWorkingHours] = useState([
    { day: 'Pazartesi', start: '09:00', end: '22:00', closed: false },
    { day: 'Salı', start: '09:00', end: '22:00', closed: false },
    { day: 'Çarşamba', start: '09:00', end: '22:00', closed: false },
    { day: 'Perşembe', start: '09:00', end: '22:00', closed: false },
    { day: 'Cuma', start: '09:00', end: '23:30', closed: false },
    { day: 'Cumartesi', start: '10:00', end: '00:00', closed: false },
    { day: 'Pazar', start: '11:00', end: '21:00', closed: true }
  ]);

  const handleToggleDayClosed = (dayIndex) => {
    setWorkingHours(prev => prev.map((item, idx) => 
      idx === dayIndex ? { ...item, closed: !item.closed } : item
    ));
  };

  const handleHourChange = (dayIndex, field, value) => {
    setWorkingHours(prev => prev.map((item, idx) => 
      idx === dayIndex ? { ...item, [field]: value } : item
    ));
  };

  const handleSaveChanges = () => {
    alert('Mağaza ayarlarınız başarıyla kaydedildi! Değişiklikler canlı mağaza vitrininizde güncellendi.');
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Settings Header */}
      <div>
        <h2 className="text-3xl font-black text-stone-800 tracking-tight">Mağaza Ayarları</h2>
        <p className="text-stone-500 text-sm mt-1">İşletmenizin profilini, operasyon saatlerini, tatil günlerini ve gönderim limitlerini buradan yönetin.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (Profile, Delivery, Map) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Business Profile */}
          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">storefront</span>
              İşletme Profili
            </h3>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                {/* Logo Uploader Visual */}
                <div className="relative group self-center sm:self-start">
                  <div className="w-24 h-24 rounded-2xl bg-stone-50 border-2 border-dashed border-stone-200 flex flex-col items-center justify-center overflow-hidden shadow-inner cursor-pointer">
                    <img 
                      className="w-full h-full object-contain p-2" 
                      alt="Restaurant Logo" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_DxruAmthhSVm6cbiMSMePZCq8pshpuLZqi0pxpmGZDcAtw1DcIc8R695wtSkChbPEATpjj1ECyULabsJVAdRIyUfUg6E15ldvTiOXeEWxRpo0_EChBYm_69K0wxl8dgTCxBJ8812H6X3N2GbkVK7RHT-K8wtEvO_HX4WnIO9Z8jI4Br1IogRB_MIeSKs-ABN_wzKaSj4mZ1_gK7dyzu1-6HE95lR0NW7I0yAm4CfKXNtg2P5KHMAMNJc8El8bnv6-RcoSLpG9Ig" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="material-symbols-outlined text-white text-lg">photo_camera</span>
                    </div>
                  </div>
                  <p className="text-center mt-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wide">Logoyu Düzenle</p>
                </div>

                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Restoran Adı</label>
                    <input 
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Mutfak / İşletme Türü</label>
                    <select 
                      value={cuisineType}
                      onChange={(e) => setCuisineType(e.target.value)}
                      className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                    >
                      <option>Burger & Fast Food</option>
                      <option>İtalyan & Pizza</option>
                      <option>Ev Yemekleri</option>
                      <option>Kebap & Izgara</option>
                      <option>Tatlı & Kahve</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Açıklama / Slogan</label>
                <textarea 
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Delivery Settings */}
          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">delivery_dining</span>
              Teslimat Ayarları
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Minimum Sipariş Tutarı (₺)</label>
                <input 
                  type="number"
                  value={minOrder}
                  onChange={(e) => setMinOrder(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Ortalama Gönderim Süresi (dk)</label>
                <input 
                  type="number"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Teslimat Bölgeleri / Kapsama Alanı</label>
                <textarea 
                  rows="2"
                  value={deliveryZones}
                  onChange={(e) => setDeliveryZones(e.target.value)}
                  className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  placeholder="Gönderim yaptığınız mahalle isimlerini aralarında virgül olacak şekilde girin..."
                />
              </div>
            </div>
          </section>

          {/* Section 3: Contact Info & Map Pin */}
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
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Kurumsal E-posta</label>
                  <input 
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Açık Adres</label>
                  <textarea 
                    rows="2.5"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Styled Mock map pin canvas */}
              <div className="h-full min-h-[190px] rounded-2xl overflow-hidden border border-stone-100 relative group shadow-sm bg-stone-100">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBCm1XgVa6eC8gn1l5b9_129wCo-bc3UGeqdo8jKT710YgN51A0KsS2G0dpQ8_AsGdr9IT7JQ69-yuepz1f9NneqSreFPoMgv7H2ZrBw1zSJdIt38AVN3ufDelvyPFej4M4JfrcRtkybKDhA3BVT6CUpzneuESd8IX5kljpSmy3JWIIT59IJGlhELYcxqpSmVzGp5H_sIWTXz6f6rqiYSw_f_ktElJOn8by8PRAauP5gtfw3I1eF0ct2cR1Uk4aQ0NtuQ5dubZDX70')" }}
                ></div>
                <div className="absolute inset-0 bg-black/5"></div>
                <button 
                  onClick={() => alert('Pin harita konumu düzenleyici yakında eklenecektir!')}
                  className="absolute bottom-3 right-3 bg-white hover:bg-stone-50 text-stone-700 px-3 py-1.5 rounded-full shadow-md text-[10px] font-extrabold uppercase tracking-wide flex items-center gap-1 cursor-pointer transition-transform duration-150 active:scale-95"
                >
                  <span className="material-symbols-outlined text-xs">map</span>
                  Konumu Düzenle
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column (Holiday Mode, Working Hours) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 4: Holiday Mode (Stunning colored header card) */}
          <section className="bg-gradient-to-br from-primary to-secondary rounded-[24px] p-6 shadow-lg shadow-primary/10 border-2 border-primary/20 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-2xl">beach_access</span>
                <h3 className="text-base font-extrabold">Tatil Modu</h3>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={holidayMode}
                  onChange={() => setHolidayMode(!holidayMode)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-white/45"></div>
              </label>
            </div>

            <p className="text-white/80 text-xs font-semibold leading-relaxed mb-5">
              Aktif edildiğinde, belirleyeceğiniz tarihler arasında restoranınız CraveDash uygulamasında otomatik olarak "Kapalı / Tatilde" olarak görünecektir.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-extrabold text-white/70 uppercase tracking-wider mb-1">Başlangıç Tarihi</label>
                <input 
                  type="date"
                  disabled={!holidayMode}
                  value={holidayStart}
                  onChange={(e) => setHolidayStart(e.target.value)}
                  className="w-full bg-white/15 hover:bg-white/20 border-none rounded-xl p-2 text-white placeholder-white/40 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-40 transition-all cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[9px] font-extrabold text-white/70 uppercase tracking-wider mb-1">Bitiş Tarihi</label>
                <input 
                  type="date"
                  disabled={!holidayMode}
                  value={holidayEnd}
                  onChange={(e) => setHolidayEnd(e.target.value)}
                  className="w-full bg-white/15 hover:bg-white/20 border-none rounded-xl p-2 text-white placeholder-white/40 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-40 transition-all cursor-pointer"
                />
              </div>
            </div>
          </section>

          {/* Section 5: Working Hours list per day */}
          <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft">
            <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-5">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              Çalışma Saatleri
            </h3>

            <div className="space-y-3.5">
              {workingHours.map((item, idx) => (
                <div 
                  key={item.day}
                  className={`flex items-center justify-between py-2 border-b border-stone-50 last:border-0 ${
                    item.closed ? 'opacity-55' : ''
                  }`}
                >
                  <span className="w-20 font-bold text-xs text-stone-700">{item.day}</span>
                  
                  <div className="flex items-center gap-1.5">
                    <input 
                      type="time"
                      disabled={item.closed}
                      value={item.start}
                      onChange={(e) => handleHourChange(idx, 'start', e.target.value)}
                      className="bg-stone-50 hover:bg-stone-100/50 border border-stone-200/50 rounded-lg p-1 text-center text-xs font-bold w-16 disabled:opacity-45 focus:outline-none"
                    />
                    <span className="text-stone-400 font-bold">-</span>
                    <input 
                      type="time"
                      disabled={item.closed}
                      value={item.end}
                      onChange={(e) => handleHourChange(idx, 'end', e.target.value)}
                      className="bg-stone-50 hover:bg-stone-100/50 border border-stone-200/50 rounded-lg p-1 text-center text-xs font-bold w-16 disabled:opacity-45 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox"
                        checked={item.closed}
                        onChange={() => handleToggleDayClosed(idx)}
                        className="sr-only"
                      />
                      <div className="w-9 h-5 bg-stone-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                    <span className={`text-[10px] font-black uppercase tracking-wider w-11 ${
                      item.closed ? 'text-primary' : 'text-stone-400'
                    }`}>
                      {item.closed ? 'KAPALI' : 'AÇIK'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Sticky Bottom bar Save panel */}
      <div className="fixed bottom-6 left-0 right-0 z-40 px-4 md:px-8">
        <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-[20px] p-4 shadow-2xl border border-stone-100 flex items-center justify-between gap-4">
          <p className="hidden md:block text-stone-500 text-xs font-semibold italic">
            * Kaydedilmeyen değişiklikler kaybolacaktır. Değişiklikler yapıldıktan sonra kaydetmeyi unutmayın.
          </p>
          <div className="flex gap-2 w-full md:w-auto justify-end ml-auto">
            <button 
              onClick={() => {
                if (confirm('Değişiklikleri iptal edip sayfayı yenilemek istiyor musunuz?')) {
                  window.location.reload();
                }
              }}
              className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs rounded-full transition-all cursor-pointer whitespace-nowrap active:scale-95"
            >
              İptal Et
            </button>
            <button 
              onClick={handleSaveChanges}
              className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-black text-xs rounded-full transition-all cursor-pointer whitespace-nowrap shadow-md shadow-primary/20 active:scale-95"
            >
              Değişiklikleri Kaydet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

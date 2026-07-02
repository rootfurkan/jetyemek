import React, { useState } from 'react';
import { useToast } from '../../common/components/Toast.jsx';

export default function AdminReviews() {
  const addToast = useToast();
  const [filter, setFilter] = useState('All'); // 'All' | 'Unreplied' | 'Negative' | 'WithImages'
  const [sortBy, setSortBy] = useState('Recent'); // 'Recent' | 'Highest' | 'Lowest'
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  // High fidelity reviews mock dataset
  const [reviews, setReviews] = useState([
    {
      id: 'rev-1',
      author: 'Ahmet Özkan',
      initials: 'AÖ',
      date: '24 Ekim 2024 • 12:45',
      rating: 5,
      items: 'Bacon Deluxe Burger, Truffle Fries, Cola Zero',
      text: 'Yemekler sıcacıık geldi ve burgerin ekmeği efsaneydi! Sosları bol koyduğunuz için teşekkürler. Servis hızı da beklediğimden çok daha iyiydi. Kesinlikle favorim oldu artık burası.',
      reply: null,
      hasImage: true
    },
    {
      id: 'rev-2',
      author: 'Selda Demir',
      initials: 'SD',
      date: '22 Ekim 2024 • 20:12',
      rating: 3,
      items: 'Classic Cheeseburger',
      text: 'Burger biraz soğuk geldi ama lezzeti yerindeydi. Bir dahaki sefere daha özenli olmanızı bekliyorum.',
      reply: 'Geri bildiriminiz için teşekkürler Selda Hanım. Yaşanan aksaklık için özür dileriz. Bir sonraki siparişinizde size özel bir ikramımız olacak, lütfen bizimle iletişime geçin.',
      hasImage: false
    },
    {
      id: 'rev-3',
      author: 'Murat Kaya',
      initials: 'MK',
      date: '20 Ekim 2024 • 13:20',
      rating: 4,
      items: 'Mushroom Swiss Burger',
      text: 'Gayet başarılı, malzemeler kaliteli belli oluyor. Ellerinize sağlık, soslar da çok lezzetliydi.',
      reply: null,
      hasImage: false
    },
    {
      id: 'rev-4',
      author: 'Eda Şahin',
      initials: 'EŞ',
      date: '18 Ekim 2024 • 19:30',
      rating: 1,
      items: 'Texas BBQ Burger, Onion Rings',
      text: 'Sipariş tam 1 saatte geldi, patatesler buz gibi olmuştu ve soğan halkaları aşırı yağ çekmişti. Eskiden çok daha iyiydiniz yakışmadı.',
      reply: null,
      hasImage: false
    }
  ]);

  const handleToggleReplySection = (id) => {
    setActiveReplyId(activeReplyId === id ? null : id);
  };

  const handleSendReply = (id) => {
    const text = replyTextMap[id];
    if (!text || text.trim() === '') {
      addToast({ message: 'Lütfen bir yanıt metni yazınız.', type: 'error' });
      return;
    }

    setReviews(prev => prev.map(r => r.id === id ? { ...r, reply: text } : r));
    setReplyTextMap(prev => ({ ...prev, [id]: '' }));
    setActiveReplyId(null);
  };

  // Filter & sort reviews
  const filteredReviews = reviews.filter(r => {
    if (filter === 'All') return true;
    if (filter === 'Unreplied') return !r.reply;
    if (filter === 'Negative') return r.rating <= 2;
    if (filter === 'WithImages') return r.hasImage;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'Recent') return 1; // already ordered
    if (sortBy === 'Highest') return b.rating - a.rating;
    if (sortBy === 'Lowest') return a.rating - b.rating;
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Title section */}
      <div>
        <h2 className="text-3xl font-black text-stone-800 tracking-tight">Değerlendirme ve Yorumlar</h2>
        <p className="text-stone-500 text-sm mt-1">Müşterilerinizin geri bildirimlerini anlık olarak takip edin, puan analizi yapın ve yanıt yazın.</p>
      </div>

      {/* Star Analytics Summary (Bento Grid Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Side: Score card */}
        <div className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft flex flex-col items-center justify-center text-center">
          <p className="text-stone-400 font-bold text-xs uppercase tracking-wider">Genel Ortalama</p>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-6xl font-black text-primary leading-none">4.8</span>
            <span className="text-stone-400 font-bold text-lg">/5</span>
          </div>
          
          <div className="flex text-amber-500 mt-2">
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
          </div>
          <p className="mt-4 text-stone-500 text-xs font-semibold">1,248 toplam yorum baz alınmıştır</p>
        </div>

        {/* Right Side: Detailed star distribution progress */}
        <div className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft md:col-span-2 flex flex-col justify-between space-y-2.5">
          {/* 5 stars */}
          <div className="flex items-center gap-4 text-xs font-bold text-stone-700">
            <span className="w-12 text-stone-600">5 Yıldız</span>
            <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '82%' }}></div>
            </div>
            <span className="w-8 text-right text-stone-400">82%</span>
          </div>
          {/* 4 stars */}
          <div className="flex items-center gap-4 text-xs font-bold text-stone-700">
            <span className="w-12 text-stone-600">4 Yıldız</span>
            <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '12%' }}></div>
            </div>
            <span className="w-8 text-right text-stone-400">12%</span>
          </div>
          {/* 3 stars */}
          <div className="flex items-center gap-4 text-xs font-bold text-stone-700">
            <span className="w-12 text-stone-600">3 Yıldız</span>
            <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '4%' }}></div>
            </div>
            <span className="w-8 text-right text-stone-400">4%</span>
          </div>
          {/* 2 stars */}
          <div className="flex items-center gap-4 text-xs font-bold text-stone-700">
            <span className="w-12 text-stone-600">2 Yıldız</span>
            <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '1%' }}></div>
            </div>
            <span className="w-8 text-right text-stone-400">1%</span>
          </div>
          {/* 1 star */}
          <div className="flex items-center gap-4 text-xs font-bold text-stone-700">
            <span className="w-12 text-stone-600">1 Yıldız</span>
            <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: '1%' }}></div>
            </div>
            <span className="w-8 text-right text-stone-400">1%</span>
          </div>
        </div>
      </div>

      {/* Filter and Sorting Selection controls */}
      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setFilter('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'All' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
            }`}
          >
            Tüm Yorumlar
          </button>
          
          <button
            onClick={() => setFilter('Unreplied')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'Unreplied' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
            }`}
          >
            Yanıtlanmamış ({reviews.filter(r => !r.reply).length})
          </button>

          <button
            onClick={() => setFilter('Negative')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'Negative' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
            }`}
          >
            Olumsuz / Düşük (≤2★)
          </button>

          <button
            onClick={() => setFilter('WithImages')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
              filter === 'WithImages' 
                ? 'bg-primary text-white shadow-sm' 
                : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
            }`}
          >
            Fotoğraflı
          </button>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <span className="text-xs text-stone-400 font-bold whitespace-nowrap">Sırala:</span>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-4 focus:ring-primary/5 focus:outline-none text-stone-700"
          >
            <option value="Recent">En Yeni</option>
            <option value="Highest">En Yüksek Puan</option>
            <option value="Lowest">En Düşük Puan</option>
          </select>
        </div>
      </div>

      {/* Review Feed list */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-white border border-stone-100 rounded-[24px] p-16 text-center shadow-soft flex flex-col items-center justify-center">
            <span className="material-symbols-outlined text-[32px] text-stone-400 mb-3">reviews</span>
            <h3 className="text-base font-bold text-stone-700">Filtreye Uygun Yorum Yok</h3>
            <p className="text-stone-400 text-xs mt-1">Seçtiğiniz filtreye uygun müşteri yorumu bulunmamaktadır.</p>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <article 
              key={rev.id}
              className="bg-white border border-stone-100 rounded-[24px] p-5 md:p-6 shadow-soft space-y-4 flex flex-col justify-between transition-all hover:border-stone-200/60"
            >
              {/* Review Header */}
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shadow-sm">
                    {rev.initials}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-stone-800 text-sm leading-snug">{rev.author}</h4>
                    <p className="text-stone-400 text-[10px] font-bold mt-0.5">{rev.date}</p>
                  </div>
                </div>

                <div className="flex text-amber-500 scale-90 md:scale-100 origin-left">
                  {[...Array(5)].map((_, i) => (
                    <span 
                      key={i} 
                      className="material-symbols-outlined text-[18px]"
                      style={{ fontVariationSettings: i < rev.rating ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      star
                    </span>
                  ))}
                </div>
              </div>

              {/* Items tag */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold bg-stone-50 border border-stone-200/50 text-primary px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">shopping_basket</span>
                  {rev.items}
                </span>
                {rev.hasImage && (
                  <span className="text-[10px] font-bold bg-stone-50 border border-stone-200/50 text-stone-600 px-2.5 py-1 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">image</span>
                    Fotoğraflı Yorum
                  </span>
                )}
              </div>

              {/* Comment text */}
              <p className="text-stone-700 text-sm font-medium leading-relaxed">{rev.text}</p>

              {/* Reply box if existing */}
              {rev.reply ? (
                <div className="bg-stone-50 p-4 rounded-2xl border-l-4 border-primary mt-2 animate-fade-in">
                  <div className="flex items-center gap-1.5 mb-1 text-primary">
                    <span className="material-symbols-outlined text-[15px] font-bold">storefront</span>
                    <span className="font-extrabold text-[11px] uppercase tracking-wider">İşletme Yanıtı</span>
                  </div>
                  <p className="text-stone-600 text-xs font-semibold leading-relaxed italic">
                    "{rev.reply}"
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-2">
                  {activeReplyId !== rev.id ? (
                    <button
                      onClick={() => handleToggleReplySection(rev.id)}
                      className="w-fit bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">reply</span>
                      Müşteriye Yanıt Yaz
                    </button>
                  ) : (
                    <div className="space-y-3 pt-1 border-t border-dashed border-stone-100 animate-slide-up">
                      <textarea
                        rows="3"
                        placeholder="Müşteriye geri bildirimi için teşekkür edin ve yanıtınızı buraya yazın..."
                        value={replyTextMap[rev.id] || ''}
                        onChange={(e) => setReplyTextMap({ ...replyTextMap, [rev.id]: e.target.value })}
                        className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-2xl p-4 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none min-h-[80px]"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleReplySection(rev.id)}
                          className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg text-xs font-bold transition-all cursor-pointer"
                        >
                          İptal
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSendReply(rev.id)}
                          className="px-5 py-1.5 bg-primary hover:bg-primary-container text-white rounded-lg text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                        >
                          Yanıtı Gönder
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}

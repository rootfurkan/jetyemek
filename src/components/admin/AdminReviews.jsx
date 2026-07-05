import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, replyToReview } from '../../features/reviews/reviewsSlice.js';
import { useToast } from '../../common/components/Toast.jsx';

// Yorum tarihini ekranda gösterilecek hale getirir.
function getReviewDate(review) {
  return new Date(review.createdAt || review.date || 0);
}

// Müşteri adından kısa avatar harfleri üretir.
function getCustomerInitials(name) {
  if (!name) return 'M';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

// Restoran yorumlarını listeler ve yanıtları yönetir.
export default function AdminReviews() {
  const dispatch = useDispatch();
  const addToast = useToast();

  const currentUser = useSelector((state) => state.auth.currentUser);
  const { list: allReviews = [], loading, error } = useSelector((state) => state.reviews);

  const restaurantId = currentUser?.restaurantId;
  const [filter, setFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Recent');
  const [replyTextMap, setReplyTextMap] = useState({});
  const [activeReplyId, setActiveReplyId] = useState(null);

  useEffect(() => {
    if (restaurantId) {
      dispatch(fetchReviews(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const reviews = useMemo(() => (
    allReviews.filter((review) => !restaurantId || review.restaurantId === restaurantId)
  ), [allReviews, restaurantId]);

  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + (Number(review.rating) || 0), 0) / reviews.length
    : 0;

  const filteredReviews = useMemo(() => {
    const result = reviews.filter((review) => {
      if (filter === 'Unreplied') return !review.reply;
      if (filter === 'Negative') return Number(review.rating) <= 2;
      if (filter === 'WithImages') return Boolean(review.hasImage || review.image);
      return true;
    });

    return [...result].sort((a, b) => {
      if (sortBy === 'Highest') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'Lowest') return Number(a.rating) - Number(b.rating);
      return getReviewDate(b) - getReviewDate(a);
    });
  }, [filter, reviews, sortBy]);

  // Restoran cevabını seçili yoruma kaydeder.
  const handleSendReply = async (id) => {
    const reply = replyTextMap[id]?.trim();

    if (!reply) {
      addToast({ message: 'Lütfen yanıt metni yazınız.', type: 'error' });
      return;
    }

    try {
      await dispatch(replyToReview({ id, reply })).unwrap();
      setReplyTextMap((prev) => ({ ...prev, [id]: '' }));
      setActiveReplyId(null);
      addToast({ message: 'Yanıt başarıyla gönderildi.', type: 'success' });
    } catch (err) {
      addToast({ message: 'Yanıt gönderilirken bir sorun oluştu.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-black text-stone-800 tracking-tight">Değerlendirmeler</h2>
        <p className="text-stone-500 text-sm mt-1">Müşteri yorumlarını takip edin, puan dağılımını inceleyin ve yorumlara yanıt verin.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft flex flex-col items-center justify-center text-center">
          <p className="text-stone-400 font-bold text-xs uppercase tracking-wider">Genel Ortalama</p>
          <div className="flex items-baseline gap-1 mt-3">
            <span className="text-6xl font-black text-primary leading-none">{averageRating.toFixed(1)}</span>
            <span className="text-stone-400 font-bold text-lg">/5</span>
          </div>

          <div className="flex text-amber-500 mt-2">
            {[0, 1, 2, 3, 4].map((star) => (
              <span
                key={star}
                className="material-symbols-outlined text-[20px]"
                style={{ fontVariationSettings: star < Math.round(averageRating) ? "'FILL' 1" : "'FILL' 0" }}
              >
                star
              </span>
            ))}
          </div>
          <p className="mt-4 text-stone-500 text-xs font-semibold">{reviews.length} yorum üzerinden hesaplandı</p>
        </div>

        <div className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft md:col-span-2 flex flex-col justify-between space-y-2.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((review) => Number(review.rating) === star).length;
            const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0;

            return (
              <div key={star} className="flex items-center gap-4 text-xs font-bold text-stone-700">
                <span className="w-14 text-stone-600">{star} Yıldız</span>
                <div className="flex-1 h-2.5 bg-stone-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="w-14 text-right text-stone-400">{count} yorum</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-soft flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {[
            { id: 'All', label: `Tüm Yorumlar (${reviews.length})` },
            { id: 'Unreplied', label: `Yanıtlanmamış (${reviews.filter((review) => !review.reply).length})` },
            { id: 'Negative', label: `Düşük Puan (${reviews.filter((review) => Number(review.rating) <= 2).length})` },
            { id: 'WithImages', label: `Fotoğraflı (${reviews.filter((review) => review.hasImage || review.image).length})` },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                filter === item.id ? 'bg-primary text-white shadow-sm' : 'bg-stone-50 hover:bg-stone-100 text-stone-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
          <span className="text-xs text-stone-400 font-bold whitespace-nowrap">Sırala:</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-4 focus:ring-primary/5 focus:outline-none text-stone-700"
          >
            <option value="Recent">En Yeni</option>
            <option value="Highest">En Yüksek Puan</option>
            <option value="Lowest">En Düşük Puan</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="bg-white border border-stone-100 rounded-[24px] p-10 text-center shadow-soft text-stone-500 text-sm font-semibold">
          Yorumlar yükleniyor...
        </div>
      )}

      {!loading && error && (
        <div className="bg-rose-50 border border-rose-100 rounded-[24px] p-6 text-primary text-sm font-bold">
          Yorumlar yüklenirken bir sorun oluştu.
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-4">
          {filteredReviews.length === 0 ? (
            <div className="bg-white border border-stone-100 rounded-[24px] p-16 text-center shadow-soft flex flex-col items-center justify-center">
              <span className="material-symbols-outlined text-[32px] text-stone-400 mb-3">reviews</span>
              <h3 className="text-base font-bold text-stone-700">Yorum Bulunamadı</h3>
              <p className="text-stone-400 text-xs mt-1">Seçtiğiniz filtreye uygun müşteri yorumu bulunmuyor.</p>
            </div>
          ) : (
            filteredReviews.map((review) => (
              <article
                key={review.id}
                className="bg-white border border-stone-100 rounded-[24px] p-5 md:p-6 shadow-soft space-y-4 transition-all hover:border-stone-200/60"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shadow-sm">
                      {getCustomerInitials(review.user || review.author)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-stone-800 text-sm leading-snug">{review.user || review.author || 'İsimsiz Kullanıcı'}</h4>
                      <p className="text-stone-400 text-[10px] font-bold mt-0.5">{review.date || getReviewDate(review).toLocaleDateString('tr-TR')}</p>
                    </div>
                  </div>

                  <div className="flex text-amber-500 scale-90 md:scale-100 origin-left">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <span
                        key={star}
                        className="material-symbols-outlined text-[18px]"
                        style={{ fontVariationSettings: star < Number(review.rating) ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                </div>

                {(review.items || review.hasImage || review.image) && (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {review.items && (
                      <span className="text-[10px] font-bold bg-stone-50 border border-stone-200/50 text-primary px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">shopping_basket</span>
                        {review.items}
                      </span>
                    )}
                    {(review.hasImage || review.image) && (
                      <span className="text-[10px] font-bold bg-stone-50 border border-stone-200/50 text-stone-600 px-2.5 py-1 rounded-lg flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">image</span>
                        Fotoğraflı Yorum
                      </span>
                    )}
                  </div>
                )}

                <p className="text-stone-700 text-sm font-medium leading-relaxed">{review.comment || review.text || 'Yorum metni bulunmuyor.'}</p>

                {review.reply ? (
                  <div className="bg-stone-50 p-4 rounded-2xl border-l-4 border-primary mt-2">
                    <div className="flex items-center gap-1.5 mb-1 text-primary">
                      <span className="material-symbols-outlined text-[15px] font-bold">storefront</span>
                      <span className="font-extrabold text-[11px] uppercase tracking-wider">İşletme Yanıtı</span>
                    </div>
                    <p className="text-stone-600 text-xs font-semibold leading-relaxed italic">"{review.reply}"</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 pt-2">
                    {activeReplyId !== review.id ? (
                      <button
                        type="button"
                        onClick={() => setActiveReplyId(review.id)}
                        className="w-fit bg-primary/5 hover:bg-primary/10 text-primary px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">reply</span>
                        Müşteriye Yanıt Yaz
                      </button>
                    ) : (
                      <div className="space-y-3 pt-1 border-t border-dashed border-stone-100">
                        <textarea
                          rows="3"
                          placeholder="Müşteriye yanıtınızı yazın..."
                          value={replyTextMap[review.id] || ''}
                          onChange={(event) => setReplyTextMap({ ...replyTextMap, [review.id]: event.target.value })}
                          className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-2xl p-4 text-xs font-semibold focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all text-stone-800 focus:outline-none min-h-[80px]"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveReplyId(null)}
                            className="px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-500 rounded-lg text-xs font-bold transition-all cursor-pointer"
                          >
                            İptal
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSendReply(review.id)}
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
      )}
    </div>
  );
}

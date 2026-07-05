import React, { useEffect, useMemo, useState } from 'react';
import api from '../../../services/api.js';
import ConfirmDeleteModal from '../../../common/components/ConfirmDeleteModal.jsx';
import SearchInput from '../../../common/components/SearchInput.jsx';
import StatCard from '../../../common/components/StatCard.jsx';
import StatusBadge from '../../../common/components/StatusBadge.jsx';
import { useToast } from '../../../common/components/Toast.jsx';

// Yorum tarihini sıralama için Date değerine çevirir.
function getReviewDate(review) {
  return new Date(review.createdAt || review.date || 0);
}

// Adminin tüm restoran yorumlarını yönettiği sayfayı açar.
export default function PlatformReviews() {
  const addToast = useToast();
  const [reviews, setReviews] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [settings, setSettings] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteModal, setDeleteModal] = useState(null);
  const [newForbiddenWord, setNewForbiddenWord] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
// Yorum, restoran ve sistem ayarlarını birlikte yükler.
    async function loadPageData() {
      setLoading(true);

      try {
        const [reviewsResponse, restaurantsResponse, settingsResponse] = await Promise.all([
          api.get('/reviews'),
          api.get('/restaurants'),
          api.get('/settings'),
        ]);

        setReviews(reviewsResponse.data || []);
        setRestaurants(restaurantsResponse.data || []);
        setSettings((settingsResponse.data || [])[0] || null);
      } catch (error) {
        addToast({ message: 'Yorumlar yüklenirken bir sorun oluştu.', type: 'error' });
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, []);

  const forbiddenWords = settings?.forbiddenReviewWords || [];

// Yorumlara restoran adını ve varsayılan durumu ekler.
  const enrichedReviews = useMemo(() => (
    reviews.map((review) => {
      const restaurant = restaurants.find((item) => String(item.id) === String(review.restaurantId));

      return {
        ...review,
        status: review.status || 'Yayında',
        restaurantName: restaurant?.name || review.restaurant || 'Restoran',
      };
    })
  ), [restaurants, reviews]);

// Arama ve durum filtresine göre yorum listesini hazırlar.
  const filteredReviews = useMemo(() => {
    const searchText = search.trim().toLocaleLowerCase('tr-TR');

    return enrichedReviews
      .filter((review) => {
        if (statusFilter !== 'all' && review.status !== statusFilter) return false;
        if (!searchText) return true;

        return (
          String(review.user || '').toLocaleLowerCase('tr-TR').includes(searchText) ||
          String(review.restaurantName || '').toLocaleLowerCase('tr-TR').includes(searchText) ||
          String(review.comment || '').toLocaleLowerCase('tr-TR').includes(searchText)
        );
      })
      .sort((a, b) => getReviewDate(b) - getReviewDate(a));
  }, [enrichedReviews, search, statusFilter]);

  const pendingCount = enrichedReviews.filter((review) => review.status === 'Onay Bekliyor').length;
  const publishedCount = enrichedReviews.filter((review) => review.status === 'Yayında').length;
  const negativeCount = enrichedReviews.filter((review) => Number(review.rating) <= 2).length;

// Onay bekleyen yorumu yayına alır.
  const handleApproveReview = async (review) => {
    try {
      const response = await api.patch(`/reviews/${review.id}`, {
        status: 'Yayında',
        moderationReason: '',
        approvedAt: new Date().toISOString(),
      });

      setReviews((prev) => prev.map((item) => (
        String(item.id) === String(review.id) ? response.data : item
      )));
      addToast({ message: 'Yorum yayına alındı.', type: 'success' });
    } catch (error) {
      addToast({ message: 'Yorum onaylanırken bir sorun oluştu.', type: 'error' });
    }
  };

// Seçilen yorumu db.jsondan siler.
  const handleDeleteReview = async () => {
    if (!deleteModal?.id) return;

    try {
      await api.delete(`/reviews/${deleteModal.id}`);
      setReviews((prev) => prev.filter((item) => String(item.id) !== String(deleteModal.id)));
      setDeleteModal(null);
      addToast({ message: 'Yorum silindi.', type: 'success' });
    } catch (error) {
      addToast({ message: 'Yorum silinirken bir sorun oluştu.', type: 'error' });
    }
  };

// Yeni yasaklı kelimeyi sistem ayarlarına ekler.
  const handleAddForbiddenWord = async () => {
    const word = newForbiddenWord.trim();
    if (!word || !settings?.id) return;

    const wordExists = forbiddenWords.some((item) => (
      item.toLocaleLowerCase('tr-TR') === word.toLocaleLowerCase('tr-TR')
    ));

    if (wordExists) {
      addToast({ message: 'Bu kelime zaten listede var.', type: 'error' });
      return;
    }

    try {
      const response = await api.patch(`/settings/${settings.id}`, {
        forbiddenReviewWords: [...forbiddenWords, word],
      });

      setSettings(response.data);
      setNewForbiddenWord('');
      addToast({ message: 'Yasaklı kelime listesi güncellendi.', type: 'success' });
    } catch (error) {
      addToast({ message: 'Kelime eklenirken bir sorun oluştu.', type: 'error' });
    }
  };

// Yasaklı kelimeyi sistem ayarlarından kaldırır.
  const handleRemoveForbiddenWord = async (word) => {
    if (!settings?.id) return;

    try {
      const response = await api.patch(`/settings/${settings.id}`, {
        forbiddenReviewWords: forbiddenWords.filter((item) => item !== word),
      });

      setSettings(response.data);
      addToast({ message: 'Yasaklı kelime kaldırıldı.', type: 'success' });
    } catch (error) {
      addToast({ message: 'Kelime kaldırılırken bir sorun oluştu.', type: 'error' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-stone-800 tracking-tight">Yorum Yönetimi</h2>
        <p className="text-stone-500 text-xs font-semibold mt-1">
          Restoranlara gelen müşteri yorumlarını inceleyin, onay bekleyenleri yayına alın veya uygunsuz yorumları silin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Yayındaki Yorum" value={publishedCount} icon="reviews" />
        <StatCard label="Admin Onayı Bekleyen" value={pendingCount} icon="pending_actions" color="warning" />
        <StatCard label="Düşük Puanlı Yorum" value={negativeCount} icon="report" color="primary" />
      </div>

      <section className="bg-white border border-stone-100 rounded-[24px] p-5 shadow-soft space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-stone-800">Yasaklı Kelime Listesi</h3>
            <p className="text-[10px] text-stone-400 font-bold mt-1">
              Bu kelimeler yorumda geçerse yorum otomatik yayına alınmaz, admin onayına düşer.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={newForbiddenWord}
              onChange={(event) => setNewForbiddenWord(event.target.value)}
              placeholder="Kelime ekle"
              className="flex-1 md:w-52 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-bold focus:outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={handleAddForbiddenWord}
              className="px-4 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black transition-all"
            >
              Ekle
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {forbiddenWords.length === 0 ? (
            <p className="text-xs text-stone-400 font-semibold">Henüz yasaklı kelime eklenmemiş.</p>
          ) : (
            forbiddenWords.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => handleRemoveForbiddenWord(word)}
                className="px-3 py-1.5 bg-rose-50 text-primary border border-rose-100 rounded-full text-[10px] font-black flex items-center gap-1 hover:bg-rose-100 transition-all"
                title="Listeden kaldır"
              >
                {word}
                <span className="material-symbols-outlined text-[13px]">close</span>
              </button>
            ))
          )}
        </div>
      </section>

      <section className="bg-white border border-stone-100 rounded-[28px] shadow-soft overflow-hidden">
        <div className="p-5 border-b border-stone-100 flex flex-col md:flex-row gap-3 md:items-center justify-between">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Müşteri, restoran veya yorum ara..."
            className="flex-1 max-w-xl"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-bold focus:outline-none focus:border-primary"
          >
            <option value="all">Tüm Yorumlar</option>
            <option value="Yayında">Yayında</option>
            <option value="Onay Bekliyor">Onay Bekliyor</option>
          </select>
        </div>

        {loading ? (
          <div className="p-10 text-center text-stone-400 text-sm font-bold">Yorumlar yükleniyor...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-10 text-center text-stone-400 text-sm font-bold">Yorum bulunamadı.</div>
        ) : (
          <div className="divide-y divide-stone-100">
            {filteredReviews.map((review) => (
              <article key={review.id} className="p-5 hover:bg-stone-50/40 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-black text-stone-800">{review.restaurantName}</h4>
                      <StatusBadge status={review.status} />
                      {review.moderationMatchedWord && (
                        <StatusBadge variant="warning">
                          Eşleşen kelime: {review.moderationMatchedWord}
                        </StatusBadge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-stone-400">
                      <span>{review.user || 'İsimsiz Kullanıcı'}</span>
                      <span>{review.date || '-'}</span>
                      <span className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className="material-symbols-outlined text-[13px]"
                            style={{ fontVariationSettings: index < Number(review.rating) ? "'FILL' 1" : "'FILL' 0" }}
                          >
                            star
                          </span>
                        ))}
                      </span>
                    </div>

                    <p className="text-sm text-stone-700 font-medium leading-relaxed">
                      {review.comment || 'Yorum metni yok.'}
                    </p>

                    {review.moderationReason && (
                      <p className="text-xs text-amber-700 font-semibold bg-amber-50 border border-amber-100 rounded-xl p-3">
                        {review.moderationReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {review.status === 'Onay Bekliyor' && (
                      <button
                        type="button"
                        onClick={() => handleApproveReview(review)}
                        className="w-10 h-10 rounded-xl bg-green-50 text-green-700 border border-green-100 hover:bg-green-100 flex items-center justify-center transition-all"
                        title="Yayına Al"
                      >
                        <span className="material-symbols-outlined text-[19px]">check</span>
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setDeleteModal(review)}
                      className="w-10 h-10 rounded-xl bg-rose-50 text-primary border border-rose-100 hover:bg-rose-100 flex items-center justify-center transition-all"
                      title="Yorumu Sil"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ConfirmDeleteModal
        isOpen={Boolean(deleteModal)}
        title="Yorumu Sil"
        message="Bu yorumu kalıcı olarak silmek istediğine emin misin?"
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDeleteReview}
      />
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  updateProfile,
  changeAvatar,
  addAddress,
  deleteAddress,
  addCard,
  deleteCard,
} from '../../../features/auth/authSlice.js';
import {
  setActiveOrder,
  setPreviousOrders,
  updateActiveOrderStatus,
  updateActiveOrderProgress,
  deliverActiveOrder,
  updatePlatformOrderStatus,
} from '../../../features/orders/ordersSlice.js';
import { updateOrder, createAddress, getOrders } from '../../../services/api.js';
import { addToCart } from '../../../features/cart/cartSlice.js';
import { fetchReviews, addReview } from '../../../features/reviews/reviewsSlice.js';
import Sidebar from '../../../components/Sidebar.jsx';
import { useToast } from '../../../common/components/Toast.jsx';
import ConfirmModal from '../../../common/components/ConfirmModal.jsx';
import Modal from '../../../common/components/Modal.jsx';
import CreditCardForm, { validateCardForm } from '../../../common/components/CreditCardForm.jsx';

// ─── Aktif Sipariş Takip Kartı ────────────────────────────────────────────────
function getOrderItemNames(order) {
  if (Array.isArray(order.items)) {
    return order.items
      .map((item) => `${item.name}${item.qty ? ` x${item.qty}` : ''}`)
      .join(', ');
  }

  return order.itemsSummary || order.items || 'Urun bilgisi yok';
}

function getPreviousOrderStatusText(order) {
  if (order.deliveryStatus === 'cancelled' || order.status === 'Iptal Edildi' || order.status === 'İptal Edildi') {
    return 'İptal Edildi';
  }

  return 'Sipariş Tamamlandı';
}

function ActiveOrderTracker({ order, restaurantName, onStatusUpdate }) {
  const statusSteps = [
    { key: 'Hazırlanıyor', label: 'Hazırlanıyor', icon: 'restaurant', progress: 25 },
    { key: 'Kurye Yola Çıktı', label: 'Kurye Yola Çıktı', icon: 'delivery_dining', progress: 65 },
    { key: 'Teslim Edildi', label: 'Teslim Edildi', icon: 'check_circle', progress: 100 },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);
  const progress = order.progress ?? (statusSteps[currentStepIndex]?.progress || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ type: 'spring', damping: 20 }}
      className="bg-white rounded-[28px] shadow-xl border border-rose-100/50 overflow-hidden"
    >
      {/* Üst Başlık Bandı */}
      <div className="bg-gradient-to-r from-rose-600 to-red-500 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              delivery_dining
            </span>
          </div>
          <div>
            <p className="text-white font-extrabold text-sm">Aktif Sipariş</p>
            <p className="text-rose-100 text-[11px] font-medium">{restaurantName}</p>
          </div>
        </div>
        <motion.div
          key={order.status}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="px-3 py-1.5 bg-white/20 rounded-full"
        >
          <span className="text-white text-xs font-bold">{order.status}</span>
        </motion.div>
      </div>

      {/* İçerik */}
      <div className="p-6">
        {/* Restoran + Tutar */}
        <div className="flex items-center gap-4 mb-6">
          {order.image && (
            <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-stone-100">
              <img className="w-full h-full object-cover" alt={restaurantName} src={order.image} />
            </div>
          )}
          <div>
            <h4 className="font-bold text-stone-800 text-base">{restaurantName}</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              <span className="font-bold text-stone-600">Urunler: </span>
              {getOrderItemNames(order)}
            </p>
            <p className="text-primary font-extrabold text-sm mt-1">
              ₺{typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
            </p>
          </div>
        </div>

        {/* Progress Bar + Kurye İkonu Animasyonu */}
        <div className="relative mb-6">
          {/* İzleme Çubuğu */}
          <div className="h-3 bg-stone-100 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-rose-600 to-red-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </div>

          {/* Kurye İkonu — progress bar üzerinde hareket eder */}
          <motion.div
            className="absolute -top-3 transform -translate-x-1/2"
            animate={{ left: `${Math.max(5, Math.min(95, progress))}%` }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-500/40">
              <span
                className="material-symbols-outlined text-white text-[18px]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {progress >= 95 ? 'check_circle' : 'delivery_dining'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Durum Adımları */}
        <div className="flex justify-between mt-8">
          {statusSteps.map((step, idx) => {
            const isCompleted = currentStepIndex >= idx;
            const isCurrent = currentStepIndex === idx;
            return (
              <div key={step.key} className="flex flex-col items-center gap-1.5 flex-1">
                <motion.div
                  animate={{
                    scale: isCurrent ? [1, 1.15, 1] : 1,
                    backgroundColor: isCompleted ? '#b51c00' : '#e7e5e4',
                  }}
                  transition={{ duration: 0.5, repeat: isCurrent ? Infinity : 0, repeatDelay: 1.5 }}
                  className="w-7 h-7 rounded-full flex items-center justify-center"
                >
                  <span
                    className={`material-symbols-outlined text-[14px] ${isCompleted ? 'text-white' : 'text-stone-400'}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {step.icon}
                  </span>
                </motion.div>
                <span
                  className={`text-[10px] font-bold text-center leading-tight ${
                    isCurrent ? 'text-primary' : isCompleted ? 'text-stone-600' : 'text-stone-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Tahmini Süre */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
          <span className="material-symbols-outlined text-[16px] text-primary">schedule</span>
          <span className="font-semibold">
            {order.status === 'Hazırlanıyor'
              ? 'Siparişiniz hazırlanıyor, lütfen bekleyiniz...'
              : order.status === 'Kurye Yola Çıktı'
              ? 'Kurye yolda! Yakında kapınızda olacak.'
              : 'Siparişiniz teslim edildi. Afiyet olsun! 🎉'}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Ana Profil Bileşeni ─────────────────────────────────────────────────────
export default function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const addToast = useToast();
  const timerRef = useRef(null);

  const [deleteCardTarget, setDeleteCardTarget] = useState(null);
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

  // Redux State
  const userProfile = useSelector((state) => state.auth.userProfile);
  const addresses = useSelector((state) => state.auth.addresses);
  const savedCards = useSelector((state) => state.auth.savedCards);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const restaurants = useSelector((state) => state.restaurants.list);
  const activeOrder = useSelector((state) => state.orders.activeOrder);
  const previousOrders = useSelector((state) => state.orders.previousOrders);
  const reviews = useSelector((state) => state.reviews.list);

  // Sayfa açılışında siparişler sekmesini seç (sepetten yönlendirme varsa)
  const defaultSection = location.state?.section || 'orders';
  const [activeSubSection, setActiveSubSection] = useState(defaultSection);

  // Profil form state
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileSurname, setProfileSurname] = useState(userProfile.surname);
  const [profilePhone, setProfilePhone] = useState(userProfile.phone);
  const [profileBirth, setProfileBirth] = useState(userProfile.birthdate);
  const [profileEmail, setProfileEmail] = useState(userProfile.email);

  // Adres form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');
  const [newAddrIcon, setNewAddrIcon] = useState('home');

  // Kart form
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardFields, setCardFields] = useState({ cardName: '', cardNumber: '', cardExpiry: '', cardCVV: '' });
  const [newCardType, setNewCardType] = useState('Visa');
  const [cardErrors, setCardErrors] = useState({});

  // Şifre
  const [currPassword, setCurrPassword] = useState('********');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Bildirim tercihleri
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  // Değerlendirme Modalı State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTargetOrder, setReviewTargetOrder] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState('');

  const getRestaurantName = (order) => {
    const restaurant = restaurants.find((item) => item.id === order.restaurantId);
    return restaurant?.name || order.restaurant || 'Restoran';
  };

  // ─── Profil Açılınca Siparişleri DB'den Yükle ─────────────────────────────────
  useEffect(() => {
    if (!currentUser?.id) {
      setOrdersLoading(false);
      return;
    }

    dispatch(fetchReviews());

    async function fetchOrders() {
      setOrdersLoading(true);
      try {
        const orders = await getOrders(currentUser.id);

        const activeStatuses = ['Hazırlanıyor', 'Kurye Yola Çıktı'];

        // En yeni aktif siparişi bul (sadece 1 tane aktif gösterilir)
        const active = orders.find(
          (o) =>
            activeStatuses.includes(o.status) &&
            o.deliveryStatus !== 'delivered' &&
            o.deliveryStatus !== 'cancelled'
        );

        // Aktif olanın dışındaki tüm siparişler "önceki" listesine gider
        const previous = orders.filter((o) => {
          if (active && o.id === active.id) return false;
          return true;
        });

        if (active) dispatch(setActiveOrder(active));
        dispatch(setPreviousOrders(previous));
      } catch (err) {
        console.error('Siparişler yüklenemedi:', err);
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();
  }, [currentUser?.id, dispatch]);

  // ─── Sipariş Takip Zamanlayıcısı ──────────────────────────────────────────────
  useEffect(() => {
    if (!activeOrder || activeOrder.deliveryStatus === 'delivered') return;
    if (activeOrder.status === 'Teslim Edildi') return;

    // ─── 1. Aşama: "Hazırlanıyor" → 15 saniye sonra "Kurye Yola Çıktı" ──────────────────
    if (activeOrder.status === 'Hazırlanıyor') {
      let prog = activeOrder.progress || 0;
      // 15 saniyede 0→50%: her saniye +50/15 ≈ 3.3 birim
      const progressInterval = setInterval(() => {
        prog = Math.min(50, prog + 50 / 15);
        dispatch(updateActiveOrderProgress(Math.round(prog)));
        if (prog >= 50) clearInterval(progressInterval);
      }, 1000);

      // 15 saniye sonra → Kurye Yola Çıktı
      timerRef.current = setTimeout(async () => {
        clearInterval(progressInterval);
        dispatch(updateActiveOrderStatus('Kurye Yola Çıktı'));
        dispatch(updateActiveOrderProgress(55));
        // DB'yi güncelle (Admin/Restoran paneli görsün)
        try {
          if (activeOrder.id) {
            await updateOrder(activeOrder.id, {
              status: 'Kurye Yola Çıktı',
              deliveryStatus: 'on_the_way',
              progress: 55,
            });
            // Platform order durumunu da güncelle
            dispatch(updatePlatformOrderStatus({ id: activeOrder.id, status: 'Kurye Yola Çıktı' }));
          }
        } catch (_) {}
        addToast({ message: '🛵 Kurye siparişinizi aldı ve yola çıktı!', type: 'success', duration: 5000 });
      }, 15000);

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timerRef.current);
      };
    }

    // ─── 2. Aşama: "Kurye Yola Çıktı" → 10 dakika (600sn) sonra "Teslim Edildi" ─────────
    if (activeOrder.status === 'Kurye Yola Çıktı') {
      let prog = activeOrder.progress || 55;
      // 600 saniyede 55→95%: her saniye +40/600 ≈ 0.067 birim
      const progressInterval = setInterval(() => {
        prog = Math.min(95, prog + 40 / 600);
        dispatch(updateActiveOrderProgress(Math.round(prog)));
        if (prog >= 95) clearInterval(progressInterval);
      }, 1000);

      // 10 dakika (600.000 ms) sonra teslim et
      timerRef.current = setTimeout(async () => {
        clearInterval(progressInterval);
        dispatch(updateActiveOrderProgress(100));

        // DB'de güncelle
        try {
          if (activeOrder.id) {
            await updateOrder(activeOrder.id, {
              status: 'Teslim Edildi',
              deliveryStatus: 'delivered',
              progress: 100,
            });
            dispatch(updatePlatformOrderStatus({ id: activeOrder.id, status: 'Teslim Edildi' }));
          }
        } catch (_) {}

        dispatch(deliverActiveOrder());
        addToast({ message: '🎉 Siparişiniz teslim edildi! Afiyet olsun.', type: 'success', duration: 6000 });
      }, 600000); // 10 dakika

      return () => {
        clearInterval(progressInterval);
        clearTimeout(timerRef.current);
      };
    }
  }, [activeOrder?.status, activeOrder?.id]);

  // ─── Profil Handlers ──────────────────────────────────────────────────────
  const handleSaveProfileForm = (e) => {
    e.preventDefault();
    dispatch(updateProfile({ name: profileName, surname: profileSurname, phone: profilePhone, birthdate: profileBirth, email: profileEmail }));
    addToast({ message: 'Kişisel bilgileriniz başarıyla güncellendi!', type: 'success' });
  };

  const handleAddAddressBtn = async (e) => {
    e.preventDefault();
    if (!newAddrTitle.trim() || !newAddrDetails.trim()) {
      addToast({ message: 'Lütfen adres başlığı ve detayını boş bırakmayın!', type: 'error' });
      return;
    }
    try {
      const addrPayload = {
        userId: String(currentUser?.id || ''),
        title: newAddrTitle,
        details: newAddrDetails,
        icon: newAddrIcon,
      };
      const saved = await createAddress(addrPayload);
      dispatch(addAddress(saved));
    } catch (_) {
      // Network olmasa bile Redux'a ekle
      dispatch(addAddress({ id: 'addr-' + Date.now(), title: newAddrTitle, details: newAddrDetails, icon: newAddrIcon }));
    }
    setNewAddrTitle('');
    setNewAddrDetails('');
    setShowAddressForm(false);
    addToast({ message: 'Yeni adresiniz başarıyla eklendi!', type: 'success' });
  };

  const handleAddCardBtn = (e) => {
    e.preventDefault();
    const { isValid, errors } = validateCardForm(cardFields);
    if (!isValid) {
      setCardErrors(errors);
      addToast({ message: 'Lütfen kart bilgilerini eksiksiz ve doğru doldurun.', type: 'error' });
      return;
    }
    setCardErrors({});

    const cardLogos = {
      Visa: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBHQVFbGuXYR69Yf-GNnywtqpwzCkHMwBpL6ZZ6h4SdtqFJcEoy6119eRON1z7sfhQnyZDCF_pJbHR6MbTUVAclhpk_ihlKrlrw2SLeL12VS-9noEP5rLnLZ6h9pwAS088OmcXR9LtdoT4Itk-fhhrSRiYInxW__VeoIx4vabjI4s1p93n2hEkUqg8slUDKQ5NdYWEqKpygeGleqadagqDYSbT483UWXQ_w8x6csqaWbG1rXSToszFwNQ',
      Mastercard: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCepLVd8hsizjFucB5HUGRh9P5WIbXle5yDNhxbFZ4IUL4x-UUkzX8Twd9ThLtYulSUXTlhtuaaVFRS4E8y5h0Ced3Fz_jI3E5m4xVrkEaQF6VNkeccJLSAtlN4ITJwO_hYI8F-o-V5HRmx33xv3iuacoJjXQWrraAK8fMmgFSeJPme2Oz95nnutZMot7FnWfo_9W0yzrvN_Goq-eetI761mTfWrpRY5le3T5J84fwXs1hlITDhkgaqKA',
      Troy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLelAgxpKLxx0GanhzDVSzQhxrz60C6J5aMlVsXXABIhdJvrKukQjpRc6hCKy6r1W1qap8gzXhmMPbW-3W_n8RTM7lmUMvBkT7P8rSLW0ITqspe8dXjqUhr-FDCv_H5aXzuEEEcrKiMa7bjj29OIAzIE9jr-6dwD7weg4YCMEI1VCCr4DXb7Hd7zB-XGY-i-PPMWphcZZtSGzxHe2WLjfxHPSwhrhtzf5GxFweYc5GbNcezzcgjQZ8Wg',
    };

    const cleanNum = cardFields.cardNumber.replace(/\s/g, '');
    dispatch(addCard({
      name: cardFields.cardName,
      type: newCardType,
      number: cleanNum.substring(cleanNum.length - 4),
      expiry: cardFields.cardExpiry,
      isDefault: false,
      logo: cardLogos[newCardType],
    }));

    setCardFields({ cardName: '', cardNumber: '', cardExpiry: '', cardCVV: '' });
    setShowCardForm(false);
    addToast({ message: 'Yeni ödeme yönteminiz başarıyla eklendi!', type: 'success' });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!newPassword.trim()) { addToast({ message: 'Lütfen yeni bir şifre giriniz!', type: 'error' }); return; }
    if (newPassword !== confirmPassword) { addToast({ message: 'Şifreler uyuşmuyor!', type: 'error' }); return; }
    setCurrPassword('********');
    setNewPassword('');
    setConfirmPassword('');
    addToast({ message: 'Şifreniz başarıyla güncellendi!', type: 'success' });
  };

  const handleSavePreferences = () => {
    addToast({ message: 'Kampanya tercihleriniz başarıyla kaydedildi!', type: 'success' });
  };

  const handleDeleteAccount = () => setDeleteAccountModalOpen(true);
  const handleConfirmDeleteAccount = () => {
    addToast({ message: 'Hesabınız silindi (Simülasyon).', type: 'info' });
    setDeleteAccountModalOpen(false);
  };

  // ─── Review Handlers ────────────────────────────────────────────────────────
  const handleOpenReviewModal = (order) => {
    setReviewTargetOrder(order);
    setReviewRating(0);
    setReviewComment('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      addToast({ message: 'Lütfen bir puan verin.', type: 'error' });
      return;
    }
    const newReview = {
      orderId: reviewTargetOrder.id,
      restaurantId: reviewTargetOrder.restaurantId,
      userId: currentUser.id,
      user: currentUser.name + (currentUser.surname ? ' ' + currentUser.surname.charAt(0) + '.' : ''),
      rating: reviewRating,
      comment: reviewComment,
      date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      reply: null,
      hasImage: false
    };

    try {
      await dispatch(addReview(newReview)).unwrap();
      addToast({ message: 'Değerlendirmeniz başarıyla eklendi.', type: 'success' });
      setShowReviewModal(false);
      setReviewTargetOrder(null);
    } catch (err) {
      addToast({ message: 'Değerlendirme gönderilemedi.', type: 'error' });
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-8 items-start min-h-[calc(100vh-140px)] animate-fade-in text-left">
      {/* Kart Silme Onay Modalı */}
      <ConfirmModal
        isOpen={!!deleteCardTarget}
        onClose={() => setDeleteCardTarget(null)}
        onConfirm={() => {
          if (deleteCardTarget) {
            dispatch(deleteCard(deleteCardTarget.id));
            addToast({ message: 'Kayıtlı kart silindi!', type: 'success' });
            setDeleteCardTarget(null);
          }
        }}
        title="Kartı Sil"
        message={`"${deleteCardTarget?.name || ''}" kartını kalıcı olarak silmek istediğinize emin misiniz?`}
        confirmLabel="Evet, Sil"
        cancelLabel="Vazgeç"
        danger
        icon="credit_card_off"
      />

      {/* Hesap Silme Onay Modalı */}
      <ConfirmModal
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        onConfirm={handleConfirmDeleteAccount}
        title="Hesabı Sil"
        message="Hesabınızı tamamen kapatmak istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Hesabımı Sil"
        cancelLabel="Vazgeç"
        danger
        icon="delete_forever"
      />

      {/* Sidebar */}
      <Sidebar
        activeSubSection={activeSubSection}
        setActiveSubSection={setActiveSubSection}
        userProfile={userProfile}
        onChangeAvatar={() => {
          const newUrl = window.prompt('Lütfen yeni profil resminizin URL adresini giriniz:', userProfile.avatar);
          if (newUrl) dispatch(changeAvatar(newUrl));
        }}
      />

      {/* Ana İçerik */}
      <div className="flex-1 w-full space-y-6">

        {/* SİPARİŞLERİM */}
        {activeSubSection === 'orders' && (
          <section className="space-y-8">
            {/* Aktif Sipariş */}
            <AnimatePresence>
              {activeOrder && (
                <div>
                  <h3 className="font-bold text-primary flex items-center gap-2 mb-4 text-xs uppercase tracking-wider select-none">
                    <motion.span
                      animate={{ opacity: [1, 0.4, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-primary inline-block"
                    />
                    AKTİF SİPARİŞLER
                  </h3>
                  <ActiveOrderTracker order={activeOrder} restaurantName={getRestaurantName(activeOrder)} />
                </div>
              )}
            </AnimatePresence>

            {/* Geçmiş Siparişler */}
            <div>
              <h3 className="font-bold text-stone-700 mb-4 text-xs uppercase tracking-wider select-none text-left">
                ÖNCEKİ SİPARİŞLERİM
              </h3>
              <div className="space-y-4">
                {ordersLoading ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-stone-100">
                    <div className="w-8 h-8 border-4 border-stone-200 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-stone-400 text-sm font-semibold">Siparişler yükleniyor...</p>
                  </div>
                ) : previousOrders.length === 0 && !activeOrder ? (
                  <div className="text-center py-12 bg-white rounded-2xl border border-stone-100">
                    <span className="material-symbols-outlined text-5xl text-stone-200">receipt_long</span>
                    <p className="text-stone-400 text-sm font-semibold mt-3">Henüz siparişiniz bulunmuyor.</p>
                    <button
                      onClick={() => navigate('/')}
                      className="mt-4 px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-full cursor-pointer border-none"
                    >
                      Sipariş Ver
                    </button>
                  </div>
                ) : null}
                {!ordersLoading && previousOrders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-100 bg-stone-50">
                        {order.image ? (
                          <img className="w-full h-full object-cover" alt={getRestaurantName(order)} src={order.image} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-stone-300 text-2xl">restaurant</span>
                          </div>
                        )}
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-stone-800 text-sm">
                          <span className="text-stone-500">Restoran: </span>
                          {getRestaurantName(order)}
                        </h5>
                        <p className="text-[10px] text-stone-400 font-semibold mt-0.5">{order.date}</p>
                        <p className="text-[11px] text-stone-500 font-medium line-clamp-1 mt-1">
                          <span className="font-bold text-stone-600">Urunler: </span>
                          {getOrderItemNames(order)}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="font-bold text-stone-800 text-sm block">
                          ₺{typeof order.total === 'number' ? order.total.toFixed(2) : order.total}
                        </span>
                        <div className="flex items-center gap-1 text-[9px] text-green-600 font-extrabold uppercase mt-0.5">
                          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          {getPreviousOrderStatusText(order)}
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
                        {order.status === 'Teslim Edildi' && !reviews.some(r => r.orderId === order.id) && (
                          <button
                            onClick={() => handleOpenReviewModal(order)}
                            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-stone-200/50"
                          >
                            <span className="material-symbols-outlined text-[15px]">star_rate</span>
                            Değerlendir
                          </button>
                        )}
                        <button
                          onClick={() => {
                            dispatch(addToCart({
                              id: String(order.id) + '-reorder',
                              name: order.restaurant + ' Menüsü',
                              price: typeof order.total === 'number' ? order.total : parseFloat(String(order.total).replace('₺', '')) || 250,
                              image: order.image || '',
                              category: 'Popüler',
                              description: order.itemsSummary || order.items,
                            }));
                            addToast({ message: `${order.restaurant} siparişiniz sepetinize tekrar eklendi!`, type: 'success' });
                            navigate('/cart');
                          }}
                          className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-primary font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer border border-rose-100/50"
                        >
                          <span className="material-symbols-outlined text-[15px]">replay</span>
                          Tekrarla
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* DEĞERLENDİRMELERİM */}
        {activeSubSection === 'reviews' && (
          <section className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>star_rate</span>
                <h2 className="text-base font-extrabold text-stone-800">Değerlendirmelerim</h2>
              </div>
              <div className="space-y-4">
                {reviews.filter(r => String(r.userId) === String(currentUser.id)).length === 0 ? (
                  <div className="text-center py-12 bg-stone-50 rounded-2xl border border-stone-100">
                    <span className="material-symbols-outlined text-5xl text-stone-300">rate_review</span>
                    <p className="text-stone-500 text-sm font-semibold mt-3">Henüz bir değerlendirme yapmadınız.</p>
                  </div>
                ) : (
                  reviews
                    .filter(r => String(r.userId) === String(currentUser.id))
                    .map((review) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-stone-50 border border-stone-200/50 rounded-2xl p-5"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-bold text-stone-800 text-sm">
                              {restaurants.find(res => res.id === review.restaurantId)?.name || 'Restoran'}
                            </h4>
                            <p className="text-[10px] text-stone-400 font-semibold mt-0.5">{review.date}</p>
                          </div>
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: i < review.rating ? "'FILL' 1" : "'FILL' 0" }}>
                                star
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-stone-600 text-xs font-medium leading-relaxed mt-2">{review.comment}</p>
                        
                        {/* Restaurant Reply */}
                        {review.reply && (
                          <div className="mt-4 bg-white p-4 rounded-xl border-l-4 border-primary shadow-sm">
                            <div className="flex items-center gap-1.5 mb-1 text-primary">
                              <span className="material-symbols-outlined text-[14px]">storefront</span>
                              <span className="font-extrabold text-[10px] uppercase tracking-wider">İşletme Yanıtı</span>
                            </div>
                            <p className="text-stone-600 text-xs font-medium italic">{review.reply}</p>
                          </div>
                        )}
                      </motion.div>
                    ))
                )}
              </div>
            </div>
          </section>
        )}

        {/* KİŞİSEL BİLGİLER */}
        {activeSubSection === 'profile' && (
          <section className="space-y-6">
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                <h2 className="text-base font-extrabold text-stone-800">Kişisel Bilgiler</h2>
              </div>
              <form onSubmit={handleSaveProfileForm} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 ml-1">Ad</label>
                  <input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5" type="text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 ml-1">Soyad</label>
                  <input value={profileSurname} onChange={(e) => setProfileSurname(e.target.value)} className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5" type="text" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 ml-1">Telefon Numarası</label>
                  <input value={profilePhone} onChange={(e) => setProfilePhone(e.target.value)} className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5" type="tel" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 ml-1">Doğum Tarihi</label>
                  <input value={profileBirth} onChange={(e) => setProfileBirth(e.target.value)} className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5" type="text" />
                </div>
                <div className="sm:col-span-2 flex justify-end mt-2">
                  <button type="submit" className="brand-gradient-bg text-white px-8 py-3 rounded-full font-bold text-xs shadow-md shadow-primary/10 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer border-none">
                    Kaydet
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 ml-1">E-posta Adresi</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} className="flex-grow bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none" type="email" />
                  <button onClick={() => addToast({ message: 'E-posta adresinize doğrulama linki gönderildi.', type: 'info' })} className="bg-rose-50 text-primary border border-rose-100 px-6 py-3 rounded-xl font-bold text-xs hover:bg-rose-100/50 transition-colors cursor-pointer shrink-0">
                    Doğrula
                  </button>
                </div>
              </div>
            </div>

            {/* Adreslerim */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  <h2 className="text-base font-extrabold text-stone-800">Adreslerim</h2>
                </div>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="flex items-center gap-1 text-primary font-bold text-xs hover:underline cursor-pointer border-none bg-transparent">
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                  Yeni Adres Ekle
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddressBtn} className="bg-stone-50 p-5 rounded-2xl border border-stone-200/50 mb-6 space-y-4 text-left">
                  <p className="text-xs font-bold text-stone-700">Yeni Adres Ekle</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] font-bold text-stone-500 mb-1">Adres Başlığı</label>
                      <input value={newAddrTitle} onChange={(e) => setNewAddrTitle(e.target.value)} placeholder="Evim, İş Adresim vs." className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" type="text" />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] font-bold text-stone-500 mb-1">İkon Seçimi</label>
                      <select value={newAddrIcon} onChange={(e) => setNewAddrIcon(e.target.value)} className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none">
                        <option value="home">Ev</option>
                        <option value="work">İş</option>
                        <option value="place">Diğer</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-stone-500 mb-1">Açık Adres Detayı</label>
                      <textarea value={newAddrDetails} onChange={(e) => setNewAddrDetails(e.target.value)} placeholder="Sokak, Bina No, Kat, Daire, İlçe, İl" rows="2" className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-100">İptal</button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary border-none">Adresi Kaydet</button>
                  </div>
                </form>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div key={addr.id} className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-200 transition-colors flex justify-between items-start gap-3">
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">{addr.icon}</span>
                      <div>
                        <p className="text-xs font-bold text-stone-800">{addr.title}</p>
                        <p className="text-[11px] text-stone-500 leading-relaxed mt-1">{addr.details}</p>
                      </div>
                    </div>
                    <button onClick={() => dispatch(deleteAddress(addr.id))} className="material-symbols-outlined text-stone-400 hover:text-rose-500 text-[16px] p-1 rounded-md hover:bg-stone-100 cursor-pointer border-none bg-transparent">
                      delete
                    </button>
                  </div>
                ))}
                {addresses.length === 0 && (
                  <p className="text-xs text-stone-400 col-span-2 py-4 text-center">Henüz kayıtlı adresiniz bulunmuyor.</p>
                )}
              </div>
            </div>

            {/* Şifre İşlemleri */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>lock</span>
                <h2 className="text-base font-extrabold text-stone-800">Şifre İşlemleri</h2>
              </div>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5 max-w-sm">
                  <label className="text-xs font-bold text-stone-500 ml-1">Mevcut Şifre</label>
                  <input value={currPassword} onChange={(e) => setCurrPassword(e.target.value)} className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none" type="password" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 ml-1">Yeni Şifre</label>
                    <input value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="••••••••" className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none" type="password" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 ml-1">Yeni Şifre Tekrar</label>
                    <input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none" type="password" />
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button type="submit" className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-2.5 rounded-full font-bold text-xs transition-all active:scale-95 cursor-pointer bg-transparent">
                    Şifreyi Güncelle
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* KARTLARIM */}
        {activeSubSection === 'cards' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>credit_card</span>
                <h1 className="text-xl font-bold text-stone-800 tracking-tight">Kayıtlı Kartlarım</h1>
              </div>
              <button onClick={() => setShowCardForm(!showCardForm)} className="flex items-center gap-1 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold text-xs shadow-md shadow-primary/10 active:scale-95 transition-all cursor-pointer border-none">
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                Yeni Kart Ekle
              </button>
            </div>

            {showCardForm && (
              <form onSubmit={handleAddCardBtn} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm text-left space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-stone-800">Yeni Ödeme Yöntemi Ekle</p>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-stone-500">Kart Tipi</label>
                    <select value={newCardType} onChange={(e) => setNewCardType(e.target.value)} className="rounded-xl border border-stone-200/80 bg-stone-50 focus:border-primary focus:outline-none py-2 px-3 text-xs">
                      <option value="Visa">Visa</option>
                      <option value="Mastercard">Mastercard</option>
                      <option value="Troy">Troy</option>
                    </select>
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
                <div className="flex justify-end gap-2 text-xs">
                  <button type="button" onClick={() => { setShowCardForm(false); setCardErrors({}); }} className="px-4 py-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-100">İptal</button>
                  <button type="submit" className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary border-none">Kartı Ekle</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedCards.map((card) => (
                <div key={card.id} className="group relative bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between h-44 overflow-hidden">
                  {card.isDefault && <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-3xl"></div>}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-stone-50 border border-stone-100 rounded-lg flex items-center justify-center p-1 shrink-0">
                        <img className="h-full object-contain" alt={card.type} src={card.logo} />
                      </div>
                      <div>
                        <h3 className="font-bold text-stone-800 text-sm">{card.name}</h3>
                        <p className="text-[10px] uppercase tracking-wider text-stone-400 font-bold font-mono">{card.type}</p>
                      </div>
                    </div>
                    <button onClick={() => setDeleteCardTarget(card)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 hover:text-primary text-stone-400 transition-colors cursor-pointer border-none bg-transparent">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                  <div className="flex flex-col gap-1 mt-auto">
                    <p className="font-extrabold text-base tracking-[0.2em] text-stone-700 font-mono">**** **** **** {card.number}</p>
                    <div className="flex justify-between items-end mt-2 text-xs font-semibold">
                      <span className="text-stone-400">SKT: {card.expiry}</span>
                      {card.isDefault && (
                        <span className="bg-rose-50 text-primary border border-rose-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">VARSAYILAN</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={() => setShowCardForm(true)} className="group border-2 border-dashed border-stone-200 hover:border-primary rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-rose-50/10 transition-all duration-300 min-h-[176px] cursor-pointer bg-transparent">
                <div className="w-11 h-11 rounded-full bg-stone-100 text-stone-500 group-hover:bg-rose-50 group-hover:text-primary transition-colors flex items-center justify-center border border-stone-200/50">
                  <span className="material-symbols-outlined text-[20px] select-none">add_card</span>
                </div>
                <span className="font-bold text-xs text-stone-400 group-hover:text-primary">Yeni Bir Ödeme Yöntemi Tanımla</span>
              </button>
            </div>

            <div className="bg-rose-50/20 border border-rose-100/40 rounded-3xl p-6 flex gap-4 items-start text-left">
              <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
              <div>
                <h4 className="font-bold text-stone-800 text-xs mb-1">Güvenli Ödeme Altyapısı</h4>
                <p className="text-[11px] text-stone-500 leading-relaxed max-w-2xl font-medium">
                  Kart bilgileriniz PCI-DSS uyumlu sunucularımızda en yüksek güvenlik standartlarıyla şifrelenerek saklanmaktadır. JetYemek personeli dahil hiç kimse tam kart numaranıza erişemez.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* TERCİHLER */}
        {activeSubSection === 'preferences' && (
          <section className="space-y-6 text-left">
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>campaign</span>
                <h2 className="text-base font-extrabold text-stone-800">Kampanya Tercihleri</h2>
              </div>
              <p className="text-xs text-stone-400 font-medium mb-6">
                Size özel indirimlerden, yeni restoran keşiflerinden ve avantajlı kampanyalardan ilk siz haberdar olun.
              </p>
              <div className="space-y-4">
                <label className="flex items-start gap-4 bg-stone-50 hover:bg-stone-50/80 p-4 rounded-2xl border border-stone-100 transition-colors cursor-pointer select-none">
                  <input checked={smsOptIn} onChange={(e) => setSmsOptIn(e.target.checked)} className="mt-1 rounded border-stone-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                  <div>
                    <h5 className="font-bold text-stone-800 text-xs">SMS ile indirim bilgisi almak istiyorum</h5>
                    <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Önemli güncellemeleri ve kurye bilgilerini içeren anlık mesajlar.</p>
                  </div>
                </label>
                <label className="flex items-start gap-4 bg-stone-50 hover:bg-stone-50/80 p-4 rounded-2xl border border-stone-100 transition-colors cursor-pointer select-none">
                  <input checked={emailOptIn} onChange={(e) => setEmailOptIn(e.target.checked)} className="mt-1 rounded border-stone-300 text-primary focus:ring-primary h-4 w-4" type="checkbox" />
                  <div>
                    <h5 className="font-bold text-stone-800 text-xs">E-posta ile indirim bilgisi almak istiyorum</h5>
                    <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Haftalık bültenler, restoran önerileri ve kişiye özel kupon kodları.</p>
                  </div>
                </label>
                <div className="flex justify-end mt-4">
                  <button onClick={handleSavePreferences} className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-full hover:bg-secondary transition-all active:scale-95 cursor-pointer shadow-sm shadow-primary/10 border-none">
                    Tercihleri Kaydet
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <span className="material-symbols-outlined text-2xl select-none">person_remove</span>
                <h2 className="text-base font-extrabold text-stone-800">Hesap Yönetimi</h2>
              </div>
              <div className="p-4 bg-rose-50/20 border border-rose-100/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                  <h5 className="font-bold text-stone-800 text-xs">Hesabı Tamamen Kapat</h5>
                  <p className="text-[10px] text-stone-400 font-semibold mt-0.5 max-w-md">Bu işlem geri alınamaz. Sipariş geçmişiniz ve kayıtlı kartlarınız kalıcı olarak silinecektir.</p>
                </div>
                <button onClick={handleDeleteAccount} className="px-6 py-2.5 bg-secondary text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-colors cursor-pointer border-none shadow-sm flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm font-bold">delete_forever</span>
                  Hesabımı Sil
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        onConfirm={() => {
          setDeleteAccountModalOpen(false);
          addToast({ message: 'Hesabınız başarıyla silindi.', type: 'info' });
          navigate('/');
        }}
        title="Hesabı Sil"
        message="Hesabınızı kalıcı olarak silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm verileriniz (adresler, kartlar, sipariş geçmişi) kalıcı olarak silinir."
        confirmText="Evet, Hesabımı Sil"
        cancelText="Vazgeç"
        confirmButtonClass="bg-red-500 hover:bg-red-600 focus:ring-red-500/20 text-white"
      />

      {/* Siparişi Değerlendir Modalı */}
      <Modal isOpen={showReviewModal} onClose={() => setShowReviewModal(false)} title="Siparişi Değerlendir">
        <div className="p-4 sm:p-6 text-center space-y-6">
          <div>
            <h3 className="font-extrabold text-stone-800 text-lg">{getRestaurantName(reviewTargetOrder || {})}</h3>
            <p className="text-xs text-stone-500 font-medium mt-1">Siparişinizi nasıl buldunuz?</p>
          </div>
          
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setReviewRating(star)}
                className={`transition-all transform hover:scale-110 ${reviewRating >= star ? 'text-amber-500' : 'text-stone-300'} cursor-pointer`}
              >
                <span className="material-symbols-outlined text-[40px]" style={{ fontVariationSettings: reviewRating >= star ? "'FILL' 1" : "'FILL' 0" }}>
                  star
                </span>
              </button>
            ))}
          </div>

          <div className="text-left">
            <label className="text-xs font-bold text-stone-500 ml-1">Yorumunuz</label>
            <textarea
              rows="4"
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Siparişinizle ilgili düşüncelerinizi paylaşın..."
              className="mt-2 w-full bg-stone-50 border border-stone-200/60 rounded-2xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowReviewModal(false)}
              className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs rounded-full transition-all cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              onClick={handleSubmitReview}
              className="px-6 py-3 bg-primary hover:bg-primary-container text-white font-extrabold text-xs rounded-full shadow-md shadow-primary/20 hover:shadow-lg transition-all cursor-pointer"
            >
              Gönder
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}

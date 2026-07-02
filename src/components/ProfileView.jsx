import React, { useState } from 'react';
import Sidebar from './Sidebar.jsx';
import { 
  PREVIOUS_ORDERS, 
  INITIAL_ACTIVE_ORDER 
} from '../data.jsx';
import { useToast } from '../common/components/Toast.jsx';
import ConfirmModal from '../common/components/ConfirmModal.jsx';
import CreditCardForm, { validateCardForm } from '../common/components/CreditCardForm.jsx';

export default function ProfileView({ 
  activeSubSection, 
  setActiveSubSection, 
  userProfile, 
  onSaveProfile, 
  onRepeatOrder,
  addresses,
  onAddAddress,
  onDeleteAddress,
  savedCards,
  onAddCard,
  onDeleteCard,
  onEnterAdmin,
  onEnterSuperAdmin
}) {
  const addToast = useToast();

  // Local editable form states
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileSurname, setProfileSurname] = useState(userProfile.surname);
  const [profilePhone, setProfilePhone] = useState(userProfile.phone);
  const [profileBirth, setProfileBirth] = useState(userProfile.birthdate);
  const [profileEmail, setProfileEmail] = useState(userProfile.email);

  // Address add form inline
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddrTitle, setNewAddrTitle] = useState('');
  const [newAddrDetails, setNewAddrDetails] = useState('');
  const [newAddrIcon, setNewAddrIcon] = useState('home');

  // Card add form — using shared CreditCardForm fields
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardFields, setCardFields] = useState({ cardName: '', cardNumber: '', cardExpiry: '', cardCVV: '' });
  const [newCardType, setNewCardType] = useState('Visa');
  const [cardErrors, setCardErrors] = useState({});

  // Password fields
  const [currPassword, setCurrPassword] = useState('********');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState({});

  // Marketing preferences
  const [smsOptIn, setSmsOptIn] = useState(false);
  const [emailOptIn, setEmailOptIn] = useState(true);

  // Confirm modals
  const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);
  const [deleteCardTarget, setDeleteCardTarget] = useState(null); // card object to delete

  // ---- Handlers ----

  const handleSaveProfileForm = (e) => {
    e.preventDefault();
    onSaveProfile && onSaveProfile({
      name: profileName,
      surname: profileSurname,
      phone: profilePhone,
      birthdate: profileBirth,
      email: profileEmail
    });
    addToast({ message: 'Kişisel bilgileriniz başarıyla güncellendi!', type: 'success' });
  };

  const handleAddAddressBtn = (e) => {
    e.preventDefault();
    if (!newAddrTitle.trim() || !newAddrDetails.trim()) {
      addToast({ message: 'Lütfen adres başlığı ve detayını boş bırakmayın!', type: 'error' });
      return;
    }
    onAddAddress && onAddAddress({
      id: Date.now(),
      title: newAddrTitle,
      details: newAddrDetails,
      icon: newAddrIcon
    });
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
      Troy: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLelAgxpKLxx0GanhzDVSzQhxrz60C6J5aMlVsXXABIhdJvrKukQjpRc6hCKy6r1W1qap8gzXhmMPbW-3W_n8RTM7lmUMvBkT7P8rSLW0ITqspe8dXjqUhr-FDCv_H5aXzuEEEcrKiMa7bjj29OIAzIE9jr-6dwD7weg4YCMEI1VCCr4DXb7Hd7zB-XGY-i-PPMWphcZZtSGzxHe2WLjfxHPSwhrhtzf5GxFweYc5GbNcezzcgjQZ8Wg'
    };

    const cleanNum = cardFields.cardNumber.replace(/\s/g, '');
    onAddCard && onAddCard({
      id: Date.now(),
      name: cardFields.cardName,
      type: newCardType,
      number: cleanNum.substring(cleanNum.length - 4),
      expiry: cardFields.cardExpiry,
      isDefault: false,
      logo: cardLogos[newCardType]
    });

    setCardFields({ cardName: '', cardNumber: '', cardExpiry: '', cardCVV: '' });
    setShowCardForm(false);
    addToast({ message: 'Yeni ödeme yönteminiz başarıyla eklendi!', type: 'success' });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPassword.trim()) errs.newPassword = 'Lütfen yeni bir şifre giriniz.';
    if (newPassword !== confirmPassword) errs.confirmPassword = 'Şifreler uyuşmuyor!';
    if (Object.keys(errs).length) {
      setPasswordErrors(errs);
      addToast({ message: Object.values(errs)[0], type: 'error' });
      return;
    }
    setPasswordErrors({});
    setCurrPassword('********');
    setNewPassword('');
    setConfirmPassword('');
    addToast({ message: 'Şifreniz başarıyla güncellendi!', type: 'success' });
  };

  const handleSavePreferences = () => {
    addToast({ message: 'Kampanya tercihleriniz başarıyla kaydedildi!', type: 'success' });
  };

  const handleDeleteAccount = () => {
    // Confirmed via modal
    addToast({ message: 'Hesabınız silindi (Simülasyon).', type: 'info' });
    setActiveSubSection('orders');
  };

  const handleConfirmDeleteCard = () => {
    if (deleteCardTarget) {
      onDeleteCard && onDeleteCard(deleteCardTarget.id);
      addToast({ message: 'Kayıtlı kart silindi!', type: 'success' });
      setDeleteCardTarget(null);
    }
  };

  const handleRepeatOrder = (order) => {
    onRepeatOrder && onRepeatOrder(order);
    addToast({ message: `${order.restaurant} siparişiniz sepetinize tekrar eklendi!`, type: 'success' });
  };

  return (
    <div className="flex flex-col md:flex-row w-full gap-8 items-start min-h-[calc(100vh-140px)] animate-fade-in">

      {/* Delete Card Confirm Modal */}
      <ConfirmModal
        isOpen={!!deleteCardTarget}
        onClose={() => setDeleteCardTarget(null)}
        onConfirm={handleConfirmDeleteCard}
        title="Kartı Sil"
        message={`"${deleteCardTarget?.name || ''}" kartını kalıcı olarak silmek istediğinize emin misiniz?`}
        confirmLabel="Evet, Sil"
        cancelLabel="Vazgeç"
        danger
        icon="credit_card_off"
      />

      {/* Delete Account Confirm Modal */}
      <ConfirmModal
        isOpen={deleteAccountModalOpen}
        onClose={() => setDeleteAccountModalOpen(false)}
        onConfirm={handleDeleteAccount}
        title="Hesabı Sil"
        message="Hesabınızı tamamen kapatmak istediğinize emin misiniz? Bu işlem geri alınamaz. Sipariş geçmişiniz ve kayıtlı kartlarınız kalıcı olarak silinecektir."
        confirmLabel="Hesabımı Sil"
        cancelLabel="Vazgeç"
        danger
        icon="delete_forever"
      />

      {/* Sidebar Selector Component */}
      <Sidebar 
        activeSubSection={activeSubSection} 
        setActiveSubSection={setActiveSubSection} 
        userProfile={userProfile} 
        onEnterAdmin={onEnterAdmin}
        onEnterSuperAdmin={onEnterSuperAdmin}
        onChangeAvatar={() => {
          addToast({ message: 'Avatar değiştirme yakında aktif olacak!', type: 'info' });
        }}
      />

      {/* Main Account Details Canvas Column */}
      <div className="flex-1 w-full space-y-6">
        
        {/* SUBSECTION: ORDERS */}
        {activeSubSection === 'orders' && (
          <section className="space-y-8">
            {/* Active order progress block */}
            <div>
              <h3 className="font-bold text-primary flex items-center gap-2 mb-4 text-xs uppercase tracking-wider select-none">
                <span className="w-2 h-2 rounded-full bg-primary inline-block"></span>
                AKTİF SİPARİŞLER
              </h3>
              <div className="bg-white rounded-[24px] shadow-lg p-6 border border-rose-100/50 relative overflow-hidden transition-all hover:shadow-xl hover:shadow-rose-100/10">
                <div className="flex flex-col md:flex-row md:items-center gap-6 justify-between">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-stone-100">
                      <img className="w-full h-full object-cover" alt="Active Pizza Order" src={INITIAL_ACTIVE_ORDER.image} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-bold text-stone-800 text-base">{INITIAL_ACTIVE_ORDER.restaurant}</h4>
                      <p className="text-xs text-stone-500 font-medium mt-1">
                        {INITIAL_ACTIVE_ORDER.items} • Toplam: {INITIAL_ACTIVE_ORDER.total.toFixed(2)} TL
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center px-4 py-2 bg-primary text-white rounded-full font-bold text-xs gap-1.5 shadow-md shadow-primary/10 select-none">
                    <span className="material-symbols-outlined text-[16px]">delivery_dining</span>
                    <span>{INITIAL_ACTIVE_ORDER.status}</span>
                  </div>
                </div>

                {/* Simulated Step Progress slider indicator */}
                <div className="mt-8 px-2 text-left">
                  <div className="h-1 bg-stone-200 rounded-full mb-3 relative overflow-hidden">
                    <div 
                      className="absolute top-0 bottom-0 left-0 bg-primary transition-all duration-1000" 
                      style={{ width: `${INITIAL_ACTIVE_ORDER.progress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between font-bold text-[10px] text-stone-400">
                    <span className="text-primary">Hazırlanıyor</span>
                    <span className="text-primary">Kurye yola çıktı</span>
                    <span>Teslim Edildi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Historic previous order listings */}
            <div>
              <h3 className="font-bold text-stone-700 mb-4 text-xs uppercase tracking-wider select-none text-left">
                ÖNCEKİ SİPARİŞLERİM
              </h3>
              <div className="space-y-4">
                {PREVIOUS_ORDERS.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-white rounded-2xl border border-stone-100 p-5 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-100 bg-stone-50">
                        <img className="w-full h-full object-cover" alt={order.restaurant} src={order.image} />
                      </div>
                      <div className="text-left">
                        <h5 className="font-bold text-stone-800 text-sm">{order.restaurant}</h5>
                        <p className="text-[10px] text-stone-400 font-semibold mt-0.5">{order.date}</p>
                        <p className="text-[11px] text-stone-500 font-medium line-clamp-1 mt-1">{order.items}</p>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-3 sm:pt-0">
                      <div className="text-left sm:text-right">
                        <span className="font-bold text-stone-800 text-sm block">{order.total}</span>
                        <div className="flex items-center gap-1 text-[9px] text-green-600 font-extrabold uppercase mt-0.5">
                          <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                          {order.status}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRepeatOrder(order)}
                        className="px-4 py-2 bg-stone-100 hover:bg-rose-50 hover:text-primary text-stone-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-stone-100"
                      >
                        <span className="material-symbols-outlined text-[15px]">replay</span>
                        Siparişi Tekrarla
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => addToast({ message: 'Daha fazla geçmiş sipariş bulunamadı.', type: 'info' })}
                  className="w-full py-4 border border-dashed border-stone-200 hover:border-primary/40 rounded-xl text-primary font-bold text-xs hover:bg-rose-50/20 transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
                >
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                  Daha Fazla Sipariş Yükle
                </button>
              </div>
            </div>
          </section>
        )}

        {/* SUBSECTION: PROFILE DETAILS FORM */}
        {activeSubSection === 'profile' && (
          <section className="space-y-6">
            {/* 1. Personal Details Form */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  person
                </span>
                <h2 className="text-base font-extrabold text-stone-800">Kişisel Bilgiler</h2>
              </div>
              <form onSubmit={handleSaveProfileForm} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 ml-1">Ad</label>
                  <input 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5" 
                    type="text" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 ml-1">Soyad</label>
                  <input 
                    value={profileSurname}
                    onChange={(e) => setProfileSurname(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5" 
                    type="text" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 ml-1">Telefon Numarası</label>
                  <input 
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5" 
                    type="tel" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-500 ml-1">Doğum Tarihi</label>
                  <input 
                    value={profileBirth}
                    onChange={(e) => setProfileBirth(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/5" 
                    type="text" 
                  />
                </div>
                <div className="sm:col-span-2 flex justify-end mt-2">
                  <button 
                    type="submit"
                    className="brand-gradient-bg text-white px-8 py-3 rounded-full font-bold text-xs shadow-md shadow-primary/10 hover:scale-102 active:scale-95 transition-all cursor-pointer"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </div>

            {/* 2. Email Address verification card */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 ml-1">E-posta Adresi</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    value={profileEmail}
                    onChange={(e) => setProfileEmail(e.target.value)}
                    className="flex-grow bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none" 
                    type="email" 
                  />
                  <button 
                    onClick={() => addToast({ message: 'E-posta adresinize doğrulama linki gönderildi.', type: 'info' })}
                    className="bg-rose-50 text-primary border border-rose-100 px-6 py-3 rounded-xl font-bold text-xs hover:bg-rose-100/50 transition-colors cursor-pointer shrink-0"
                  >
                    Doğrula
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Delivery Addresses Inline Management */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3 text-primary">
                  <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                    location_on
                  </span>
                  <h2 className="text-base font-extrabold text-stone-800">Adreslerim</h2>
                </div>
                <button 
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="flex items-center gap-1 text-primary font-bold text-xs hover:underline cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm font-bold">add</span>
                  Yeni Adres Ekle
                </button>
              </div>

              {/* Add address form inline */}
              {showAddressForm && (
                <form onSubmit={handleAddAddressBtn} className="bg-stone-50 p-5 rounded-2xl border border-stone-200/50 mb-6 space-y-4">
                  <p className="text-xs font-bold text-stone-700">Yeni Adres Ekle</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] font-bold text-stone-500 mb-1">Adres Başlığı (örn: Ev, Ofis)</label>
                      <input 
                        value={newAddrTitle}
                        onChange={(e) => setNewAddrTitle(e.target.value)}
                        placeholder="Evim, İş Adresim vs."
                        className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20" 
                        type="text" 
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-[11px] font-bold text-stone-500 mb-1">İkon Seçimi</label>
                      <select 
                        value={newAddrIcon}
                        onChange={(e) => setNewAddrIcon(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none"
                      >
                        <option value="home">Ev (Home)</option>
                        <option value="work">İş (Work)</option>
                        <option value="local_pizza">Restoran (Food)</option>
                        <option value="place">Diğer (Pin)</option>
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-stone-500 mb-1">Açık Adres Detayı</label>
                      <textarea 
                        value={newAddrDetails}
                        onChange={(e) => setNewAddrDetails(e.target.value)}
                        placeholder="Sokak, Bina No, Kat, Daire, İlçe, İl"
                        rows="2"
                        className="w-full bg-white border border-stone-200 rounded-xl py-2 px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 text-xs">
                    <button 
                      type="button"
                      onClick={() => setShowAddressForm(false)}
                      className="px-4 py-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-100"
                    >
                      İptal
                    </button>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary"
                    >
                      Adresi Kaydet
                    </button>
                  </div>
                </form>
              )}

              {/* Address list grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {addresses.map((addr) => (
                  <div 
                    key={addr.id} 
                    className="p-4 rounded-2xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-stone-200 transition-colors flex justify-between items-start gap-3"
                  >
                    <div className="flex gap-3">
                      <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                        {addr.icon}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-stone-800">{addr.title}</p>
                        <p className="text-[11px] text-stone-500 leading-relaxed mt-1">{addr.details}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => addToast({ message: 'Adres düzenleme yakında aktif olacak.', type: 'info' })}
                        className="material-symbols-outlined text-stone-400 hover:text-primary text-[16px] p-1 rounded-md hover:bg-stone-100 cursor-pointer"
                      >
                        edit
                      </button>
                      <button 
                        onClick={() => onDeleteAddress && onDeleteAddress(addr.id)}
                        className="material-symbols-outlined text-stone-400 hover:text-error text-[16px] p-1 rounded-md hover:bg-stone-100 cursor-pointer"
                      >
                        delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Password Security details */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100 text-left">
              <div className="flex items-center gap-3 mb-6 text-primary">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                <h2 className="text-base font-extrabold text-stone-800">Şifre İşlemleri</h2>
              </div>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div className="space-y-1.5 max-w-sm">
                  <label className="text-xs font-bold text-stone-500 ml-1">Mevcut Şifre</label>
                  <div className="relative">
                    <input 
                      value={currPassword}
                      onChange={(e) => setCurrPassword(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200/60 rounded-xl py-3 px-4 text-sm font-semibold focus:border-primary focus:bg-white focus:outline-none" 
                      type="password" 
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 cursor-pointer text-[18px]">
                      visibility
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 ml-1">Yeni Şifre</label>
                    <input 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-stone-50 border rounded-xl py-3 px-4 text-sm font-semibold focus:bg-white focus:outline-none ${passwordErrors.newPassword ? 'border-rose-400' : 'border-stone-200/60 focus:border-primary'}`}
                      type="password" 
                    />
                    {passwordErrors.newPassword && (
                      <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {passwordErrors.newPassword}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-500 ml-1">Yeni Şifre Tekrar</label>
                    <input 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-stone-50 border rounded-xl py-3 px-4 text-sm font-semibold focus:bg-white focus:outline-none ${passwordErrors.confirmPassword ? 'border-rose-400' : 'border-stone-200/60 focus:border-primary'}`}
                      type="password" 
                    />
                    {passwordErrors.confirmPassword && (
                      <p className="text-xs text-rose-500 font-semibold flex items-center gap-1 mt-1">
                        <span className="material-symbols-outlined text-[14px]">error</span>
                        {passwordErrors.confirmPassword}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit"
                    className="border-2 border-primary text-primary hover:bg-primary/5 px-8 py-2.5 rounded-full font-bold text-xs transition-all active:scale-95 cursor-pointer"
                  >
                    Şifreyi Güncelle
                  </button>
                </div>
              </form>
            </div>
          </section>
        )}

        {/* SUBSECTION: SAVED PAYMENT CARDS WALLET */}
        {activeSubSection === 'cards' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-primary text-3xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  credit_card
                </span>
                <h1 className="text-xl font-bold text-stone-800 tracking-tight">Kayıtlı Kartlarım</h1>
              </div>
              <button 
                onClick={() => setShowCardForm(!showCardForm)}
                className="flex items-center gap-1 px-6 py-2.5 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-bold text-xs shadow-md shadow-primary/10 hover:scale-102 active:scale-95 transition-all cursor-pointer border-none"
              >
                <span className="material-symbols-outlined text-sm font-bold">add</span>
                Yeni Kart Ekle
              </button>
            </div>

            {/* Add Card Form inline — using shared CreditCardForm */}
            {showCardForm && (
              <form onSubmit={handleAddCardBtn} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm text-left space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-stone-800">Yeni Ödeme Yöntemi Ekle</p>
                  <div className="flex items-center gap-2">
                    <label className="text-[11px] font-bold text-stone-500">Kart Tipi</label>
                    <select 
                      value={newCardType}
                      onChange={(e) => setNewCardType(e.target.value)}
                      className="rounded-xl border border-stone-200/80 bg-stone-50 focus:border-primary focus:bg-white focus:outline-none py-2 px-3 text-xs"
                    >
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
                  onChange={(fields) => {
                    setCardFields(fields);
                    // Clear errors on change
                    if (Object.keys(cardErrors).length) setCardErrors({});
                  }}
                  errors={cardErrors}
                />

                <div className="flex justify-end gap-2 text-xs">
                  <button 
                    type="button"
                    onClick={() => { setShowCardForm(false); setCardErrors({}); }}
                    className="px-4 py-2 border border-stone-200 rounded-lg text-stone-500 hover:bg-stone-100"
                  >
                    İptal
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary"
                  >
                    Kartı Ekle
                  </button>
                </div>
              </form>
            )}

            {/* Credit cards list layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {savedCards.map((card) => (
                <div 
                  key={card.id} 
                  className="group relative bg-white rounded-3xl p-6 shadow-sm border border-stone-100 hover:shadow-lg transition-all duration-300 text-left flex flex-col justify-between h-44 overflow-hidden"
                >
                  {card.isDefault && (
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-3xl"></div>
                  )}
                  
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

                    <button 
                      onClick={() => setDeleteCardTarget(card)}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-rose-50 hover:text-primary text-stone-400 transition-colors cursor-pointer select-none"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>

                  <div className="flex flex-col gap-1 mt-auto">
                    <p className="font-extrabold text-base tracking-[0.2em] text-stone-700 font-mono">
                      **** **** **** {card.number}
                    </p>
                    <div className="flex justify-between items-end mt-2 text-xs font-semibold">
                      <span className="text-stone-400">SKT: {card.expiry}</span>
                      {card.isDefault && (
                        <span className="bg-rose-50 text-primary border border-rose-100 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider">
                          VARSAYILAN
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {/* Add card empty state layout triggers */}
              <button 
                onClick={() => setShowCardForm(true)}
                className="group border-2 border-dashed border-stone-200 hover:border-primary rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:bg-rose-50/10 transition-all duration-300 min-h-[176px] cursor-pointer"
              >
                <div className="w-11 h-11 rounded-full bg-stone-100 text-stone-500 group-hover:bg-rose-50 group-hover:text-primary transition-colors flex items-center justify-center border border-stone-200/50">
                  <span className="material-symbols-outlined text-[20px] select-none">add_card</span>
                </div>
                <span className="font-bold text-xs text-stone-400 group-hover:text-primary">
                  Yeni Bir Ödeme Yöntemi Tanımla
                </span>
              </button>
            </div>

            {/* PCI-DSS Security compliance certificate card block */}
            <div className="bg-rose-50/20 border border-rose-100/40 rounded-3xl p-6 flex gap-4 items-start text-left">
              <span className="material-symbols-outlined text-primary text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                verified_user
              </span>
              <div>
                <h4 className="font-bold text-stone-800 text-xs mb-1">Güvenli Ödeme Altyapısı</h4>
                <p className="text-[11px] text-stone-500 leading-relaxed max-w-2xl font-medium">
                  Kart bilgileriniz PCI-DSS uyumlu sunucularımızda en yüksek güvenlik standartlarıyla şifrelenerek saklanmaktadır. CraveDash personeli dahil hiç kimse tam kart numaranıza erişemez.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SUBSECTION: NOTIFICATION & CAMPAIGN OPT-INS & ACCOUNT TERMINATION */}
        {activeSubSection === 'preferences' && (
          <section className="space-y-6 text-left">
            {/* Campaign Options Panel */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <span className="material-symbols-outlined text-2xl select-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  campaign
                </span>
                <h2 className="text-base font-extrabold text-stone-800">Kampanya Tercihleri</h2>
              </div>
              <p className="text-xs text-stone-400 font-medium mb-6">
                Size özel indirimlerden, yeni restoran keşiflerinden ve avantajlı kampanyalardan ilk siz haberdar olun.
              </p>

              <div className="space-y-4">
                <label className="flex items-start gap-4 bg-stone-50 hover:bg-stone-50/80 p-4 rounded-2xl border border-stone-100 transition-colors cursor-pointer select-none">
                  <input 
                    checked={smsOptIn}
                    onChange={(e) => setSmsOptIn(e.target.checked)}
                    className="mt-1 rounded border-stone-300 text-primary focus:ring-primary h-4 w-4" 
                    type="checkbox" 
                  />
                  <div>
                    <h5 className="font-bold text-stone-800 text-xs">SMS ile indirim bilgisi almak istiyorum</h5>
                    <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Önemli güncellemeleri ve kurye bilgilerini içeren anlık mesajlar.</p>
                  </div>
                </label>

                <label className="flex items-start gap-4 bg-stone-50 hover:bg-stone-50/80 p-4 rounded-2xl border border-stone-100 transition-colors cursor-pointer select-none">
                  <input 
                    checked={emailOptIn}
                    onChange={(e) => setEmailOptIn(e.target.checked)}
                    className="mt-1 rounded border-stone-300 text-primary focus:ring-primary h-4 w-4" 
                    type="checkbox" 
                  />
                  <div>
                    <h5 className="font-bold text-stone-800 text-xs">E-posta ile indirim bilgisi almak istiyorum</h5>
                    <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Haftalık bültenler, restoran önerileri ve kişiye özel kupon kodları.</p>
                  </div>
                </label>

                <div className="flex justify-end mt-4">
                  <button 
                    onClick={handleSavePreferences}
                    className="px-6 py-2.5 bg-primary text-white font-bold text-xs rounded-full hover:bg-secondary transition-all active:scale-95 cursor-pointer shadow-sm shadow-primary/10 border-none"
                  >
                    Tercihleri Kaydet
                  </button>
                </div>
              </div>
            </div>

            {/* Account Close / Delete block */}
            <div className="bg-white rounded-3xl shadow-sm p-6 md:p-8 border border-stone-100">
              <div className="flex items-center gap-3 mb-4 text-primary">
                <span className="material-symbols-outlined text-2xl select-none">
                  person_remove
                </span>
                <h2 className="text-base font-extrabold text-stone-800">Hesap Yönetimi</h2>
              </div>
              <div className="p-4 bg-rose-50/20 border border-rose-100/30 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-left">
                  <h5 className="font-bold text-stone-800 text-xs">Hesabı Tamamen Kapat</h5>
                  <p className="text-[10px] text-stone-400 font-semibold mt-0.5 max-w-md">
                    Bu işlem geri alınamaz. Sipariş geçmişiniz ve kayıtlı kartlarınız kalıcı olarak silinecektir.
                  </p>
                </div>
                <button 
                  onClick={() => setDeleteAccountModalOpen(true)}
                  className="px-6 py-2.5 bg-secondary text-white font-bold text-xs rounded-xl hover:bg-rose-700 transition-colors cursor-pointer border-none shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm font-bold">delete_forever</span>
                  Hesabımı Sil
                </button>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}

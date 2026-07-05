import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'motion/react';
import { loginSuccess } from '../../features/auth/authSlice.js';
import { registerUser } from '../../services/api.js';
import { useToast } from '../../common/components/Toast.jsx';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const addToast = useToast();

  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const update = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Anlık hata temizle
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Ad boş bırakılamaz';
    if (!form.surname.trim()) newErrors.surname = 'Soyad boş bırakılamaz';
    if (!form.email.trim()) newErrors.email = 'E-posta boş bırakılamaz';
    else if (!EMAIL_REGEX.test(form.email)) newErrors.email = 'Geçerli bir e-posta adresi girin';
    if (!form.password) newErrors.password = 'Şifre boş bırakılamaz';
    else if (form.password.length < 6) newErrors.password = 'Şifre en az 6 karakter olmalı';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Şifre tekrarı boş bırakılamaz';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    if (!form.terms) newErrors.terms = 'Kullanım koşullarını kabul etmelisiniz';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    try {
      const newUser = await registerUser({
        id: 'user-' + Date.now(),
        name: form.name.trim(),
        surname: form.surname.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: 'customer',
        phone: '',
        birthdate: '',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name + '+' + form.surname)}&background=b51c00&color=fff`,
      });

      // Otomatik giriş yap
      dispatch(loginSuccess(newUser));
      addToast({ message: `Hoş geldin ${newUser.name}! Hesabın başarıyla oluşturuldu. 🎉`, type: 'success', duration: 5000 });
      navigate('/', { replace: true });
    } catch (err) {
      addToast({ message: 'Kayıt sırasında bir hata oluştu. Lütfen tekrar deneyin.', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = 'w-full bg-stone-50 border rounded-xl px-4 h-12 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-rose-500/20';

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arka Plan Dekoratif Elementler */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3 pointer-events-none" />
      <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-orange-100/40 rounded-full blur-2xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="relative z-10 w-full max-w-lg"
      >
        {/* Logo & Başlık */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-rose-200">
              <span className="material-symbols-outlined text-white text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <span className="text-2xl font-black text-rose-700 tracking-tight">JetYemek</span>
          </Link>
          <h1 className="text-2xl font-bold text-stone-800 mt-3">Hesap Oluştur</h1>
          <p className="text-stone-500 text-sm mt-1">En lezzetli siparişler bir tık uzağında</p>
        </div>

        {/* Form Kartı */}
        <div className="bg-white/80 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-xl shadow-stone-200/50 overflow-hidden">
          <div className="p-7">
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* Ad + Soyad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Ad</label>
                  <input
                    id="reg-name"
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Ahmet"
                    className={`${inputBase} ${errors.name ? 'border-red-400 focus:ring-red-300/20' : 'border-stone-200 focus:border-rose-400'}`}
                  />
                  <AnimatePresence>
                    {errors.name && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[11px] mt-1 ml-1 font-medium">
                        {errors.name}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Soyad</label>
                  <input
                    id="reg-surname"
                    type="text"
                    value={form.surname}
                    onChange={(e) => update('surname', e.target.value)}
                    placeholder="Yılmaz"
                    className={`${inputBase} ${errors.surname ? 'border-red-400 focus:ring-red-300/20' : 'border-stone-200 focus:border-rose-400'}`}
                  />
                  <AnimatePresence>
                    {errors.surname && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[11px] mt-1 ml-1 font-medium">
                        {errors.surname}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* E-posta */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">E-posta Adresi</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400 text-[18px] pointer-events-none">mail</span>
                  <input
                    id="reg-email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="ornek@mail.com"
                    className={`${inputBase} pl-10 ${errors.email ? 'border-red-400 focus:ring-red-300/20' : 'border-stone-200 focus:border-rose-400'}`}
                  />
                </div>
                <AnimatePresence>
                  {errors.email && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[11px] mt-1 ml-1 font-medium">
                      {errors.email}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Şifre</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400 text-[18px] pointer-events-none">lock</span>
                  <input
                    id="reg-password"
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => update('password', e.target.value)}
                    placeholder="En az 6 karakter"
                    className={`${inputBase} pl-10 pr-11 ${errors.password ? 'border-red-400 focus:ring-red-300/20' : 'border-stone-200 focus:border-rose-400'}`}
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                <AnimatePresence>
                  {errors.password && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[11px] mt-1 ml-1 font-medium">
                      {errors.password}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Şifre Tekrar */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">Şifre Tekrarı</label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400 text-[18px] pointer-events-none">lock_reset</span>
                  <input
                    id="reg-confirm"
                    type={showConfirm ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(e) => update('confirmPassword', e.target.value)}
                    placeholder="Şifrenizi tekrar girin"
                    className={`${inputBase} pl-10 pr-11 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-300/20' : 'border-stone-200 focus:border-rose-400'}`}
                  />
                  <button type="button" onClick={() => setShowConfirm((v) => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer">
                    <span className="material-symbols-outlined text-[18px]">{showConfirm ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                <AnimatePresence>
                  {errors.confirmPassword && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[11px] mt-1 ml-1 font-medium">
                      {errors.confirmPassword}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Sözleşme Onayı */}
              <div>
                <label className="flex items-start gap-3 cursor-pointer select-none group">
                  <div className="relative mt-0.5">
                    <input
                      id="reg-terms"
                      type="checkbox"
                      checked={form.terms}
                      onChange={(e) => update('terms', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all peer-checked:bg-rose-600 peer-checked:border-rose-600 ${errors.terms ? 'border-red-400' : 'border-stone-300 group-hover:border-rose-400'}`}>
                      {form.terms && <span className="material-symbols-outlined text-white text-[14px]">check</span>}
                    </div>
                  </div>
                  <span className="text-xs text-stone-600 leading-relaxed pt-0.5">
                    <span className="text-rose-600 font-bold hover:underline cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowTermsModal(true); }}>Kullanım Koşulları</span> ve{' '}
                    <span className="text-rose-600 font-bold hover:underline cursor-pointer" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowPrivacyModal(true); }}>Gizlilik Politikası</span>'nı okudum, kabul ediyorum.
                  </span>
                </label>
                <AnimatePresence>
                  {errors.terms && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-red-500 text-[11px] mt-1 ml-8 font-medium">
                      {errors.terms}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Kayıt Ol Butonu */}
              <button
                id="reg-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-rose-300/40 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Hesap Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    Ücretsiz Hesap Oluştur
                  </>
                )}
              </button>
            </form>

            {/* Giriş Yap Linki */}
            <div className="mt-5 text-center">
              <p className="text-sm text-stone-500">
                Zaten hesabın var mı?{' '}
                <Link to="/login" className="text-rose-600 font-bold hover:underline">
                  Giriş Yap
                </Link>
              </p>
            </div>
          </div>

          {/* Alt Dekoratif Bant */}
          <div className="h-1.5 bg-gradient-to-r from-rose-500 via-orange-400 to-amber-400" />
        </div>

        <p className="text-center text-stone-400 text-xs mt-5">
          © 2024 JetYemek. Tüm hakları saklıdır.
        </p>
      </motion.div>
      {/* Kullanım Koşulları Modalı */}
      <AnimatePresence>
        {showTermsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowTermsModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-10"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-stone-800">Kullanım Koşulları</h2>
                <button onClick={() => setShowTermsModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar text-stone-600 text-sm leading-relaxed space-y-4">
                <p className="font-semibold text-stone-800">1. Taraflar ve Kapsam</p>
                <p>Bu kullanım koşulları ("Koşullar"), JetYemek platformuna ("Platform") kayıt olan kullanıcılar ("Müşteri") ile JetYemek Inc. arasındaki hukuki ilişkiyi düzenler. Platformu kullanarak bu koşulları peşinen kabul etmiş sayılırsınız.</p>
                
                <p className="font-semibold text-stone-800 mt-4">2. Hesap Sorumluluğu</p>
                <p>Müşteri, hesabına ait giriş bilgilerinin güvenliğinden bizzat sorumludur. Hesabınız üzerinden yapılan tüm işlemlerin (sipariş verme, iptal vb.) sizin tarafınızdan yapıldığı kabul edilir. Şüpheli bir durumda derhal destek ekibiyle iletişime geçilmelidir.</p>

                <p className="font-semibold text-stone-800 mt-4">3. Sipariş ve İptal Şartları</p>
                <p>Verilen siparişler, restoran tarafından onaylandıktan sonra (Hazırlanıyor aşamasına geçtiğinde) müşteri tarafından iptal edilemez. İptal talepleri ancak "Sipariş Alındı" aşamasındayken destek hattı üzerinden yapılabilir. Yanlış adres bildirimi nedeniyle teslim edilemeyen siparişlerin ücret iadesi yapılmaz.</p>

                <p className="font-semibold text-stone-800 mt-4">4. Teslimat Süreleri</p>
                <p>Restoranlar tarafından belirtilen tahmini teslimat süreleri (örneğin 20-30 dk) bilgilendirme amaçlıdır ve kesin bir taahhüt içermez. Hava muhalefeti, trafik veya restoranın yoğunluğuna bağlı olarak kurye bekleme sürelerinde opsiyonel gecikmeler yaşanabilir.</p>
              </div>
              <div className="p-6 border-t border-stone-100 bg-stone-50 text-right">
                <button onClick={() => setShowTermsModal(false)} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 cursor-pointer">
                  Okudum, Anladım
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gizlilik Politikası Modalı */}
      <AnimatePresence>
        {showPrivacyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setShowPrivacyModal(false)}
              className="absolute inset-0 bg-stone-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden z-10"
            >
              <div className="p-6 border-b border-stone-100 flex justify-between items-center">
                <h2 className="text-xl font-bold text-stone-800">Gizlilik Politikası (KVKK)</h2>
                <button onClick={() => setShowPrivacyModal(false)} className="text-stone-400 hover:text-stone-600 transition-colors">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar text-stone-600 text-sm leading-relaxed space-y-4">
                <p className="font-semibold text-stone-800">1. Veri Sorumlusu</p>
                <p>Kişisel verileriniz, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında, veri sorumlusu sıfatıyla JetYemek Inc. tarafından aşağıda açıklanan kapsamda işlenmektedir.</p>

                <p className="font-semibold text-stone-800 mt-4">2. İşlenen Veriler ve Amacı</p>
                <p>Platforma üye olurken sağladığınız ad, soyad, e-posta adresi, teslimat adresi ve ödeme bilgileriniz (kart bilgileri tarafımızca saklanmaz, güvenli ödeme altyapısına iletilir); siparişlerinizin size ulaştırılabilmesi, kullanıcı deneyiminin iyileştirilmesi ve hukuki yükümlülüklerimizin yerine getirilmesi amacıyla işlenmektedir.</p>

                <p className="font-semibold text-stone-800 mt-4">3. Veri Güvenliği ve Üçüncü Şahıslarla Paylaşım</p>
                <p>JetYemek, kişisel verilerinizi en üst düzey güvenlik protokolleriyle (SSL, Uçtan Uca Şifreleme) korur. Sipariş adresiniz ve iletişim numaranız, teslimatın yapılabilmesi amacıyla yalnızca ilgili restoran ve kurye ile paylaşılır. Verileriniz, kanuni zorunluluklar haricinde hiçbir şekilde 3. şahıs kurum veya reklam firmalarına satılmaz ve devredilemez.</p>

                <p className="font-semibold text-stone-800 mt-4">4. Kullanıcı Hakları</p>
                <p>KVKK 11. Madde gereğince; verilerinizin silinmesini, düzeltilmesini veya anonimleştirilmesini destek paneli üzerinden talep etme hakkına sahipsiniz. Talep halinde hesabınız ve geçmiş sipariş verileriniz kalıcı olarak imha edilecektir.</p>
              </div>
              <div className="p-6 border-t border-stone-100 bg-stone-50 text-right">
                <button onClick={() => setShowPrivacyModal(false)} className="px-6 py-2.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200 cursor-pointer">
                  Okudum, Anladım
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

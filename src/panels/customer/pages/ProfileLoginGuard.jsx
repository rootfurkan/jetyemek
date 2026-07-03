import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import Profile from './Profile.jsx';

/**
 * ProfileLoginGuard — /profile rotası için auth koruyucu.
 * Giriş yapılmamış ziyaretçiye şık bir "Giriş Gerekli" ekranı gösterir.
 * Giriş yapılmışsa normal Profile bileşenini render eder.
 */
export default function ProfileLoginGuard() {
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  // Giriş yapılmış ve müşteri rolündeyse Profile'ı göster
  if (isAuthenticated && userRole === 'customer') {
    return <Profile />;
  }

  // Ziyaretçi veya yanlış rol → Şık giriş gerekli ekranı
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', damping: 22, stiffness: 200 }}
      className="min-h-[70vh] flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="max-w-sm mx-auto">
        {/* Animasyonlu İkon */}
        <div className="relative mb-8 mx-auto w-fit">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-28 h-28 rounded-full bg-gradient-to-br from-rose-50 to-orange-50 border-4 border-rose-100 flex items-center justify-center shadow-xl shadow-rose-100/50"
          >
            <span
              className="material-symbols-outlined text-6xl text-rose-400 select-none"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              receipt_long
            </span>
          </motion.div>
          {/* Kilit İkonu */}
          <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-100 flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-amber-500 text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              lock
            </span>
          </div>
        </div>

        {/* Başlık */}
        <h1 className="text-2xl font-extrabold text-stone-800 tracking-tight">
          Siparişlerim
        </h1>
        <p className="text-stone-500 text-sm mt-3 leading-relaxed max-w-xs mx-auto">
          Siparişlerinizi görüntüleyebilmek için hesabınıza giriş yapmanız gerekmektedir.
        </p>

        {/* Giriş Butonu */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', damping: 20 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            to="/login"
            state={{ from: '/profile' }}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white font-bold rounded-full shadow-lg shadow-rose-300/40 transition-all hover:-translate-y-px active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-lg">login</span>
            Giriş Yap
          </Link>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white border-2 border-rose-200 text-rose-700 font-bold rounded-full hover:bg-rose-50 transition-all active:scale-95 text-sm"
          >
            <span className="material-symbols-outlined text-lg">person_add</span>
            Kayıt Ol
          </Link>
        </motion.div>

        {/* Küçük bilgi notu */}
        <div className="mt-8 p-4 rounded-2xl bg-stone-50 border border-stone-100 text-left">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary text-lg mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
            <p className="text-xs text-stone-500 leading-relaxed">
              Hesap oluşturmak ücretsizdir. Siparişlerinizi takip etmek, geçmiş siparişlerinize ulaşmak ve adreslerinizi kaydetmek için giriş yapın.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

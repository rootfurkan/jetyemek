import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'motion/react';
import { loginSuccess, setLoginError, clearLoginError } from '../../features/auth/authSlice.js';
import { loginUser } from '../../services/api.js';

const REDIRECT_MAP = {
  customer: '/',
  restaurant: '/restaurant',
  admin: '/admin',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, userRole, loginError } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Zaten giriş yapılmışsa ilgili panele yönlendir
  useEffect(() => {
    if (isAuthenticated && userRole) {
      const target =
        userRole === 'customer'
          ? location.state?.from || '/'
          : REDIRECT_MAP[userRole] || '/';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, userRole, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email || !password) return;

    setIsLoading(true);
    dispatch(clearLoginError());

    try {
      const user = await loginUser(email, password);
      if (user) {
        dispatch(loginSuccess(user));
      } else {
        dispatch(setLoginError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.'));
      }
    } catch (err) {
      console.error('Login server error:', err);
      dispatch(setLoginError('Sunucuya bağlanılamadı. JSON Server çalışıyor mu? Terminalde npm run server komutunu çalıştırın.'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dekoratif Arka Plan */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-200/25 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-orange-100/40 rounded-full blur-2xl pointer-events-none" />

      {/* Floating Yemek İkonları */}
      <div className="absolute top-16 left-16 text-5xl opacity-10 pointer-events-none select-none animate-bounce" style={{ animationDuration: '3s' }}>🍔</div>
      <div className="absolute bottom-24 right-20 text-4xl opacity-10 pointer-events-none select-none animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>🍕</div>
      <div className="absolute top-1/2 right-10 text-3xl opacity-10 pointer-events-none select-none animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }}>🌮</div>
      <div className="absolute top-20 right-1/3 text-3xl opacity-10 pointer-events-none select-none animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>🥗</div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 22, stiffness: 200 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo & Başlık */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-600 to-red-500 flex items-center justify-center shadow-xl shadow-rose-300/50">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
            <span className="text-3xl font-black text-rose-700 tracking-tight">JetYemek</span>
          </Link>
          <p className="text-stone-500 text-sm mt-2 font-medium">Lezzetin hızına ulaşmak için giriş yapın</p>
        </div>

        {/* Login Kartı */}
        <div className="bg-white/85 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-2xl shadow-stone-200/40 overflow-hidden">
          {/* Üst Dekoratif Bant */}
          <div className="h-1.5 bg-gradient-to-r from-rose-600 via-orange-400 to-amber-400" />

          <div className="p-7">
            <h2 className="text-xl font-bold text-stone-800 mb-6 text-center">Hesabına Giriş Yap</h2>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* E-posta */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400 text-[18px] pointer-events-none">mail</span>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); dispatch(clearLoginError()); }}
                    onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                    placeholder="ornek@mail.com"
                    className={`w-full bg-stone-50 border rounded-xl pl-10 pr-4 h-12 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${
                      touched.email && !email
                        ? 'border-red-400 focus:ring-red-300/20'
                        : 'border-stone-200 focus:border-rose-400 focus:ring-rose-500/15'
                    }`}
                  />
                </div>
                {touched.email && !email && (
                  <p className="text-red-500 text-[11px] mt-1 ml-1 font-medium">E-posta adresi gerekli</p>
                )}
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-xs font-bold text-stone-500 uppercase tracking-wider mb-1.5">
                  Şifre
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-400 text-[18px] pointer-events-none">lock</span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); dispatch(clearLoginError()); }}
                    onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                    placeholder="••••••••"
                    className={`w-full bg-stone-50 border rounded-xl pl-10 pr-11 h-12 text-sm text-stone-800 placeholder-stone-400 outline-none transition-all duration-200 focus:bg-white focus:ring-2 ${
                      touched.password && !password
                        ? 'border-red-400 focus:ring-red-300/20'
                        : 'border-stone-200 focus:border-rose-400 focus:ring-rose-500/15'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
                {touched.password && !password && (
                  <p className="text-red-500 text-[11px] mt-1 ml-1 font-medium">Şifre gerekli</p>
                )}
              </div>

              {/* Hata Mesajı */}
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200"
                >
                  <span className="material-symbols-outlined text-red-500 text-lg flex-shrink-0">error</span>
                  <p className="text-red-700 text-xs font-semibold">{loginError}</p>
                </motion.div>
              )}

              {/* Giriş Butonu */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-rose-300/40 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 cursor-pointer mt-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Giriş Yapılıyor...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-lg">login</span>
                    Giriş Yap
                  </>
                )}
              </button>
            </form>

            {/* Ayraç */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-stone-200" />
              <span className="text-xs text-stone-400 font-semibold">veya</span>
              <div className="flex-1 h-px bg-stone-200" />
            </div>

            {/* Register Linki */}
            <div className="text-center">
              <p className="text-sm text-stone-600">
                Henüz hesabın yok mu?{' '}
                <Link
                  to="/register"
                  className="text-rose-600 font-bold hover:text-rose-700 underline underline-offset-2 transition-colors"
                >
                  Ücretsiz Kaydol
                </Link>
              </p>
            </div>

            {/* Demo Bilgi Notu */}
            <div className="mt-5 p-4 rounded-2xl bg-amber-50/70 border border-amber-200/50">
              <p className="text-[11px] font-extrabold text-amber-700 uppercase tracking-widest mb-2">
                Demo Hesaplar
              </p>
              <div className="space-y-1">
                <p className="text-amber-800 text-xs font-mono">
                  <span className="font-bold">Müşteri:</span> ahmet.yilmaz@gmail.com / musteri123
                </p>
                <p className="text-amber-800 text-xs font-mono">
                  <span className="font-bold">Restoran:</span> gourmet@jetyemek.com / rest123
                </p>
                <p className="text-amber-800 text-xs font-mono">
                  <span className="font-bold">Admin:</span> admin@jetyemek.com / admin123
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-stone-400 text-xs mt-5 font-medium">
          © 2024 JetYemek Platform — Tüm hakları saklıdır
        </p>
      </motion.div>
    </div>
  );
}

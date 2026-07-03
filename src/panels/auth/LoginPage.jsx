import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearLoginError } from '../../features/auth/authSlice.js';

const ROLE_TABS = [
  {
    key: 'customer',
    label: 'Müşteri',
    icon: 'person',
    hint: 'musteri@jetyemek.com / musteri123',
    color: 'from-orange-500 to-rose-600',
    activeColor: 'bg-rose-600',
    description: 'Lezzetli yemekler sipariş et',
  },
  {
    key: 'restaurant',
    label: 'Restoran',
    icon: 'storefront',
    hint: 'gourmet@jetyemek.com / rest123',
    color: 'from-emerald-500 to-teal-600',
    activeColor: 'bg-emerald-600',
    description: 'Restoranını yönet',
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: 'shield',
    hint: 'admin@jetyemek.com / admin123',
    color: 'from-violet-500 to-indigo-600',
    activeColor: 'bg-violet-600',
    description: 'Platformu yönet',
  },
];

const REDIRECT_MAP = {
  customer: '/',
  restaurant: '/restaurant',
  admin: '/admin',
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isAuthenticated, userType, loginError } = useSelector((state) => state.auth);

  const [selectedRole, setSelectedRole] = useState('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  // Zaten giriş yapılmışsa kendi paneline veya geldiği sayfaya yönlendir
  useEffect(() => {
    if (isAuthenticated && userType) {
      const target = userType === 'customer'
        ? (location.state?.from || '/')
        : (REDIRECT_MAP[userType] || '/');
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, userType, navigate, location.state]);

  // Sekme değişince formu sıfırla
  const handleRoleChange = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setTouched({ email: false, password: false });
    dispatch(clearLoginError());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!email || !password) return;

    setIsLoading(true);
    // Gerçekçi bir gecikme simülasyonu
    await new Promise((res) => setTimeout(res, 700));
    dispatch(login({ email, password }));
    setIsLoading(false);
  };

  const fillDemo = () => {
    const activeTab = ROLE_TABS.find((t) => t.key === selectedRole);
    if (!activeTab) return;
    const [demoEmail, demoPass] = activeTab.hint.split(' / ');
    setEmail(demoEmail);
    setPassword(demoPass);
    dispatch(clearLoginError());
  };

  const activeTab = ROLE_TABS.find((t) => t.key === selectedRole);

  return (
    <div className="min-h-screen bg-[#0a0b0e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Arka plan efektleri */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(181,28,0,0.35) 0%, transparent 60%)',
        }}
      />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-rose-600/40 to-transparent" />

      {/* Floating orbs */}
      <div
        className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #b51c00, transparent)' }}
      />
      <div
        className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-10 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #b90040, transparent)' }}
      />

      {/* Login Kartı */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Başlık */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-br from-rose-600 to-red-700 shadow-2xl shadow-rose-900/50 mb-4">
            <span className="material-symbols-outlined text-white text-3xl">local_fire_department</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">JetYemek</h1>
          <p className="text-stone-400 text-sm mt-1 font-medium">Platform Giriş Paneli</p>
        </div>

        {/* Kart */}
        <div className="bg-[#13151a] border border-stone-800/60 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
          {/* Rol Sekmeleri */}
          <div className="flex border-b border-stone-800/60">
            {ROLE_TABS.map((tab) => {
              const isActive = selectedRole === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleRoleChange(tab.key)}
                  className={`flex-1 flex flex-col items-center gap-1.5 py-4 text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                    isActive
                      ? 'text-white border-b-2 border-rose-500'
                      : 'text-stone-500 hover:text-stone-300 border-b-2 border-transparent'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl transition-all duration-300 ${
                      isActive ? 'text-rose-400' : 'text-stone-600'
                    }`}
                  >
                    {tab.icon}
                  </span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form Alanı */}
          <div className="p-7">
            {/* Aktif Rol Açıklaması */}
            <div className="mb-6 p-3.5 rounded-2xl bg-stone-900/50 border border-stone-800/40 flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-xl bg-gradient-to-br ${activeTab?.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
              >
                <span className="material-symbols-outlined text-white text-base">{activeTab?.icon}</span>
              </div>
              <div>
                <p className="text-white text-sm font-bold">{activeTab?.label} Girişi</p>
                <p className="text-stone-400 text-xs mt-0.5">{activeTab?.description}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              {/* E-posta */}
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  E-posta Adresi
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-500 text-[18px] pointer-events-none">
                    mail
                  </span>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      dispatch(clearLoginError());
                    }}
                    onBlur={() => setTouched((p) => ({ ...p, email: true }))}
                    placeholder="ornek@jetyemek.com"
                    className={`w-full bg-[#0e1014] border rounded-xl pl-11 pr-4 h-12 text-sm text-white placeholder-stone-600 outline-none transition-all duration-200 focus:ring-2 focus:ring-rose-600/40 ${
                      touched.email && !email
                        ? 'border-red-500/60 focus:border-red-500'
                        : 'border-stone-700/60 focus:border-stone-500'
                    }`}
                  />
                </div>
                {touched.email && !email && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">E-posta adresi gerekli</p>
                )}
              </div>

              {/* Şifre */}
              <div>
                <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                  Şifre
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-stone-500 text-[18px] pointer-events-none">
                    lock
                  </span>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      dispatch(clearLoginError());
                    }}
                    onBlur={() => setTouched((p) => ({ ...p, password: true }))}
                    placeholder="••••••••"
                    className={`w-full bg-[#0e1014] border rounded-xl pl-11 pr-12 h-12 text-sm text-white placeholder-stone-600 outline-none transition-all duration-200 focus:ring-2 focus:ring-rose-600/40 ${
                      touched.password && !password
                        ? 'border-red-500/60 focus:border-red-500'
                        : 'border-stone-700/60 focus:border-stone-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer p-1"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {touched.password && !password && (
                  <p className="text-red-400 text-xs mt-1.5 ml-1">Şifre gerekli</p>
                )}
              </div>

              {/* Hata Mesajı */}
              {loginError && (
                <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-red-950/50 border border-red-800/40">
                  <span className="material-symbols-outlined text-red-400 text-lg flex-shrink-0">error</span>
                  <p className="text-red-300 text-xs font-medium">{loginError}</p>
                </div>
              )}

              {/* Giriş Butonu */}
              <button
                id="login-submit-btn"
                type="submit"
                disabled={isLoading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-rose-700 to-red-600 hover:from-rose-600 hover:to-red-500 text-white text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-lg shadow-rose-900/40 hover:shadow-rose-800/50 hover:-translate-y-px active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer mt-2"
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

            {/* Demo Hesap Bilgileri */}
            <div className="mt-5 p-4 rounded-2xl bg-stone-900/40 border border-stone-800/30">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[11px] font-extrabold text-stone-500 uppercase tracking-widest">
                  Demo Hesap
                </p>
                <button
                  type="button"
                  onClick={fillDemo}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">auto_fix_high</span>
                  Otomatik Doldur
                </button>
              </div>
              <p className="text-stone-400 text-xs font-mono leading-relaxed">{activeTab?.hint}</p>
            </div>
          </div>
        </div>

        {/* Alt Bilgi */}
        <p className="text-center text-stone-600 text-xs mt-6 font-medium">
          JetYemek Platform v1.0 — Tüm hakları saklıdır
        </p>
      </div>
    </div>
  );
}

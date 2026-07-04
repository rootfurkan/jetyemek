import React, { useState } from 'react';
import { useToast } from '../../common/components/Toast.jsx';
import AdminOrders from './AdminOrders.jsx';
import AdminMenu from './AdminMenu.jsx';
import AdminReviews from './AdminReviews.jsx';
import AdminFinance from './AdminFinance.jsx';
import AdminSettings from './AdminSettings.jsx';


export default function AdminDashboard({ onExitAdmin }) {
  const addToast = useToast();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'menu' | 'reviews' | 'finance' | 'settings'

  // Summary Metrics for the main Admin Dashboard overview
  const overviewStats = [
    {
      title: 'Bugünün Cirosu',
      value: '4,282.50 ₺',
      change: 'Düne Göre +12.4%',
      isPositive: true,
      icon: 'payments',
      gradient: 'from-primary to-secondary text-white'
    },
    {
      title: 'Aktif Siparişler',
      value: '18',
      change: 'Yeni siparişler geliyor',
      isPositive: true,
      icon: 'notifications_active',
      gradient: 'bg-stone-100 border border-stone-200/50 text-stone-800'
    },
    {
      title: 'Mağaza Puanı',
      value: '4.8',
      change: 'Bu hafta 248 yeni yorum',
      isPositive: true,
      icon: 'star',
      gradient: 'bg-stone-100 border border-stone-200/50 text-stone-800'
    }
  ];

  return (
    <div className="min-h-screen bg-stone-50/40 flex text-stone-800 font-sans antialiased">
      {/* 1. Left Fixed Sidebar Navigation Panel */}
      <aside className="w-72 bg-white border-r border-rose-100/10 flex flex-col py-6 px-4 shrink-0 fixed top-0 bottom-0 left-0 z-40 shadow-sm">
        {/* Brand Header */}
        <div className="mb-8 px-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-md shadow-primary/10">
            <span className="material-symbols-outlined text-[24px]">fastfood</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-primary leading-tight">CraveDash</h1>
            <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Yönetim Paneli</p>
          </div>
        </div>

        {/* Navigation Link list */}
        <nav className="flex-1 space-y-1.5">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'dashboard' 
                ? 'bg-primary-container text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Genel Bakış
          </button>

          <button 
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-primary-container text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">notifications_active</span>
            Canlı Siparişler
            <span className="ml-auto bg-secondary text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full ring-2 ring-white shadow-sm">
              4
            </span>
          </button>

          <button 
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'menu' 
                ? 'bg-primary-container text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">restaurant_menu</span>
            Menü Yönetimi
          </button>

          <button 
            onClick={() => setActiveTab('reviews')}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'reviews' 
                ? 'bg-primary-container text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">reviews</span>
            Yorumlar
          </button>

          <button 
            onClick={() => setActiveTab('finance')}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'finance' 
                ? 'bg-primary-container text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Finans & Raporlar
          </button>

          <div className="pt-4 mt-4 border-t border-stone-100">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-primary-container text-white shadow-md shadow-primary/10' 
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Mağaza Ayarları
            </button>
          </div>
        </nav>

        {/* Bottom Storefront Escaper switch */}
        <div className="mt-auto pt-6 border-t border-stone-100 space-y-4">
          {/* Active restaurant user headshot */}
          <div className="bg-stone-50 rounded-2xl p-3.5 flex items-center gap-3 border border-stone-200/55">
            <img 
              alt="Manager Profile" 
              className="w-10 h-10 rounded-xl object-cover border-2 border-primary/20" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMvl-4C8nAcmenNhmQW1jBnjtb4qlzpAMB8YMDTEzDCIdwgU60b-WmnlL2Fc7ouv0xrqMCfz2l7ym-XNlNlkLo-0fyVqos5uBXvuHBZ-cLdmmgsgV05NVnwXwHg8qWMwzCVgfLVe8uLAS9pBqb-3QuzN_AI05ZCFsRfTd4ebERJOJTBGcG1lOSuNWNH0hb-qAaRdLvMZRRB4rjICowc8zsLSk5ke3llVGQogtxOsWUEEkYn1E6Chlw2IHuVm6H1akYmIFectCHyv8" 
              referrerPolicy="no-referrer"
            />
            <div className="overflow-hidden">
              <p className="font-black text-xs text-stone-800 truncate leading-tight">Hearty Delights</p>
              <p className="text-[10px] text-stone-400 font-bold tracking-wide mt-0.5">Mağaza #8842</p>
            </div>
          </div>

          <button
            onClick={onExitAdmin}
            className="w-full h-11 flex items-center justify-center gap-2 rounded-xl border border-rose-200 hover:bg-rose-50 text-primary text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all active:scale-95"
          >
            <span>Müşteri Görünümü</span>
            <span className="material-symbols-outlined text-[15px]">logout</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Content shell area */}
      <div className="flex-1 ml-72 p-6 md:p-8 min-h-screen">
        
        {/* Dynamic Navigation Top AppBar Utility */}
        <header className="sticky top-0 z-30 mb-8 flex justify-between items-center w-full h-16 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/10">
          <div>
            <h2 className="text-2xl font-black text-stone-800 tracking-tight">
              {activeTab === 'dashboard' && 'Yönetim Paneli'}
              {activeTab === 'orders' && 'Canlı Sipariş Terminali'}
              {activeTab === 'menu' && 'Menü & Ürün Yönetimi'}
              {activeTab === 'reviews' && 'Yorum & Puan Takibi'}
              {activeTab === 'finance' && 'Finansal Analizler'}
              {activeTab === 'settings' && 'Sistem Mağaza Ayarları'}
            </h2>
            <p className="text-xs text-stone-400 font-bold tracking-wide mt-0.5 uppercase">
              {new Date().toLocaleDateString('tr-TR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-green-200 shadow-sm select-none">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Restoran Açık / Aktif
            </div>

            <div className="flex gap-1.5">
              <button 
                onClick={() => addToast({ message: 'Sistem bildiriminiz yok.', type: 'info' })}
                className="p-2 text-stone-400 hover:text-stone-700 bg-white border border-stone-200 shadow-sm rounded-xl hover:scale-102 transition-all relative"
              >
                <span className="material-symbols-outlined text-[20px]">notifications</span>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white"></span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic content rendering depending on chosen tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-fade-in">
            {/* Quick Overview Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {overviewStats.map((card, idx) => (
                <div 
                  key={idx}
                  className={`p-6 rounded-[24px] shadow-soft relative overflow-hidden flex flex-col justify-between h-36 group hover:scale-[1.02] transition-all cursor-pointer ${
                    card.gradient.includes('from-') ? `bg-gradient-to-br ${card.gradient}` : 'bg-white border border-stone-100'
                  }`}
                >
                  <div className="relative z-10">
                    <p className={`text-[10px] font-bold uppercase tracking-wider ${
                      card.gradient.includes('text-white') ? 'text-white/80' : 'text-stone-400'
                    }`}>
                      {card.title}
                    </p>
                    <h3 className="text-3xl font-black mt-1 tracking-tight">{card.value}</h3>
                  </div>

                  <div className={`text-[10px] font-extrabold px-2.5 py-1 rounded-xl w-fit relative z-10 ${
                    card.gradient.includes('text-white') ? 'bg-white/20 text-white' : 'bg-stone-50 text-stone-500 border border-stone-200/50'
                  }`}>
                    {card.change}
                  </div>

                  <span className={`material-symbols-outlined absolute -bottom-4 -right-4 text-8xl opacity-10 group-hover:rotate-12 transition-transform select-none ${
                    card.gradient.includes('text-white') ? 'text-white' : 'text-stone-300'
                  }`}>
                    {card.icon}
                  </span>
                </div>
              ))}
            </div>

            {/* Overview Visual Bento Splits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              
              {/* Left Overview Column: Dynamic Quick order list widget */}
              <div className="lg:col-span-2 bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 space-y-5">
                <div className="flex justify-between items-center border-b border-stone-50 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-stone-800">Sipariş Akışı</h3>
                    <p className="text-stone-400 text-xs font-semibold mt-0.5">Sıradaki bekleyen siparişlerinizi hızlıca görün</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-primary hover:text-primary-container text-xs font-bold"
                  >
                    Tüm Siparişleri Gör
                  </button>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="bg-stone-50/50 hover:bg-stone-50 border border-stone-200/45 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-rose-50 border border-rose-100 text-primary rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                        #42
                      </div>
                      <div>
                        <h4 className="font-extrabold text-stone-800 text-sm">Double Hearty Burger Combo</h4>
                        <p className="text-stone-500 text-xs font-semibold mt-0.5">2x Pastırma, Soğansız • 242.50 ₺</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xs text-primary font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px] animate-pulse">timer</span>
                        04:12 Kaldı
                      </span>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="bg-primary hover:bg-primary-container text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
                      >
                        Yönet
                      </button>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="bg-stone-50/50 hover:bg-stone-50 border border-stone-200/45 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-amber-50 border border-amber-100 text-amber-600 rounded-xl flex items-center justify-center font-black text-sm shadow-sm">
                        #39
                      </div>
                      <div>
                        <h4 className="font-extrabold text-stone-800 text-sm">Avokadolu Tavuk Salata</h4>
                        <p className="text-stone-500 text-xs font-semibold mt-0.5">Tavuk Göğsü, Ekstra Sos • 185.00 ₺</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-xs text-amber-500 font-bold">
                        Hazırlanıyor
                      </span>
                      <button 
                        onClick={() => setActiveTab('orders')}
                        className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-1.5 rounded-full text-xs font-bold"
                      >
                        Yönet
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Weekly static report graph */}
              <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Haftalık Satışlar</h4>
                  <p className="text-stone-500 text-xs font-semibold mt-1">Son 7 günlük satış barları</p>
                </div>

                <div className="h-28 flex items-end gap-2.5 w-full mt-6">
                  <div className="flex-1 bg-primary/25 hover:bg-primary transition-all rounded-t-lg h-1/2" title="Pazartesi: 2.1k"></div>
                  <div className="flex-1 bg-primary/25 hover:bg-primary transition-all rounded-t-lg h-3/4" title="Salı: 3.4k"></div>
                  <div className="flex-1 bg-primary/25 hover:bg-primary transition-all rounded-t-lg h-2/3" title="Çarşamba: 2.9k"></div>
                  <div className="flex-1 bg-primary/25 hover:bg-primary transition-all rounded-t-lg h-1/3" title="Perşembe: 1.5k"></div>
                  <div className="flex-1 bg-primary/40 hover:bg-primary transition-all rounded-t-lg h-full animate-scale-up" title="Cuma: 4.2k"></div>
                  <div className="flex-1 bg-primary/25 hover:bg-primary transition-all rounded-t-lg h-4/5" title="Cumartesi: 3.8k"></div>
                  <div className="flex-1 bg-primary/25 hover:bg-primary transition-all rounded-t-lg h-2/3" title="Pazar: 2.7k"></div>
                </div>

                <div className="flex justify-between mt-2.5 text-[9px] text-stone-400 font-bold uppercase tracking-wider">
                  <span>Pzt</span><span>Sal</span><span>Çar</span><span>Per</span><span>Cum</span><span>Cmt</span><span>Paz</span>
                </div>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'orders' && <AdminOrders />}
        {activeTab === 'menu' && <AdminMenu />}
        {activeTab === 'reviews' && <AdminReviews />}
        {activeTab === 'finance' && <AdminFinance />}
        {activeTab === 'settings' && <AdminSettings />}

      </div>
    </div>
  );
}

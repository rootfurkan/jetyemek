import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Overview() {
  const navigate = useNavigate();

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
    <div className="space-y-8 animate-fade-in text-left">
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
              onClick={() => navigate('/restaurant/orders')}
              className="text-primary hover:text-primary-container text-xs font-bold border-none bg-transparent cursor-pointer"
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
                  onClick={() => navigate('/restaurant/orders')}
                  className="bg-primary hover:bg-primary-container text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border-none cursor-pointer"
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
                  onClick={() => navigate('/restaurant/orders')}
                  className="bg-stone-800 hover:bg-stone-900 text-white px-4 py-1.5 rounded-full text-xs font-bold border-none cursor-pointer"
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
  );
}

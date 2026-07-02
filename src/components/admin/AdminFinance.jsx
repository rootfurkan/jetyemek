import React, { useState } from 'react';
import { useToast } from '../../common/components/Toast.jsx';

export default function AdminFinance() {
  const addToast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('Last30'); // 'Today' | 'Last7' | 'Last30'
  const [searchQuery, setSearchQuery] = useState('');

  // Mock statistical data
  const statCards = [
    {
      title: 'Toplam Ciro',
      value: '142,500 ₺',
      change: '+12.5%',
      isPositive: true,
      icon: 'payments',
      color: 'primary',
      progressWidth: '75%'
    },
    {
      title: 'Net Kazanç',
      subtitle: '(8% Komisyon Sonrası)',
      value: '131,100 ₺',
      change: '+8.2%',
      isPositive: true,
      icon: 'account_balance_wallet',
      color: 'tertiary',
      progressWidth: '68%'
    },
    {
      title: 'Toplam Sipariş',
      value: '2,840',
      change: '-2.4%',
      isPositive: false,
      icon: 'shopping_bag',
      color: 'secondary',
      progressWidth: '45%'
    },
    {
      title: 'Ortalama Sepet',
      value: '50.17 ₺',
      change: '+5.1%',
      isPositive: true,
      icon: 'analytics',
      color: 'stone',
      progressWidth: '80%'
    }
  ];

  // Top selling products mock
  const topProducts = [
    { name: 'Classic Smash Burger', revenue: '24,500 ₺', percent: 90 },
    { name: 'Truffle Fries', revenue: '18,200 ₺', percent: 72 },
    { name: 'Buffalo Wings (12pc)', revenue: '15,800 ₺', percent: 60 },
    { name: 'Caramel Milkshake', revenue: '12,100 ₺', percent: 45 },
    { name: 'Veggie Garden Wrap', revenue: '9,400 ₺', percent: 35 }
  ];

  // Transactions logs mock
  const transactions = [
    { id: 'CD-84920', date: '24 Ekim, 14:32', amount: 120.00, commission: 9.60, payout: 110.40, status: 'Başarılı' },
    { id: 'CD-84919', date: '24 Ekim, 14:15', amount: 85.50, commission: 6.84, payout: 78.66, status: 'Başarılı' },
    { id: 'CD-84918', date: '24 Ekim, 13:50', amount: 210.00, commission: 16.80, payout: 193.20, status: 'Beklemede' },
    { id: 'CD-84917', date: '24 Ekim, 13:22', amount: 45.00, commission: 3.60, payout: 41.40, status: 'İade Edildi' },
    { id: 'CD-84916', date: '24 Ekim, 12:45', amount: 312.00, commission: 24.96, payout: 287.04, status: 'Başarılı' }
  ];

  const filteredTransactions = transactions.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header and Period Filter bar */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">Finans ve Raporlar</h2>
          <p className="text-stone-500 text-sm mt-1">İşletmenizin finansal durumunu, net kazancını ve sipariş analizlerini buradan takip edin.</p>
        </div>

        <div className="flex flex-wrap bg-white rounded-full p-1 border border-stone-200 shadow-sm items-center gap-1 self-stretch sm:self-auto">
          <button
            onClick={() => setSelectedPeriod('Today')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'Today' ? 'bg-primary text-white shadow-sm' : 'text-stone-500 hover:text-primary'
            }`}
          >
            Bugün
          </button>
          <button
            onClick={() => setSelectedPeriod('Last7')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'Last7' ? 'bg-primary text-white shadow-sm' : 'text-stone-500 hover:text-primary'
            }`}
          >
            Son 7 Gün
          </button>
          <button
            onClick={() => setSelectedPeriod('Last30')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedPeriod === 'Last30' ? 'bg-primary text-white shadow-sm' : 'text-stone-500 hover:text-primary'
            }`}
          >
            Son 30 Gün
          </button>
          
          <div className="h-4 w-[1px] bg-stone-200 mx-1 hidden sm:block"></div>
          
          <button 
            onClick={() => addToast({ message: 'Özel tarih aralığı filtresi yakında eklenecektir!', type: 'info' })}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-stone-500 hover:text-primary transition-all flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[15px]">calendar_today</span>
            Özel
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div 
            key={idx}
            className="bg-white p-5 rounded-[24px] shadow-soft border border-stone-100 flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer hover:border-primary/25"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 bg-rose-50 text-primary rounded-xl">
                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
              </div>
              
              <div className={`flex items-center gap-0.5 text-xs font-bold ${
                card.isPositive ? 'text-green-600' : 'text-primary'
              }`}>
                <span className="material-symbols-outlined text-[15px]">
                  {card.isPositive ? 'trending_up' : 'trending_down'}
                </span>
                {card.change}
              </div>
            </div>

            <div>
              <p className="text-stone-400 font-bold text-xs tracking-wide">
                {card.title} {card.subtitle && <span className="text-[10px] opacity-75 font-medium">{card.subtitle}</span>}
              </p>
              <h3 className="text-2xl font-black text-stone-800 tracking-tight mt-1">{card.value}</h3>
            </div>

            <div className="mt-4 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
              <div 
                className={`h-full ${
                  card.color === 'primary' 
                    ? 'bg-primary' 
                    : card.color === 'tertiary' 
                      ? 'bg-amber-500' 
                      : card.color === 'secondary' 
                        ? 'bg-rose-500' 
                        : 'bg-stone-800'
                }`} 
                style={{ width: card.progressWidth }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Bento Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left/Middle Column: Revenue trend interactive SVG line graph */}
        <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h4 className="text-base font-extrabold text-stone-800">Ciro Gelişim Grafiği</h4>
              <p className="text-stone-400 text-xs font-semibold">Günlük performans ve kar oranları analizi (Son 30 Gün)</p>
            </div>
            
            <div className="flex gap-4 items-center self-end sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                Ciro (TL)
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600">
                <span className="w-3.5 h-[3px] rounded bg-amber-500 border-t border-dashed border-amber-600 inline-block"></span>
                Net Kar (TL)
              </div>
            </div>
          </div>

          {/* High Fidelity Interactive SVG Line Chart */}
          <div className="relative w-full h-[220px] bg-rose-50/20 rounded-2xl border border-stone-100 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenue-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#b51c00" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#b51c00" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="55" x2="800" y2="55" stroke="#f1e5e2" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="0" y1="110" x2="800" y2="110" stroke="#f1e5e2" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="0" y1="165" x2="800" y2="165" stroke="#f1e5e2" strokeWidth="1" strokeDasharray="5 5" />

              {/* Revenue Shaded Area */}
              <path 
                d="M 0 180 Q 100 130 200 160 T 400 100 T 600 130 T 800 60 L 800 220 L 0 220 Z" 
                fill="url(#revenue-gradient)" 
              />

              {/* Revenue Trend Line */}
              <path 
                d="M 0 180 Q 100 130 200 160 T 400 100 T 600 130 T 800 60" 
                fill="none" 
                stroke="#b51c00" 
                strokeWidth="3.5" 
                strokeLinecap="round"
              />

              {/* Net Profit Dashed Trend Line */}
              <path 
                d="M 0 195 Q 100 150 200 175 T 400 120 T 600 148 T 800 80" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="2" 
                strokeDasharray="6 4"
                strokeLinecap="round"
              />

              {/* Interactive Dot indicators on the highest peak */}
              <circle cx="800" cy="60" r="5" fill="#b51c00" stroke="#ffffff" strokeWidth="2" />
              <circle cx="400" cy="100" r="4.5" fill="#b51c00" stroke="#ffffff" strokeWidth="1.5" />
            </svg>

            {/* Custom SVG Tooltip Indicator overlaying */}
            <div className="absolute top-4 right-12 bg-stone-900 text-white rounded-xl px-3 py-1.5 shadow-md border border-stone-800 flex flex-col items-start gap-0.5 opacity-90 animate-fade-in scale-90">
              <span className="text-[9px] font-bold text-stone-400">Peak Satış Günü</span>
              <span className="text-xs font-black text-rose-300">Ciro: 8,420 ₺</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-3 px-2">
            <span>01 Ekim</span>
            <span>10 Ekim</span>
            <span>20 Ekim</span>
            <span>30 Ekim</span>
          </div>
        </div>

        {/* Right Column: Order Distribution pie diagram mockup */}
        <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-extrabold text-stone-800">Sipariş Statüleri</h4>
            <p className="text-stone-400 text-xs font-semibold mb-6">Başarılı ve iptal siparişlerin yüzdesel dağılımı</p>
          </div>

          {/* Styled CSS circular Conic Gradient with floating labels */}
          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <div 
              className="w-full h-full rounded-full shadow-inner" 
              style={{ background: 'conic-gradient(#b51c00 0% 75%, #f59e0b 75% 90%, #ef4444 90% 100%)' }}
            ></div>
            <div className="absolute w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-md border border-stone-50">
              <span className="text-2xl font-black text-stone-800">2,840</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Toplam</span>
            </div>
          </div>

          <div className="mt-6 space-y-2 pt-2 border-t border-stone-50">
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>
                Tamamlanan
              </div>
              <span className="text-stone-800">2,130 (75%)</span>
            </div>
            
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>
                Beklemede/Yolda
              </div>
              <span className="text-stone-800">426 (15%)</span>
            </div>

            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>
                İptal / İade
              </div>
              <span className="text-stone-800">284 (10%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lower Bento Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Selling Products List Progressbars */}
        <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 lg:col-span-5 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-base font-extrabold text-stone-800">En Çok Satan Ürünler</h4>
            <button 
              onClick={() => addToast({ message: 'Tam liste menü yönetiminde listelenmektedir.', type: 'info' })}
              className="text-primary hover:text-primary-container text-xs font-bold hover:underline"
            >
              Tümünü Gör
            </button>
          </div>

          <div className="space-y-4 flex-grow flex flex-col justify-around">
            {topProducts.map((prod, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="flex justify-between text-xs font-bold text-stone-700 mb-1.5">
                  <span className="group-hover:text-primary transition-colors text-stone-800">{prod.name}</span>
                  <span className="text-primary font-black">{prod.revenue}</span>
                </div>
                <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary group-hover:bg-primary-container transition-all rounded-full" 
                    style={{ width: `${prod.percent}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Interactive Table Log */}
        <div className="bg-white rounded-[28px] shadow-soft border border-stone-100 overflow-hidden lg:col-span-7 flex flex-col justify-between">
          <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h4 className="text-base font-extrabold text-stone-800">Son Hesap Hareketleri</h4>
            <div className="relative max-w-xs w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">
                search
              </span>
              <input 
                type="text"
                placeholder="Sipariş No Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 focus:border-rose-200 focus:bg-white rounded-xl text-xs font-bold focus:ring-4 focus:ring-primary/5 w-full focus:outline-none text-stone-700 placeholder-stone-400 transition-all"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tarih</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Sipariş No</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tutar</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Komisyon</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Net Hak Ediş</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Statü</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-stone-400 font-semibold">
                      Sipariş bulunamadı.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-stone-50/30 transition-colors">
                      <td className="px-6 py-3.5 text-stone-400 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-3.5 font-bold text-stone-800">{tx.id}</td>
                      <td className="px-4 py-3.5">{tx.amount.toFixed(2)} ₺</td>
                      <td className="px-4 py-3.5 text-primary">-{tx.commission.toFixed(2)} ₺</td>
                      <td className="px-4 py-3.5 font-extrabold text-stone-800">{tx.payout.toFixed(2)} ₺</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                          tx.status === 'Başarılı' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : tx.status === 'Beklemede' 
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex items-center justify-between text-[11px] font-bold text-stone-400">
            <span>128 işlem içerisinden 1-5 gösteriliyor</span>
            <div className="flex gap-1.5">
              <button className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm cursor-pointer"><span className="material-symbols-outlined text-[15px] select-none">chevron_left</span></button>
              <button className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm cursor-pointer"><span className="material-symbols-outlined text-[15px] select-none">chevron_right</span></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

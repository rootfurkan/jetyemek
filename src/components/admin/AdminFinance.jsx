import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useToast } from '../../common/components/Toast.jsx';

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;
}

function getOrderDate(order) {
  return new Date(order.createdAt || order.date || 0);
}

function getMainProductName(name) {
  return String(name || 'Ürün').replace(/\s*\([^)]*\)\s*$/u, '').trim() || 'Ürün';
}

function isCancelled(order) {
  return order.deliveryStatus === 'cancelled' || order.status === 'İptal Edildi' || order.status === 'Iptal Edildi';
}

function getFinanceStatus(order) {
  if (isCancelled(order)) return 'İptal';
  if (order.deliveryStatus === 'delivered') return 'Başarılı';
  return 'Beklemede';
}

function getPeriodStart(period) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);

  if (period === 'Today') return date;
  if (period === 'Last7') {
    date.setDate(date.getDate() - 6);
    return date;
  }

  date.setDate(date.getDate() - 29);
  return date;
}

export default function AdminFinance() {
  const addToast = useToast();
  const [selectedPeriod, setSelectedPeriod] = useState('Last30');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const currentUser = useSelector((state) => state.auth.currentUser);
  const orders = useSelector((state) => state.orders.platformOrders);
  const restaurants = useSelector((state) => state.restaurants.list);
  const baseCommission = useSelector((state) => state.finance.baseCommission);

  const restaurantId = currentUser?.restaurantId;
  const restaurant = restaurants.find((item) => item.id === restaurantId);
  const commissionRate = Number(restaurant?.commission ?? baseCommission ?? 12);

  const periodStart = getPeriodStart(selectedPeriod);

  const restaurantOrders = useMemo(() => (
    orders
      .filter((order) => !restaurantId || order.restaurantId === restaurantId)
      .sort((a, b) => getOrderDate(b) - getOrderDate(a))
  ), [orders, restaurantId]);

  const periodOrders = restaurantOrders.filter((order) => getOrderDate(order) >= periodStart);
  const paidOrders = periodOrders.filter((order) => !isCancelled(order));

  const grossRevenue = paidOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const commissionTotal = grossRevenue * (commissionRate / 100);
  const netRevenue = grossRevenue - commissionTotal;
  const orderCount = paidOrders.length;
  const averageBasket = orderCount ? grossRevenue / orderCount : 0;

  const statCards = [
    {
      title: 'Toplam Ciro',
      value: formatPrice(grossRevenue),
      change: `${orderCount} sipariş`,
      icon: 'payments',
      color: 'primary',
      progressWidth: '100%',
    },
    {
      title: 'Net Kazanç',
      subtitle: `(%${commissionRate} komisyon sonrası)`,
      value: formatPrice(netRevenue),
      change: `Komisyon: ${formatPrice(commissionTotal)}`,
      icon: 'account_balance_wallet',
      color: 'tertiary',
      progressWidth: `${grossRevenue ? Math.max(8, (netRevenue / grossRevenue) * 100) : 0}%`,
    },
    {
      title: 'Toplam Sipariş',
      value: String(orderCount),
      change: `${periodOrders.length - paidOrders.length} iptal`,
      icon: 'shopping_bag',
      color: 'secondary',
      progressWidth: `${Math.min(100, orderCount * 12)}%`,
    },
    {
      title: 'Ortalama Sepet',
      value: formatPrice(averageBasket),
      change: restaurant?.name || 'Restoran',
      icon: 'analytics',
      color: 'stone',
      progressWidth: `${Math.min(100, averageBasket / 5)}%`,
    },
  ];

  const chartDayCount = selectedPeriod === 'Today' ? 1 : selectedPeriod === 'Last7' ? 7 : 30;
  const chartDays = Array.from({ length: chartDayCount }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (chartDayCount - 1 - index));

    const dayOrders = paidOrders.filter((order) => getOrderDate(order).toDateString() === date.toDateString());
    const gross = dayOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
    const net = gross - gross * (commissionRate / 100);

    return {
      label: date.toLocaleDateString('tr-TR', { day: '2-digit', month: 'short' }),
      gross,
      net,
    };
  });

  const maxChartValue = Math.max(...chartDays.map((day) => day.gross), 1);
  const chartPoints = chartDays.map((day, index) => {
    const x = chartDays.length === 1 ? 400 : (index / (chartDays.length - 1)) * 760 + 20;
    const y = 190 - (day.gross / maxChartValue) * 150;
    return `${x},${y}`;
  }).join(' ');
  const netPoints = chartDays.map((day, index) => {
    const x = chartDays.length === 1 ? 400 : (index / (chartDays.length - 1)) * 760 + 20;
    const y = 190 - (day.net / maxChartValue) * 150;
    return `${x},${y}`;
  }).join(' ');

  const statusCounts = {
    delivered: periodOrders.filter((order) => order.deliveryStatus === 'delivered').length,
    pending: periodOrders.filter((order) => !['delivered', 'cancelled'].includes(order.deliveryStatus)).length,
    cancelled: periodOrders.filter(isCancelled).length,
  };
  const statusTotal = Math.max(periodOrders.length, 1);
  const deliveredPercent = Math.round((statusCounts.delivered / statusTotal) * 100);
  const pendingPercent = Math.round((statusCounts.pending / statusTotal) * 100);
  const cancelledPercent = Math.max(0, 100 - deliveredPercent - pendingPercent);

  const productRevenue = {};
  paidOrders.forEach((order) => {
    (order.items || []).forEach((item) => {
      const key = getMainProductName(item.name);
      const revenue = (Number(item.price) || 0) * (Number(item.qty || item.quantity) || 1);
      productRevenue[key] = (productRevenue[key] || 0) + revenue;
    });
  });

  const topProducts = Object.entries(productRevenue)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);
  const maxProductRevenue = Math.max(...topProducts.map((item) => item.revenue), 1);

  const transactions = periodOrders.map((order) => {
    const amount = Number(order.total) || 0;
    const commission = isCancelled(order) ? 0 : amount * (commissionRate / 100);
    return {
      id: order.id,
      date: getOrderDate(order).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      amount,
      commission,
      payout: amount - commission,
      status: getFinanceStatus(order),
    };
  });

  const filteredTransactions = transactions.filter((tx) =>
    String(tx.id).toLowerCase().includes(searchQuery.toLowerCase())
  );
  const itemsPerPage = 7;
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice(
    (safePage - 1) * itemsPerPage,
    safePage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">Finans ve Raporlar</h2>
          <p className="text-stone-500 text-sm mt-1">Siparişlerden hesaplanan ciro, komisyon ve ürün performansı.</p>
        </div>

        <div className="flex flex-wrap bg-white rounded-full p-1 border border-stone-200 shadow-sm items-center gap-1 self-stretch sm:self-auto">
          {[
            { id: 'Today', label: 'Bugün' },
            { id: 'Last7', label: 'Son 7 Gün' },
            { id: 'Last30', label: 'Son 30 Gün' },
          ].map((period) => (
            <button
              key={period.id}
              onClick={() => {
                setSelectedPeriod(period.id);
                setCurrentPage(1);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedPeriod === period.id ? 'bg-primary text-white shadow-sm' : 'text-stone-500 hover:text-primary'
              }`}
            >
              {period.label}
            </button>
          ))}

        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="bg-white p-5 rounded-[24px] shadow-soft border border-stone-100 flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer hover:border-primary/25"
          >
            <div className="flex justify-between items-start mb-3">
              <div className="p-2.5 bg-rose-50 text-primary rounded-xl">
                <span className="material-symbols-outlined text-[20px]">{card.icon}</span>
              </div>

              <div className="flex items-center gap-0.5 text-xs font-bold text-green-600">
                <span className="material-symbols-outlined text-[15px]">trending_up</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 lg:col-span-2 flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
            <div>
              <h4 className="text-base font-extrabold text-stone-800">Ciro Gelişim Grafiği</h4>
              <p className="text-stone-400 text-xs font-semibold">Seçili dönemdeki günlük brüt ve net gelir.</p>
            </div>

            <div className="flex gap-4 items-center self-end sm:self-auto">
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600">
                <span className="w-3 h-3 rounded-full bg-primary inline-block"></span>
                Ciro
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600">
                <span className="w-3.5 h-[3px] rounded bg-amber-500 inline-block"></span>
                Net
              </div>
            </div>
          </div>

          <div className="relative w-full h-[220px] bg-rose-50/20 rounded-2xl border border-stone-100 overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 800 220" preserveAspectRatio="none">
              <line x1="0" y1="55" x2="800" y2="55" stroke="#f1e5e2" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="0" y1="110" x2="800" y2="110" stroke="#f1e5e2" strokeWidth="1" strokeDasharray="5 5" />
              <line x1="0" y1="165" x2="800" y2="165" stroke="#f1e5e2" strokeWidth="1" strokeDasharray="5 5" />
              <polyline points={chartPoints} fill="none" stroke="#b51c00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points={netPoints} fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

            <div className="absolute top-4 right-4 bg-stone-900 text-white rounded-xl px-3 py-1.5 shadow-md border border-stone-800">
              <span className="block text-[9px] font-bold text-stone-400">Dönem Cirosu</span>
              <span className="text-xs font-black text-rose-300">{formatPrice(grossRevenue)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-stone-400 uppercase tracking-wider mt-3 px-2">
            <span>{chartDays[0]?.label}</span>
            <span>{chartDays[Math.floor(chartDays.length / 2)]?.label}</span>
            <span>{chartDays[chartDays.length - 1]?.label}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 flex flex-col justify-between">
          <div>
            <h4 className="text-base font-extrabold text-stone-800">Sipariş Statüleri</h4>
            <p className="text-stone-400 text-xs font-semibold mb-6">Tamamlanan, bekleyen ve iptal sipariş dağılımı.</p>
          </div>

          <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
            <div
              className="w-full h-full rounded-full shadow-inner"
              style={{
                background: `conic-gradient(#b51c00 0% ${deliveredPercent}%, #f59e0b ${deliveredPercent}% ${deliveredPercent + pendingPercent}%, #ef4444 ${deliveredPercent + pendingPercent}% 100%)`,
              }}
            ></div>
            <div className="absolute w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-md border border-stone-50">
              <span className="text-2xl font-black text-stone-800">{periodOrders.length}</span>
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">Toplam</span>
            </div>
          </div>

          <div className="mt-6 space-y-2 pt-2 border-t border-stone-50">
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary inline-block"></span>Tamamlanan</div>
              <span className="text-stone-800">{statusCounts.delivered} ({deliveredPercent}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span>Beklemede/Yolda</div>
              <span className="text-stone-800">{statusCounts.pending} ({pendingPercent}%)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-bold text-stone-600">
              <div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block"></span>İptal</div>
              <span className="text-stone-800">{statusCounts.cancelled} ({cancelledPercent}%)</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 lg:col-span-5 h-[520px] flex flex-col justify-between overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-base font-extrabold text-stone-800">En Çok Satan Ürünler</h4>
            <button
              onClick={() => addToast({ message: 'Liste sipariş kalemlerinden hesaplanıyor.', type: 'info' })}
              className="text-primary hover:text-primary-container text-xs font-bold hover:underline"
            >
              Detay
            </button>
          </div>

          <div className="space-y-4 flex-grow flex flex-col justify-around overflow-y-auto pr-1">
            {topProducts.length === 0 ? (
              <p className="text-stone-400 text-sm font-semibold">Bu dönemde ürün satışı yok.</p>
            ) : (
              topProducts.map((prod) => (
                <div key={prod.name} className="group cursor-pointer">
                  <div className="flex justify-between text-xs font-bold text-stone-700 mb-1.5">
                    <span className="group-hover:text-primary transition-colors text-stone-800">{prod.name}</span>
                    <span className="text-primary font-black">{formatPrice(prod.revenue)}</span>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary group-hover:bg-primary-container transition-all rounded-full"
                      style={{ width: `${Math.max(8, (prod.revenue / maxProductRevenue) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-[28px] shadow-soft border border-stone-100 overflow-hidden lg:col-span-7 h-[520px] flex flex-col justify-between">
          <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h4 className="text-base font-extrabold text-stone-800">Son Hesap Hareketleri</h4>
            <div className="relative max-w-xs w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Sipariş No Ara..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 focus:border-rose-200 focus:bg-white rounded-xl text-xs font-bold focus:ring-4 focus:ring-primary/5 w-full focus:outline-none text-stone-700 placeholder-stone-400 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50/50 border-b border-stone-100">
                  <th className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tarih</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Sipariş No</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Tutar</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Komisyon</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Net Hakediş</th>
                  <th className="px-6 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Statü</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-stone-400 font-semibold">Sipariş bulunamadı.</td>
                  </tr>
                ) : (
                  paginatedTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-stone-50/30 transition-colors">
                      <td className="px-6 py-3.5 text-stone-400 whitespace-nowrap">{tx.date}</td>
                      <td className="px-4 py-3.5 font-bold text-stone-800">{tx.id}</td>
                      <td className="px-4 py-3.5">{formatPrice(tx.amount)}</td>
                      <td className="px-4 py-3.5 text-primary">-{formatPrice(tx.commission)}</td>
                      <td className="px-4 py-3.5 font-extrabold text-stone-800">{formatPrice(tx.payout)}</td>
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

          <div className="p-4 bg-stone-50/50 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[11px] font-bold text-stone-400">
            <span>
              {filteredTransactions.length === 0
                ? '0 işlem gösteriliyor'
                : `${(safePage - 1) * itemsPerPage + 1}-${Math.min(safePage * itemsPerPage, filteredTransactions.length)} / ${filteredTransactions.length} işlem gösteriliyor`}
            </span>
            <div className="flex items-center gap-3">
              <span>Komisyon oranı: %{commissionRate}</span>
              {filteredTransactions.length > itemsPerPage && (
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                    disabled={safePage === 1}
                    className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Önceki sayfa"
                  >
                    <span className="material-symbols-outlined text-[15px] select-none">chevron_left</span>
                  </button>
                  <span className="px-2 text-stone-500">{safePage}/{totalPages}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                    disabled={safePage === totalPages}
                    className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Sonraki sayfa"
                  >
                    <span className="material-symbols-outlined text-[15px] select-none">chevron_right</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

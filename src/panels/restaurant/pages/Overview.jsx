import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function formatPrice(value) {
  return `${Number(value || 0).toLocaleString('tr-TR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;
}

function isSameLocalDay(dateValue, selectedDate) {
  if (!dateValue) return false;
  const date = new Date(dateValue);
  return date.toLocaleDateString('tr-TR') === selectedDate.toLocaleDateString('tr-TR');
}

function isCancelledOrder(order) {
  return order.deliveryStatus === 'cancelled' || order.status === 'İptal Edildi';
}

function getOrderItemsText(order) {
  if (!Array.isArray(order.items) || order.items.length === 0) return order.itemsSummary || 'Urun bilgisi yok';

  return order.items
    .map((item) => `${item.name} x${item.qty || item.quantity || 1}`)
    .join(', ');
}

function getOrderStatusLabel(order) {
  if (order.deliveryStatus === 'ready') return 'Siparis hazir';
  if (order.deliveryStatus === 'on_the_way') return 'Kurye yolda';
  if (order.deliveryStatus === 'delivered') return 'Teslim edildi';
  return order.status || 'Hazirlaniyor';
}

function getOrderStatusClass(order) {
  if (order.deliveryStatus === 'ready') return 'text-green-600';
  if (order.deliveryStatus === 'on_the_way') return 'text-blue-600';
  if (order.deliveryStatus === 'delivered') return 'text-emerald-600';
  return 'text-amber-500';
}

export default function Overview() {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const orders = useSelector((state) => state.orders.platformOrders);
  const restaurants = useSelector((state) => state.restaurants.list);
  const reviews = useSelector((state) => state.reviews.list);
  const baseCommission = useSelector((state) => state.finance.baseCommission);

  const restaurantId = currentUser?.restaurantId;
  const currentRestaurant = restaurants.find((restaurant) => restaurant.id === restaurantId);
  const commissionRate = Number(currentRestaurant?.commission ?? baseCommission ?? 12);
  const today = new Date();

  const restaurantOrders = orders.filter((order) => (
    (!restaurantId || order.restaurantId === restaurantId) &&
    !isCancelledOrder(order)
  ));

  const todaysOrders = restaurantOrders.filter((order) => isSameLocalDay(order.createdAt, today));
  const activeOrders = restaurantOrders.filter((order) => order.deliveryStatus !== 'delivered');
  const grossRevenue = todaysOrders.reduce((total, order) => total + (Number(order.total) || 0), 0);
  const platformCommission = grossRevenue * (commissionRate / 100);
  const netRevenue = grossRevenue - platformCommission;

  const restaurantReviews = reviews.filter((review) => !restaurantId || review.restaurantId === restaurantId);
  const ratingFromReviews = restaurantReviews.length
    ? restaurantReviews.reduce((total, review) => total + (Number(review.rating) || 0), 0) / restaurantReviews.length
    : null;
  const restaurantRating = ratingFromReviews ?? Number(currentRestaurant?.rating) ?? 0;

  const latestOrders = [...restaurantOrders]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 3);

  const weeklySales = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));
    const total = restaurantOrders
      .filter((order) => isSameLocalDay(order.createdAt, date))
      .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

    return {
      label: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
      title: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' }),
      total,
    };
  });
  const maxWeeklySales = Math.max(...weeklySales.map((day) => day.total), 1);

  const overviewStats = [
    {
      title: 'Bugunun Cirosu',
      value: formatPrice(netRevenue),
      change: `Platform komisyonu: ${formatPrice(platformCommission)}`,
      icon: 'payments',
      gradient: 'from-primary to-secondary text-white',
    },
    {
      title: 'Aktif Siparisler',
      value: String(activeOrders.length),
      change: activeOrders.length > 0 ? 'Hazirlanacak aktif siparis var' : 'Aktif siparis yok',
      icon: 'notifications_active',
      gradient: 'bg-stone-100 border border-stone-200/50 text-stone-800',
    },
    {
      title: 'Magaza Puani',
      value: restaurantRating.toFixed(1),
      change: restaurantReviews.length > 0
        ? `${restaurantReviews.length} yorumdan hesaplandi`
        : 'Restoran bilgisinden alindi',
      icon: 'star',
      gradient: 'bg-stone-100 border border-stone-200/50 text-stone-800',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {overviewStats.map((card) => (
          <div
            key={card.title}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 space-y-5">
          <div className="flex justify-between items-center border-b border-stone-50 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-stone-800">Siparis Akisi</h3>
              <p className="text-stone-400 text-xs font-semibold mt-0.5">En yeni 3 siparisin ozeti</p>
            </div>
            <button
              onClick={() => navigate('/restaurant/orders')}
              className="text-primary hover:text-primary-container text-xs font-bold border-none bg-transparent cursor-pointer"
            >
              Tum Siparisleri Gor
            </button>
          </div>

          <div className="space-y-4">
            {latestOrders.length === 0 ? (
              <div className="bg-stone-50/50 border border-stone-200/45 p-6 rounded-2xl text-center">
                <p className="text-sm font-bold text-stone-600">Henuz siparis yok</p>
                <p className="text-xs text-stone-400 mt-1">Yeni siparisler geldiginde burada listelenecek.</p>
              </div>
            ) : (
              latestOrders.map((order, index) => (
                <div
                  key={order.id}
                  className="bg-stone-50/50 hover:bg-stone-50 border border-stone-200/45 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all hover:border-primary/10"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-12 h-12 border rounded-xl flex items-center justify-center font-black text-sm shadow-sm ${
                      index === 0 ? 'bg-rose-50 border-rose-100 text-primary' : 'bg-amber-50 border-amber-100 text-amber-600'
                    }`}>
                      #{String(order.id).slice(-3)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-stone-800 text-sm truncate">
                        {order.customerName || order.customer || 'Musteri'}
                      </h4>
                      <p className="text-stone-500 text-xs font-semibold mt-0.5 line-clamp-1">{getOrderItemsText(order)}</p>
                      <p className="text-primary text-xs font-black mt-1">{formatPrice(order.total)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                    <span className={`text-xs font-bold flex items-center gap-1 ${getOrderStatusClass(order)}`}>
                      <span className="material-symbols-outlined text-[15px]">timer</span>
                      {getOrderStatusLabel(order)}
                    </span>
                    <button
                      onClick={() => navigate('/restaurant/orders')}
                      className="bg-primary hover:bg-primary-container text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-sm border-none cursor-pointer"
                    >
                      Yonet
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Haftalik Satislar</h4>
            <p className="text-stone-500 text-xs font-semibold mt-1">Son 7 gunluk gercek siparis toplami</p>
          </div>

          <div className="h-28 flex items-end gap-2.5 w-full mt-6">
            {weeklySales.map((day, index) => {
              const height = Math.max(8, Math.round((day.total / maxWeeklySales) * 100));

              return (
                <div
                  key={`${day.title}-${index}`}
                  className={`flex-1 rounded-t-lg transition-all ${
                    day.total > 0 ? 'bg-primary shadow-sm shadow-primary/20' : 'bg-stone-300'
                  }`}
                  style={{ height: `${height}%` }}
                  title={`${day.title}: ${formatPrice(day.total)}`}
                />
              );
            })}
          </div>

          <div className="flex justify-between mt-2.5 text-[9px] text-stone-400 font-bold uppercase tracking-wider">
            {weeklySales.map((day, index) => (
              <span key={`${day.label}-${index}`}>{day.label}</span>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-stone-100 space-y-2">
            {weeklySales.map((day, index) => (
              <div key={`${day.title}-amount-${index}`} className="flex justify-between text-[11px] font-bold">
                <span className="text-stone-400">{day.title}</span>
                <span className="text-stone-700">{formatPrice(day.total)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

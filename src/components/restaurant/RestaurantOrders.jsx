import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../common/components/Toast.jsx';
import { updatePlatformOrderStatus } from '../../features/orders/ordersSlice.js';
import { updateOrder } from '../../services/api.js';

// Siparişin restoran panelindeki durumunu belirler.
function getPanelStatus(order) {
  if (order.deliveryStatus === 'new' || order.deliveryStatus === 'pending') return 'New';
  if (order.deliveryStatus === 'ready') return 'Ready';
  if (order.deliveryStatus === 'on_the_way') return 'OnTheWay';
  if (order.deliveryStatus === 'delivered') return 'Delivered';
  if (order.status === 'Sipariş Hazır') return 'Ready';
  if (order.status === 'Kurye Yola Çıktı') return 'OnTheWay';
  return 'Preparing';
}

// Sipariş durumunu ekranda okunur metne çevirir.
function getStatusLabel(status) {
  if (status === 'New') return 'Yeni Sipariş';
  if (status === 'Ready') return 'Teslimata Hazır';
  if (status === 'OnTheWay') return 'Kurye Yolda';
  if (status === 'Delivered') return 'Teslim Edildi';
  return 'Hazırlanıyor';
}

// Siparişin kaç dakika önce geldiğini hesaplar.
function getTimeText(createdAt) {
  if (!createdAt) return 'Şimdi';
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
  if (minutes < 1) return 'Şimdi';
  if (minutes < 60) return `${minutes} dk önce`;
  return `${Math.floor(minutes / 60)} sa ${minutes % 60} dk önce`;
}

// Tutarı TL formatında gösterir.
function formatPrice(value) {
  return `${Number(value || 0).toFixed(2)} TL`;
}

// Restoranın canlı sipariş ekranını yönetir.
export default function RestaurantOrders() {
  const addToast = useToast();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.currentUser);
  const userRole = useSelector((state) => state.auth.userRole);
  const platformOrders = useSelector((state) => state.orders.platformOrders);
  const [activeTab, setActiveTab] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const orders = useMemo(() => {
    const restaurantId = currentUser?.restaurantId;

    return platformOrders
      .filter((order) => {
        const belongsToRestaurant =
          userRole !== 'restaurant' || !restaurantId || order.restaurantId === restaurantId;
        const isLive =
          order.deliveryStatus !== 'cancelled' &&
          order.status !== 'İptal Edildi';

        return belongsToRestaurant && isLive;
      })
      .map((order) => ({
        id: order.id,
        customer: order.customerName || order.customer || 'Müşteri',
        amount: Number(order.total || order.amount || 0),
        status: getPanelStatus(order),
        time: getTimeText(order.createdAt),
        items: Array.isArray(order.items) ? order.items : [],
        address: order.address || 'Adres belirtilmedi',
        paymentMethod: order.paymentMethod || 'Ödeme bilgisi yok',
        notes: order.notes || order.orderNote || '',
      }));
  }, [currentUser?.restaurantId, platformOrders, userRole]);

  // Sipariş durumunu db.json ve Redux üzerinde günceller.
  const updateStatus = async (orderId, data, message) => {
    try {
      const updatedOrder = await updateOrder(orderId, data);
      dispatch(updatePlatformOrderStatus({
        id: orderId,
        status: updatedOrder.status,
        deliveryStatus: updatedOrder.deliveryStatus,
        progress: updatedOrder.progress,
      }));
      addToast({ message, type: 'success' });
    } catch (error) {
      console.error('Sipariş güncellenirken hata:', error);
      addToast({ message: 'Sipariş güncellenirken hata oluştu.', type: 'error' });
    }
  };

  // Yeni siparişi hazırlama aşamasına alır.
  const handleAcceptNewOrder = (orderId) => {
    updateStatus(
      orderId,
      { status: 'Hazırlanıyor', deliveryStatus: 'preparing', progress: 10 },
      'Sipariş mutfağa alındı.'
    );
  };

  // Siparişi kurye bekliyor durumuna geçirir.
  const handleMarkAsReady = (orderId) => {
    updateStatus(
      orderId,
      { status: 'Sipariş Hazır', deliveryStatus: 'ready', progress: 35 },
      'Sipariş hazır olarak işaretlendi.'
    );
  };

  // Siparişi kuryeye verildi durumuna taşır.
  const handleHandToCourier = (orderId) => {
    updateStatus(
      orderId,
      { status: 'Kurye Yola Çıktı', deliveryStatus: 'on_the_way', progress: 55 },
      'Sipariş kuryeye teslim edildi.'
    );
  };

  // Siparişi iptal eder.
  const handleCancelOrder = (orderId) => {
    updateStatus(
      orderId,
      { status: 'İptal Edildi', deliveryStatus: 'cancelled', progress: 0 },
      'Sipariş iptal edildi.'
    );
  };

  // Siparişi teslim edildi olarak kapatır.
  const handleDeliveredOrder = (orderId) => {
    updateStatus(
      orderId,
      { status: 'Teslim Edildi', deliveryStatus: 'delivered', progress: 100 },
      'Sipariş teslim edildi olarak işaretlendi.'
    );
  };

  const stats = {
    all: orders.length,
    new: orders.filter((order) => order.status === 'New').length,
    preparing: orders.filter((order) => order.status === 'Preparing').length,
    ready: orders.filter((order) => order.status === 'Ready' || order.status === 'OnTheWay').length,
    delivered: orders.filter((order) => order.status === 'Delivered').length,
  };

  const filteredOrders = orders.filter((order) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Ready') return order.status === 'Ready' || order.status === 'OnTheWay';
    return order.status === activeTab;
  });

  const filterButtons = [
    { id: 'All', label: 'Tümü', count: stats.all },
    { id: 'New', label: 'Yeni', count: stats.new },
    { id: 'Preparing', label: 'Hazırlanıyor', count: stats.preparing },
    { id: 'Ready', label: 'Hazır', count: stats.ready },
    { id: 'Delivered', label: 'Teslim', count: stats.delivered },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight flex items-center gap-2">
            Canlı Siparişler
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
            </span>
          </h2>
          <p className="text-stone-500 text-sm mt-1">
            db.json içindeki gerçek siparişleri buradan takip edip durumlarını güncelleyebilirsiniz.
          </p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {filterButtons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveTab(button.id)}
              className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 min-w-[90px] border-2 transition-all cursor-pointer ${
                activeTab === button.id
                  ? 'border-primary bg-primary/5 text-primary shadow-sm font-bold'
                  : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600'
              }`}
            >
              <span className="text-lg font-black">{button.count}</span>
              <span className="text-[10px] tracking-wider uppercase font-semibold">{button.label}</span>
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-stone-100 rounded-[24px] p-16 text-center shadow-soft flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4 text-stone-400">
            <span className="material-symbols-outlined text-[32px]">checklist</span>
          </div>
          <h3 className="text-lg font-bold text-stone-700">Aktif Sipariş Yok</h3>
          <p className="text-stone-400 text-xs mt-1 max-w-sm">
            Seçili filtreye uygun canlı sipariş bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders.map((order) => {
            const isExpanded = expandedOrderId === order.id;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-[24px] shadow-soft border-2 transition-all overflow-hidden flex flex-col cursor-pointer ${
                  order.status === 'New'
                    ? 'border-primary/30 shadow-primary/5 ring-4 ring-primary/5'
                    : 'border-stone-100 hover:border-stone-200'
                }`}
                onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
              >
                <div className="p-5 border-b border-stone-100 flex justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        order.status === 'New'
                          ? 'bg-primary text-white animate-pulse'
                          : order.status === 'Preparing'
                          ? 'bg-amber-500 text-white'
                          : order.status === 'OnTheWay'
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-600 text-white'
                      }`}>
                        {getStatusLabel(order.status)}
                      </span>
                      <span className="text-stone-400 font-bold text-xs">#{order.id}</span>
                    </div>
                    <h3 className="font-extrabold text-stone-800 text-base">{order.customer}</h3>
                    <p className="text-[11px] text-stone-400 font-semibold mt-1">{order.paymentMethod}</p>
                  </div>

                  <div className="text-right">
                    <div className="text-primary font-black text-lg">{formatPrice(order.amount)}</div>
                    <div className="flex items-center gap-1 justify-end text-stone-500 text-xs font-semibold mt-1">
                      <span className="material-symbols-outlined text-[14px]">moped</span>
                      Adrese Teslim
                    </div>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <ul className="space-y-2.5">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex flex-col gap-1.5 text-sm text-stone-700">
                        <div className="flex justify-between items-start gap-3">
                          <span className="font-bold leading-tight">
                            {item.qty}x <span className="font-semibold text-stone-800">{item.name}</span>
                          </span>
                          <span className="text-stone-500 font-medium whitespace-nowrap">
                            {formatPrice((Number(item.qty) || 0) * (Number(item.price) || 0))}
                          </span>
                        </div>
                        {item.note && (
                          <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/50 font-medium w-fit shadow-sm">
                            <span className="font-bold mr-1">Not:</span> {item.note}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>

                  {isExpanded && (
                    <div className="mt-5 pt-4 border-t border-dashed border-stone-100 space-y-4 animate-fade-in">
                      <div>
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Teslimat Adresi</p>
                        <p className="text-stone-700 text-xs font-medium leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                          {order.address}
                        </p>
                      </div>

                      {order.notes && (
                        <div>
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Sipariş Notu</p>
                          <p className="text-primary text-xs font-bold italic bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                            "{order.notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="text-center mt-4">
                    <span className="text-[11px] text-stone-400 font-bold hover:text-primary transition-colors flex items-center justify-center gap-1">
                      {isExpanded ? 'Detayları Gizle' : 'Detayları ve Adresi Gör'}
                      <span className="material-symbols-outlined text-[16px]">
                        {isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-stone-50/60 border-t border-stone-100/80 rounded-b-[22px]">
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[18px] ${
                        order.status === 'New' ? 'text-primary animate-pulse' : 'text-stone-500'
                      }`}>
                        timer
                      </span>
                      <span className={`text-xs font-bold ${
                        order.status === 'New' ? 'text-primary' : 'text-stone-600'
                      }`}>
                        {order.time}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToast({ message: `Sipariş #${order.id} mutfak fişi yazdırılıyor...`, type: 'info' });
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors bg-white border border-stone-200/50 rounded-lg shadow-sm"
                      title="Yazdır"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                    </button>
                  </div>

                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {order.status === 'New' && (
                      <>
                        <button
                          onClick={() => handleAcceptNewOrder(order.id)}
                          className="flex-1 bg-primary hover:bg-primary-container text-white text-xs font-extrabold h-10 rounded-xl transition-all shadow-sm uppercase cursor-pointer"
                        >
                          Onayla
                        </button>
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-3 text-stone-400 hover:text-primary hover:bg-stone-100 border border-stone-200 rounded-xl h-10 transition-colors cursor-pointer"
                          title="Siparişi İptal Et"
                        >
                          <span className="material-symbols-outlined text-[18px]">cancel</span>
                        </button>
                      </>
                    )}

                    {order.status === 'Preparing' && (
                      <button
                        onClick={() => handleMarkAsReady(order.id)}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold h-10 rounded-xl transition-all shadow-sm uppercase cursor-pointer"
                      >
                        Sipariş Hazır
                      </button>
                    )}

                    {order.status === 'Ready' && (
                      <button
                        onClick={() => handleHandToCourier(order.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold h-10 rounded-xl transition-all shadow-sm uppercase cursor-pointer"
                      >
                        Kuryeye Teslim Et
                      </button>
                    )}

                    {order.status === 'OnTheWay' && (
                      <button
                        onClick={() => handleDeliveredOrder(order.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold h-10 rounded-xl transition-all shadow-sm uppercase cursor-pointer"
                      >
                        Teslim Edildi
                      </button>
                    )}

                    {order.status === 'Delivered' && (
                      <div className="w-full bg-emerald-50 text-emerald-700 text-xs font-extrabold h-10 rounded-xl flex items-center justify-center uppercase">
                        Teslim Edildi
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

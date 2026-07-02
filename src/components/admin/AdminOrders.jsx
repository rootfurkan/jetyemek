import React, { useState, useEffect } from 'react';
import { useToast } from '../../common/components/Toast.jsx';

export default function AdminOrders() {
  const addToast = useToast();
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'New' | 'Preparing' | 'Ready'
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // High fidelity Live Orders state
  const [orders, setOrders] = useState([
    {
      id: 'ORD-8921',
      customer: 'Caner Yıldırım',
      amount: 412.50,
      type: 'Delivery',
      status: 'New',
      time: '02:45',
      items: [
        { name: 'Double Smash Burger', qty: 2, price: 145 },
        { name: 'Truffle Fries', qty: 1, price: 75 },
        { name: 'Cola Zero (330ml)', qty: 1, price: 47.5 }
      ],
      address: 'Levent, Büyükdere Cd. No:199, Wyndham Grand, Kat:4',
      notes: 'Burgerler soğansız olsun lütfen. Köfteler orta-iyi pişsin.'
    },
    {
      id: 'ORD-8918',
      customer: 'Zeynep Özdemir',
      amount: 185.00,
      type: 'Pickup',
      status: 'Preparing',
      time: '12:15',
      items: [
        { name: 'Crispy Chicken Bowl', qty: 1, price: 185 }
      ],
      address: 'Gel-Al Sipariş - Müşteri Yolda',
      notes: 'Soslar ayrı kapta gelsin.'
    },
    {
      id: 'ORD-8910',
      customer: 'Murat Aksoy',
      amount: 624.00,
      type: 'Delivery',
      status: 'Ready',
      time: 'Awaiting Courier',
      items: [
        { name: 'Classic Cheeseburger', qty: 4, price: 130 },
        { name: 'Onion Rings', qty: 2, price: 52 }
      ],
      address: 'Caferağa Mah. Moda Cd. No:82/3 Kadıköy',
      notes: 'Temassız teslimat, kapıya asın.'
    },
    {
      id: 'ORD-8915',
      customer: 'Selin Karaca',
      amount: 234.00,
      type: 'Delivery',
      status: 'Preparing',
      time: '18:45',
      late: true,
      items: [
        { name: 'Vegan Garden Pizza', qty: 1, price: 210 },
        { name: 'Garlic Dip', qty: 1, price: 24 }
      ],
      address: 'Osmanağa Mah. Kırtasiyeci Sk. No:12 D:5 Kadıköy',
      notes: 'Lütfen sıcak gelsin, teşekkürler.'
    }
  ]);

  // Toast notification state
  const [showAlert, setShowAlert] = useState(false);
  const [newOrderAlertData, setNewOrderAlertData] = useState(null);

  useEffect(() => {
    // Simulate a new order incoming after 5 seconds to show energetic realtime capability
    const timer = setTimeout(() => {
      const incomingOrder = {
        id: 'ORD-8930',
        customer: 'Batuhan Şahin',
        amount: 295.00,
        type: 'Delivery',
        status: 'New',
        time: 'Just now',
        items: [
          { name: 'Texas BBQ Burger', qty: 1, price: 230 },
          { name: 'Sweet Potato Fries', qty: 1, price: 65 }
        ],
        address: 'Bostancı Mah. Bağdat Cd. No:410 D:2 Kadıköy',
        notes: 'Lütfen zili çalmayın, bebek uyuyor.'
      };
      
      setNewOrderAlertData(incomingOrder);
      setShowAlert(true);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptNewOrder = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Preparing', time: '0m' } : o));
  };

  const handleMarkAsReady = (orderId) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Ready', time: 'Awaiting Courier' } : o));
  };

  const handleHandToCourier = (orderId) => {
    // In real app, this changes status to On the Way or Completed. Let's make it Completed to clear visual terminal
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleCancelOrder = (orderId) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  const handleAcceptFromAlert = () => {
    if (newOrderAlertData) {
      setOrders(prev => [newOrderAlertData, ...prev]);
      setShowAlert(false);
      setActiveTab('New');
    }
  };

  // Stats calculation
  const stats = {
    all: orders.length,
    new: orders.filter(o => o.status === 'New').length,
    preparing: orders.filter(o => o.status === 'Preparing').length,
    ready: orders.filter(o => o.status === 'Ready').length,
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'All') return true;
    return o.status === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Contextual Header & Realtime Pulse */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight flex items-center gap-2">
            Canlı Siparişler
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-primary"></span>
            </span>
          </h2>
          <p className="text-stone-500 text-sm mt-1">Sipariş akışını ve hazırlık süreçlerini buradan anlık olarak yönetin.</p>
        </div>

        {/* Dynamic Navigation Filter Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('All')}
            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 min-w-[90px] border-2 transition-all cursor-pointer ${
              activeTab === 'All' 
                ? 'border-primary bg-primary/5 text-primary shadow-sm font-bold' 
                : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600'
            }`}
          >
            <span className="text-lg font-black">{stats.all}</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold">Tümü</span>
          </button>
          
          <button
            onClick={() => setActiveTab('New')}
            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 min-w-[90px] border-2 transition-all cursor-pointer ${
              activeTab === 'New' 
                ? 'border-primary bg-primary/5 text-primary shadow-sm font-bold' 
                : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600'
            }`}
          >
            <span className="text-lg font-black flex items-center gap-1">
              {stats.new}
              {stats.new > 0 && <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span>}
            </span>
            <span className="text-[10px] tracking-wider uppercase font-semibold">Yeni</span>
          </button>

          <button
            onClick={() => setActiveTab('Preparing')}
            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 min-w-[90px] border-2 transition-all cursor-pointer ${
              activeTab === 'Preparing' 
                ? 'border-primary bg-primary/5 text-primary shadow-sm font-bold' 
                : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600'
            }`}
          >
            <span className="text-lg font-black">{stats.preparing}</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold">Hazırlanıyor</span>
          </button>

          <button
            onClick={() => setActiveTab('Ready')}
            className={`flex flex-col items-center justify-center rounded-2xl px-5 py-2 min-w-[90px] border-2 transition-all cursor-pointer ${
              activeTab === 'Ready' 
                ? 'border-primary bg-primary/5 text-primary shadow-sm font-bold' 
                : 'border-stone-200 bg-white hover:border-stone-300 text-stone-600'
            }`}
          >
            <span className="text-lg font-black">{stats.ready}</span>
            <span className="text-[10px] tracking-wider uppercase font-semibold">Hazır</span>
          </button>
        </div>
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-white border border-stone-100 rounded-[24px] p-16 text-center shadow-soft flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mb-4 text-stone-400">
            <span className="material-symbols-outlined text-[32px]">checklist</span>
          </div>
          <h3 className="text-lg font-bold text-stone-700">Aktif Sipariş Yok</h3>
          <p className="text-stone-400 text-xs mt-1 max-w-sm">
            Şu anda seçtiğiniz filtreye uygun canlı sipariş bulunmamaktadır. Yeni siparişler geldiğinde burada belirecektir.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
                {/* Order Card Header */}
                <div className="p-5 border-b border-stone-100 flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className={`text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                        order.status === 'New' 
                          ? 'bg-primary text-white animate-pulse' 
                          : order.status === 'Preparing' 
                            ? 'bg-amber-500 text-white' 
                            : 'bg-green-600 text-white'
                      }`}>
                        {order.status === 'New' 
                          ? 'YENİ SİPARİŞ' 
                          : order.status === 'Preparing' 
                            ? 'HAZIRLANIYOR' 
                            : 'TESLİMATA HAZIR'
                        }
                      </span>
                      <span className="text-stone-400 font-bold text-xs">#{order.id}</span>
                    </div>
                    <h3 className="font-extrabold text-stone-800 text-base">{order.customer}</h3>
                  </div>

                  <div className="text-right">
                    <div className="text-primary font-black text-lg">{order.amount.toFixed(2)} ₺</div>
                    <div className="flex items-center gap-1 justify-end text-stone-500 text-xs font-semibold mt-1">
                      <span className="material-symbols-outlined text-[14px]">
                        {order.type === 'Delivery' ? 'moped' : 'shopping_bag'}
                      </span>
                      {order.type === 'Delivery' ? 'Adrese Teslim' : 'Gel-Al'}
                    </div>
                  </div>
                </div>

                {/* Items & Expanding Detail Body */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <ul className="space-y-2.5">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="flex justify-between items-center text-sm text-stone-700">
                        <span className="font-bold">
                          {item.qty}x <span className="font-semibold text-stone-800">{item.name}</span>
                        </span>
                        <span className="text-stone-500 font-medium">{(item.qty * item.price).toFixed(2)} ₺</span>
                      </li>
                    ))}
                  </ul>

                  {/* Expanded Information */}
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
                          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Mutfak / Sipariş Notu</p>
                          <p className="text-primary text-xs font-bold italic bg-primary/5 p-2.5 rounded-xl border border-primary/10">
                            "{order.notes}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Toggle view details indicator */}
                  <div className="text-center mt-4">
                    <span className="text-[11px] text-stone-400 font-bold hover:text-primary transition-colors flex items-center justify-center gap-1">
                      {isExpanded ? 'Detayları Gizle' : 'Detayları ve Adresi Gör'}
                      <span className="material-symbols-outlined text-[16px]">
                        {isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Action Buttons Panel */}
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
                        {order.status === 'New' ? `${order.time} Önce` : order.time}
                      </span>
                    </div>

                    {order.late && (
                      <span className="text-[10px] font-extrabold text-white bg-primary px-2 py-0.5 rounded animate-pulse">
                        GECİKTİ
                      </span>
                    )}

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        // Print action mock
                        addToast({ message: `Sipariş #${order.id} mutfak fişi yazdırılıyor...`, type: 'info' });
                      }}
                      className="p-1.5 text-stone-400 hover:text-stone-700 transition-colors bg-white border border-stone-200/50 rounded-lg shadow-sm"
                      title="Yazdır"
                    >
                      <span className="material-symbols-outlined text-[18px]">print</span>
                    </button>
                  </div>

                  {/* Interactive Button Workflows */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {order.status === 'New' && (
                      <>
                        <button
                          onClick={() => handleAcceptNewOrder(order.id)}
                          className="flex-1 bg-primary hover:bg-primary-container text-white text-xs font-extrabold h-10 rounded-xl transition-all shadow-sm uppercase cursor-pointer"
                        >
                          Onayla (Mutfak)
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
                        Sipariş Hazır (Kurye Çağır)
                      </button>
                    )}

                    {order.status === 'Ready' && (
                      <button
                        onClick={() => handleHandToCourier(order.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs font-extrabold h-10 rounded-xl transition-all shadow-sm uppercase cursor-pointer"
                      >
                        Kuryeye Teslim Et (Yola Çıkar)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Animated Realtime Incoming Order Alert Prompt */}
      {showAlert && newOrderAlertData && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary border-4 border-primary-fixed text-white px-5 py-4 rounded-3xl shadow-2xl flex items-center gap-4 animate-slide-up-alert">
          <div className="relative bg-white/20 p-2.5 rounded-2xl">
            <span className="material-symbols-outlined text-2xl animate-bounce">notifications_active</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-primary text-[9px] font-extrabold flex items-center justify-center rounded-full">
              1
            </span>
          </div>

          <div>
            <p className="font-black text-sm tracking-wide">YENİ SİPARİŞ GELDİ!</p>
            <p className="text-xs opacity-90 font-medium mt-0.5">
              {newOrderAlertData.customer} • <span className="font-extrabold">{newOrderAlertData.amount.toFixed(2)} ₺</span>
            </p>
          </div>

          <div className="flex gap-2 ml-4">
            <button 
              onClick={handleAcceptFromAlert}
              className="bg-white text-primary text-xs font-black px-4 py-2 rounded-xl shadow hover:bg-stone-50 active:scale-95 transition-all cursor-pointer"
            >
              Gör ve Onayla
            </button>
            <button 
              onClick={() => setShowAlert(false)}
              className="bg-transparent text-white/80 hover:text-white p-2 hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

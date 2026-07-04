import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRestaurant, deleteRestaurant, toggleRestaurantStatus, updateRestaurantCommission } from '../../features/restaurants/restaurantsSlice.js';
import api from '../../services/api.js';
import { useToast } from '../../common/components/Toast.jsx';

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString('tr-TR')} ₺`;
}

function getOrderDate(order) {
  return new Date(order.createdAt || order.date || 0);
}

function isCancelled(order) {
  return order.deliveryStatus === 'cancelled' || order.status === 'İptal Edildi' || order.status === 'Iptal Edildi';
}

function getOrderStatusText(order) {
  if (isCancelled(order)) return 'İptal Edildi';
  if (order.deliveryStatus === 'delivered') return 'Teslim Edildi';
  if (order.deliveryStatus === 'on_the_way') return 'Yolda';
  if (order.deliveryStatus === 'ready') return 'Hazır';
  return order.status || 'Hazırlanıyor';
}

export default function PlatformAdminDashboard({ onExitAdmin, propActiveTab, hideSidebar }) {
  const addToast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Navigation tabs for Super Admin
  const [localActiveTab, setLocalActiveTab] = useState('overview'); // 'overview' | 'restaurants' | 'users' | 'orders' | 'couriers' | 'campaigns' | 'finance' | 'settings'
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propActiveTab ? () => {} : setLocalActiveTab;

  // Redux'tan restoranları al
  const reduxRestaurants = useSelector((state) => state.restaurants.list);
  const platformOrders = useSelector((state) => state.orders.platformOrders);
  const restaurants = reduxRestaurants;

  // Search queries for various tabs
  const [searchQuery, setSearchQuery] = useState('');
  
  // Platform Load Simulation state
  const [platformLoad, setPlatformLoad] = useState(38);
  const [showLogs, setShowLogs] = useState(false);

  const paidOrders = platformOrders.filter((order) => !isCancelled(order));
  const totalRevenue = paidOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);
  const deliveredOrders = platformOrders.filter((order) => order.deliveryStatus === 'delivered').length;
  const successRate = platformOrders.length ? ((deliveredOrders / platformOrders.length) * 100).toFixed(1) : '0.0';
  const uniqueCustomers = new Set(platformOrders.map((order) => order.userId).filter(Boolean)).size;
  const commissionRevenue = paidOrders.reduce((sum, order) => {
    const restaurant = restaurants.find((item) => item.id === order.restaurantId);
    const commission = Number(restaurant?.commission ?? 12);
    return sum + ((Number(order.total) || 0) * commission / 100);
  }, 0);

  const orders = useMemo(() => (
    [...platformOrders]
      .sort((a, b) => getOrderDate(b) - getOrderDate(a))
      .map((order) => ({
        id: order.id,
        customer: order.customerName || 'Müşteri',
        restaurant: restaurants.find((item) => item.id === order.restaurantId)?.name || order.restaurant || 'Restoran',
        total: Number(order.total) || 0,
        status: getOrderStatusText(order),
        time: getOrderDate(order).toLocaleString('tr-TR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      }))
  ), [platformOrders, restaurants]);

  const topRestaurants = useMemo(() => {
    const salesByRestaurant = {};

    paidOrders.forEach((order) => {
      const id = order.restaurantId || 'unknown';
      if (!salesByRestaurant[id]) {
        const restaurant = restaurants.find((item) => item.id === id);
        salesByRestaurant[id] = {
          id,
          name: restaurant?.name || order.restaurant || 'Restoran',
          image: restaurant?.image || '',
          revenue: 0,
          orderCount: 0,
        };
      }

      salesByRestaurant[id].revenue += Number(order.total) || 0;
      salesByRestaurant[id].orderCount += 1;
    });

    return Object.values(salesByRestaurant)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
  }, [paidOrders, restaurants]);

  const maxRestaurantRevenue = Math.max(...topRestaurants.map((item) => item.revenue), 1);
  const monthlyOrderBars = useMemo(() => {
    const today = new Date();
    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(today.getFullYear(), today.getMonth() - (11 - index), 1);
      const monthOrders = paidOrders.filter((order) => {
        const orderDate = getOrderDate(order);
        return orderDate.getFullYear() === date.getFullYear() && orderDate.getMonth() === date.getMonth();
      });
      const revenue = monthOrders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

      return {
        label: date.toLocaleDateString('tr-TR', { month: 'short' }),
        orderCount: monthOrders.length,
        revenue,
      };
    });
    const maxRevenue = Math.max(...months.map((month) => month.revenue), 1);

    return months.map((month) => ({
      ...month,
      height: Math.max(8, (month.revenue / maxRevenue) * 100),
    }));
  }, [paidOrders]);

  // Core Platform Metrics
  const coreStats = [
    {
      title: 'Toplam Platform Cirosu (GMV)',
      value: formatCurrency(totalRevenue),
      change: `${paidOrders.length} sipariş`,
      isPositive: true,
      icon: 'payments',
      desc: 'Kayıtlı siparişlerden hesaplanan brüt işlem hacmi',
      color: 'primary'
    },
    {
      title: 'Aktif Platform Kullanıcısı',
      value: String(uniqueCustomers),
      change: 'Gerçek veri',
      isPositive: true,
      icon: 'group',
      desc: 'Sipariş veren tekil müşteri sayısı',
      color: 'tertiary'
    },
    {
      title: 'Platform Komisyon Geliri',
      value: formatCurrency(commissionRevenue),
      change: 'Komisyon',
      isPositive: true,
      icon: 'account_balance_wallet',
      desc: 'Restoran komisyon oranlarına göre hesaplandı',
      color: 'secondary'
    },
    {
      title: 'Sipariş Başarı Oranı',
      value: `%${successRate}`,
      change: `${deliveredOrders} teslim`,
      isPositive: true,
      icon: 'bolt',
      desc: 'Teslim edilen siparişlerin toplam siparişe oranı',
      color: 'amber'
    }
  ];

  // System logs mock
  const systemLogs = [
    { time: '16:04:12', type: 'INFO', msg: 'Napoli Antica restoranı menü güncellemesi yaptı.' },
    { time: '15:58:32', type: 'SUCCESS', msg: 'Sipariş #VH-9421 kurye Ahmet Yılmaz tarafından teslim edildi.' },
    { time: '15:42:01', type: 'WARNING', msg: 'Kurye Mehmet Tan teslimat süresi sınırına yaklaşıyor (Sipariş #VH-9420).' },
    { time: '15:30:15', type: 'INFO', msg: 'Yeni kullanıcı kaydı oluşturuldu: can.kaya@gmail.com' },
    { time: '15:15:00', type: 'SYSTEM', msg: 'Platform genel komisyon oranı %12 olarak güncellendi.' }
  ];

  // 1. Restaurant Management Tab State — Redux'a bağlı
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestName, setNewRestName] = useState('');
  const [newRestCategory, setNewRestCategory] = useState('Fast Food');
  const [newRestComm, setNewRestCommission] = useState('12');
  const [newRestCity, setNewRestCity] = useState('Kadıköy, İstanbul');
  const [newRestEmail, setNewRestEmail] = useState('');
  const [newRestPassword, setNewRestPassword] = useState('');

  const handleToggleRestStatus = (id) => {
    dispatch(toggleRestaurantStatus(id));
  };

  const handleUpdateCommission = (id, currentComm) => {
    const newVal = prompt('Yeni komisyon oranını giriniz (%):', currentComm);
    if (newVal && !isNaN(newVal)) {
      dispatch(updateRestaurantCommission({ id, commission: newVal }));
      addToast({ message: 'Komisyon oranı güncellendi.', type: 'success' });
    }
  };

  const handleDeleteRestaurant = (id) => {
    if (window.confirm('Bu restoran ortağını platformdan kalıcı olarak silmek istediğinize emin misiniz?')) {
      dispatch(deleteRestaurant(id));
      addToast({ message: 'Restoran platformdan kaldırıldı.', type: 'success' });
    }
  };

  const handleAddRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!newRestName.trim()) return;
    // Slug ID üret
    const restId = 'rest-' + newRestName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    // Redux'a restoran ekle
    dispatch(addRestaurant({
      id: restId,
      name: newRestName,
      category: newRestCategory,
      commission: parseFloat(newRestComm) || 12,
      status: 'Aktif',
      city: newRestCity,
      rating: '5.0',
    }));
    // Eğer e-posta girilmişse db'ye kullanıcı hesabı da oluştur
    if (newRestEmail.trim()) {
      try {
        await api.post('/users', {
          id: restId + '-user',
          role: 'restaurant',
          email: newRestEmail.trim(),
          password: newRestPassword || 'rest123',
          restaurantId: restId,
          name: newRestName,
          avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U',
        });
      } catch (_) { /* Kullanıcı kaydı başarısız olsa da devam et */ }
    }
    addToast({ message: `"${newRestName}" restoranı platforma eklendi ve müşteri paneline yansıdı!`, type: 'success' });
    setNewRestName('');
    setNewRestEmail('');
    setNewRestPassword('');
    setShowAddRestaurant(false);
  };


  // 2. User Management Tab State
  const [users, setUsers] = useState([
    { id: 1, name: 'Selda Yılmaz', email: 'selda.yilmaz@mail.com', orders: 42, role: 'VIP', joined: '12 Mart 2023', status: 'Aktif', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAgM6BA-zn7U4XOdzmgjUl0KV0eZJC6sCEMc_Zu4WMh4bEX5lVB9sEuDStUJm_SL8p7tx02Oedz4NNymb_Tg9p2Rgb_T_cE8mFSW_1btCJMam5lPCleT0JQK40OU0Uwe8PE1GqT06BEX-MUVdWvk5qiVwWIIyvDHeaeTQ4QRYCfDXfUf3jHCW8Z1CDlN9JiKhr78YDtu10vqbGp9nz5DWQBtq8WfANmO9y9wYzR2Kb4OHIei1CKzJUhaTp1gdbpcbe96FSS447OpC0' },
    { id: 2, name: 'Caner Akın', email: 'caner_akn@webmail.com', orders: 15, role: 'Standart', joined: '04 Ocak 2024', status: 'Aktif', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMhru0Brp4SuzTY1qonVPXP2wZOwfGB5Nf4aui3MNO90aMmTb3Ver2b_4TBM2OKozdcQBhqIPiKUx0XqvZ27Tej51VsEnXpMLAQD95Lrqnk4-1j7RopXAtVkAL82RYtba-F9McjSpCWlahFEZqtXRMLAG52_04eqidpsgJswsgKRCXVF_JRHtps7CwuH_XTPQr9xm-drhUg8VV1Pj0uaS91Y_MIvcFo7UAuhQxHBPjeoMbrNLPSJ9EtyzoW4SCBQi6dKulKq3V8Bk' },
    { id: 3, name: 'Meltem Erden', email: 'mel.erden@social.com', orders: 3, role: 'Yeni', joined: '22 Şubat 2024', status: 'İnaktif', avatar: null },
    { id: 4, name: 'Burak Tandoğan', email: 'btandogan@cloud.net', orders: 122, role: 'ELITE', joined: '15 Ağustos 2022', status: 'Aktif', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA21gTLjCZWjCMbryPV9ZeFysTuJEPOfLBL9oovBEMcBVgJEx2qWrqpmU4Dc_HQ9nmfGKJM-yphQHTeLvJtL5DzAkj5wPN08cQfwERjDvObAygw_vy9Zcg0CmE6EhK3bfWbLl67zgY6qvKW06_gvKK-HlHHvwu9pyedHqztzhqeqjM344FSSW9Jo8_R2BZRpkcJ0oYAqM7G1-RkBwf_PnvmVia70qawF2_5ahcdSOipXeIm95snZHt2b0ysKzX-Rx10enttKjXLTWo' }
  ]);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleToggleUserStatus = (id) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === 'Aktif' ? 'İnaktif' : 'Aktif' } : u));
  };

  const handleDeleteUser = (id) => {
    if (confirm("Bu kullanıcıyı platformdan tamamen silmek istediğinize emin misiniz?")) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };


  const handleUpdateOrderStatus = (id, newStatus) => {
    addToast({ message: `Sipariş ${newStatus.toLowerCase()} olarak işaretlendi.`, type: 'success' });
  };


  // 4. Courier Management State
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    async function loadCouriers() {
      try {
        const response = await api.get('/couriers');
        setCouriers(response.data || []);
      } catch (error) {
        setCouriers([]);
      }
    }

    loadCouriers();
  }, []);

  const [selectedOrderToAssign, setSelectedOrderToAssign] = useState('VH-9420');
  const [selectedCourierToAssign, setSelectedCourierToAssign] = useState('courier-2');

  const activeCouriers = couriers.filter((courier) => courier.status !== 'Çevrimdışı');
  const deliveryCouriers = couriers.filter((courier) => courier.status === 'Teslimatta');
  const availableCouriers = couriers.filter((courier) => courier.status === 'Müsait' || courier.status === 'Beklemede');

  const handleAssignOrder = () => {
    addToast({ message: `Sipariş #${selectedOrderToAssign}, kurye ${couriers.find(c => String(c.id) === String(selectedCourierToAssign))?.name} üzerine başarıyla atandı!`, type: 'success' });
    // update status
    setCouriers(prev => prev.map(c => String(c.id) === String(selectedCourierToAssign) ? { ...c, status: 'Teslimatta' } : c));
  };


  // 5. Campaign & Promotion Management State
  const [promos, setPromos] = useState([
    { code: 'LEZZET25', type: 'Kupon Kodu', rate: '%25', desc: 'Yeni Kullanıcı Kampanyası', usage: '1.240 / 5,000', progress: 25, condition: 'Min. 150 ₺', status: 'Aktif' },
    { code: 'FREEFOOD', type: 'Kampanya', rate: '0 ₺ Kargo', desc: 'Ücretsiz Teslimat', usage: '3.456 / ∞', progress: 65, condition: 'Tüm Restoranlar', status: 'Aktif' },
    { code: 'BAHAR20', type: 'Kupon Kodu', rate: '%20', desc: 'Bahar Sezonu İndirimi', usage: '2,000 / 2,000', progress: 100, condition: 'Min. 150 ₺', status: 'Sona Erdi' }
  ]);

  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignCode, setNewCampaignCode] = useState('');
  const [newCampaignDiscount, setNewCampaignDiscount] = useState('20');
  const [newCampaignMin, setNewCampaignMin] = useState('150');

  const handleLaunchCampaign = (e) => {
    e.preventDefault();
    if (!newCampaignCode.trim()) return;
    const newPromo = {
      code: newCampaignCode.toUpperCase(),
      type: 'Kupon Kodu',
      rate: `%${newCampaignDiscount}`,
      desc: newCampaignName || 'Yeni Lansman Kampanyası',
      usage: '0 / 10,000',
      progress: 0,
      condition: `Min. ${newCampaignMin} ₺`,
      status: 'Aktif'
    };
    setPromos(prev => [newPromo, ...prev]);
    setNewCampaignName('');
    setNewCampaignCode('');
    addToast({ message: `Yeni kampanya ve "${newPromo.code}" kuponu canlı sisteme tanımlandı!`, type: 'success' });
  };


  // 6. Payments and Financial Logs State
  const [financials, setFinancials] = useState([
    { id: '#4592', restaurant: 'Burger House', date: '14 Eki 2023, 14:30', gross: 12450.00, comm: 996.00, net: 11454.00, status: 'Tamamlandı' },
    { id: '#3321', restaurant: 'Sushi Palace', date: '14 Eki 2023, 11:15', gross: 8900.00, comm: 712.00, net: 8188.00, status: 'Beklemede' },
    { id: '#9901', restaurant: 'Pizza King', date: '13 Eki 2023, 19:45', gross: 15200.00, comm: 1216.00, net: 13984.00, status: 'Tamamlandı' },
    { id: '#4122', restaurant: 'Green Farm Salad', date: '13 Eki 2023, 16:05', gross: 4300.00, comm: 344.00, net: 3956.00, status: 'İptal Edildi' }
  ]);

  const [pdfLoading, setPdfLoading] = useState(false);
  const handleDownloadPDF = () => {
    setPdfLoading(true);
    setTimeout(() => {
      setPdfLoading(false);
      addToast({ message: 'Platform mali tablosu PDF raporu başarıyla üretildi ve indirilmeye başlandı.', type: 'success' });
    }, 1500);
  };


  // 7. General Settings State
  const [baseCommission, setBaseCommission] = useState('12');
  const [baseDeliveryFee, setBaseDeliveryFee] = useState('24.90');
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [adminProfileName, setAdminProfileName] = useState('Cansu Yılmaz');
  const [adminEmail, setAdminProfileEmail] = useState('cansu.y@vibranthearth.com');

  const handleSaveSystemSettings = () => {
    addToast({ message: 'Platform genel ayarları ve sistem parametreleri başarıyla güncellendi!', type: 'success' });
  };

  // Helper filters
  const filteredRestaurants = restaurants.filter(r =>
    (r.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (r.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={hideSidebar ? "w-full text-stone-800 bg-stone-50/40" : "min-h-screen bg-stone-50/40 flex text-stone-800 font-sans antialiased"}>
      
      {/* SIDEBAR NAVIGATION */}
      {!hideSidebar && (
        <aside className="w-72 bg-white border-r border-rose-100/10 flex flex-col py-6 px-4 shrink-0 fixed top-0 bottom-0 left-0 z-40 shadow-sm">
        
        {/* Brand Header */}
        <div className="mb-8 px-3 flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-md shadow-primary/10">
            <span className="material-symbols-outlined text-[24px]">fastfood</span>
          </div>
          <div>
            <h1 className="text-lg font-black text-primary leading-tight">CraveDash</h1>
            <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">Platform Admin</p>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
          <button 
            onClick={() => { setActiveTab('overview'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'overview' 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            Genel Bakış
          </button>

          <button 
            onClick={() => { setActiveTab('restaurants'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'restaurants' 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">store</span>
            Restoran Yönetimi
          </button>

          <button 
            onClick={() => { setActiveTab('users'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'users' 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">group</span>
            Müşteri Yönetimi
          </button>

          <button 
            onClick={() => { setActiveTab('orders'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'orders' 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">receipt_long</span>
            Sipariş Yönetimi
          </button>

          <button 
            onClick={() => { setActiveTab('couriers'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'couriers' 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">delivery_dining</span>
            Kurye Yönetimi
          </button>

          <button 
            onClick={() => { setActiveTab('campaigns'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'campaigns' 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">campaign</span>
            Kampanya & Promosyon
          </button>

          <button 
            onClick={() => { setActiveTab('finance'); setSearchQuery(''); }}
            className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
              activeTab === 'finance' 
                ? 'bg-primary text-white shadow-md shadow-primary/10' 
                : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">payments</span>
            Ödeme ve Muhasebe
          </button>

          <div className="pt-4 mt-4 border-t border-stone-100">
            <button 
              onClick={() => { setActiveTab('settings'); setSearchQuery(''); }}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-primary text-white shadow-md shadow-primary/10' 
                  : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">settings</span>
              Sistem Ayarları
            </button>
          </div>
        </nav>

        {/* Bottom Switcher */}
        <div className="mt-auto pt-6 border-t border-stone-100 space-y-4">
          <div className="bg-stone-100/70 p-3.5 rounded-2xl border border-stone-200/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Platform Yükü</span>
              <span className="text-[11px] font-black text-rose-600">%38</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div className="bg-rose-500 h-full transition-all duration-1000" style={{ width: '38%' }}></div>
            </div>
            <button 
              onClick={() => setShowLogs(true)}
              className="mt-3 w-full py-1.5 bg-primary hover:bg-primary-container text-white rounded-xl text-[10px] font-bold uppercase tracking-wide cursor-pointer transition-colors"
            >
              Canlı Sistem Logları
            </button>
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
      )}

      {/* MAIN VIEWPORT */}
      <div className={hideSidebar ? "w-full" : "flex-1 ml-72 p-6 md:p-8 min-h-screen"}>
        
        {/* Dynamic Navigation Top AppBar Utility */}
        <header className="sticky top-0 z-30 mb-8 flex justify-between items-center w-full h-16 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/10">
          <div>
            <h2 className="text-2xl font-black text-stone-800 tracking-tight">
              {activeTab === 'overview' && 'Platform Genel Bakış'}
              {activeTab === 'restaurants' && 'Restoran Ortakları Yönetimi'}
              {activeTab === 'users' && 'Sistem Müşteri Portföyü'}
              {activeTab === 'orders' && 'Genel Sipariş Akışı'}
              {activeTab === 'couriers' && 'Sistem Kurye Yönetimi'}
              {activeTab === 'campaigns' && 'Kampanya & Promosyon Yönetimi'}
              {activeTab === 'finance' && 'Platform Muhasebe & Hak Edişler'}
              {activeTab === 'settings' && 'Platform Genel Ayarları'}
            </h2>
            <p className="text-xs text-stone-400 font-bold tracking-wide mt-0.5 uppercase">
              CraveDash Platform Admin Control Center
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-rose-50 text-primary px-3.5 py-1.5 rounded-full text-xs font-bold border border-rose-100 shadow-sm select-none">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Sistem Durumu: Çevrimiçi
            </div>
          </div>
        </header>

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            
            {/* 4 Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreStats.map((stat, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-5 rounded-[24px] shadow-soft border border-stone-100 flex flex-col justify-between hover:scale-[1.02] transition-all cursor-pointer hover:border-primary/25"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-rose-50 text-primary rounded-xl">
                      <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
                    </div>
                    
                    <div className={`flex items-center gap-0.5 text-xs font-bold ${
                      stat.isPositive ? 'text-green-600' : 'text-primary'
                    }`}>
                      <span className="material-symbols-outlined text-[15px]">
                        {stat.isPositive ? 'trending_up' : 'trending_down'}
                      </span>
                      {stat.change}
                    </div>
                  </div>

                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">{stat.title}</p>
                    <h3 className="text-2xl font-black text-stone-800 tracking-tight mt-1">{stat.value}</h3>
                    <p className="text-[10px] text-stone-400 font-semibold mt-1">{stat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Visual Charts & Category Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Growth Trend Chart */}
              <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 lg:col-span-2 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h4 className="text-base font-extrabold text-stone-800">Platform İşlem Hacmi Trendi (GMV)</h4>
                    <p className="text-stone-400 text-xs font-semibold">Aylık bazda brüt platform satışları ve dönüşüm hacmi</p>
                  </div>
                  <div className="flex gap-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-stone-500">
                      <span className="w-2.5 h-2.5 bg-primary rounded-full inline-block"></span>
                      Sipariş Hacmi
                    </span>
                  </div>
                </div>

                {/* Simulated Growth Chart Bars */}
                <div className="h-56 flex items-end justify-between gap-3 px-2 pt-4">
                  {monthlyOrderBars.map((month, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                      <div className="w-full bg-primary hover:bg-primary-container hover:scale-x-105 transition-all rounded-t-lg relative" style={{ height: `${month.height}%` }}>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20">
                          {month.orderCount} Sipariş / {formatCurrency(month.revenue)}
                        </div>
                      </div>
                      <span className="text-[9px] font-bold text-stone-400 uppercase">
                        {month.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Top Restaurants */}
              <div className="bg-white p-6 rounded-[28px] shadow-soft border border-stone-100 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-stone-800">En Popüler Restoranlar</h4>
                  <p className="text-stone-400 text-xs font-semibold mb-6">En çok satış yapan iş ortakları</p>
                </div>

                <div className="space-y-4">
                  {topRestaurants.length === 0 ? (
                    <p className="text-sm text-stone-400 font-semibold">Henüz satış verisi yok.</p>
                  ) : (
                    topRestaurants.map((restaurant, idx) => (
                      <div key={restaurant.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-stone-50 border border-stone-100 rounded-xl overflow-hidden flex items-center justify-center text-stone-400">
                          {restaurant.image ? (
                            <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="material-symbols-outlined text-[20px]">storefront</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between gap-2 text-xs font-bold text-stone-700 mb-1">
                            <span className="truncate">{idx + 1}. {restaurant.name}</span>
                            <span>{formatCurrency(restaurant.revenue)}</span>
                          </div>
                          <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${Math.max(8, (restaurant.revenue / maxRestaurantRevenue) * 100)}%` }}></div>
                          </div>
                          <p className="text-[10px] text-stone-400 font-bold mt-1">{restaurant.orderCount} sipariş</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="pt-4 border-t border-stone-100 mt-4 text-center">
                  <button 
                    onClick={() => {
                      if (hideSidebar) {
                        navigate('/admin/restaurants');
                      } else {
                        setActiveTab('restaurants');
                      }
                    }}
                    className="text-primary hover:text-primary-container text-xs font-bold hover:underline"
                  >
                    Tüm İş Ortaklarını Gör &rarr;
                  </button>
                </div>
              </div>
            </div>

            {/* Secondary Bento: Fast Orders & Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Platforms Active orders overview */}
              <div className="lg:col-span-2 bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-stone-50 pb-3">
                  <div>
                    <h3 className="text-base font-extrabold text-stone-800">Canlı Sistem Sipariş Akışı</h3>
                    <p className="text-stone-400 text-xs font-semibold mt-0.5">Platformdaki anlık işlem hareketliliği</p>
                  </div>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="text-primary hover:text-primary-container text-xs font-bold"
                  >
                    Tüm Siparişleri İzle
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((ord, idx) => (
                    <div key={idx} className="bg-stone-50/50 hover:bg-stone-50 border border-stone-200/40 p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-rose-50 border border-rose-100 text-primary rounded-xl flex items-center justify-center font-black text-xs shadow-sm">
                          {ord.id.split('-')[1] || ord.id}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-stone-800 text-xs">{ord.customer} &bull; {ord.restaurant}</h4>
                          <p className="text-stone-500 text-[10px] font-bold tracking-wide mt-0.5">{ord.total.toFixed(2)} ₺ &bull; {ord.time}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                          ord.status === 'Teslim Edildi' 
                            ? 'bg-green-50 text-green-700 border border-green-200' 
                            : ord.status === 'Hazırlanıyor' || ord.status === 'Yolda'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {ord.status}
                        </span>
                        
                        <div className="flex gap-1">
                          <button 
                            onClick={() => handleUpdateOrderStatus(ord.id, 'Teslim Edildi')}
                            className="bg-white hover:bg-stone-100 text-stone-700 p-1.5 rounded-lg border border-stone-200 shadow-sm text-[10px] font-bold"
                            title="Teslim Edildi İşaretle"
                          >
                            <span className="material-symbols-outlined text-[14px]">done</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick system status dashboard info */}
              <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-stone-400 uppercase tracking-wider">Kurye Dağılım Durumu</h4>
                  <p className="text-stone-500 text-xs font-semibold mt-1">Sistemdeki kuryelerin durum özeti</p>
                </div>

                <div className="space-y-4 my-6">
                  <div className="flex justify-between items-center text-xs font-bold text-stone-600">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-primary rounded-full inline-block"></span>Teslimatta</span>
                    <span className="text-stone-800">{deliveryCouriers.length} Kurye</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-bold text-stone-600">
                    <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span>Müsait / Beklemede</span>
                    <span className="text-stone-800">{availableCouriers.length} Kurye</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <button 
                    onClick={() => setActiveTab('couriers')}
                    className="w-full h-11 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-extrabold uppercase tracking-wide cursor-pointer transition-all"
                  >
                    <span>Kurye Haritasını Aç</span>
                    <span className="material-symbols-outlined text-[15px]">map</span>
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 2. RESTAURANTS TAB */}
        {activeTab === 'restaurants' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold text-stone-400 uppercase tracking-wider">Restoran Listesi & Onay Kuyruğu</h3>
                <p className="text-stone-500 text-xs font-semibold mt-1">Platformdaki tüm aktif restoranların yönetimi ve yeni restoran onayı.</p>
              </div>

              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">search</span>
                  <input 
                    type="text"
                    placeholder="Restoran ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 w-full text-stone-700 placeholder-stone-400 transition-all"
                  />
                </div>
                <button 
                  onClick={() => setShowAddRestaurant(true)}
                  className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wide flex items-center gap-1.5 shadow-sm active:scale-95 transition-all whitespace-nowrap"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Yeni Restoran Ekle
                </button>
              </div>
            </div>

            {/* Add Restaurant Modal Inline overlay */}
            {showAddRestaurant && (
              <form onSubmit={handleAddRestaurantSubmit} className="bg-gradient-to-br from-stone-50 to-rose-50/30 p-6 rounded-[24px] border border-stone-200/50 space-y-4 shadow-sm max-w-2xl animate-fade-in">
                <div className="flex items-center gap-2 mb-1">
                  <span className="material-symbols-outlined text-primary text-xl">storefront</span>
                  <h4 className="text-sm font-black text-stone-800 uppercase tracking-wider">Yeni Restoran Kaydı Tanımla</h4>
                </div>
                <p className="text-xs text-stone-500">Eklenen restoran anında müşteri paneline ve giriş sistemine yansıyacak.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Restoran Adı *</label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Lezzet Sofrası"
                      value={newRestName}
                      onChange={(e) => setNewRestName(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Kategori / Mutfak</label>
                    <select
                      value={newRestCategory}
                      onChange={(e) => setNewRestCategory(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    >
                      <option>Burger & Fast Food</option>
                      <option>İtalyan & Pizza</option>
                      <option>Ev Yemekleri</option>
                      <option>Kebap & Izgara</option>
                      <option>Tatlı & Kahve</option>
                      <option>Asya Mutfağı</option>
                      <option>Pizza</option>
                      <option>Vegan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Komisyon Oranı (%)</label>
                    <input
                      type="number"
                      required
                      value={newRestComm}
                      onChange={(e) => setNewRestCommission(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Şehir / Bölge</label>
                    <input
                      type="text"
                      required
                      value={newRestCity}
                      onChange={(e) => setNewRestCity(e.target.value)}
                      className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Giriş Bilgileri */}
                <div className="border-t border-stone-200 pt-4">
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">key</span>
                    Panel Giriş Bilgileri (Opsiyonel)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Giriş E-postası</label>
                      <input
                        type="email"
                        placeholder="ornek@jetyemek.com"
                        value={newRestEmail}
                        onChange={(e) => setNewRestEmail(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Giriş Şifresi</label>
                      <input
                        type="text"
                        placeholder="Şifre (boş = rest123)"
                        value={newRestPassword}
                        onChange={(e) => setNewRestPassword(e.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddRestaurant(false)}
                    className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl text-xs font-bold text-stone-600 cursor-pointer"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_business</span>
                    Restoranı Kaydet & Yayınla
                  </button>
                </div>
              </form>
            )}

            {/* Restaurant List Table bento card */}
            <div className="bg-white rounded-[28px] shadow-soft border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Restoran Bilgisi</th>
                      <th className="px-4 py-4">Kategori</th>
                      <th className="px-4 py-4 text-center">Komisyon Oranı</th>
                      <th className="px-4 py-4 text-center">Ortalama Puan</th>
                      <th className="px-4 py-4">Sistem Durumu</th>
                      <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                    {filteredRestaurants.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-stone-400 font-bold">
                          Restoran bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredRestaurants.map((rest) => (
                        <tr key={rest.id} className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={rest.image || rest.img} alt={rest.name} className="w-10 h-10 object-cover rounded-xl shadow-sm border border-stone-100" />
                              <div>
                                <p className="font-extrabold text-stone-800 text-xs">{rest.name}</p>
                                <p className="text-[10px] text-stone-400 font-semibold">{rest.city}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className="bg-stone-100 text-stone-600 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {rest.category}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center font-extrabold text-stone-800">
                            %{(parseFloat(rest.commission) || 0).toFixed(1)}
                          </td>
                          <td className="px-4 py-4 text-center text-amber-500 font-black">
                            <div className="flex items-center justify-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">star</span>
                            {rest.rating}
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                              rest.status === 'Aktif' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-stone-100 text-stone-500 border border-stone-200'
                            }`}>
                              {rest.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button 
                                onClick={() => handleToggleRestStatus(rest.id)}
                                className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                                title="Aktif/Pasif Durumu Değiştir"
                              >
                                <span className="material-symbols-outlined text-[16px]">sync</span>
                              </button>
                              <button 
                                onClick={() => handleUpdateCommission(rest.id, rest.commission)}
                                className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                                title="Komisyon Oranını Güncelle"
                              >
                                <span className="material-symbols-outlined text-[16px]">percent</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteRestaurant(rest.id)}
                                className="p-1.5 hover:bg-rose-50 border border-rose-100 rounded-lg shadow-sm text-primary"
                                title="Restoranı Sil"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. USERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-base font-extrabold text-stone-400 uppercase tracking-wider">Müşteri Portföyü</h3>
                <p className="text-stone-500 text-xs font-semibold mt-1">Platformdaki tüm kayıtlı kullanıcıların listesi, sipariş adetleri ve hesap durumları.</p>
              </div>

              <div className="relative max-w-xs w-full">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 text-[18px]">search</span>
                <input 
                  type="text"
                  placeholder="İsim veya e-posta ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 w-full text-stone-700 placeholder-stone-400 transition-all"
                />
              </div>
            </div>

            {/* Users List bento card */}
            <div className="bg-white rounded-[28px] shadow-soft border border-stone-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Müşteri Bilgisi</th>
                      <th className="px-4 py-4 text-center">Platform Rolü</th>
                      <th className="px-4 py-4 text-center">Toplam Sipariş</th>
                      <th className="px-4 py-4">Kayıt Tarihi</th>
                      <th className="px-4 py-4">Hesap Durumu</th>
                      <th className="px-6 py-4 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-stone-400 font-bold">
                          Kullanıcı bulunamadı.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-9 h-9 object-cover rounded-full shadow-sm border border-stone-100" />
                              ) : (
                                <div className="w-9 h-9 bg-primary-container text-white rounded-full flex items-center justify-center font-bold text-xs">
                                  {user.name.split(' ').map(n => n[0]).join('')}
                                </div>
                              )}
                              <div>
                                <p className="font-extrabold text-stone-800 text-xs">{user.name}</p>
                                <p className="text-[10px] text-stone-400 font-semibold">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                              user.role === 'VIP' || user.role === 'ELITE'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-stone-100 text-stone-500 border border-stone-200'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-center font-black text-stone-800">
                            {user.orders}
                          </td>
                          <td className="px-4 py-4 text-stone-400 whitespace-nowrap">
                            {user.joined}
                          </td>
                          <td className="px-4 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                              user.status === 'Aktif' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-1.5 justify-end">
                              <button 
                                onClick={() => handleToggleUserStatus(user.id)}
                                className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                                title="Kullanıcı Hesap Durumunu Değiştir"
                              >
                                <span className="material-symbols-outlined text-[16px]">sync</span>
                              </button>
                              <button 
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-1.5 hover:bg-rose-50 border border-rose-100 rounded-lg shadow-sm text-primary"
                                title="Kullanıcıyı Sil"
                              >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center pb-3">
              <div>
                <h3 className="text-base font-extrabold text-stone-400 uppercase tracking-wider">Genel Sipariş Akışı</h3>
                <p className="text-stone-500 text-xs font-semibold mt-1">Platformdaki anlık işlem hareketliliği ve statü takipleri.</p>
              </div>
            </div>

            {/* Platform live orders list card */}
            <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Sipariş No</th>
                      <th className="px-4 py-4">Müşteri</th>
                      <th className="px-4 py-4">Restoran</th>
                      <th className="px-4 py-4">Tutar</th>
                      <th className="px-4 py-4">Durum</th>
                      <th className="px-4 py-4">Tarih / Zaman</th>
                      <th className="px-6 py-4 text-right">Durum Değiştir</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/40 transition-colors">
                        <td className="px-6 py-4 font-bold text-stone-800">{ord.id}</td>
                        <td className="px-4 py-4 font-bold text-stone-700">{ord.customer}</td>
                        <td className="px-4 py-4">{ord.restaurant}</td>
                        <td className="px-4 py-4 font-extrabold text-stone-800">{ord.total.toFixed(2)} ₺</td>
                        <td className="px-4 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                            ord.status === 'Teslim Edildi' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : ord.status === 'Hazırlanıyor' || ord.status === 'Yolda'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-stone-400 whitespace-nowrap">{ord.time}</td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-1 justify-end">
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'Hazırlanıyor')}
                              className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                            >
                              Hazırlanıyor
                            </button>
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'Yolda')}
                              className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 transition-colors"
                            >
                              Yolda
                            </button>
                            <button 
                              onClick={() => handleUpdateOrderStatus(ord.id, 'Teslim Edildi')}
                              className="px-2.5 py-1 text-[10px] font-bold bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                            >
                              Teslim Edildi
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. COURIERS TAB */}
        {activeTab === 'couriers' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Courier Status metrics list */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">Aktif Kuryeler</p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">{activeCouriers.length}</h3>
                  </div>
                  <div className="p-3 bg-rose-50 text-primary rounded-xl">
                    <span className="material-symbols-outlined">motorcycle</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">Teslimatta</p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">{deliveryCouriers.length}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                    <span className="material-symbols-outlined">local_shipping</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">Müsait</p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">{availableCouriers.length}</h3>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <span className="material-symbols-outlined">check_circle</span>
                  </div>
                </div>
              </div>

              {/* LIVE COURIER INTERACTIVE MAP (High fidelity SVG) */}
              <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-soft lg:col-span-2 relative min-h-[280px] overflow-hidden flex flex-col justify-between">
                <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#e5bdb6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-800">Canlı Kurye Haritası (İstanbul)</h4>
                    <p className="text-[10px] text-stone-400 font-bold tracking-wide mt-0.5">Sistem kuryelerinin canlı kentsel koordinatları</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm"><span className="material-symbols-outlined text-[15px]">zoom_in</span></button>
                    <button className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm"><span className="material-symbols-outlined text-[15px]">zoom_out</span></button>
                  </div>
                </div>

                {/* Simulated live visual elements */}
                <div className="w-full h-44 border border-stone-100 bg-stone-50/50 rounded-2xl relative flex items-center justify-center">
                  {/* Streets mockup layout */}
                  <div className="absolute w-[2px] h-full bg-stone-200 left-1/3"></div>
                  <div className="absolute w-[2px] h-full bg-stone-200 left-2/3"></div>
                  <div className="absolute h-[2px] w-full bg-stone-200 top-1/2"></div>

                  {/* Pulsing Courier Dot 1 */}
                  <div className="absolute top-1/4 left-1/4 group cursor-pointer text-primary">
                    <span className="material-symbols-outlined text-lg animate-bounce select-none">motorcycle</span>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[8px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 transition-opacity">
                      Ahmet Y.
                    </span>
                  </div>

                  {/* Pulsing Courier Dot 2 */}
                  <div className="absolute bottom-1/3 right-1/4 group cursor-pointer text-amber-500">
                    <span className="material-symbols-outlined text-lg animate-pulse select-none">pedal_bike</span>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[8px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 transition-opacity">
                      Mehmet T.
                    </span>
                  </div>

                  {/* Pulsing Courier Dot 3 */}
                  <div className="absolute top-1/2 right-1/2 group cursor-pointer text-green-600">
                    <span className="material-symbols-outlined text-lg animate-pulse select-none">delivery_dining</span>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[8px] px-1.5 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 transition-opacity">
                      Caner B.
                    </span>
                  </div>
                </div>

                <div className="relative z-10 flex justify-between items-center text-[9px] font-bold text-stone-400 uppercase tracking-wider mt-3">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-primary rounded-full inline-block"></span> Teslimatta</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full inline-block"></span> Müsait / Hazır</span>
                </div>
              </div>

            </div>

            {/* Lower bento: Courier table list & Manual assignment form */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Courier list table */}
              <div className="xl:col-span-2 bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
                <div className="p-5 border-b border-stone-100">
                  <h4 className="text-base font-extrabold text-stone-800">Sistem Kurye Listesi</h4>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                        <th className="px-6 py-3">Kurye Adı</th>
                        <th className="px-4 py-3">Araç Türü</th>
                        <th className="px-4 py-3">Aktif Bölgesi</th>
                        <th className="px-4 py-3 text-center">Toplam Teslimat</th>
                        <th className="px-6 py-3">Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                      {couriers.map((courier) => (
                        <tr key={courier.id} className="hover:bg-stone-50/40 transition-colors">
                          <td className="px-6 py-3.5 font-bold text-stone-800">{courier.name}</td>
                          <td className="px-4 py-3.5">{courier.vehicle}</td>
                          <td className="px-4 py-3.5 text-stone-500">{courier.zone}</td>
                          <td className="px-4 py-3.5 text-center font-extrabold text-stone-800">{courier.ordersDelivered}</td>
                          <td className="px-6 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                              courier.status === 'Müsait' 
                                ? 'bg-green-50 text-green-700 border border-green-200' 
                                : courier.status === 'Teslimatta'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {courier.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Manual Courier Assignment panel */}
              <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-stone-800">Manuel Sipariş Atama</h4>
                  <p className="text-stone-400 text-xs font-semibold mb-6">Restoran tarafından hazırlanan siparişleri müsait bir kuryeye manuel olarak atayın.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Hazırlanan Siparişi Seçin</label>
                    <select 
                      value={selectedOrderToAssign}
                      onChange={(e) => setSelectedOrderToAssign(e.target.value)}
                      className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value="VH-9420">VH-9420 (Burger Haven &bull; Hazır)</option>
                      <option value="VH-9419">VH-9419 (Pizza Roma &bull; Paketlendi)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Müsait Kuryeyi Seçin</label>
                    <select 
                      value={selectedCourierToAssign}
                      onChange={(e) => setSelectedCourierToAssign(e.target.value)}
                      className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    >
                      {couriers.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.status} &bull; {c.zone})</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl space-y-2 text-[11px] font-bold text-stone-500">
                    <div className="flex justify-between">
                      <span>Tahmini Teslimat Süresi:</span>
                      <span className="text-stone-800">25 - 30 dk</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Mesafe:</span>
                      <span className="text-stone-800">3.2 km</span>
                    </div>
                  </div>

                  <button 
                    onClick={handleAssignOrder}
                    className="w-full py-3 bg-primary hover:bg-primary-container text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition-all active:scale-95"
                  >
                    Siparişi Ata ve Bildirim Gönder
                  </button>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 6. CAMPAIGNS TAB */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Campaign statistics boxes */}
              <div className="space-y-4">
                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">Toplam Kupon Kullanımı</p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">12.450</h3>
                  </div>
                  <div className="p-3 bg-rose-50 text-primary rounded-xl">
                    <span className="material-symbols-outlined">shopping_cart_checkout</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">Sağlanan Toplam İndirim</p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">245.600 ₺</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                    <span className="material-symbols-outlined">savings</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">Dönüşüm Oranı</p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">%18.5</h3>
                  </div>
                  <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                </div>
              </div>

              {/* Campaign Creator form */}
              <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-soft lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h4 className="text-base font-extrabold text-stone-800 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">auto_awesome</span>
                    Platform Kampanya Oluşturucu
                  </h4>
                  <p className="text-stone-400 text-xs font-semibold mb-6">Tüm platformda veya belirli restoranlarda geçerli yeni bir indirim kuponu tanımlayın.</p>
                </div>

                <form onSubmit={handleLaunchCampaign} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Kampanya / Promosyon Adı</label>
                      <input 
                        type="text"
                        required
                        placeholder="Örn: Hafta Sonu Çılgınlığı"
                        value={newCampaignName}
                        onChange={(e) => setNewCampaignName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Kupon Kodu (Benzersiz)</label>
                      <input 
                        type="text"
                        required
                        placeholder="Örn: CRAVEWEEKEND"
                        value={newCampaignCode}
                        onChange={(e) => setNewCampaignCode(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">İndirim Yüzdesi (%)</label>
                      <input 
                        type="number"
                        required
                        value={newCampaignDiscount}
                        onChange={(e) => setNewCampaignDiscount(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Minimum Sepet Tutarı (₺)</label>
                      <input 
                        type="number"
                        required
                        value={newCampaignMin}
                        onChange={(e) => setNewCampaignMin(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      className="px-6 py-3 bg-primary hover:bg-primary-container text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-sm transition-all"
                    >
                      Yeni Kampanyayı Yayına Al
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Platform active promos list */}
            <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
              <div className="p-5 border-b border-stone-100">
                <h4 className="text-base font-extrabold text-stone-800 uppercase tracking-wider">Aktif Platform Promosyonları</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Kupon Kodu</th>
                      <th className="px-4 py-4">Kupon Türü</th>
                      <th className="px-4 py-4">İndirim Oranı</th>
                      <th className="px-4 py-4">Şart / Limit</th>
                      <th className="px-4 py-4">Kullanım Dağılımı</th>
                      <th className="px-6 py-4">Durum</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                    {promos.map((promo, idx) => (
                      <tr key={idx} className="hover:bg-stone-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-extrabold text-stone-800 text-xs tracking-wide">{promo.code}</p>
                            <p className="text-[10px] text-stone-400 font-semibold">{promo.desc}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">{promo.type}</td>
                        <td className="px-4 py-4 font-black text-primary">{promo.rate}</td>
                        <td className="px-4 py-4">
                          <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">
                            {promo.condition}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col w-28">
                            <span className="text-[10px] text-stone-400 font-bold mb-1">{promo.usage}</span>
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${promo.progress}%` }}></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                            promo.status === 'Aktif' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {promo.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 7. FINANCE TAB */}
        {activeTab === 'finance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-rose-50 text-primary rounded-xl">
                    <span className="material-symbols-outlined">trending_up</span>
                  </div>
                  <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-bold">+12.5%</span>
                </div>
                <div className="mt-4">
                  <p className="text-stone-400 font-bold text-xs tracking-wide">Platform Toplam Cirosu</p>
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight mt-1">482.500 ₺</h3>
                  <p className="text-[10px] text-stone-400 font-semibold mt-1">Son 30 gün verileri</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                    <span className="material-symbols-outlined">account_balance_wallet</span>
                  </div>
                  <span className="text-green-600 bg-green-50 px-3 py-1 rounded-full text-[10px] font-bold">+8.2%</span>
                </div>
                <div className="mt-4">
                  <p className="text-stone-400 font-bold text-xs tracking-wide">Net Kar (Hizmet Bedeli)</p>
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight mt-1">38.600 ₺</h3>
                  <p className="text-[10px] text-stone-400 font-semibold mt-1">Sistem hizmet bedellerinden elde edilen pay</p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-stone-50 text-stone-600 rounded-xl">
                    <span className="material-symbols-outlined">restaurant</span>
                  </div>
                  <span className="text-stone-600 bg-stone-100 px-3 py-1 rounded-full text-[10px] font-bold">%8 Ortalama</span>
                </div>
                <div className="mt-4">
                  <p className="text-stone-400 font-bold text-xs tracking-wide">Restoranlara Dağıtılacak Tutar</p>
                  <h3 className="text-2xl font-black text-stone-800 tracking-tight mt-1">443.900 ₺</h3>
                  <p className="text-[10px] text-stone-400 font-semibold mt-1">Hak ediş bekleyen mutabakatlar</p>
                </div>
              </div>

            </div>

            {/* Financial Ledger table list */}
            <div className="bg-white rounded-[28px] border border-stone-100 shadow-soft overflow-hidden">
              <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h4 className="text-base font-extrabold text-stone-800">Hak Ediş ve Muhasebe Logları</h4>
                
                <button 
                  onClick={handleDownloadPDF}
                  disabled={pdfLoading}
                  className="px-5 py-2.5 bg-primary hover:bg-primary-container disabled:opacity-50 text-white font-black text-xs rounded-xl uppercase tracking-wider flex items-center gap-2 cursor-pointer transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  {pdfLoading ? 'Rapor Üretiliyor...' : 'PDF Finans Raporu Al'}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100 text-[10px] font-black text-stone-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Restoran Bilgisi</th>
                      <th className="px-4 py-4">İşlem Tarihi</th>
                      <th className="px-4 py-4">Brüt Sipariş Tutar</th>
                      <th className="px-4 py-4">Alınan Komisyon (%8)</th>
                      <th className="px-4 py-4">Net Restoran Ödeme</th>
                      <th className="px-6 py-4">Mutabakat Statüsü</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-xs text-stone-700 font-medium">
                    {financials.map((ledger) => (
                      <tr key={ledger.id} className="hover:bg-stone-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-extrabold text-stone-800 text-xs">{ledger.restaurant}</p>
                            <p className="text-[10px] text-stone-400 font-semibold">İşlem: {ledger.id}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-stone-400 whitespace-nowrap">{ledger.date}</td>
                        <td className="px-4 py-4">{ledger.gross.toFixed(2)} ₺</td>
                        <td className="px-4 py-4 text-primary">-{ledger.comm.toFixed(2)} ₺</td>
                        <td className="px-4 py-4 font-black text-stone-800">{ledger.net.toFixed(2)} ₺</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide inline-block ${
                            ledger.status === 'Tamamlandı' 
                              ? 'bg-green-50 text-green-700 border border-green-200' 
                              : ledger.status === 'Beklemede'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                          }`}>
                            {ledger.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 8. SYSTEM SETTINGS TAB */}
        {activeTab === 'settings' && (
          <div className="space-y-6 pb-24 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Platform settings config */}
              <div className="lg:col-span-7 space-y-6">
                
                <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft space-y-4">
                  <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">settings_suggest</span>
                    Sistem Genel Parametreleri
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Varsayılan Komisyon Ücreti (%)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">%</span>
                        <input 
                          type="number"
                          value={baseCommission}
                          onChange={(e) => setBaseCommission(e.target.value)}
                          className="w-full pl-10 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-stone-400 font-semibold mt-1">Platformdaki tüm restoranlar için taban komisyon oranı.</p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Varsayılan Teslimat Ücreti (₺)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-primary">₺</span>
                        <input 
                          type="text"
                          value={baseDeliveryFee}
                          onChange={(e) => setBaseDeliveryFee(e.target.value)}
                          className="w-full pl-10 bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                        />
                      </div>
                      <p className="text-[10px] text-stone-400 font-semibold mt-1">Sistem başlangıç kurye taşıma bedeli parametresi.</p>
                    </div>
                  </div>
                </section>

                <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft space-y-4">
                  <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary">notifications_active</span>
                    Platform Sistem Bildirimleri
                  </h3>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                      <div className="flex gap-3 items-center">
                        <span className="material-symbols-outlined text-stone-500">mail</span>
                        <div>
                          <p className="text-xs font-extrabold text-stone-800 leading-tight">E-posta Bildirimleri</p>
                          <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Yeni restoran kayıtları ve platform haftalık mutabakat özetleri</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={emailNotifs}
                          onChange={() => setEmailNotifs(!emailNotifs)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-stone-50 rounded-2xl border border-stone-100">
                      <div className="flex gap-3 items-center">
                        <span className="material-symbols-outlined text-stone-500">sms</span>
                        <div>
                          <p className="text-xs font-extrabold text-stone-800 leading-tight">SMS Uyarıları</p>
                          <p className="text-[10px] text-stone-400 font-semibold mt-0.5">Kritik sunucu yükü, ödeme gecikmeleri veya sistem kesintileri</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={smsNotifs}
                          onChange={() => setSmsNotifs(!smsNotifs)}
                          className="sr-only peer"
                        />
                        <div className="w-9 h-5 bg-stone-200 rounded-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                </section>

              </div>

              {/* Right Column: Super admin profile settings */}
              <div className="lg:col-span-5 space-y-6">
                
                <section className="bg-white rounded-[24px] p-6 border border-stone-100 shadow-soft flex flex-col items-center">
                  <div className="relative mb-4">
                    <img 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW3F7uh6g1Kznczffnq89_eaBUXJq8xASo0zbD3eje_5FDbt5YvAYODYbkYpUnOEh1Hw2G6gPOlJBj9uGmtICPXc7xJGIts_Pe7soyVnnalozY_lL_RLoT8N3gng22vnqC7Q9hGG5FCSn-TtpYKjeTzSZuIxZvnd0sQnEKV_eeRZPLl6XSdbmnYHOffUF_DfOylLNs5qVH5kcor9EUg-LfQCi8dLcsRuaNNac3lG-cjyMYLGlcECKbklmwsAXuYFS93v2MYPGR6Ug" 
                      alt="Super Admin" 
                      className="w-24 h-24 rounded-full border-4 border-rose-50 object-cover shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <h4 className="text-sm font-black text-stone-800">{adminProfileName}</h4>
                  <p className="text-[10px] text-stone-400 font-extrabold uppercase tracking-wide mt-0.5">Süper Admin</p>

                  <div className="w-full space-y-4 mt-6">
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Ad Soyad</label>
                      <input 
                        type="text"
                        value={adminProfileName}
                        onChange={(e) => setAdminProfileName(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">E-posta Adresi</label>
                      <input 
                        type="email"
                        value={adminEmail}
                        onChange={(e) => setAdminProfileEmail(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                      />
                    </div>
                  </div>
                </section>

              </div>
            </div>

            {/* Sticky Save bar */}
            <div className="fixed bottom-6 left-0 right-0 z-40 px-4 md:px-8">
              <div className="max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-[20px] p-4 shadow-2xl border border-stone-100 flex items-center justify-end gap-2">
                <button 
                  onClick={() => window.location.reload()}
                  className="px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 font-bold text-xs rounded-full transition-all cursor-pointer"
                >
                  İptal Et
                </button>
                <button 
                  onClick={handleSaveSystemSettings}
                  className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white font-black text-xs rounded-full transition-all cursor-pointer shadow-md shadow-primary/20"
                >
                  Sistem Ayarlarını Kaydet
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* CANLI SISTEM LOGLARI DRAWER / MODAL */}
      {showLogs && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-stone-700 w-full max-w-2xl rounded-[28px] shadow-2xl overflow-hidden border border-stone-100 animate-scale-up font-mono text-xs">
            <div className="p-5 border-b border-stone-100 bg-stone-50 flex justify-between items-center text-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                <span className="font-extrabold">CraveDash Live System Logs</span>
              </div>
              <button 
                onClick={() => setShowLogs(false)}
                className="text-stone-400 hover:text-stone-800 p-1 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="p-6 space-y-3.5 max-h-[360px] overflow-y-auto custom-scrollbar">
              {systemLogs.map((log, idx) => (
                <div key={idx} className="flex gap-4 border-b border-stone-100 pb-2.5 last:border-0 last:pb-0">
                  <span className="text-stone-500 shrink-0 font-bold">[{log.time}]</span>
                  <span className={`font-black shrink-0 ${
                    log.type === 'SUCCESS' ? 'text-green-400' :
                    log.type === 'WARNING' ? 'text-amber-400' :
                    log.type === 'SYSTEM' ? 'text-rose-400' : 'text-cyan-400'
                  }`}>
                    {log.type}
                  </span>
                  <span className="text-stone-700">{log.msg}</span>
                </div>
              ))}
            </div>

            <div className="p-4 bg-stone-50 border-t border-stone-100 text-right">
              <button 
                onClick={() => setShowLogs(false)}
                className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl font-bold cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

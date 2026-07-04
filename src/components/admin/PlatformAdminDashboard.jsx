import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addRestaurant, deleteRestaurant, toggleRestaurantStatus, updateRestaurantCommission } from '../../features/restaurants/restaurantsSlice.js';
import { updatePlatformOrderStatus } from '../../features/orders/ordersSlice.js';
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

function getCustomerPlatformRole(orderCount) {
  if (orderCount > 10) return 'VIP';
  if (orderCount >= 10) return 'Elite';
  if (orderCount >= 5) return 'Gold';
  if (orderCount >= 3) return 'Silver';
  return 'Yeni';
}

function formatJoinedDate(user) {
  const dateValue = user.createdAt || user.joinedAt || user.registeredAt;
  if (!dateValue) return '-';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

const ORDER_STATUS_OPTIONS = [
  { label: 'Hazırlanıyor', status: 'Hazırlanıyor', deliveryStatus: 'preparing', progress: 10, icon: 'restaurant' },
  { label: 'Sipariş Hazır', status: 'Sipariş Hazır', deliveryStatus: 'ready', progress: 35, icon: 'inventory_2' },
  { label: 'Kurye Yola Çıktı', status: 'Kurye Yola Çıktı', deliveryStatus: 'on_the_way', progress: 55, icon: 'local_shipping' },
  { label: 'Teslim Edildi', status: 'Teslim Edildi', deliveryStatus: 'delivered', progress: 100, icon: 'check_circle' },
  { label: 'İptal Edildi', status: 'İptal Edildi', deliveryStatus: 'cancelled', progress: 0, icon: 'cancel' },
];

const COURIER_MAP_ROUTES = [
  { path: 'M 24 116 C 110 94, 168 92, 242 118 S 382 154, 500 112', duration: 24 },
  { path: 'M 64 38 C 122 76, 158 126, 216 126 S 330 82, 456 46', duration: 22 },
  { path: 'M 78 178 C 146 134, 218 146, 280 108 S 390 66, 520 78', duration: 27 },
  { path: 'M 512 190 C 420 166, 364 156, 296 178 S 156 210, 42 172', duration: 26 },
  { path: 'M 282 24 C 268 82, 286 128, 250 170 S 180 216, 102 206', duration: 23 },
  { path: 'M 18 72 C 96 58, 158 54, 216 74 S 326 140, 536 142', duration: 29 },
];

function getCourierMapVisual(courier, index) {
  const route = COURIER_MAP_ROUTES[index % COURIER_MAP_ROUTES.length];
  const isBusy = courier.status === 'Teslimatta';
  const isAvailable = courier.status === 'Müsait' || courier.status === 'Beklemede';

  return {
    ...route,
    icon: courier.vehicle?.toLowerCase().includes('bisiklet') ? 'pedal_bike' : 'motorcycle',
    colorClass: isBusy ? 'text-primary' : isAvailable ? 'text-green-600' : 'text-stone-400',
    pulseClass: isAvailable ? 'animate-pulse' : '',
    isMoving: courier.status !== 'Çevrimdışı',
  };
}

function getCampaignTypeLabel(type) {
  if (type === 'free_delivery') return 'Teslimat Kampanyası';
  if (type === 'coupon_fixed') return 'Sabit Kupon';
  if (type === 'coupon_percent') return 'Yüzde Kupon';
  return 'Kampanya';
}

function getCampaignRateText(campaign) {
  if (campaign.type === 'free_delivery') return `${Number(campaign.discountValue || 0)} TL teslimat`;
  if (campaign.type === 'coupon_fixed') return `${Number(campaign.discountValue || 0)} TL`;
  if (campaign.type === 'coupon_percent') return `%${Number(campaign.discountValue || 0)}`;
  return '-';
}

function getCampaignUsageText(campaign) {
  const usageCount = Number(campaign.usageCount || 0);
  return campaign.usageLimit ? `${usageCount} / ${campaign.usageLimit}` : `${usageCount} / sınırsız`;
}

function getCampaignProgress(campaign) {
  if (!campaign.usageLimit) return 0;
  return Math.min(100, (Number(campaign.usageCount || 0) / Number(campaign.usageLimit)) * 100);
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
        deliveryStatus: order.deliveryStatus,
        progress: order.progress,
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
  const [commissionModal, setCommissionModal] = useState(null);
  const [commissionValue, setCommissionValue] = useState('');
  const [deleteModal, setDeleteModal] = useState(null);

  const handleToggleRestStatus = (id) => {
    dispatch(toggleRestaurantStatus(id));
  };

  const openCommissionModal = (restaurant) => {
    setCommissionModal(restaurant);
    setCommissionValue(String(restaurant.commission ?? 12));
  };

  const closeCommissionModal = () => {
    setCommissionModal(null);
    setCommissionValue('');
  };

  const handleUpdateCommission = (event) => {
    event.preventDefault();
    const commission = Number(commissionValue);

    if (!commissionModal || Number.isNaN(commission) || commission < 0 || commission > 100) {
      addToast({ message: 'Lütfen 0 ile 100 arasında geçerli bir komisyon oranı girin.', type: 'error' });
      return;
    }

    dispatch(updateRestaurantCommission({ id: commissionModal.id, commission }));
    addToast({ message: 'Komisyon oranı güncellendi.', type: 'success' });
    closeCommissionModal();
  };

  const openDeleteModal = (restaurant) => {
    setDeleteModal(restaurant);
  };

  const closeDeleteModal = () => {
    setDeleteModal(null);
  };

  const handleDeleteRestaurant = () => {
    if (!deleteModal?.id) return;

    dispatch(deleteRestaurant(deleteModal.id));
    addToast({ message: 'Restoran platformdan kaldırıldı.', type: 'success' });
    closeDeleteModal();
  };

  const handleAddRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const restId = 'rest-' + newRestName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    const defaultRestaurantImage = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U';
    const restaurantPayload = {
      id: restId,
      name: newRestName.trim(),
      category: newRestCategory,
      commission: parseFloat(newRestComm) || 12,
      status: 'Aktif',
      isOpen: true,
      isSponsor: false,
      city: newRestCity,
      rating: '5.0',
      time: '30-40 dk',
      deliveryFee: 'Ücretsiz',
      minOrder: '100 TL',
      tag: 'restoran',
      image: defaultRestaurantImage,
      bannerImage: '',
      description: '',
      deliveryZones: newRestCity,
      address: newRestCity,
      phone: '',
      email: newRestEmail.trim(),
      holidayMode: false,
      holidayStart: '',
      holidayEnd: '',
    };

    try {
      const savedRestaurantResponse = await api.post('/restaurants', restaurantPayload);
      dispatch(addRestaurant(savedRestaurantResponse.data));

      if (newRestEmail.trim()) {
        await api.post('/users', {
          id: restId + '-user',
          role: 'restaurant',
          email: newRestEmail.trim(),
          password: newRestPassword || 'rest123',
          restaurantId: restId,
          name: newRestName.trim(),
          avatar: defaultRestaurantImage,
        });
      }
    } catch (_) {
      addToast({ message: 'Restoran kaydedilirken bir sorun oluştu.', type: 'error' });
      return;
    }

    addToast({ message: `"${newRestName}" restoranı platforma eklendi ve müşteri paneline yansıdı!`, type: 'success' });
    setNewRestName('');
    setNewRestEmail('');
    setNewRestPassword('');
    setShowAddRestaurant(false);
  };


  // 2. User Management Tab State
  const [users, setUsers] = useState([]);
  const [userDeleteModal, setUserDeleteModal] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get('/users');
        const customerUsers = (response.data || []).filter((user) => user.role === 'customer');
        setUsers(customerUsers);
      } catch (error) {
        setUsers([]);
      }
    }

    loadUsers();
  }, []);

  const enrichedUsers = useMemo(() => (
    users.map((user) => {
      const orderCount = platformOrders.filter((order) => String(order.userId) === String(user.id)).length;
      const fullName = `${user.name || ''} ${user.surname || ''}`.trim() || user.email || 'İsimsiz Kullanıcı';

      return {
        ...user,
        name: fullName,
        orders: orderCount,
        platformRole: getCustomerPlatformRole(orderCount),
        joined: formatJoinedDate(user),
        status: user.status || 'Aktif',
      };
    })
  ), [users, platformOrders]);

  const handleToggleUserStatus = async (id) => {
    const user = users.find((item) => String(item.id) === String(id));
    if (!user) return;

    const nextStatus = (user.status || 'Aktif') === 'Aktif' ? 'Pasif' : 'Aktif';

    try {
      const response = await api.patch(`/users/${id}`, { status: nextStatus });
      setUsers((prev) => prev.map((item) => String(item.id) === String(id) ? { ...item, ...response.data } : item));
      addToast({ message: 'Kullanıcı durumu güncellendi.', type: 'success' });
    } catch (error) {
      addToast({ message: 'Kullanıcı durumu güncellenirken bir sorun oluştu.', type: 'error' });
    }
  };

  const openUserDeleteModal = (user) => {
    setUserDeleteModal(user);
  };

  const closeUserDeleteModal = () => {
    setUserDeleteModal(null);
  };

  const handleDeleteUser = async () => {
    if (!userDeleteModal?.id) return;

    try {
      await api.delete(`/users/${userDeleteModal.id}`);
      setUsers((prev) => prev.filter((user) => String(user.id) !== String(userDeleteModal.id)));
      addToast({ message: 'Kullanıcı platformdan kaldırıldı.', type: 'success' });
      closeUserDeleteModal();
    } catch (error) {
      addToast({ message: 'Kullanıcı silinirken bir sorun oluştu.', type: 'error' });
    }
  };

  const [orderStatusModal, setOrderStatusModal] = useState(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 10;
  const totalOrderPages = Math.max(1, Math.ceil(orders.length / ordersPerPage));
  const paginatedOrders = orders.slice((ordersPage - 1) * ordersPerPage, ordersPage * ordersPerPage);

  useEffect(() => {
    if (ordersPage > totalOrderPages) {
      setOrdersPage(totalOrderPages);
    }
  }, [ordersPage, totalOrderPages]);

  const openOrderStatusModal = (order) => {
    setOrderStatusModal(order);
  };

  const closeOrderStatusModal = () => {
    setOrderStatusModal(null);
  };

  const handleUpdateOrderStatus = async (statusOption, targetOrder = orderStatusModal) => {
    if (!targetOrder?.id) return;

    try {
      const response = await api.patch(`/orders/${targetOrder.id}`, {
        status: statusOption.status,
        deliveryStatus: statusOption.deliveryStatus,
        progress: statusOption.progress,
      });

      dispatch(updatePlatformOrderStatus({
        id: response.data.id,
        status: response.data.status,
        deliveryStatus: response.data.deliveryStatus,
        progress: response.data.progress,
      }));
      addToast({ message: `Sipariş durumu "${statusOption.label}" olarak güncellendi.`, type: 'success' });
      if (orderStatusModal?.id === targetOrder.id) {
        closeOrderStatusModal();
      }
    } catch (error) {
      addToast({ message: 'Sipariş durumu güncellenirken bir sorun oluştu.', type: 'error' });
    }
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

  const [selectedOrderToAssign, setSelectedOrderToAssign] = useState('');
  const [selectedCourierToAssign, setSelectedCourierToAssign] = useState('courier-2');

  const activeCouriers = couriers.filter((courier) => courier.status !== 'Çevrimdışı');
  const deliveryCouriers = couriers.filter((courier) => courier.status === 'Teslimatta');
  const availableCouriers = couriers.filter((courier) => courier.status === 'Müsait' || courier.status === 'Beklemede');
  const assignableOrders = orders.filter((order) => (
    order.deliveryStatus === 'ready' ||
    order.status === 'Sipariş Hazır' ||
    order.status === 'Hazır' ||
    order.deliveryStatus === 'preparing'
  ));

  useEffect(() => {
    if (assignableOrders.length === 0) {
      if (selectedOrderToAssign) setSelectedOrderToAssign('');
      return;
    }

    if (!assignableOrders.find((order) => String(order.id) === String(selectedOrderToAssign))) {
      setSelectedOrderToAssign(assignableOrders[0].id);
    }
  }, [assignableOrders, selectedOrderToAssign]);

  useEffect(() => {
    if (availableCouriers.length === 0) {
      if (selectedCourierToAssign) setSelectedCourierToAssign('');
      return;
    }

    if (!availableCouriers.find((courier) => String(courier.id) === String(selectedCourierToAssign)) && availableCouriers.length > 0) {
      setSelectedCourierToAssign(availableCouriers[0].id);
    }
  }, [availableCouriers, selectedCourierToAssign]);

  const handleAssignOrder = async () => {
    const selectedCourier = couriers.find(c => String(c.id) === String(selectedCourierToAssign));
    const selectedOrder = orders.find((order) => String(order.id) === String(selectedOrderToAssign));

    if (!selectedCourier || !selectedOrder) {
      addToast({ message: 'Atama için sipariş ve kurye seçmelisiniz.', type: 'error' });
      return;
    }

    try {
      const [courierResponse, orderResponse] = await Promise.all([
        api.patch(`/couriers/${selectedCourier.id}`, { status: 'Teslimatta' }),
        api.patch(`/orders/${selectedOrder.id}`, {
          status: 'Kurye Yola Çıktı',
          deliveryStatus: 'on_the_way',
          progress: 55,
          courierId: selectedCourier.id,
          courierName: selectedCourier.name,
        }),
      ]);

      setCouriers(prev => prev.map(c => String(c.id) === String(selectedCourier.id) ? { ...c, ...courierResponse.data } : c));
      dispatch(updatePlatformOrderStatus({
        id: orderResponse.data.id,
        status: orderResponse.data.status,
        deliveryStatus: orderResponse.data.deliveryStatus,
        progress: orderResponse.data.progress,
      }));
      addToast({ message: `Sipariş #${selectedOrder.id}, kurye ${selectedCourier.name} üzerine başarıyla atandı.`, type: 'success' });
    } catch (error) {
      addToast({ message: 'Kurye ataması yapılırken bir sorun oluştu.', type: 'error' });
    }
  };


  // 5. Campaign & Promotion Management State
  const [promos, setPromos] = useState([]);

  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignCode, setNewCampaignCode] = useState('');
  const [newCampaignType, setNewCampaignType] = useState('coupon_percent');
  const [newCampaignDiscount, setNewCampaignDiscount] = useState('20');
  const [newCampaignMin, setNewCampaignMin] = useState('150');
  const activePromos = promos.filter((promo) => promo.status === 'Aktif');
  const totalCampaignUsage = promos.reduce((sum, promo) => sum + Number(promo.usageCount || 0), 0);
  const couponPromoCount = promos.filter((promo) => promo.type !== 'free_delivery').length;

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const response = await api.get('/campaigns');
        setPromos(response.data || []);
      } catch (error) {
        setPromos([]);
      }
    }

    loadCampaigns();
  }, []);

  const handleLaunchCampaign = async (e) => {
    e.preventDefault();
    if (newCampaignType !== 'free_delivery' && !newCampaignCode.trim()) return;

    const newPromo = {
      id: 'camp-' + Date.now(),
      name: newCampaignName || 'Yeni Kampanya',
      code: newCampaignType === 'free_delivery' ? '' : newCampaignCode.toUpperCase().trim(),
      type: newCampaignType,
      discountValue: newCampaignType === 'free_delivery' ? 50 : Number(newCampaignDiscount || 0),
      minOrder: Number(newCampaignMin || 0),
      status: 'Aktif',
      usageCount: 0,
      usageLimit: newCampaignType === 'free_delivery' ? null : 10000,
      description: newCampaignType === 'free_delivery'
        ? `${newCampaignMin} TL üzeri siparişlerde teslimat ücreti bedava`
        : `${newCampaignMin} TL üzeri siparişlerde geçerli kupon`,
    };

    try {
      const response = await api.post('/campaigns', newPromo);
      setPromos(prev => [response.data, ...prev]);
      setNewCampaignName('');
      setNewCampaignCode('');
      addToast({ message: 'Yeni kampanya yayına alındı.', type: 'success' });
    } catch (error) {
      addToast({ message: 'Kampanya kaydedilirken bir sorun oluştu.', type: 'error' });
    }
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

  const filteredUsers = enrichedUsers.filter(u => 
    (u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
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
                            onClick={() => handleUpdateOrderStatus(ORDER_STATUS_OPTIONS[3], ord)}
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
                                onClick={() => openCommissionModal(rest)}
                                className="p-1.5 hover:bg-stone-50 border border-stone-200 rounded-lg shadow-sm text-stone-500 hover:text-stone-800"
                                title="Komisyon Oranını Güncelle"
                              >
                                <span className="material-symbols-outlined text-[16px]">percent</span>
                              </button>
                              <button 
                                onClick={() => openDeleteModal(rest)}
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

            {commissionModal && (
              <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <form
                  onSubmit={handleUpdateCommission}
                  className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-black text-stone-800">Komisyon Oranı</h4>
                      <p className="text-xs text-stone-400 font-semibold mt-1">{commissionModal.name}</p>
                    </div>
                    <button
                      type="button"
                      onClick={closeCommissionModal}
                      className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                      Yeni Komisyon Oranı (%)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={commissionValue}
                        onChange={(event) => setCommissionValue(event.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-stone-800 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary"
                        autoFocus
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-black">%</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeCommissionModal}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
                    >
                      Kaydet
                    </button>
                  </div>
                </form>
              </div>
            )}

            {deleteModal && (
              <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-rose-50 text-primary flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined">delete</span>
                      </div>
                      <h4 className="text-lg font-black text-stone-800">Restoranı Sil</h4>
                      <p className="text-xs text-stone-500 font-semibold mt-2 leading-relaxed">
                        <span className="font-black text-stone-800">{deleteModal.name}</span> restoranını platformdan kaldırmak istediğine emin misin?
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeDeleteModal}
                      className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeDeleteModal}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteRestaurant}
                      className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                                  {(user.name || '?').split(' ').map(n => n[0]).join('')}
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
                              user.platformRole === 'VIP' || user.platformRole === 'Elite' || user.platformRole === 'Gold'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-stone-100 text-stone-500 border border-stone-200'
                            }`}>
                              {user.platformRole}
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
                                onClick={() => openUserDeleteModal(user)}
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

            {userDeleteModal && (
              <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="w-11 h-11 rounded-2xl bg-rose-50 text-primary flex items-center justify-center mb-3">
                        <span className="material-symbols-outlined">person_remove</span>
                      </div>
                      <h4 className="text-lg font-black text-stone-800">Kullanıcıyı Sil</h4>
                      <p className="text-xs text-stone-500 font-semibold mt-2 leading-relaxed">
                        <span className="font-black text-stone-800">{userDeleteModal.name}</span> kullanıcısını platformdan kaldırmak istediğine emin misin?
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeUserDeleteModal}
                      className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={closeUserDeleteModal}
                      className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      İptal
                    </button>
                    <button
                      type="button"
                      onClick={handleDeleteUser}
                      className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-black cursor-pointer shadow-sm"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              </div>
            )}
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
                    {paginatedOrders.map((ord) => (
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
                          <button
                            type="button"
                            onClick={() => openOrderStatusModal(ord)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-stone-200 text-stone-500 hover:text-primary hover:bg-rose-50 hover:border-rose-100 transition-all"
                            title="Durumu Güncelle"
                          >
                            <span className="material-symbols-outlined text-[18px]">edit_square</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {orders.length > ordersPerPage && (
                <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50/50">
                  <p className="text-[10px] font-bold text-stone-400">
                    {orders.length} sipariş içinde sayfa {ordersPage} / {totalOrderPages}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setOrdersPage((page) => Math.max(1, page - 1))}
                      disabled={ordersPage === 1}
                      className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Önceki sayfa"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                    </button>

                    {Array.from({ length: totalOrderPages }, (_, index) => index + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setOrdersPage(page)}
                        className={`w-9 h-9 rounded-xl text-xs font-black border transition-all ${
                          ordersPage === page
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-stone-500 border-stone-200 hover:text-primary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => setOrdersPage((page) => Math.min(totalOrderPages, page + 1))}
                      disabled={ordersPage === totalOrderPages}
                      className="w-9 h-9 rounded-xl border border-stone-200 bg-white text-stone-500 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Sonraki sayfa"
                    >
                      <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {orderStatusModal && (
              <div className="fixed inset-0 bg-black/45 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border border-stone-100 space-y-5 animate-scale-up">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-black text-stone-800">Sipariş Durumu</h4>
                      <p className="text-xs text-stone-500 font-semibold mt-1">
                        #{orderStatusModal.id} için yeni durumu seç
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeOrderStatusModal}
                      className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer transition-all"
                    >
                      <span className="material-symbols-outlined">close</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {ORDER_STATUS_OPTIONS.map((option) => {
                      const isActive = orderStatusModal.deliveryStatus === option.deliveryStatus;

                      return (
                        <button
                          key={option.deliveryStatus}
                          type="button"
                          onClick={() => handleUpdateOrderStatus(option)}
                          className={`w-full flex items-center justify-between gap-3 rounded-2xl px-4 py-3 border text-left transition-all ${
                            isActive
                              ? 'border-primary bg-rose-50 text-primary'
                              : 'border-stone-100 bg-stone-50 text-stone-700 hover:border-rose-100 hover:bg-rose-50/60'
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[20px]">{option.icon}</span>
                            <span className="text-xs font-black">{option.label}</span>
                          </span>
                          {isActive && <span className="material-symbols-outlined text-[18px]">check</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
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

              {/* LIVE COURIER DEMO MAP */}
              <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-soft lg:col-span-2 relative min-h-[280px] overflow-hidden flex flex-col justify-between">
                <style>{`
                  @keyframes courierDemoRide {
                    0% { offset-distance: 0%; }
                    100% { offset-distance: 100%; }
                  }
                  .courier-demo-ride {
                    offset-rotate: auto 0deg;
                    animation: courierDemoRide var(--ride-duration) linear infinite;
                  }
                  .courier-demo-paused {
                    offset-distance: var(--park-position);
                  }
                `}</style>
                <div className="absolute inset-0 z-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#e5bdb6 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div className="relative z-10 flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-800">Canlı Kurye Haritası (İstanbul)</h4>
                    <p className="text-[10px] text-stone-400 font-bold tracking-wide mt-0.5">Demo şehir planı üzerinde hareketli kurye görünümü</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm"><span className="material-symbols-outlined text-[15px]">zoom_in</span></button>
                    <button className="p-1 rounded bg-white hover:bg-stone-100 border border-stone-200 shadow-sm"><span className="material-symbols-outlined text-[15px]">zoom_out</span></button>
                  </div>
                </div>

                <div className="w-full h-64 border border-stone-100 bg-[#f3efe7] rounded-2xl relative overflow-hidden shadow-inner">
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 560 240" preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                      <linearGradient id="courierWater" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="#dbeafe" />
                        <stop offset="100%" stopColor="#bae6fd" />
                      </linearGradient>
                      <filter id="softRoadShadow" x="-10%" y="-10%" width="120%" height="120%">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodColor="#78716c" floodOpacity="0.16" />
                      </filter>
                    </defs>
                    <path d="M 0 196 C 76 176, 126 216, 198 198 S 322 178, 394 204 S 496 222, 560 198 L 560 240 L 0 240 Z" fill="url(#courierWater)" opacity="0.9" />
                    <path d="M 10 196 C 88 184, 132 214, 204 198 S 322 184, 390 206 S 486 220, 550 204" fill="none" stroke="#7dd3fc" strokeWidth="2" opacity="0.65" />

                    <rect x="20" y="18" width="102" height="48" rx="12" fill="#fffaf5" stroke="#e7e5e4" />
                    <rect x="138" y="22" width="72" height="40" rx="10" fill="#fef3c7" stroke="#fde68a" opacity="0.9" />
                    <rect x="392" y="22" width="126" height="54" rx="14" fill="#fffaf5" stroke="#e7e5e4" />
                    <rect x="72" y="148" width="98" height="44" rx="12" fill="#fffaf5" stroke="#e7e5e4" />
                    <rect x="194" y="158" width="80" height="42" rx="12" fill="#dcfce7" stroke="#bbf7d0" />
                    <rect x="360" y="146" width="136" height="48" rx="14" fill="#fffaf5" stroke="#e7e5e4" />
                    <rect x="468" y="92" width="58" height="36" rx="10" fill="#f5f5f4" stroke="#e7e5e4" />
                    <rect x="20" y="84" width="54" height="34" rx="9" fill="#f5f5f4" stroke="#e7e5e4" />

                    <path d="M 18 72 C 96 58, 158 54, 216 74 S 326 140, 536 142" fill="none" stroke="#c9c2b8" strokeWidth="22" strokeLinecap="round" filter="url(#softRoadShadow)" />
                    <path d="M 24 116 C 110 94, 168 92, 242 118 S 382 154, 500 112" fill="none" stroke="#c9c2b8" strokeWidth="22" strokeLinecap="round" filter="url(#softRoadShadow)" />
                    <path d="M 78 178 C 146 134, 218 146, 280 108 S 390 66, 520 78" fill="none" stroke="#d5cec4" strokeWidth="18" strokeLinecap="round" />
                    <path d="M 64 38 C 122 76, 158 126, 216 126 S 330 82, 456 46" fill="none" stroke="#ddd6cc" strokeWidth="13" strokeLinecap="round" />
                    <path d="M 512 190 C 420 166, 364 156, 296 178 S 156 210, 42 172" fill="none" stroke="#ddd6cc" strokeWidth="13" strokeLinecap="round" />
                    <path d="M 282 24 C 268 82, 286 128, 250 170 S 180 216, 102 206" fill="none" stroke="#ddd6cc" strokeWidth="13" strokeLinecap="round" />
                    <path d="M 18 72 C 96 58, 158 54, 216 74 S 326 140, 536 142" fill="none" stroke="#f8fafc" strokeWidth="2" strokeDasharray="12 12" strokeLinecap="round" opacity="0.9" />
                    <path d="M 24 116 C 110 94, 168 92, 242 118 S 382 154, 500 112" fill="none" stroke="#f8fafc" strokeWidth="2" strokeDasharray="12 12" strokeLinecap="round" opacity="0.9" />
                    <path d="M 78 178 C 146 134, 218 146, 280 108 S 390 66, 520 78" fill="none" stroke="#f8fafc" strokeWidth="1.6" strokeDasharray="10 10" strokeLinecap="round" opacity="0.9" />
                    {COURIER_MAP_ROUTES.map((route, index) => (
                      <path
                        key={index}
                        d={route.path}
                        fill="none"
                        stroke={index % 2 === 0 ? '#b51c00' : '#16a34a'}
                        strokeWidth="2"
                        strokeDasharray="8 10"
                        strokeLinecap="round"
                        opacity="0.34"
                      />
                    ))}
                    <circle cx="250" cy="116" r="5" fill="#b51c00" opacity="0.82" />
                    <circle cx="425" cy="150" r="5" fill="#b51c00" opacity="0.82" />
                    <circle cx="178" cy="64" r="4" fill="#16a34a" opacity="0.8" />
                    <text x="32" y="44" fill="#78716c" fontSize="9" fontWeight="700">Beşiktaş</text>
                    <text x="400" y="54" fill="#78716c" fontSize="9" fontWeight="700">Kadıköy</text>
                    <text x="206" y="184" fill="#166534" fontSize="8" fontWeight="700">Park</text>
                    <text x="18" y="226" fill="#0369a1" fontSize="8" fontWeight="700">Sahil hattı</text>
                  </svg>

                  {couriers.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-xs font-bold text-stone-400">Kurye verisi bulunamadı.</p>
                    </div>
                  ) : (
                    couriers.map((courier, index) => {
                      const visual = getCourierMapVisual(courier, index);

                      return (
                        <div
                          key={courier.id}
                          className={`absolute left-0 top-0 group cursor-pointer ${visual.colorClass} ${visual.isMoving ? 'courier-demo-ride' : 'courier-demo-paused'}`}
                          style={{
                            offsetPath: `path('${visual.path}')`,
                            '--ride-duration': `${visual.duration}s`,
                            '--park-position': `${18 + (index * 13) % 70}%`,
                            animationDelay: `-${index * 3.2}s`,
                          }}
                        >
                          <span className={`material-symbols-outlined text-[28px] select-none drop-shadow-md ${visual.pulseClass}`}>
                            {visual.icon}
                          </span>
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[8px] px-2 py-1 rounded shadow opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 transition-opacity">
                            {courier.name} - {courier.status}
                          </span>
                        </div>
                      );
                    })
                  )}
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
                      {assignableOrders.length === 0 ? (
                        <option value="">Atanacak sipariş yok</option>
                      ) : (
                        assignableOrders.map((order) => (
                          <option key={order.id} value={order.id}>
                            {order.id} ({order.restaurant} - {order.status})
                          </option>
                        ))
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Müsait Kuryeyi Seçin</label>
                    <select 
                      value={selectedCourierToAssign}
                      onChange={(e) => setSelectedCourierToAssign(e.target.value)}
                      className="w-full bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none"
                    >
                      {availableCouriers.length === 0 ? (
                        <option value="">Müsait kurye yok</option>
                      ) : (
                        availableCouriers.map(c => (
                          <option key={c.id} value={c.id}>{c.name} ({c.status} &bull; {c.zone})</option>
                        ))
                      )}
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
                    disabled={!selectedOrderToAssign || !selectedCourierToAssign}
                    className="w-full py-3 bg-primary hover:bg-primary-container text-white font-black text-xs rounded-xl uppercase tracking-wider shadow-md transition-all active:scale-95 disabled:opacity-45 disabled:cursor-not-allowed"
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
                    <h3 className="text-2xl font-black text-stone-800 mt-1">{totalCampaignUsage}</h3>
                  </div>
                  <div className="p-3 bg-rose-50 text-primary rounded-xl">
                    <span className="material-symbols-outlined">shopping_cart_checkout</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">Aktif Kampanya</p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">{activePromos.length}</h3>
                  </div>
                  <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
                    <span className="material-symbols-outlined">savings</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-[24px] border border-stone-100 shadow-soft flex justify-between items-center">
                  <div>
                    <p className="text-stone-400 font-bold text-xs tracking-wide">Kupon Kampanyası</p>
                    <h3 className="text-2xl font-black text-stone-800 mt-1">{couponPromoCount}</h3>
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
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Kampanya Türü</label>
                      <select
                        value={newCampaignType}
                        onChange={(e) => setNewCampaignType(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary"
                      >
                        <option value="free_delivery">Teslimat Ücreti Bedava</option>
                        <option value="coupon_fixed">Sabit Tutar Kuponu</option>
                        <option value="coupon_percent">Yüzde İndirim Kuponu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">Kupon Kodu (Benzersiz)</label>
                      <input 
                        type="text"
                        required={newCampaignType !== 'free_delivery'}
                        disabled={newCampaignType === 'free_delivery'}
                        placeholder="Örn: CRAVEWEEKEND"
                        value={newCampaignCode}
                        onChange={(e) => setNewCampaignCode(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary disabled:opacity-45"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-1">
                        {newCampaignType === 'coupon_percent' ? 'İndirim Yüzdesi (%)' : 'İndirim Tutarı (TL)'}
                      </label>
                      <input 
                        type="number"
                        required
                        disabled={newCampaignType === 'free_delivery'}
                        value={newCampaignDiscount}
                        onChange={(e) => setNewCampaignDiscount(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-200 rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none focus:border-primary disabled:opacity-45"
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
                    {promos.map((promo) => (
                      <tr key={promo.id} className="hover:bg-stone-50/40 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-extrabold text-stone-800 text-xs tracking-wide">{promo.code || 'Otomatik Kampanya'}</p>
                            <p className="text-[10px] text-stone-400 font-semibold">{promo.name || promo.description}</p>
                          </div>
                        </td>
                        <td className="px-4 py-4">{getCampaignTypeLabel(promo.type)}</td>
                        <td className="px-4 py-4 font-black text-primary">{getCampaignRateText(promo)}</td>
                        <td className="px-4 py-4">
                          <span className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded text-[10px] font-bold">
                            Min. {Number(promo.minOrder || 0)} ₺
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col w-28">
                            <span className="text-[10px] text-stone-400 font-bold mb-1">{getCampaignUsageText(promo)}</span>
                            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full" style={{ width: `${getCampaignProgress(promo)}%` }}></div>
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


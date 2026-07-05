import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  addRestaurant,
  deleteRestaurant,
  toggleRestaurantStatus,
  updateRestaurantCommission,
} from "../../features/restaurants/restaurantsSlice.js";
import { updatePlatformOrderStatus } from "../../features/orders/ordersSlice.js";
import api from "../../services/api.js";
import { useToast } from "../../common/components/Toast.jsx";
import AdminCampaignsTab from "./platform/AdminCampaignsTab.jsx";
import AdminCouriersTab from "./platform/AdminCouriersTab.jsx";
import AdminFinanceTab from "./platform/AdminFinanceTab.jsx";
import AdminOverviewTab from "./platform/AdminOverviewTab.jsx";
import AdminOrdersTab from "./platform/AdminOrdersTab.jsx";
import AdminRestaurantsTab from "./platform/AdminRestaurantsTab.jsx";
import AdminSettingsTab from "./platform/AdminSettingsTab.jsx";
import AdminUsersTab from "./platform/AdminUsersTab.jsx";

const DEFAULT_ADMIN_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCW3F7uh6g1Kznczffnq89_eaBUXJq8xASo0zbD3eje_5FDbt5YvAYODYbkYpUnOEh1Hw2G6gPOlJBj9uGmtICPXc7xJGIts_Pe7soyVnnalozY_lL_RLoT8N3gng22vnqC7Q9hGG5FCSn-TtpYKjeTzSZuIxZvnd0sQnEKV_eeRZPLl6XSdbmnYHOffUF_DfOylLNs5qVH5kcor9EUg-LfQCi8dLcsRuaNNac3lG-cjyMYLGlcECKbklmwsAXuYFS93v2MYPGR6Ug";

function formatCurrency(value) {
  return `${Number(value || 0).toLocaleString("tr-TR")} ₺`;
}

function formatPdfCurrency(value) {
  return `${Number(value || 0).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} TL`;
}

function getOrderDate(order) {
  return new Date(order.createdAt || order.date || 0);
}

function isCancelled(order) {
  return (
    order.deliveryStatus === "cancelled" ||
    order.status === "İptal Edildi" ||
    order.status === "Iptal Edildi"
  );
}

function getOrderStatusText(order) {
  if (isCancelled(order)) return "İptal Edildi";
  if (order.deliveryStatus === "delivered") return "Teslim Edildi";
  if (order.deliveryStatus === "on_the_way") return "Yolda";
  if (order.deliveryStatus === "ready") return "Hazır";
  return order.status || "Hazırlanıyor";
}

function getFinancialStatus(order) {
  if (isCancelled(order)) return "İptal Edildi";
  if (order.deliveryStatus === "delivered" || order.status === "Teslim Edildi")
    return "Tamamlandı";
  return "Beklemede";
}

function arrayBufferToBase64(buffer) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    const chunk = bytes.subarray(index, index + chunkSize);
    binary += String.fromCharCode.apply(null, chunk);
  }

  return btoa(binary);
}

async function registerArialFont(doc) {
  const fontCandidates = [
    {
      url: "/fonts/Roboto-Medium.ttf",
      fileName: "Roboto-Medium.ttf",
      family: "JetYemekFont",
    },
    { url: "/fonts/arial.ttf", fileName: "arial.ttf", family: "JetYemekFont" },
    {
      url: "/fonts/Arial.ttf",
      fileName: "Arial.ttf",
      family: "JetYemekFont",
    },
  ];

  for (const font of fontCandidates) {
    try {
      const response = await fetch(font.url);
      if (!response.ok) continue;

      const fontBase64 = arrayBufferToBase64(await response.arrayBuffer());
      doc.addFileToVFS(font.fileName, fontBase64);
      doc.addFont(font.fileName, font.family, "normal", "Identity-H");
      doc.setFont(font.family, "normal");
      doc.setCharSpace(0);
      doc.getTextWidth("Türkçe karakter testi: ğüşöçıİ");
      return true;
    } catch (error) {
      doc.setFont("helvetica", "normal");
      // Bir sonraki font adayını dene.
    }
  }

  doc.setFont("helvetica", "normal");
  doc.setCharSpace(0);
  return false;
}

function normalizePdfText(value, hasUnicodeFont) {
  const text = String(value ?? "");
  if (hasUnicodeFont) return text;

  return text
    .replaceAll("İ", "I")
    .replaceAll("I", "I")
    .replaceAll("ı", "i")
    .replaceAll("Ş", "S")
    .replaceAll("ş", "s")
    .replaceAll("Ğ", "G")
    .replaceAll("ğ", "g")
    .replaceAll("Ü", "U")
    .replaceAll("ü", "u")
    .replaceAll("Ö", "O")
    .replaceAll("ö", "o")
    .replaceAll("Ç", "C")
    .replaceAll("ç", "c");
}

function getCustomerPlatformRole(orderCount) {
  if (orderCount > 10) return "VIP";
  if (orderCount >= 10) return "Elite";
  if (orderCount >= 5) return "Gold";
  if (orderCount >= 3) return "Silver";
  return "Yeni";
}

function formatJoinedDate(user) {
  const dateValue = user.createdAt || user.joinedAt || user.registeredAt;
  if (!dateValue) return "-";

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const ORDER_STATUS_OPTIONS = [
  {
    label: "Hazırlanıyor",
    status: "Hazırlanıyor",
    deliveryStatus: "preparing",
    progress: 10,
    icon: "restaurant",
  },
  {
    label: "Sipariş Hazır",
    status: "Sipariş Hazır",
    deliveryStatus: "ready",
    progress: 35,
    icon: "inventory_2",
  },
  {
    label: "Kurye Yola Çıktı",
    status: "Kurye Yola Çıktı",
    deliveryStatus: "on_the_way",
    progress: 55,
    icon: "local_shipping",
  },
  {
    label: "Teslim Edildi",
    status: "Teslim Edildi",
    deliveryStatus: "delivered",
    progress: 100,
    icon: "check_circle",
  },
  {
    label: "İptal Edildi",
    status: "İptal Edildi",
    deliveryStatus: "cancelled",
    progress: 0,
    icon: "cancel",
  },
];

const COURIER_MAP_ROUTES = [
  {
    path: "M 24 116 C 110 94, 168 92, 242 118 S 382 154, 500 112",
    duration: 24,
  },
  { path: "M 64 38 C 122 76, 158 126, 216 126 S 330 82, 456 46", duration: 22 },
  {
    path: "M 78 178 C 146 134, 218 146, 280 108 S 390 66, 520 78",
    duration: 27,
  },
  {
    path: "M 512 190 C 420 166, 364 156, 296 178 S 156 210, 42 172",
    duration: 26,
  },
  {
    path: "M 282 24 C 268 82, 286 128, 250 170 S 180 216, 102 206",
    duration: 23,
  },
  { path: "M 18 72 C 96 58, 158 54, 216 74 S 326 140, 536 142", duration: 29 },
];

function getCourierMapVisual(courier, index) {
  const route = COURIER_MAP_ROUTES[index % COURIER_MAP_ROUTES.length];
  const isBusy = courier.status === "Teslimatta";
  const isAvailable =
    courier.status === "Müsait" || courier.status === "Beklemede";

  return {
    ...route,
    icon: courier.vehicle?.toLowerCase().includes("bisiklet")
      ? "pedal_bike"
      : "motorcycle",
    colorClass: isBusy
      ? "text-primary"
      : isAvailable
        ? "text-green-600"
        : "text-stone-400",
    pulseClass: isAvailable ? "animate-pulse" : "",
    isMoving: courier.status !== "Çevrimdışı",
  };
}

function getCampaignTypeLabel(type) {
  if (type === "free_delivery") return "Teslimat Kampanyası";
  if (type === "coupon_fixed") return "Sabit Kupon";
  if (type === "coupon_percent") return "Yüzde Kupon";
  return "Kampanya";
}

function getCampaignRateText(campaign) {
  if (campaign.type === "free_delivery")
    return `${Number(campaign.discountValue || 0)} TL teslimat`;
  if (campaign.type === "coupon_fixed")
    return `${Number(campaign.discountValue || 0)} TL`;
  if (campaign.type === "coupon_percent")
    return `%${Number(campaign.discountValue || 0)}`;
  return "-";
}

function getCampaignUsageText(campaign) {
  const usageCount = Number(campaign.usageCount || 0);
  return campaign.usageLimit
    ? `${usageCount} / ${campaign.usageLimit}`
    : `${usageCount} / sınırsız`;
}

function getCampaignProgress(campaign) {
  if (!campaign.usageLimit) return 0;
  return Math.min(
    100,
    (Number(campaign.usageCount || 0) / Number(campaign.usageLimit)) * 100,
  );
}

export default function PlatformAdminDashboard({
  onExitAdmin,
  propActiveTab,
  hideSidebar,
}) {
  const addToast = useToast();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // Navigation tabs for Super Admin
  const [localActiveTab, setLocalActiveTab] = useState("overview"); // 'overview' | 'restaurants' | 'users' | 'orders' | 'couriers' | 'campaigns' | 'finance' | 'settings'
  const activeTab = propActiveTab || localActiveTab;
  const setActiveTab = propActiveTab ? () => {} : setLocalActiveTab;

  // Redux'tan restoranları al
  const reduxRestaurants = useSelector((state) => state.restaurants.list);
  const platformOrders = useSelector((state) => state.orders.platformOrders);
  const currentUser = useSelector((state) => state.auth.currentUser);
  const restaurants = reduxRestaurants;

  // Search queries for various tabs
  const [searchQuery, setSearchQuery] = useState("");

  // Platform Load Simulation state
  const [platformLoad, setPlatformLoad] = useState(38);
  const [showLogs, setShowLogs] = useState(false);

  const paidOrders = platformOrders.filter((order) => !isCancelled(order));
  const totalRevenue = paidOrders.reduce(
    (sum, order) => sum + (Number(order.total) || 0),
    0,
  );
  const deliveredOrders = platformOrders.filter(
    (order) => order.deliveryStatus === "delivered",
  ).length;
  const successRate = platformOrders.length
    ? ((deliveredOrders / platformOrders.length) * 100).toFixed(1)
    : "0.0";
  const uniqueCustomers = new Set(
    platformOrders.map((order) => order.userId).filter(Boolean),
  ).size;
  const commissionRevenue = paidOrders.reduce((sum, order) => {
    const restaurant = restaurants.find(
      (item) => item.id === order.restaurantId,
    );
    const commission = Number(restaurant?.commission ?? 12);
    return sum + ((Number(order.total) || 0) * commission) / 100;
  }, 0);

  const orders = useMemo(
    () =>
      [...platformOrders]
        .sort((a, b) => getOrderDate(b) - getOrderDate(a))
        .map((order) => ({
          id: order.id,
          customer: order.customerName || "Müşteri",
          restaurant:
            restaurants.find((item) => item.id === order.restaurantId)?.name ||
            order.restaurant ||
            "Restoran",
          total: Number(order.total) || 0,
          status: getOrderStatusText(order),
          deliveryStatus: order.deliveryStatus,
          progress: order.progress,
          time: getOrderDate(order).toLocaleString("tr-TR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          }),
        })),
    [platformOrders, restaurants],
  );

  const topRestaurants = useMemo(() => {
    const salesByRestaurant = {};

    paidOrders.forEach((order) => {
      const id = order.restaurantId || "unknown";
      if (!salesByRestaurant[id]) {
        const restaurant = restaurants.find((item) => item.id === id);
        salesByRestaurant[id] = {
          id,
          name: restaurant?.name || order.restaurant || "Restoran",
          image: restaurant?.image || "",
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

  const maxRestaurantRevenue = Math.max(
    ...topRestaurants.map((item) => item.revenue),
    1,
  );
  const monthlyOrderBars = useMemo(() => {
    const today = new Date();
    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - (11 - index),
        1,
      );
      const monthOrders = paidOrders.filter((order) => {
        const orderDate = getOrderDate(order);
        return (
          orderDate.getFullYear() === date.getFullYear() &&
          orderDate.getMonth() === date.getMonth()
        );
      });
      const revenue = monthOrders.reduce(
        (sum, order) => sum + (Number(order.total) || 0),
        0,
      );

      return {
        label: date.toLocaleDateString("tr-TR", { month: "short" }),
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
      title: "Toplam Platform Cirosu (GMV)",
      value: formatCurrency(totalRevenue),
      change: `${paidOrders.length} sipariş`,
      isPositive: true,
      icon: "payments",
      desc: "Kayıtlı siparişlerden hesaplanan brüt işlem hacmi",
      color: "primary",
    },
    {
      title: "Aktif Platform Kullanıcısı",
      value: String(uniqueCustomers),
      change: "Gerçek veri",
      isPositive: true,
      icon: "group",
      desc: "Sipariş veren tekil müşteri sayısı",
      color: "tertiary",
    },
    {
      title: "Platform Komisyon Geliri",
      value: formatCurrency(commissionRevenue),
      change: "Komisyon",
      isPositive: true,
      icon: "account_balance_wallet",
      desc: "Restoran komisyon oranlarına göre hesaplandı",
      color: "secondary",
    },
    {
      title: "Sipariş Başarı Oranı",
      value: `%${successRate}`,
      change: `${deliveredOrders} teslim`,
      isPositive: true,
      icon: "bolt",
      desc: "Teslim edilen siparişlerin toplam siparişe oranı",
      color: "amber",
    },
  ];

  // System logs mock
  const systemLogs = [
    {
      time: "16:04:12",
      type: "INFO",
      msg: "Napoli Antica restoranı menü güncellemesi yaptı.",
    },
    {
      time: "15:58:32",
      type: "SUCCESS",
      msg: "Sipariş #VH-9421 kurye Ahmet Yılmaz tarafından teslim edildi.",
    },
    {
      time: "15:42:01",
      type: "WARNING",
      msg: "Kurye Mehmet Tan teslimat süresi sınırına yaklaşıyor (Sipariş #VH-9420).",
    },
    {
      time: "15:30:15",
      type: "INFO",
      msg: "Yeni kullanıcı kaydı oluşturuldu: can.kaya@gmail.com",
    },
    {
      time: "15:15:00",
      type: "SYSTEM",
      msg: "Platform genel komisyon oranı %12 olarak güncellendi.",
    },
  ];

  // 1. Restaurant Management Tab State — Redux'a bağlı
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddRestaurant, setShowAddRestaurant] = useState(false);
  const [newRestName, setNewRestName] = useState("");
  const [newRestCategory, setNewRestCategory] = useState("Fast Food");
  const [newRestComm, setNewRestCommission] = useState("12");
  const [newRestCity, setNewRestCity] = useState("Kadıköy, İstanbul");
  const [newRestEmail, setNewRestEmail] = useState("");
  const [newRestPassword, setNewRestPassword] = useState("");
  const [commissionModal, setCommissionModal] = useState(null);
  const [commissionValue, setCommissionValue] = useState("");
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
    setCommissionValue("");
  };

  const handleUpdateCommission = (event) => {
    event.preventDefault();
    const commission = Number(commissionValue);

    if (
      !commissionModal ||
      Number.isNaN(commission) ||
      commission < 0 ||
      commission > 100
    ) {
      addToast({
        message: "Lütfen 0 ile 100 arasında geçerli bir komisyon oranı girin.",
        type: "error",
      });
      return;
    }

    dispatch(
      updateRestaurantCommission({ id: commissionModal.id, commission }),
    );
    addToast({ message: "Komisyon oranı güncellendi.", type: "success" });
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
    addToast({ message: "Restoran platformdan kaldırıldı.", type: "success" });
    closeDeleteModal();
  };

  const handleAddRestaurantSubmit = async (e) => {
    e.preventDefault();
    if (!newRestName.trim()) return;

    const restId =
      "rest-" +
      newRestName
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "") +
      "-" +
      Date.now();
    const defaultRestaurantImage =
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U";
    const restaurantPayload = {
      id: restId,
      name: newRestName.trim(),
      category: newRestCategory,
      commission: parseFloat(newRestComm) || 12,
      status: "Aktif",
      isOpen: true,
      isSponsor: false,
      city: newRestCity,
      rating: "5.0",
      time: "30-40 dk",
      deliveryFee: "Ücretsiz",
      minOrder: "100 TL",
      tag: "restoran",
      image: defaultRestaurantImage,
      bannerImage: "",
      description: "",
      deliveryZones: newRestCity,
      address: newRestCity,
      phone: "",
      email: newRestEmail.trim(),
      holidayMode: false,
      holidayStart: "",
      holidayEnd: "",
    };

    try {
      const savedRestaurantResponse = await api.post(
        "/restaurants",
        restaurantPayload,
      );
      dispatch(addRestaurant(savedRestaurantResponse.data));

      if (newRestEmail.trim()) {
        await api.post("/users", {
          id: restId + "-user",
          role: "restaurant",
          email: newRestEmail.trim(),
          password: newRestPassword || "rest123",
          restaurantId: restId,
          name: newRestName.trim(),
          avatar: defaultRestaurantImage,
        });
      }
    } catch (_) {
      addToast({
        message: "Restoran kaydedilirken bir sorun oluştu.",
        type: "error",
      });
      return;
    }

    addToast({
      message: `"${newRestName}" restoranı platforma eklendi ve müşteri paneline yansıdı!`,
      type: "success",
    });
    setNewRestName("");
    setNewRestEmail("");
    setNewRestPassword("");
    setShowAddRestaurant(false);
  };

  // 2. User Management Tab State
  const [users, setUsers] = useState([]);
  const [userDeleteModal, setUserDeleteModal] = useState(null);

  useEffect(() => {
    async function loadUsers() {
      try {
        const response = await api.get("/users");
        const customerUsers = (response.data || []).filter(
          (user) => user.role === "customer",
        );
        setUsers(customerUsers);
      } catch (error) {
        setUsers([]);
      }
    }

    loadUsers();
  }, []);

  const enrichedUsers = useMemo(
    () =>
      users.map((user) => {
        const orderCount = platformOrders.filter(
          (order) => String(order.userId) === String(user.id),
        ).length;
        const fullName =
          `${user.name || ""} ${user.surname || ""}`.trim() ||
          user.email ||
          "İsimsiz Kullanıcı";

        return {
          ...user,
          name: fullName,
          orders: orderCount,
          platformRole: getCustomerPlatformRole(orderCount),
          joined: formatJoinedDate(user),
          status: user.status || "Aktif",
        };
      }),
    [users, platformOrders],
  );

  const handleToggleUserStatus = async (id) => {
    const user = users.find((item) => String(item.id) === String(id));
    if (!user) return;

    const nextStatus = (user.status || "Aktif") === "Aktif" ? "Pasif" : "Aktif";

    try {
      const response = await api.patch(`/users/${id}`, { status: nextStatus });
      setUsers((prev) =>
        prev.map((item) =>
          String(item.id) === String(id) ? { ...item, ...response.data } : item,
        ),
      );
      addToast({ message: "Kullanıcı durumu güncellendi.", type: "success" });
    } catch (error) {
      addToast({
        message: "Kullanıcı durumu güncellenirken bir sorun oluştu.",
        type: "error",
      });
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
      setUsers((prev) =>
        prev.filter((user) => String(user.id) !== String(userDeleteModal.id)),
      );
      addToast({
        message: "Kullanıcı platformdan kaldırıldı.",
        type: "success",
      });
      closeUserDeleteModal();
    } catch (error) {
      addToast({
        message: "Kullanıcı silinirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  const [orderStatusModal, setOrderStatusModal] = useState(null);
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 10;
  const totalOrderPages = Math.max(1, Math.ceil(orders.length / ordersPerPage));
  const paginatedOrders = orders.slice(
    (ordersPage - 1) * ordersPerPage,
    ordersPage * ordersPerPage,
  );

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

  const handleUpdateOrderStatus = async (
    statusOption,
    targetOrder = orderStatusModal,
  ) => {
    if (!targetOrder?.id) return;

    try {
      const response = await api.patch(`/orders/${targetOrder.id}`, {
        status: statusOption.status,
        deliveryStatus: statusOption.deliveryStatus,
        progress: statusOption.progress,
      });

      dispatch(
        updatePlatformOrderStatus({
          id: response.data.id,
          status: response.data.status,
          deliveryStatus: response.data.deliveryStatus,
          progress: response.data.progress,
        }),
      );
      addToast({
        message: `Sipariş durumu "${statusOption.label}" olarak güncellendi.`,
        type: "success",
      });
      if (orderStatusModal?.id === targetOrder.id) {
        closeOrderStatusModal();
      }
    } catch (error) {
      addToast({
        message: "Sipariş durumu güncellenirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  // 4. Courier Management State
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    async function loadCouriers() {
      try {
        const response = await api.get("/couriers");
        setCouriers(response.data || []);
      } catch (error) {
        setCouriers([]);
      }
    }

    loadCouriers();
  }, []);

  const [selectedOrderToAssign, setSelectedOrderToAssign] = useState("");
  const [selectedCourierToAssign, setSelectedCourierToAssign] =
    useState("courier-2");

  const activeCouriers = couriers.filter(
    (courier) => courier.status !== "Çevrimdışı",
  );
  const deliveryCouriers = couriers.filter(
    (courier) => courier.status === "Teslimatta",
  );
  const availableCouriers = couriers.filter(
    (courier) => courier.status === "Müsait" || courier.status === "Beklemede",
  );
  const assignableOrders = orders.filter(
    (order) =>
      order.deliveryStatus === "ready" ||
      order.status === "Sipariş Hazır" ||
      order.status === "Hazır" ||
      order.deliveryStatus === "preparing",
  );

  useEffect(() => {
    if (assignableOrders.length === 0) {
      if (selectedOrderToAssign) setSelectedOrderToAssign("");
      return;
    }

    if (
      !assignableOrders.find(
        (order) => String(order.id) === String(selectedOrderToAssign),
      )
    ) {
      setSelectedOrderToAssign(assignableOrders[0].id);
    }
  }, [assignableOrders, selectedOrderToAssign]);

  useEffect(() => {
    if (availableCouriers.length === 0) {
      if (selectedCourierToAssign) setSelectedCourierToAssign("");
      return;
    }

    if (
      !availableCouriers.find(
        (courier) => String(courier.id) === String(selectedCourierToAssign),
      ) &&
      availableCouriers.length > 0
    ) {
      setSelectedCourierToAssign(availableCouriers[0].id);
    }
  }, [availableCouriers, selectedCourierToAssign]);

  const handleAssignOrder = async () => {
    const selectedCourier = couriers.find(
      (c) => String(c.id) === String(selectedCourierToAssign),
    );
    const selectedOrder = orders.find(
      (order) => String(order.id) === String(selectedOrderToAssign),
    );

    if (!selectedCourier || !selectedOrder) {
      addToast({
        message: "Atama için sipariş ve kurye seçmelisiniz.",
        type: "error",
      });
      return;
    }

    try {
      const [courierResponse, orderResponse] = await Promise.all([
        api.patch(`/couriers/${selectedCourier.id}`, { status: "Teslimatta" }),
        api.patch(`/orders/${selectedOrder.id}`, {
          status: "Kurye Yola Çıktı",
          deliveryStatus: "on_the_way",
          progress: 55,
          courierId: selectedCourier.id,
          courierName: selectedCourier.name,
        }),
      ]);

      setCouriers((prev) =>
        prev.map((c) =>
          String(c.id) === String(selectedCourier.id)
            ? { ...c, ...courierResponse.data }
            : c,
        ),
      );
      dispatch(
        updatePlatformOrderStatus({
          id: orderResponse.data.id,
          status: orderResponse.data.status,
          deliveryStatus: orderResponse.data.deliveryStatus,
          progress: orderResponse.data.progress,
        }),
      );
      addToast({
        message: `Sipariş #${selectedOrder.id}, kurye ${selectedCourier.name} üzerine başarıyla atandı.`,
        type: "success",
      });
    } catch (error) {
      addToast({
        message: "Kurye ataması yapılırken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  // 5. Campaign & Promotion Management State
  const [promos, setPromos] = useState([]);

  const [newCampaignName, setNewCampaignName] = useState("");
  const [newCampaignCode, setNewCampaignCode] = useState("");
  const [newCampaignType, setNewCampaignType] = useState("coupon_percent");
  const [newCampaignDiscount, setNewCampaignDiscount] = useState("20");
  const [newCampaignMin, setNewCampaignMin] = useState("150");
  const [campaignDeleteModal, setCampaignDeleteModal] = useState(null);
  const activePromos = promos.filter((promo) => promo.status === "Aktif");
  const totalCampaignUsage = promos.reduce(
    (sum, promo) => sum + Number(promo.usageCount || 0),
    0,
  );
  const couponPromoCount = promos.filter(
    (promo) => promo.type !== "free_delivery",
  ).length;

  useEffect(() => {
    async function loadCampaigns() {
      try {
        const response = await api.get("/campaigns");
        setPromos(response.data || []);
      } catch (error) {
        setPromos([]);
      }
    }

    loadCampaigns();
  }, []);

  const handleLaunchCampaign = async (e) => {
    e.preventDefault();
    if (newCampaignType !== "free_delivery" && !newCampaignCode.trim()) return;

    const newPromo = {
      id: "camp-" + Date.now(),
      name: newCampaignName || "Yeni Kampanya",
      code:
        newCampaignType === "free_delivery"
          ? ""
          : newCampaignCode.toUpperCase().trim(),
      type: newCampaignType,
      discountValue:
        newCampaignType === "free_delivery"
          ? 50
          : Number(newCampaignDiscount || 0),
      minOrder: Number(newCampaignMin || 0),
      status: "Aktif",
      usageCount: 0,
      usageLimit: newCampaignType === "free_delivery" ? null : 10000,
      description:
        newCampaignType === "free_delivery"
          ? `${newCampaignMin} TL üzeri siparişlerde teslimat ücreti bedava`
          : `${newCampaignMin} TL üzeri siparişlerde geçerli kupon`,
    };

    try {
      const response = await api.post("/campaigns", newPromo);
      setPromos((prev) => [response.data, ...prev]);
      setNewCampaignName("");
      setNewCampaignCode("");
      addToast({ message: "Yeni kampanya yayına alındı.", type: "success" });
    } catch (error) {
      addToast({
        message: "Kampanya kaydedilirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  const handleToggleCampaignStatus = async (campaign) => {
    const nextStatus = campaign.status === "Aktif" ? "Pasif" : "Aktif";

    try {
      const response = await api.patch(`/campaigns/${campaign.id}`, {
        status: nextStatus,
      });
      setPromos((prev) =>
        prev.map((promo) =>
          String(promo.id) === String(campaign.id)
            ? { ...promo, ...response.data }
            : promo,
        ),
      );
      addToast({
        message: `Kampanya ${nextStatus.toLowerCase()} duruma alındı.`,
        type: "success",
      });
    } catch (error) {
      addToast({
        message: "Kampanya durumu güncellenirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  const openCampaignDeleteModal = (campaign) => {
    setCampaignDeleteModal(campaign);
  };

  const closeCampaignDeleteModal = () => {
    setCampaignDeleteModal(null);
  };

  const handleDeleteCampaign = async () => {
    if (!campaignDeleteModal?.id) return;

    try {
      await api.delete(`/campaigns/${campaignDeleteModal.id}`);
      setPromos((prev) =>
        prev.filter(
          (promo) => String(promo.id) !== String(campaignDeleteModal.id),
        ),
      );
      addToast({ message: "Kampanya silindi.", type: "success" });
      closeCampaignDeleteModal();
    } catch (error) {
      addToast({
        message: "Kampanya silinirken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  // 6. Payments and Financial Logs State
  const [financeSearch, setFinanceSearch] = useState("");
  const [financeSort, setFinanceSort] = useState("amount_desc");
  const [financePage, setFinancePage] = useState(1);
  const [pdfLoading, setPdfLoading] = useState(false);

  const financials = useMemo(
    () =>
      [...platformOrders]
        .sort((a, b) => getOrderDate(b) - getOrderDate(a))
        .map((order) => {
          const restaurant = restaurants.find(
            (item) => String(item.id) === String(order.restaurantId),
          );
          const gross = Number(order.total) || 0;
          const commissionRate = Number(restaurant?.commission ?? 12);
          const comm = isCancelled(order) ? 0 : (gross * commissionRate) / 100;
          const net = isCancelled(order) ? 0 : gross - comm;
          const orderDate = getOrderDate(order);

          return {
            id: order.id,
            restaurant:
              restaurant?.name ||
              order.restaurant ||
              order.restaurantName ||
              "Restoran",
            date: Number.isNaN(orderDate.getTime())
              ? "-"
              : orderDate.toLocaleString("tr-TR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
            dateValue: Number.isNaN(orderDate.getTime())
              ? 0
              : orderDate.getTime(),
            gross,
            comm,
            net,
            commissionRate,
            status: getFinancialStatus(order),
          };
        }),
    [platformOrders, restaurants],
  );

  const filteredFinancials = useMemo(() => {
    const searchText = financeSearch.trim().toLocaleLowerCase("tr-TR");
    const searchedFinancials = financials.filter(
      (ledger) =>
        !searchText ||
        String(ledger.id).toLocaleLowerCase("tr-TR").includes(searchText) ||
        ledger.restaurant.toLocaleLowerCase("tr-TR").includes(searchText) ||
        ledger.status.toLocaleLowerCase("tr-TR").includes(searchText),
    );

    return [...searchedFinancials].sort((a, b) => {
      if (financeSort === "amount_asc") return a.gross - b.gross;
      if (financeSort === "commission_desc") return b.comm - a.comm;
      if (financeSort === "date_desc") return b.dateValue - a.dateValue;
      return b.gross - a.gross;
    });
  }, [financeSearch, financeSort, financials]);

  const financePerPage = 10;
  const financeTotalPages = Math.max(
    1,
    Math.ceil(filteredFinancials.length / financePerPage),
  );
  const paginatedFinancials = filteredFinancials.slice(
    (financePage - 1) * financePerPage,
    financePage * financePerPage,
  );
  const financeGrossTotal = financials.reduce(
    (sum, ledger) =>
      sum + (ledger.status === "İptal Edildi" ? 0 : ledger.gross),
    0,
  );
  const financeCommissionTotal = financials.reduce(
    (sum, ledger) => sum + ledger.comm,
    0,
  );
  const financeRestaurantPayout = financials.reduce(
    (sum, ledger) => sum + ledger.net,
    0,
  );
  const averageCommissionRate = financials.length
    ? financials.reduce((sum, ledger) => sum + ledger.commissionRate, 0) /
      financials.length
    : 0;

  useEffect(() => {
    setFinancePage(1);
  }, [financeSearch, financeSort]);

  useEffect(() => {
    if (financePage > financeTotalPages) {
      setFinancePage(financeTotalPages);
    }
  }, [financePage, financeTotalPages]);

  const handleDownloadPDF = async () => {
    setPdfLoading(true);

    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "mm", format: "a4" });
      const hasArialFont = await registerArialFont(doc);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 14;
      const primary = [225, 29, 72];
      const primaryDark = [190, 18, 60];
      const roseLight = [255, 241, 242];
      const stoneText = [41, 37, 36];
      const mutedText = [120, 113, 108];
      const border = [231, 229, 228];
      let y = 16;
      const pdfText = (value) => normalizePdfText(value, hasArialFont);

      const addPageFooter = () => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(7);
        doc.setTextColor(...mutedText);
        doc.text(
          pdfText(`JetYemek Finans Raporu • Sayfa ${pageCount}`),
          margin,
          pageHeight - 8,
        );
      };

      const drawCoverHeader = () => {
        doc.setFillColor(...primary);
        doc.roundedRect(margin, y, pageWidth - margin * 2, 24, 4, 4, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(17);
        doc.text(pdfText("JetYemek Finans Raporu"), margin + 7, y + 10);
        doc.setFontSize(8.5);
        doc.text(
          pdfText(`Oluşturma Tarihi: ${new Date().toLocaleString("tr-TR")}`),
          margin + 7,
          y + 17,
        );
        y += 32;
      };

      const drawSummaryCard = (x, title, value, note) => {
        doc.setFillColor(...roseLight);
        doc.setDrawColor(...border);
        doc.roundedRect(x, y, 56, 25, 3, 3, "FD");
        doc.setTextColor(...mutedText);
        doc.setFontSize(7.5);
        doc.text(pdfText(title), x + 4, y + 7);
        doc.setTextColor(...primaryDark);
        doc.setFontSize(11);
        doc.text(pdfText(value), x + 4, y + 15);
        doc.setTextColor(...mutedText);
        doc.setFontSize(6.8);
        doc.text(pdfText(note), x + 4, y + 21);
      };

      drawCoverHeader();
      drawSummaryCard(
        margin,
        "Platform Cirosu",
        formatPdfCurrency(financeGrossTotal),
        "İptal dışı siparişler",
      );
      drawSummaryCard(
        margin + 62,
        "Komisyon Geliri",
        formatPdfCurrency(financeCommissionTotal),
        "Restoran oranlarına göre",
      );
      drawSummaryCard(
        margin + 124,
        "Restoran Hak Edişi",
        formatPdfCurrency(financeRestaurantPayout),
        `${filteredFinancials.length} kayıt`,
      );
      y += 35;

      const columns = [
        { key: "id", label: "İşlem", x: margin, width: 26, align: "left" },
        { key: "restaurant", label: "Restoran", x: 40, width: 43, align: "left" },
        { key: "date", label: "Tarih", x: 84, width: 34, align: "left" },
        { key: "gross", label: "Brüt", x: 119, width: 24, align: "right" },
        { key: "comm", label: "Komisyon", x: 144, width: 25, align: "right" },
        { key: "net", label: "Net", x: 170, width: 26, align: "right" },
      ];
      const tableWidth = pageWidth - margin * 2;
      const rowHeight = 10;

      const drawHeader = () => {
        doc.setFillColor(...primary);
        doc.roundedRect(margin, y, tableWidth, 9, 2, 2, "F");
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(7.5);
        columns.forEach((column) => {
          const textX =
            column.align === "right" ? column.x + column.width - 2 : column.x + 2;
          doc.text(pdfText(column.label), textX, y + 5.8, {
            align: column.align === "right" ? "right" : "left",
          });
        });
        y += 9;
      };

      drawHeader();

      filteredFinancials.forEach((ledger, index) => {
        if (y > pageHeight - 18) {
          addPageFooter();
          doc.addPage();
          y = 16;
          drawHeader();
        }

        doc.setFillColor(index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250, index % 2 === 0 ? 255 : 250);
        doc.rect(margin, y, tableWidth, rowHeight, "F");
        doc.setDrawColor(...border);
        doc.line(margin, y + rowHeight, pageWidth - margin, y + rowHeight);
        doc.setFontSize(7.2);

        const values = {
          id: `#${ledger.id}`,
          restaurant: ledger.restaurant,
          date: ledger.date,
          gross: formatPdfCurrency(ledger.gross),
          comm: `-${formatPdfCurrency(ledger.comm)}`,
          net: formatPdfCurrency(ledger.net),
        };

        columns.forEach((column) => {
          const text = doc.splitTextToSize(pdfText(values[column.key]), column.width - 3)[0] || "";
          const isMoney = ["gross", "comm", "net"].includes(column.key);
          doc.setTextColor(column.key === "comm" ? primaryDark[0] : stoneText[0], column.key === "comm" ? primaryDark[1] : stoneText[1], column.key === "comm" ? primaryDark[2] : stoneText[2]);
          if (!isMoney && column.key !== "restaurant") doc.setTextColor(...mutedText);

          const textX =
            column.align === "right" ? column.x + column.width - 2 : column.x + 2;
          doc.text(text, textX, y + 6.4, {
            align: column.align === "right" ? "right" : "left",
          });
        });

        y += rowHeight;
      });

      addPageFooter();
      doc.save(
        `jetyemek-finans-raporu-${new Date().toISOString().slice(0, 10)}.pdf`,
      );
      setPdfLoading(false);
      addToast({
        message: hasArialFont
          ? "Finans raporu indirildi."
          : "Finans raporu indirildi. Türkçe karakterler için public/fonts/arial.ttf dosyasını ekleyin.",
        type: "success",
      });
    } catch (error) {
      setPdfLoading(false);
      addToast({
        message: "Finans raporu oluşturulurken bir sorun oluştu.",
        type: "error",
      });
    }
  };

  // 7. General Settings State
  const [platformSettingsId, setPlatformSettingsId] = useState(null);
  const [baseCommission, setBaseCommission] = useState("12");
  const [baseDeliveryFee, setBaseDeliveryFee] = useState("24.90");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [adminProfileName, setAdminProfileName] = useState("Cansu Yılmaz");
  const [adminEmail, setAdminProfileEmail] = useState(
    "cansu.y@vibranthearth.com",
  );
  const [adminAvatar, setAdminAvatar] = useState("");
  const [savedPlatformSettings, setSavedPlatformSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsSaving, setSettingsSaving] = useState(false);

  const applyPlatformSettings = (settings) => {
    if (!settings) return;

    setPlatformSettingsId(settings.id || null);
    setBaseCommission(String(settings.baseCommission ?? 12));
    setBaseDeliveryFee(String(settings.baseDeliveryFee ?? 24.9));
    setEmailNotifs(settings.emailNotifications ?? true);
    setSmsNotifs(settings.smsNotifications ?? false);
    setAdminProfileName(settings.adminName || currentUser?.name || "Platform Admin");
    setAdminProfileEmail(settings.adminEmail || currentUser?.email || "admin@jetyemek.com");
    setAdminAvatar(settings.adminAvatar || currentUser?.avatar || "");
    setSavedPlatformSettings(settings);
  };

  useEffect(() => {
    async function loadPlatformSettings() {
      setSettingsLoading(true);

      try {
        const response = await api.get("/settings");
        const settings = (response.data || [])[0] || null;

        if (settings) {
          applyPlatformSettings(settings);
        } else {
          const fallbackSettings = {
            id: "platform",
            baseCommission: 12,
            baseDeliveryFee: 24.9,
            emailNotifications: true,
            smsNotifications: false,
            adminName: currentUser?.name || "Platform Admin",
            adminEmail: currentUser?.email || "admin@jetyemek.com",
            adminAvatar: currentUser?.avatar || "",
          };
          const createResponse = await api.post("/settings", fallbackSettings);
          applyPlatformSettings(createResponse.data);
        }
      } catch (error) {
        addToast({ message: "Platform ayarları yüklenirken bir sorun oluştu.", type: "error" });
      } finally {
        setSettingsLoading(false);
      }
    }

    loadPlatformSettings();
  }, [currentUser?.avatar, currentUser?.email, currentUser?.name]);

  const handleResetSystemSettings = () => {
    applyPlatformSettings(savedPlatformSettings);
    addToast({ message: "Değişiklikler geri alındı.", type: "success" });
  };

  const handleSaveSystemSettings = async () => {
    const commissionValue = Number(baseCommission);
    const deliveryFeeValue = Number(String(baseDeliveryFee).replace(",", "."));

    if (Number.isNaN(commissionValue) || commissionValue < 0 || commissionValue > 100) {
      addToast({ message: "Komisyon oranı 0 ile 100 arasında olmalı.", type: "error" });
      return;
    }

    if (Number.isNaN(deliveryFeeValue) || deliveryFeeValue < 0) {
      addToast({ message: "Teslimat ücreti geçerli bir tutar olmalı.", type: "error" });
      return;
    }

    const payload = {
      baseCommission: commissionValue,
      baseDeliveryFee: deliveryFeeValue,
      emailNotifications: emailNotifs,
      smsNotifications: smsNotifs,
      adminName: adminProfileName.trim() || "Platform Admin",
      adminEmail: adminEmail.trim() || "admin@jetyemek.com",
      adminAvatar: adminAvatar.trim(),
      updatedAt: new Date().toISOString(),
    };

    setSettingsSaving(true);

    try {
      const response = platformSettingsId
        ? await api.patch(`/settings/${platformSettingsId}`, payload)
        : await api.post("/settings", { id: "platform", ...payload });

      applyPlatformSettings(response.data);
      window.dispatchEvent(
        new CustomEvent("platformSettingsUpdated", { detail: response.data }),
      );
      addToast({ message: "Sistem ayarları kaydedildi.", type: "success" });
    } catch (error) {
      addToast({ message: "Sistem ayarları kaydedilirken bir sorun oluştu.", type: "error" });
    } finally {
      setSettingsSaving(false);
    }
  };

  // Helper filters
  const filteredRestaurants = restaurants.filter(
    (r) =>
      (r.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.category || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredUsers = enrichedUsers.filter(
    (u) =>
      (u.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const visibleAdminName = adminProfileName.trim() || "Platform Admin";
  const visibleAdminEmail = adminEmail.trim() || "admin@jetyemek.com";
  const visibleAdminAvatar = adminAvatar.trim() || DEFAULT_ADMIN_AVATAR;

  return (
    <div
      className={
        hideSidebar
          ? "w-full text-stone-800 bg-stone-50/40"
          : "min-h-screen bg-stone-50/40 flex text-stone-800 font-sans antialiased"
      }
    >
      {/* SIDEBAR NAVIGATION */}
      {!hideSidebar && (
        <aside className="w-72 bg-white border-r border-rose-100/10 flex flex-col py-6 px-4 shrink-0 fixed top-0 bottom-0 left-0 z-40 shadow-sm">
          {/* Brand Header */}
          <div className="mb-8 px-3 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-md shadow-primary/10">
              <span className="material-symbols-outlined text-[24px]">
                fastfood
              </span>
            </div>
            <div>
              <h1 className="text-lg font-black text-primary leading-tight">
                CraveDash
              </h1>
              <p className="text-[10px] font-extrabold text-stone-400 uppercase tracking-wider">
                Platform Admin
              </p>
            </div>
          </div>

          {/* Navigation list */}
          <nav className="flex-1 space-y-1.5 overflow-y-auto pr-1">
            <button
              onClick={() => {
                setActiveTab("overview");
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                dashboard
              </span>
              Genel Bakış
            </button>

            <button
              onClick={() => {
                setActiveTab("restaurants");
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === "restaurants"
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                store
              </span>
              Restoran Yönetimi
            </button>

            <button
              onClick={() => {
                setActiveTab("users");
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === "users"
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                group
              </span>
              Müşteri Yönetimi
            </button>

            <button
              onClick={() => {
                setActiveTab("orders");
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                receipt_long
              </span>
              Sipariş Yönetimi
            </button>

            <button
              onClick={() => {
                setActiveTab("couriers");
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === "couriers"
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                delivery_dining
              </span>
              Kurye Yönetimi
            </button>

            <button
              onClick={() => {
                setActiveTab("campaigns");
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === "campaigns"
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                campaign
              </span>
              Kampanya & Promosyon
            </button>

            <button
              onClick={() => {
                setActiveTab("finance");
                setSearchQuery("");
              }}
              className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                activeTab === "finance"
                  ? "bg-primary text-white shadow-md shadow-primary/10"
                  : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                payments
              </span>
              Ödeme ve Muhasebe
            </button>

            <div className="pt-4 mt-4 border-t border-stone-100">
              <button
                onClick={() => {
                  setActiveTab("settings");
                  setSearchQuery("");
                }}
                className={`w-full flex items-center gap-3.5 px-4 h-11 rounded-xl text-xs font-extrabold tracking-wide uppercase transition-all cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-800"
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">
                  settings
                </span>
                Sistem Ayarları
              </button>
            </div>
          </nav>

          {/* Bottom Switcher */}
          <div className="mt-auto pt-6 border-t border-stone-100 space-y-4">
            <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm">
              <img
                src={visibleAdminAvatar}
                alt={visibleAdminName}
                className="w-11 h-11 rounded-2xl object-cover border border-rose-100 bg-rose-50"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-stone-800 truncate">
                  {visibleAdminName}
                </p>
                <p className="text-[10px] font-bold text-stone-400 truncate">
                  {visibleAdminEmail}
                </p>
              </div>
            </div>

            <div className="bg-stone-100/70 p-3.5 rounded-2xl border border-stone-200/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                  Platform Yükü
                </span>
                <span className="text-[11px] font-black text-rose-600">
                  %38
                </span>
              </div>
              <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-rose-500 h-full transition-all duration-1000"
                  style={{ width: "38%" }}
                ></div>
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
              <span className="material-symbols-outlined text-[15px]">
                logout
              </span>
            </button>
          </div>
        </aside>
      )}

      {/* MAIN VIEWPORT */}
      <div
        className={
          hideSidebar ? "w-full" : "flex-1 ml-72 p-6 md:p-8 min-h-screen"
        }
      >
        {/* Dynamic Navigation Top AppBar Utility */}
        <header className="sticky top-0 z-30 mb-8 flex justify-between items-center w-full h-16 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/10">
          <div>
            <h2 className="text-2xl font-black text-stone-800 tracking-tight">
              {activeTab === "overview" && "Platform Genel Bakış"}
              {activeTab === "restaurants" && "Restoran Ortakları Yönetimi"}
              {activeTab === "users" && "Sistem Müşteri Portföyü"}
              {activeTab === "orders" && "Genel Sipariş Akışı"}
              {activeTab === "couriers" && "Sistem Kurye Yönetimi"}
              {activeTab === "campaigns" && "Kampanya & Promosyon Yönetimi"}
              {activeTab === "finance" && "Platform Muhasebe & Hak Edişler"}
              {activeTab === "settings" && "Platform Genel Ayarları"}
            </h2>
            <p className="text-xs text-stone-400 font-bold tracking-wide mt-0.5 uppercase">
              CraveDash Platform Admin Control Center
            </p>
          </div>
        </header>

        {/* 1. OVERVIEW TAB */}
        {activeTab === "overview" && (
          <AdminOverviewTab
            coreStats={coreStats}
            monthlyOrderBars={monthlyOrderBars}
            topRestaurants={topRestaurants}
            maxRestaurantRevenue={maxRestaurantRevenue}
            orders={orders}
            deliveryCouriers={deliveryCouriers}
            availableCouriers={availableCouriers}
            hideSidebar={hideSidebar}
            navigate={navigate}
            setActiveTab={setActiveTab}
            formatCurrency={formatCurrency}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            orderStatusOptions={ORDER_STATUS_OPTIONS}
          />
        )}
        {/* 2. RESTAURANTS TAB */}
        {activeTab === "restaurants" && (
          <AdminRestaurantsTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            showAddRestaurant={showAddRestaurant}
            setShowAddRestaurant={setShowAddRestaurant}
            handleAddRestaurantSubmit={handleAddRestaurantSubmit}
            newRestName={newRestName}
            setNewRestName={setNewRestName}
            newRestCategory={newRestCategory}
            setNewRestCategory={setNewRestCategory}
            newRestComm={newRestComm}
            setNewRestCommission={setNewRestCommission}
            newRestCity={newRestCity}
            setNewRestCity={setNewRestCity}
            newRestEmail={newRestEmail}
            setNewRestEmail={setNewRestEmail}
            newRestPassword={newRestPassword}
            setNewRestPassword={setNewRestPassword}
            filteredRestaurants={filteredRestaurants}
            handleToggleRestStatus={handleToggleRestStatus}
            openCommissionModal={openCommissionModal}
            openDeleteModal={openDeleteModal}
            commissionModal={commissionModal}
            closeCommissionModal={closeCommissionModal}
            handleUpdateCommission={handleUpdateCommission}
            commissionValue={commissionValue}
            setCommissionValue={setCommissionValue}
            deleteModal={deleteModal}
            closeDeleteModal={closeDeleteModal}
            handleDeleteRestaurant={handleDeleteRestaurant}
          />
        )}
        {/* 3. USERS TAB */}
        {activeTab === "users" && (
          <AdminUsersTab
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filteredUsers={filteredUsers}
            userDeleteModal={userDeleteModal}
            handleToggleUserStatus={handleToggleUserStatus}
            openUserDeleteModal={openUserDeleteModal}
            closeUserDeleteModal={closeUserDeleteModal}
            handleDeleteUser={handleDeleteUser}
          />
        )}
        {/* 4. ORDERS TAB */}
        {activeTab === "orders" && (
          <AdminOrdersTab
            orders={orders}
            paginatedOrders={paginatedOrders}
            ordersPerPage={ordersPerPage}
            ordersPage={ordersPage}
            setOrdersPage={setOrdersPage}
            totalOrderPages={totalOrderPages}
            orderStatusModal={orderStatusModal}
            openOrderStatusModal={openOrderStatusModal}
            closeOrderStatusModal={closeOrderStatusModal}
            handleUpdateOrderStatus={handleUpdateOrderStatus}
            orderStatusOptions={ORDER_STATUS_OPTIONS}
          />
        )}
        {/* 5. COURIERS TAB */}
        {activeTab === "couriers" && (
          <AdminCouriersTab
            couriers={couriers}
            activeCouriers={activeCouriers}
            deliveryCouriers={deliveryCouriers}
            availableCouriers={availableCouriers}
            assignableOrders={assignableOrders}
            selectedOrderToAssign={selectedOrderToAssign}
            setSelectedOrderToAssign={setSelectedOrderToAssign}
            selectedCourierToAssign={selectedCourierToAssign}
            setSelectedCourierToAssign={setSelectedCourierToAssign}
            handleAssignOrder={handleAssignOrder}
            courierMapRoutes={COURIER_MAP_ROUTES}
            getCourierMapVisual={getCourierMapVisual}
          />
        )}
        {/* 6. CAMPAIGNS TAB */}
        {activeTab === "campaigns" && (
          <AdminCampaignsTab
            promos={promos}
            activePromos={activePromos}
            totalCampaignUsage={totalCampaignUsage}
            couponPromoCount={couponPromoCount}
            newCampaignName={newCampaignName}
            setNewCampaignName={setNewCampaignName}
            newCampaignCode={newCampaignCode}
            setNewCampaignCode={setNewCampaignCode}
            newCampaignType={newCampaignType}
            setNewCampaignType={setNewCampaignType}
            newCampaignDiscount={newCampaignDiscount}
            setNewCampaignDiscount={setNewCampaignDiscount}
            newCampaignMin={newCampaignMin}
            setNewCampaignMin={setNewCampaignMin}
            handleLaunchCampaign={handleLaunchCampaign}
            getCampaignTypeLabel={getCampaignTypeLabel}
            getCampaignRateText={getCampaignRateText}
            getCampaignUsageText={getCampaignUsageText}
            getCampaignProgress={getCampaignProgress}
            handleToggleCampaignStatus={handleToggleCampaignStatus}
            openCampaignDeleteModal={openCampaignDeleteModal}
            campaignDeleteModal={campaignDeleteModal}
            closeCampaignDeleteModal={closeCampaignDeleteModal}
            handleDeleteCampaign={handleDeleteCampaign}
          />
        )}
        {/* 7. FINANCE TAB */}
        {activeTab === "finance" && (
          <AdminFinanceTab
            financials={financials}
            filteredFinancials={filteredFinancials}
            paginatedFinancials={paginatedFinancials}
            financeGrossTotal={financeGrossTotal}
            financeCommissionTotal={financeCommissionTotal}
            financeRestaurantPayout={financeRestaurantPayout}
            averageCommissionRate={averageCommissionRate}
            financeSearch={financeSearch}
            setFinanceSearch={setFinanceSearch}
            financeSort={financeSort}
            setFinanceSort={setFinanceSort}
            handleDownloadPDF={handleDownloadPDF}
            pdfLoading={pdfLoading}
            financePerPage={financePerPage}
            financePage={financePage}
            setFinancePage={setFinancePage}
            financeTotalPages={financeTotalPages}
            formatCurrency={formatCurrency}
          />
        )}
        {/* 8. SYSTEM SETTINGS TAB */}
        {activeTab === "settings" && (
          <AdminSettingsTab
            settingsLoading={settingsLoading}
            settingsSaving={settingsSaving}
            baseCommission={baseCommission}
            setBaseCommission={setBaseCommission}
            baseDeliveryFee={baseDeliveryFee}
            setBaseDeliveryFee={setBaseDeliveryFee}
            emailNotifs={emailNotifs}
            setEmailNotifs={setEmailNotifs}
            smsNotifs={smsNotifs}
            setSmsNotifs={setSmsNotifs}
            visibleAdminAvatar={visibleAdminAvatar}
            visibleAdminName={visibleAdminName}
            adminProfileName={adminProfileName}
            setAdminProfileName={setAdminProfileName}
            adminEmail={adminEmail}
            setAdminProfileEmail={setAdminProfileEmail}
            adminAvatar={adminAvatar}
            setAdminAvatar={setAdminAvatar}
            handleResetSystemSettings={handleResetSystemSettings}
            handleSaveSystemSettings={handleSaveSystemSettings}
          />
        )}
      </div>

      {/* CANLI SISTEM LOGLARI DRAWER / MODAL */}
      {showLogs && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white text-stone-700 w-full max-w-2xl rounded-[28px] shadow-2xl overflow-hidden border border-stone-100 animate-scale-up font-mono text-xs">
            <div className="p-5 border-b border-stone-100 bg-stone-50 flex justify-between items-center text-stone-800">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping"></span>
                <span className="font-extrabold">
                  CraveDash Live System Logs
                </span>
              </div>
              <button
                onClick={() => setShowLogs(false)}
                className="text-stone-400 hover:text-stone-800 p-1 hover:bg-stone-100 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  close
                </span>
              </button>
            </div>

            <div className="p-6 space-y-3.5 max-h-[360px] overflow-y-auto custom-scrollbar">
              {systemLogs.map((log, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 border-b border-stone-100 pb-2.5 last:border-0 last:pb-0"
                >
                  <span className="text-stone-500 shrink-0 font-bold">
                    [{log.time}]
                  </span>
                  <span
                    className={`font-black shrink-0 ${
                      log.type === "SUCCESS"
                        ? "text-green-400"
                        : log.type === "WARNING"
                          ? "text-amber-400"
                          : log.type === "SYSTEM"
                            ? "text-rose-400"
                            : "text-cyan-400"
                    }`}
                  >
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










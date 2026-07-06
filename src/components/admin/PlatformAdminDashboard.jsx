import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../common/components/Toast.jsx";
import AdminCampaignsTab from "./platform/AdminCampaignsTab.jsx";
import AdminCouriersTab from "./platform/AdminCouriersTab.jsx";
import AdminFinanceTab from "./platform/AdminFinanceTab.jsx";
import AdminOverviewTab from "./platform/AdminOverviewTab.jsx";
import AdminOrdersTab from "./platform/AdminOrdersTab.jsx";
import AdminRestaurantsTab from "./platform/AdminRestaurantsTab.jsx";
import AdminSettingsTab from "./platform/AdminSettingsTab.jsx";
import AdminUsersTab from "./platform/AdminUsersTab.jsx";
import {
  ORDER_STATUS_OPTIONS,
  formatCurrency,
  getCampaignProgress,
  getCampaignRateText,
  getCampaignTypeLabel,
  getCampaignUsageText,
  getOrderDate,
  getOrderStatusText,
  isCancelled,
} from "./platform/adminDashboardUtils.js";
import useAdminCampaigns from "./platform/hooks/useAdminCampaigns.js";
import useAdminCouriers from "./platform/hooks/useAdminCouriers.js";
import useAdminFinance from "./platform/hooks/useAdminFinance.js";
import useAdminOrders from "./platform/hooks/useAdminOrders.js";
import useAdminRestaurants from "./platform/hooks/useAdminRestaurants.js";
import useAdminSettings from "./platform/hooks/useAdminSettings.js";
import useAdminUsers from "./platform/hooks/useAdminUsers.js";

// Admin panelinin ana ekranını ve sekme verilerini yönetir.
export default function PlatformAdminDashboard({
  onExitAdmin,
  propActiveTab,
  hideSidebar,
}) {
  const addToast = useToast();
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

  // Siparişleri admin tablosunda gösterilecek formata çevirir.
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

  // En çok ciro yapan restoranları hesaplar.
  const topRestaurants = useMemo(() => { // büyük bir veri olduğu için sadece veri değiştiği zaman çalışır
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
  // Aylık satış grafiği için bar verisi üretir.
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

  const {
    showAddRestaurant,
    setShowAddRestaurant,
    newRestName,
    setNewRestName,
    newRestCategory,
    setNewRestCategory,
    newRestComm,
    setNewRestCommission,
    newRestCity,
    setNewRestCity,
    newRestEmail,
    setNewRestEmail,
    newRestPassword,
    setNewRestPassword,
    commissionModal,
    commissionValue,
    setCommissionValue,
    deleteModal,
    handleToggleRestStatus,
    openCommissionModal,
    closeCommissionModal,
    handleUpdateCommission,
    openDeleteModal,
    closeDeleteModal,
    handleDeleteRestaurant,
    handleAddRestaurantSubmit,
  } = useAdminRestaurants({ addToast });
  const {
    enrichedUsers,
    userDeleteModal,
    handleToggleUserStatus,
    openUserDeleteModal,
    closeUserDeleteModal,
    handleDeleteUser,
  } = useAdminUsers({ platformOrders, addToast });
  const {
    orderStatusModal,
    ordersPage,
    setOrdersPage,
    ordersPerPage,
    totalOrderPages,
    paginatedOrders,
    openOrderStatusModal,
    closeOrderStatusModal,
    handleUpdateOrderStatus,
  } = useAdminOrders({ orders, addToast });
  const {
    couriers,
    activeCouriers,
    deliveryCouriers,
    availableCouriers,
    assignableOrders,
    selectedOrderToAssign,
    setSelectedOrderToAssign,
    selectedCourierToAssign,
    setSelectedCourierToAssign,
    handleAssignOrder,
  } = useAdminCouriers({ orders, addToast });
  const {
    promos,
    activePromos,
    totalCampaignUsage,
    couponPromoCount,
    newCampaignName,
    setNewCampaignName,
    newCampaignCode,
    setNewCampaignCode,
    newCampaignType,
    setNewCampaignType,
    newCampaignDiscount,
    setNewCampaignDiscount,
    newCampaignMin,
    setNewCampaignMin,
    campaignDeleteModal,
    handleLaunchCampaign,
    handleToggleCampaignStatus,
    openCampaignDeleteModal,
    closeCampaignDeleteModal,
    handleDeleteCampaign,
  } = useAdminCampaigns({ addToast });
  const {
    financials,
    filteredFinancials,
    paginatedFinancials,
    financeGrossTotal,
    financeCommissionTotal,
    financeRestaurantPayout,
    averageCommissionRate,
    financeSearch,
    setFinanceSearch,
    financeSort,
    setFinanceSort,
    handleDownloadPDF,
    pdfLoading,
    financePerPage,
    financePage,
    setFinancePage,
    financeTotalPages,
  } = useAdminFinance({ platformOrders, restaurants, addToast });
  const {
    settingsLoading,
    settingsSaving,
    baseCommission,
    setBaseCommission,
    baseDeliveryFee,
    setBaseDeliveryFee,
    emailNotifs,
    setEmailNotifs,
    smsNotifs,
    setSmsNotifs,
    adminProfileName,
    setAdminProfileName,
    adminEmail,
    setAdminProfileEmail,
    adminAvatar,
    setAdminAvatar,
    visibleAdminName,
    visibleAdminEmail,
    visibleAdminAvatar,
    handleResetSystemSettings,
    handleSaveSystemSettings,
  } = useAdminSettings({ currentUser, addToast });
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














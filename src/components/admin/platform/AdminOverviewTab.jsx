import React from "react";
import OverviewCourierSummary from "./OverviewCourierSummary.jsx";
import OverviewLiveOrders from "./OverviewLiveOrders.jsx";
import OverviewSalesChart from "./OverviewSalesChart.jsx";
import OverviewStatsGrid from "./OverviewStatsGrid.jsx";
import OverviewTopRestaurants from "./OverviewTopRestaurants.jsx";

export default function AdminOverviewTab({
  coreStats,
  monthlyOrderBars,
  topRestaurants,
  maxRestaurantRevenue,
  orders,
  deliveryCouriers,
  availableCouriers,
  hideSidebar,
  navigate,
  setActiveTab,
  formatCurrency,
  handleUpdateOrderStatus,
  orderStatusOptions,
}) {
  return (
    <div className="space-y-8 animate-fade-in">
      <OverviewStatsGrid coreStats={coreStats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverviewSalesChart
          monthlyOrderBars={monthlyOrderBars}
          formatCurrency={formatCurrency}
        />
        <OverviewTopRestaurants
          topRestaurants={topRestaurants}
          maxRestaurantRevenue={maxRestaurantRevenue}
          hideSidebar={hideSidebar}
          navigate={navigate}
          setActiveTab={setActiveTab}
          formatCurrency={formatCurrency}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <OverviewLiveOrders
          orders={orders}
          setActiveTab={setActiveTab}
          handleUpdateOrderStatus={handleUpdateOrderStatus}
          orderStatusOptions={orderStatusOptions}
        />
        <OverviewCourierSummary
          deliveryCouriers={deliveryCouriers}
          availableCouriers={availableCouriers}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
}

import React from "react";
import CourierAssignmentPanel from "./CourierAssignmentPanel.jsx";
import CourierListTable from "./CourierListTable.jsx";
import CourierDemoMap from "./CourierDemoMap.jsx";
import CourierStatsCards from "./CourierStatsCards.jsx";

// Kurye listesi ve atama ekranını gösterir.
export default function AdminCouriersTab({
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
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <CourierStatsCards
          activeCount={activeCouriers.length}
          deliveryCount={deliveryCouriers.length}
          availableCount={availableCouriers.length}
        />

        <CourierDemoMap />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <CourierListTable couriers={couriers} />

        <CourierAssignmentPanel
          assignableOrders={assignableOrders}
          availableCouriers={availableCouriers}
          selectedOrderToAssign={selectedOrderToAssign}
          setSelectedOrderToAssign={setSelectedOrderToAssign}
          selectedCourierToAssign={selectedCourierToAssign}
          setSelectedCourierToAssign={setSelectedCourierToAssign}
          handleAssignOrder={handleAssignOrder}
        />
      </div>
    </div>
  );
}

import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

// Admin tüm siparişler sekmesini route üzerinden açar.
export default function PlatformOrders() {
  return <PlatformAdminDashboard propActiveTab="orders" hideSidebar={true} />;
}

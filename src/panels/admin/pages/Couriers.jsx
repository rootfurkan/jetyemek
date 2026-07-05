import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

// Admin kuryeler sekmesini route üzerinden açar.
export default function Couriers() {
  return <PlatformAdminDashboard propActiveTab="couriers" hideSidebar={true} />;
}

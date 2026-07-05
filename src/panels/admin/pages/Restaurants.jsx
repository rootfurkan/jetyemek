import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

// Admin restoranlar sekmesini route üzerinden açar.
export default function Restaurants() {
  return <PlatformAdminDashboard propActiveTab="restaurants" hideSidebar={true} />;
}

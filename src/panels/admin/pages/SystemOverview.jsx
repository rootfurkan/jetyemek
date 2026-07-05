import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

// Admin ana özet sekmesini route üzerinden açar.
export default function SystemOverview() {
  return <PlatformAdminDashboard propActiveTab="overview" hideSidebar={true} />;
}

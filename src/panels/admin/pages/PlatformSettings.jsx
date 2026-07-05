import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

// Admin sistem ayarları sekmesini route üzerinden açar.
export default function PlatformSettings() {
  return <PlatformAdminDashboard propActiveTab="settings" hideSidebar={true} />;
}

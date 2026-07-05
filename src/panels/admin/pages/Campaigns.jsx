import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

// Admin kampanyalar sekmesini route üzerinden açar.
export default function Campaigns() {
  return <PlatformAdminDashboard propActiveTab="campaigns" hideSidebar={true} />;
}

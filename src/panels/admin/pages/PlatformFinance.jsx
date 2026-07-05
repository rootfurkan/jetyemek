import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

// Admin finansal analiz sekmesini route üzerinden açar.
export default function PlatformFinance() {
  return <PlatformAdminDashboard propActiveTab="finance" hideSidebar={true} />;
}

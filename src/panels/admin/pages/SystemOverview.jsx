import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

export default function SystemOverview() {
  return <PlatformAdminDashboard propActiveTab="overview" hideSidebar={true} />;
}

import React from 'react';
import PlatformAdminDashboard from '../../../components/admin/PlatformAdminDashboard.jsx';

// Admin kullanıcılar sekmesini route üzerinden açar.
export default function Users() {
  return <PlatformAdminDashboard propActiveTab="users" hideSidebar={true} />;
}

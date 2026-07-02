import React from 'react';
import SystemOverview from '../panels/admin/pages/SystemOverview.jsx';
import Restaurants from '../panels/admin/pages/Restaurants.jsx';
import Users from '../panels/admin/pages/Users.jsx';
import PlatformOrders from '../panels/admin/pages/PlatformOrders.jsx';
import Couriers from '../panels/admin/pages/Couriers.jsx';
import Campaigns from '../panels/admin/pages/Campaigns.jsx';
import PlatformFinance from '../panels/admin/pages/PlatformFinance.jsx';
import PlatformSettings from '../panels/admin/pages/PlatformSettings.jsx';

export const AdminRoutes = [
  { index: true, element: <SystemOverview /> },
  { path: 'restaurants', element: <Restaurants /> },
  { path: 'users', element: <Users /> },
  { path: 'orders', element: <PlatformOrders /> },
  { path: 'couriers', element: <Couriers /> },
  { path: 'campaigns', element: <Campaigns /> },
  { path: 'finance', element: <PlatformFinance /> },
  { path: 'settings', element: <PlatformSettings /> }
];

import React from 'react';
import { useRoutes } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout.jsx';
import RestaurantLayout from '../layouts/RestaurantLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import { CustomerRoutes } from './CustomerRoutes.jsx';
import { RestaurantRoutes } from './RestaurantRoutes.jsx';
import { AdminRoutes } from './AdminRoutes.jsx';

export default function AppRouter() {
  const routes = useRoutes([
    {
      path: '/',
      element: <CustomerLayout />,
      children: CustomerRoutes,
    },
    {
      path: '/restaurant',
      element: <RestaurantLayout />,
      children: RestaurantRoutes,
    },
    {
      path: '/admin',
      element: <AdminLayout />,
      children: AdminRoutes,
    }
  ]);

  return routes;
}

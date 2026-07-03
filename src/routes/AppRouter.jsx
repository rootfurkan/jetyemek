import React from 'react';
import { useRoutes, Navigate } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout.jsx';
import RestaurantLayout from '../layouts/RestaurantLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import { CustomerRoutes } from './CustomerRoutes.jsx';
import { RestaurantRoutes } from './RestaurantRoutes.jsx';
import { AdminRoutes } from './AdminRoutes.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import LoginPage from '../panels/auth/LoginPage.jsx';

export default function AppRouter() {
  const routes = useRoutes([
    // Login Sayfası — herkese açık
    {
      path: '/login',
      element: <LoginPage />,
    },
    // Müşteri Paneli — 'customer' rolü gerektirir
    {
      path: '/',
      element: (
        <ProtectedRoute allowedRole="customer">
          <CustomerLayout />
        </ProtectedRoute>
      ),
      children: CustomerRoutes,
    },
    // Restoran Paneli — 'restaurant' rolü gerektirir
    {
      path: '/restaurant',
      element: (
        <ProtectedRoute allowedRole="restaurant">
          <RestaurantLayout />
        </ProtectedRoute>
      ),
      children: RestaurantRoutes,
    },
    // Admin Paneli — 'admin' rolü gerektirir
    {
      path: '/admin',
      element: (
        <ProtectedRoute allowedRole="admin">
          <AdminLayout />
        </ProtectedRoute>
      ),
      children: AdminRoutes,
    },
    // Bilinmeyen rotalar login'e yönlendirilir
    {
      path: '*',
      element: <Navigate to="/login" replace />,
    },
  ]);

  return routes;
}

import React from 'react';
import Home from '../panels/customer/pages/Home.jsx';
import RestaurantMenu from '../panels/customer/pages/RestaurantMenu.jsx';
import Cart from '../panels/customer/pages/Cart.jsx';
import Profile from '../panels/customer/pages/Profile.jsx';
import ProfileLoginGuard from '../panels/customer/pages/ProfileLoginGuard.jsx';
import Favorites from '../panels/customer/pages/Favorites.jsx';
import OrderSuccess from '../panels/customer/pages/OrderSuccess.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';

export const CustomerRoutes = [
  { index: true, element: <Home /> },
  { path: 'restaurant/:id', element: <RestaurantMenu /> },
  { path: 'cart', element: <Cart /> },
  { path: 'favorites', element: <Favorites /> },
  { path: 'order-success', element: <OrderSuccess /> },
  // Profil/Siparişlerim — giriş yapılmamışsa şık "Giriş Gerekli" ekranı göster
  {
    path: 'profile',
    element: <ProfileLoginGuard />,
  },
];

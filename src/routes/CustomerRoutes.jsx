import React from 'react';
import Home from '../panels/customer/pages/Home.jsx';
import RestaurantMenu from '../panels/customer/pages/RestaurantMenu.jsx';
import Cart from '../panels/customer/pages/Cart.jsx';
import Profile from '../panels/customer/pages/Profile.jsx';

export const CustomerRoutes = [
  { index: true, element: <Home /> },
  { path: 'restaurant/:id', element: <RestaurantMenu /> },
  { path: 'cart', element: <Cart /> },
  { path: 'profile', element: <Profile /> }
];

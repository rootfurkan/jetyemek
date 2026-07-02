import React from 'react';
import Overview from '../panels/restaurant/pages/Overview.jsx';
import Orders from '../panels/restaurant/pages/Orders.jsx';
import Menu from '../panels/restaurant/pages/Menu.jsx';
import Reviews from '../panels/restaurant/pages/Reviews.jsx';
import Finance from '../panels/restaurant/pages/Finance.jsx';
import Settings from '../panels/restaurant/pages/Settings.jsx';

export const RestaurantRoutes = [
  { index: true, element: <Overview /> },
  { path: 'orders', element: <Orders /> },
  { path: 'menu', element: <Menu /> },
  { path: 'reviews', element: <Reviews /> },
  { path: 'finance', element: <Finance /> },
  { path: 'settings', element: <Settings /> }
];

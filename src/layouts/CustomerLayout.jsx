import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { ToastProvider } from '../common/components/Toast.jsx';
import Preloader from '../common/components/Preloader.jsx';

export default function CustomerLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isRouteLoading, setIsRouteLoading] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.cartTotal);
  const userProfile = useSelector((state) => state.auth.userProfile);
  const { isAuthenticated, userRole } = useSelector((state) => state.auth);

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  useEffect(() => {
    setIsRouteLoading(true);
    const timer = window.setTimeout(() => {
      setIsRouteLoading(false);
    }, 1450);

    return () => window.clearTimeout(timer);
  }, [location.pathname, location.search]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-50/20 flex flex-col font-sans">
        {isRouteLoading && <Preloader fullscreen />}

        <Navbar
          currentTab=""
          setCurrentTab={(tab) => {
            if (tab === 'home') navigate('/');
            else if (tab === 'cart') navigate('/cart');
            else if (tab === 'account') navigate('/profile');
            else if (tab === 'favorites') navigate('/favorites');
          }}
          cartCount={cartCount}
          cartTotal={cartTotal}
          onSearch={(query) => {}}
          userProfile={userProfile}
          onEnterAdmin={() => navigate('/restaurant')}
          onEnterSuperAdmin={() => navigate('/admin')}
        />

        <main className="flex-grow w-full max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6">
          <Outlet />
        </main>

        <Footer setCurrentTab={(tab) => {
          if (tab === 'home') navigate('/');
        }} />
      </div>
    </ToastProvider>
  );
}

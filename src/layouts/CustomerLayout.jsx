import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { ToastProvider } from '../common/components/Toast.jsx';

export default function CustomerLayout() {
  const navigate = useNavigate();
  
  // Get cart info & profile from Redux
  const cartItems = useSelector((state) => state.cart.items);
  const cartTotal = useSelector((state) => state.cart.cartTotal);
  const userProfile = useSelector((state) => state.auth.userProfile);

  const cartCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-stone-50/20 flex flex-col font-sans">
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
          onSearch={(query) => {
            // We can set search parameters in navigation or redux if needed
          }}
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

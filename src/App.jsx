import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store.js';
import AppRouter from './routes/AppRouter.jsx';
import { getMenuItems, getRestaurants, getAddresses, getOrders, getReviews } from './services/api.js';
import { setMenuItems } from './features/menu/menuSlice.js';
import { setRestaurants } from './features/restaurants/restaurantsSlice.js';
import { setAddresses } from './features/auth/authSlice.js';
import { setReviews } from './features/reviews/reviewsSlice.js';
import {
  setActiveOrder,
  setPreviousOrders,
  setPlatformOrders,
} from './features/orders/ordersSlice.js';
import { ToastProvider } from './common/components/Toast.jsx';

function AppDataLoader() {
  const dispatch = useDispatch();
  const { isAuthenticated, currentUser, userRole } = useSelector((state) => state.auth);

  // ─── İlk yükleme: Restoran + Menü verileri ────────────────────────────────
  useEffect(() => {
    async function loadPublicData() {
      try {
        const [restaurants, menuItems, reviews] = await Promise.all([
          getRestaurants(),
          getMenuItems(),
          getReviews(),
        ]);
        dispatch(setRestaurants(restaurants));
        dispatch(setMenuItems(menuItems));
        dispatch(setReviews(reviews));
      } catch (error) {
        console.error('Veriler yüklenirken hata oluştu:', error);
      }
    }
    loadPublicData();
  }, [dispatch]);

  // ─── Kullanıcı giriş yaptığında: adresler + siparişler ───────────────────
  useEffect(() => {
    if (!isAuthenticated || !currentUser?.id) return;

    async function loadUserData() {
      try {
        // Adresler (müşteri ise)
        if (userRole === 'customer') {
          const addresses = await getAddresses(currentUser.id);
          dispatch(setAddresses(addresses));
        }

        // Siparişler
        const orders = await getOrders(userRole === 'customer' ? currentUser.id : undefined);

        if (userRole === 'customer') {
          // Aktif sipariş: Hazırlanıyor veya Kurye Yola Çıktı
          const activeStatuses = ['Hazırlanıyor', 'Kurye Yola Çıktı'];
          const active = orders.find(
            (o) =>
              activeStatuses.includes(o.status) ||
              (o.deliveryStatus && !['delivered', 'cancelled'].includes(o.deliveryStatus))
          );

          // Geçmiş siparişler: Teslim Edildi veya İptal Edildi
          const previous = orders.filter(
            (o) =>
              o.deliveryStatus === 'delivered' ||
              o.status === 'Teslim Edildi' ||
              o.status === 'İptal Edildi'
          );

          // Aktif siparişi state'e yükle (sayfa yenilenince kaybolmasın)
          if (active) {
            dispatch(setActiveOrder(active));
          }

          dispatch(setPreviousOrders(previous));
        } else {
          // Admin/Restoran için tüm siparişler
          dispatch(setPlatformOrders(orders));
        }
      } catch (error) {
        console.error('Kullanıcı verileri yüklenirken hata:', error);
      }
    }

    loadUserData();
  }, [isAuthenticated, currentUser?.id, userRole, dispatch]);

  return <AppRouter />;
}

export default function App() {
  return (
    <Provider store={store}>
      <ToastProvider>
        <BrowserRouter>
          <AppDataLoader />
        </BrowserRouter>
      </ToastProvider>
    </Provider>
  );
}

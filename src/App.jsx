import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { useDispatch } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import store from './app/store.js';
import AppRouter from './routes/AppRouter.jsx';
import { getMenuItems, getRestaurants } from './services/api.js';
import { setMenuItems } from './features/menu/menuSlice.js';
import { setRestaurants } from './features/restaurants/restaurantsSlice.js';

function AppDataLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [restaurants, menuItems] = await Promise.all([
          getRestaurants(),
          getMenuItems(),
        ]);

        dispatch(setRestaurants(restaurants));
        dispatch(setMenuItems(menuItems));
      } catch (error) {
        console.error('Veriler yuklenirken hata olustu:', error);
      }
    }

    loadInitialData();
  }, [dispatch]);

  return <AppRouter />;
}

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppDataLoader />
      </BrowserRouter>
    </Provider>
  );
}

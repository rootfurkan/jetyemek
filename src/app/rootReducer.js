import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import restaurantsReducer from '../features/restaurants/restaurantsSlice.js';
import ordersReducer from '../features/orders/ordersSlice.js';
import menuReducer from '../features/menu/menuSlice.js';
import cartReducer from '../features/cart/cartSlice.js';
import campaignsReducer from '../features/campaigns/campaignsSlice.js';
import reviewsReducer from '../features/reviews/reviewsSlice.js';
import couriersReducer from '../features/couriers/couriersSlice.js';
import financeReducer from '../features/finance/financeSlice.js';

const rootReducer = combineReducers({
  auth: authReducer,
  restaurants: restaurantsReducer,
  orders: ordersReducer,
  menu: menuReducer,
  cart: cartReducer,
  campaigns: campaignsReducer,
  reviews: reviewsReducer,
  couriers: couriersReducer,
  finance: financeReducer,
});

export default rootReducer;

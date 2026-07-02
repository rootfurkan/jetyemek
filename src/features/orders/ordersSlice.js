import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_ACTIVE_ORDER, PREVIOUS_ORDERS } from '../../data.jsx';

const INITIAL_PLATFORM_ORDERS = [
  { id: 'VH-9421', customer: 'Mehmet Aydın', restaurant: 'Napoli Antica', total: 485.00, status: 'Teslim Edildi', time: 'Şimdi' },
  { id: 'VH-9420', customer: 'Elif Sönmez', restaurant: 'Burger Haven', total: 320.50, status: 'Yolda', time: '4 dk önce' },
  { id: 'VH-9419', customer: 'Burak Kaya', restaurant: 'Pizza Roma', total: 610.00, status: 'Hazırlanıyor', time: '12 dk önce' },
  { id: 'VH-9418', customer: 'Ahmet Yılmaz', restaurant: 'Döner Dünyası', total: 145.00, status: 'İptal Edildi', time: '25 dk önce' }
];

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    activeOrder: INITIAL_ACTIVE_ORDER,
    previousOrders: PREVIOUS_ORDERS,
    platformOrders: INITIAL_PLATFORM_ORDERS,
  },
  reducers: {
    placeOrder: (state, action) => {
      const { restaurant, items, total, image } = action.payload;
      const newOrder = {
        restaurant,
        items,
        total,
        status: 'Sipariş Alındı',
        progress: 10,
        image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuBygBpUWwh8OtaJC8RU2J-A3XvmOOJca3DQs7kGCsbTxO3fcb4wn7A_YykulSKHii-Y-aMMYDY2BDj27jevbX3OcLGAiQfHaJV5bnGn78U5EzoK7T-jD81IcSCQbdncrCQoJ8FagaFgoTzAsGi94d3yC7alslg07ls9QDj09SQ1AUqY2Y6owNH8TjCL_VUVJ2wPzZ1xo0cf7e8ZqdmqB_y-GLeXkZZDQ8TMB5d22qQAqqQGz-Kh9C8NXjLlbUn5oQMiZZ85v5_zA6U',
      };
      state.activeOrder = newOrder;

      // Add to platform orders
      state.platformOrders.unshift({
        id: 'VH-' + (Math.floor(Math.random() * 9000) + 1000),
        customer: 'Ahmet Yılmaz',
        restaurant,
        total,
        status: 'Sipariş Alındı',
        time: 'Şimdi',
      });
    },
    updateActiveOrderProgress: (state, action) => {
      if (state.activeOrder) {
        state.activeOrder.progress = action.payload;
      }
    },
    updateActiveOrderStatus: (state, action) => {
      if (state.activeOrder) {
        state.activeOrder.status = action.payload;
      }
    },
    cancelActiveOrder: (state) => {
      if (state.activeOrder) {
        state.activeOrder.status = 'İptal Edildi';
        state.activeOrder.progress = 0;
      }
    },
    updatePlatformOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.platformOrders.find(o => o.id === id);
      if (order) {
        order.status = status;
      }
    },
    addPreviousOrder: (state, action) => {
      state.previousOrders.unshift(action.payload);
    }
  },
});

export const {
  placeOrder,
  updateActiveOrderProgress,
  updateActiveOrderStatus,
  cancelActiveOrder,
  updatePlatformOrderStatus,
  addPreviousOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;

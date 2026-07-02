import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    cartTotal: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find(i => i.id === item.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }
      state.cartTotal = state.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    },
    removeFromCart: (state, action) => {
      const id = action.payload;
      const existing = state.items.find(i => i.id === id);
      if (existing) {
        if (existing.quantity > 1) {
          existing.quantity -= 1;
        } else {
          state.items = state.items.filter(i => i.id !== id);
        }
      }
      state.cartTotal = state.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    },
    removeItemCompletely: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.cartTotal = state.items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
    },
    clearCart: (state) => {
      state.items = [];
      state.cartTotal = 0;
    },
  },
});

export const { addToCart, removeFromCart, removeItemCompletely, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

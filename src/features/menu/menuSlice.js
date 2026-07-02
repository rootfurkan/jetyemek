import { createSlice } from '@reduxjs/toolkit';
import { GOURMET_MENU } from '../../data.jsx';

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: GOURMET_MENU,
  },
  reducers: {
    setMenuItems: (state, action) => {
      state.items = action.payload;
    },
    addMenuItem: (state, action) => {
      state.items.push({
        id: 'item-' + Date.now(),
        ...action.payload,
      });
    },
    deleteMenuItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateMenuItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
  },
});

export const { setMenuItems, addMenuItem, deleteMenuItem, updateMenuItem } = menuSlice.actions;

export default menuSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { SPONSOR_RESTAURANTS, RESTAURANT_GRID } from '../../data.jsx';

// Combining existing restaurants from PlatformAdminDashboard too
const INITIAL_RESTAURANTS = [
  { id: 'gourmet-burger', name: 'Gourmet Burger House', category: 'Hamburger & Pizza', commission: 15.0, status: 'Aktif', city: 'Beşiktaş, İstanbul', rating: 4.9, img: SPONSOR_RESTAURANTS[0].image, isOpen: true },
  { id: 'lezzet-sofrasi', name: 'Lezzet Sofrası', category: 'Ev Yemekleri', commission: 12.0, status: 'Aktif', city: 'Kadıköy, İstanbul', rating: 4.8, img: SPONSOR_RESTAURANTS[1].image, isOpen: true },
  { id: 'sushi-art', name: 'Sushi Art', category: 'Asya Mutfağı', commission: 18.0, status: 'Aktif', city: 'Şişli, İstanbul', rating: 4.9, img: SPONSOR_RESTAURANTS[2].image, isOpen: true },
  { id: 'pizza-house', name: 'Pizza House', category: 'Pizza', commission: 10.0, status: 'Aktif', city: 'Fatih, İstanbul', rating: 4.7, img: SPONSOR_RESTAURANTS[3].image, isOpen: true },
  { id: 'burger-empire', name: 'Burger Empire', category: 'Fast Food', commission: 12.5, status: 'Aktif', city: 'Beşiktaş, İstanbul', rating: 4.7, img: RESTAURANT_GRID[0].image, isOpen: true },
  { id: 'pasta-amore', name: 'Pasta Amore', category: 'İtalyan', commission: 14.0, status: 'Pasif', city: 'Kadıköy, İstanbul', rating: 4.6, img: RESTAURANT_GRID[1].image, isOpen: false },
  { id: 'donerci-vedat', name: 'Dönerci Vedat', category: 'Kebap & Izgara', commission: 10.0, status: 'Aktif', city: 'Fatih, İstanbul', rating: 4.9, img: RESTAURANT_GRID[2].image, isOpen: true },
];

const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState: {
    list: INITIAL_RESTAURANTS,
    sponsorList: SPONSOR_RESTAURANTS,
    gridList: RESTAURANT_GRID,
    selectedRestaurantId: null,
  },
  reducers: {
    setRestaurants: (state, action) => {
      state.list = action.payload;
      state.sponsorList = action.payload.filter(restaurant => restaurant.isSponsor);
      state.gridList = action.payload;
    },
    setSelectedRestaurantId: (state, action) => {
      state.selectedRestaurantId = action.payload;
    },
    toggleRestaurantStatus: (state, action) => {
      const rest = state.list.find(r => r.id === action.payload);
      if (rest) {
        rest.status = rest.status === 'Aktif' ? 'Pasif' : 'Aktif';
        rest.isOpen = rest.status === 'Aktif';
      }
    },
    updateRestaurantCommission: (state, action) => {
      const { id, commission } = action.payload;
      const rest = state.list.find(r => r.id === id);
      if (rest) {
        rest.commission = parseFloat(commission);
      }
    },
    addRestaurant: (state, action) => {
      state.list.push({
        id: 'rest-' + Date.now(),
        rating: 5.0,
        status: 'Aktif',
        isOpen: true,
        ...action.payload,
      });
    },
    deleteRestaurant: (state, action) => {
      state.list = state.list.filter(r => r.id !== action.payload);
    },
  },
});

export const {
  setRestaurants,
  setSelectedRestaurantId,
  toggleRestaurantStatus,
  updateRestaurantCommission,
  addRestaurant,
  deleteRestaurant,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;

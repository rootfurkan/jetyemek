import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_USER, INITIAL_ADDRESSES, INITIAL_CARDS } from '../../data.jsx';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userProfile: INITIAL_USER,
    addresses: INITIAL_ADDRESSES,
    savedCards: INITIAL_CARDS,
    isAuthenticated: true,
  },
  reducers: {
    updateProfile: (state, action) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    changeAvatar: (state, action) => {
      state.userProfile.avatar = action.payload;
    },
    addAddress: (state, action) => {
      state.addresses.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
    },
    addCard: (state, action) => {
      state.savedCards.push({
        id: Date.now(),
        ...action.payload,
      });
    },
    deleteCard: (state, action) => {
      state.savedCards = state.savedCards.filter(card => card.id !== action.payload);
    },
  },
});

export const {
  updateProfile,
  changeAvatar,
  addAddress,
  deleteAddress,
  addCard,
  deleteCard,
} = authSlice.actions;

export default authSlice.reducer;

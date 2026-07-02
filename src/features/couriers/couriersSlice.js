import { createSlice } from '@reduxjs/toolkit';

const INITIAL_COURIERS = [
  { id: 1, name: 'Ahmet Yılmaz', vehicle: 'Motosiklet', zone: 'Beşiktaş', status: 'Teslimatta', ordersDelivered: 14 },
  { id: 2, name: 'Mehmet Tan', vehicle: 'Elektrikli Bisiklet', zone: 'Kadıköy', status: 'Müsait', ordersDelivered: 8 },
  { id: 3, name: 'Caner Bakır', vehicle: 'Otomobil', zone: 'Şişli', status: 'Çevrimdışı', ordersDelivered: 12 }
];

const couriersSlice = createSlice({
  name: 'couriers',
  initialState: {
    list: INITIAL_COURIERS,
  },
  reducers: {
    addCourier: (state, action) => {
      state.list.push({
        id: Date.now(),
        ordersDelivered: 0,
        ...action.payload,
      });
    },
    updateCourierStatus: (state, action) => {
      const { id, status } = action.payload;
      const courier = state.list.find(c => c.id === id);
      if (courier) {
        courier.status = status;
      }
    },
    incrementDelivered: (state, action) => {
      const courier = state.list.find(c => c.id === action.payload);
      if (courier) {
        courier.ordersDelivered += 1;
      }
    },
  },
});

export const { addCourier, updateCourierStatus, incrementDelivered } = couriersSlice.actions;

export default couriersSlice.reducer;

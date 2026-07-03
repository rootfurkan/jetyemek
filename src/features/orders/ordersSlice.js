import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    // Müşterinin anlık aktif siparişi (null = sipariş yok)
    activeOrder: null,

    // Müşterinin geçmiş siparişleri (db'den çekilir)
    previousOrders: [],

    // Admin/Restoran panel sipariş listesi (db'den çekilir)
    platformOrders: [],

    // Yükleniyor durumları
    isLoading: false,
  },
  reducers: {
    // ─── Aktif Sipariş ────────────────────────────────────────────────────────
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
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

    // Aktif siparişi teslim edildi olarak işaretle → geçmişe taşı
    deliverActiveOrder: (state) => {
      if (state.activeOrder) {
        const delivered = {
          ...state.activeOrder,
          status: 'Teslim Edildi',
          deliveryStatus: 'delivered',
          progress: 100,
        };
        state.previousOrders.unshift(delivered);
        // Platform orders'da da güncelle
        const platformOrder = state.platformOrders.find(
          (o) => o.id === state.activeOrder.id
        );
        if (platformOrder) {
          platformOrder.status = 'Teslim Edildi';
        }
        state.activeOrder = null;
      }
    },

    cancelActiveOrder: (state) => {
      if (state.activeOrder) {
        const cancelled = {
          ...state.activeOrder,
          status: 'İptal Edildi',
          deliveryStatus: 'cancelled',
        };
        state.previousOrders.unshift(cancelled);
        state.activeOrder = null;
      }
    },

    // ─── Geçmiş Siparişler ────────────────────────────────────────────────────
    setPreviousOrders: (state, action) => {
      state.previousOrders = action.payload;
    },

    addPreviousOrder: (state, action) => {
      state.previousOrders.unshift(action.payload);
    },

    // ─── Platform Siparişleri (Admin / Restoran) ──────────────────────────────
    setPlatformOrders: (state, action) => {
      state.platformOrders = action.payload;
    },

    addPlatformOrder: (state, action) => {
      state.platformOrders.unshift(action.payload);
    },

    updatePlatformOrderStatus: (state, action) => {
      const { id, status } = action.payload;
      const order = state.platformOrders.find((o) => o.id === id);
      if (order) {
        order.status = status;
      }
    },

    // ─── Loading ──────────────────────────────────────────────────────────────
    setOrdersLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setActiveOrder,
  updateActiveOrderProgress,
  updateActiveOrderStatus,
  deliverActiveOrder,
  cancelActiveOrder,
  setPreviousOrders,
  addPreviousOrder,
  setPlatformOrders,
  addPlatformOrder,
  updatePlatformOrderStatus,
  setOrdersLoading,
} = ordersSlice.actions;

export default ordersSlice.reducer;

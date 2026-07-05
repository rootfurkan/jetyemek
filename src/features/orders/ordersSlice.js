import { createSlice } from '@reduxjs/toolkit';

// Siparişlerin müşteri, restoran ve admin state yönetimini tutar.
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
    // Müşterinin aktif siparişini state içine alır.
    setActiveOrder: (state, action) => {
      state.activeOrder = action.payload;
    },

    // Aktif sipariş ilerleme yüzdesini günceller.
    updateActiveOrderProgress: (state, action) => {
      if (state.activeOrder) {
        state.activeOrder.progress = action.payload;
      }
    },

    // Aktif siparişin görünen durum metnini günceller.
    updateActiveOrderStatus: (state, action) => {
      if (state.activeOrder) {
        state.activeOrder.status = action.payload;
      }
    },

    // Aktif siparişi teslim edildi olarak işaretle → geçmişe taşı
    // Aktif siparişi teslim edip önceki siparişlere taşır.
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

    // Aktif siparişi iptal edip geçmiş siparişlere ekler.
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
    // Kullanıcının geçmiş siparişlerini db verisiyle doldurur.
    setPreviousOrders: (state, action) => {
      state.previousOrders = action.payload;
    },

    // Yeni tamamlanan siparişi geçmiş listenin başına ekler.
    addPreviousOrder: (state, action) => {
      state.previousOrders.unshift(action.payload);
    },

    // ─── Platform Siparişleri (Admin / Restoran) ──────────────────────────────
    // Admin ve restoran panellerindeki sipariş listesini doldurur.
    setPlatformOrders: (state, action) => {
      state.platformOrders = action.payload;
    },

    // Yeni siparişi platform sipariş listesine ekler.
    addPlatformOrder: (state, action) => {
      state.platformOrders.unshift(action.payload);
    },

    // Admin/restoran durum değişimini ortak sipariş listesine yansıtır.
    updatePlatformOrderStatus: (state, action) => {
      const { id, status, deliveryStatus, progress } = action.payload;
      const order = state.platformOrders.find((o) => o.id === id);
      if (order) {
        order.status = status;
        if (deliveryStatus) order.deliveryStatus = deliveryStatus;
        if (progress !== undefined) order.progress = progress;
      }
    },

    // ─── Loading ──────────────────────────────────────────────────────────────
    // Sipariş yüklenme durumunu günceller.
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

import { createSlice } from '@reduxjs/toolkit';

const INITIAL_FINANCIALS = [
  { id: '#4592', restaurant: 'Burger House', date: '14 Eki 2023, 14:30', gross: 12450.00, comm: 996.00, net: 11454.00, status: 'Tamamlandı' },
  { id: '#3321', restaurant: 'Sushi Palace', date: '14 Eki 2023, 11:15', gross: 8900.00, comm: 712.00, net: 8188.00, status: 'Beklemede' },
  { id: '#9901', restaurant: 'Pizza King', date: '13 Eki 2023, 19:45', gross: 15200.00, comm: 1216.00, net: 13984.00, status: 'Tamamlandı' },
  { id: '#4122', restaurant: 'Green Farm Salad', date: '13 Eki 2023, 16:05', gross: 4300.00, comm: 344.00, net: 3956.00, status: 'İptal Edildi' }
];

// Platform finans kayıtlarını ve temel ücretleri yönetir.
const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    financials: INITIAL_FINANCIALS,
    baseCommission: 12,
    baseDeliveryFee: 24.90,
  },
  reducers: {
    // Yeni finans hareketini liste başına ekler.
    addFinancialLog: (state, action) => {
      state.financials.unshift(action.payload);
    },
    // Finans kaydının durumunu günceller.
    updateFinancialStatus: (state, action) => {
      const { id, status } = action.payload;
      const f = state.financials.find(log => log.id === id);
      if (f) {
        f.status = status;
      }
    },
    // Varsayılan platform komisyon oranını değiştirir.
    updateBaseCommission: (state, action) => {
      state.baseCommission = action.payload;
    },
    // Varsayılan teslimat ücretini değiştirir.
    updateBaseDeliveryFee: (state, action) => {
      state.baseDeliveryFee = action.payload;
    }
  },
});

export const {
  addFinancialLog,
  updateFinancialStatus,
  updateBaseCommission,
  updateBaseDeliveryFee,
} = financeSlice.actions;

export default financeSlice.reducer;

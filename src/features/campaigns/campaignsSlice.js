import { createSlice } from '@reduxjs/toolkit';

const INITIAL_PROMOS = [
  { code: 'LEZZET25', type: 'Kupon Kodu', rate: '%25', desc: 'Yeni Kullanıcı Kampanyası', usage: '1.240 / 5,000', progress: 25, condition: 'Min. 150 ₺', status: 'Aktif' },
  { code: 'FREEFOOD', type: 'Kampanya', rate: '0 ₺ Kargo', desc: 'Ücretsiz Teslimat', usage: '3.456 / ∞', progress: 65, condition: 'Tüm Restoranlar', status: 'Aktif' },
  { code: 'BAHAR20', type: 'Kupon Kodu', rate: '%20', desc: 'Bahar Sezonu İndirimi', usage: '2,000 / 2,000', progress: 100, condition: 'Min. 150 ₺', status: 'Sona Erdi' }
];

// Kampanya ve kupon state bilgisini yönetir.
const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState: {
    promos: INITIAL_PROMOS,
  },
  reducers: {
    // Admin panelden yeni kampanyayı listeye ekler.
    addCampaign: (state, action) => {
      state.promos.unshift({
        usage: '0 / 10,000',
        progress: 0,
        status: 'Aktif',
        ...action.payload,
      });
    },
    // Kampanyayı aktif veya pasif yapar.
    toggleCampaignStatus: (state, action) => {
      const promo = state.promos.find(p => p.code === action.payload);
      if (promo) {
        promo.status = promo.status === 'Aktif' ? 'Pasif' : 'Aktif';
      }
    },
  },
});

export const { addCampaign, toggleCampaignStatus } = campaignsSlice.actions;

export default campaignsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { SPONSOR_RESTAURANTS, RESTAURANT_GRID } from '../../data.jsx';

// Tüm restoranları birleştir: sponsorlar + grid (tekrarları ID'ye göre kaldır)
const ALL_RESTAURANTS = [
  ...SPONSOR_RESTAURANTS.map(r => ({ ...r, isSponsor: true, isOpen: r.isOpen ?? true, commission: r.commission ?? 12, status: 'Aktif' })),
  ...RESTAURANT_GRID.filter(r => !SPONSOR_RESTAURANTS.find(s => s.id === r.id)).map(r => ({
    ...r, isSponsor: false, commission: r.commission ?? 12, status: r.isOpen === false ? 'Pasif' : 'Aktif'
  })),
];

// Restoran listesini, durumunu ve komisyon bilgisini yönetir.
const restaurantsSlice = createSlice({
  name: 'restaurants',
  initialState: {
    list: ALL_RESTAURANTS,
    sponsorList: SPONSOR_RESTAURANTS,
    gridList: ALL_RESTAURANTS,
    selectedRestaurantId: null,
  },
  reducers: {
    // db.json restoran verisini Redux listelerine aktarır.
    setRestaurants: (state, action) => {
      state.list = action.payload;
      state.sponsorList = action.payload.filter(r => r.isSponsor);
      state.gridList = action.payload;
    },
    // Panelde seçili restoran bilgisini saklar.
    setSelectedRestaurantId: (state, action) => {
      state.selectedRestaurantId = action.payload;
    },
    // Restoranı aktif veya pasif hale getirir.
    toggleRestaurantStatus: (state, action) => {
      const updateItem = (arr, id) => {
        const r = arr.find(r => r.id === id);
        if (r) {
          r.status = r.status === 'Aktif' ? 'Pasif' : 'Aktif';
          r.isOpen = r.status === 'Aktif';
        }
      };
      updateItem(state.list, action.payload);
      updateItem(state.gridList, action.payload);
    },
    // Restorana ait komisyon oranını günceller.
    updateRestaurantCommission: (state, action) => {
      const { id, commission } = action.payload;
      const update = arr => {
        const r = arr.find(r => r.id === id);
        if (r) r.commission = parseFloat(commission);
      };
      update(state.list);
      update(state.gridList);
    },
    // Restoran profil ve ayar değişikliklerini listelere işler.
    updateRestaurant: (state, action) => {
      const updatedRestaurant = action.payload;
      const update = arr => {
        const index = arr.findIndex(r => r.id === updatedRestaurant.id);
        if (index !== -1) arr[index] = { ...arr[index], ...updatedRestaurant };
      };
      update(state.list);
      update(state.gridList);
      update(state.sponsorList);
    },
    // Admin panelden yeni restoranı listeye ekler.
    addRestaurant: (state, action) => {
      const newRest = {
        id: action.payload.id || 'rest-' + Date.now(),
        rating: '5.0',
        status: 'Aktif',
        isOpen: true,
        isSponsor: false,
        commission: 12,
        minOrder: '100 TL',
        time: '30-40 dk',
        deliveryFee: 'Ücretsiz',
        tag: 'evyemekleri',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U',
        ...action.payload,
      };
      state.list.push(newRest);
      state.gridList.push(newRest);
    },
    // Seçilen restoranı tüm restoran listelerinden kaldırır.
    deleteRestaurant: (state, action) => {
      state.list = state.list.filter(r => r.id !== action.payload);
      state.gridList = state.gridList.filter(r => r.id !== action.payload);
      state.sponsorList = state.sponsorList.filter(r => r.id !== action.payload);
    },
  },
});

export const {
  setRestaurants,
  setSelectedRestaurantId,
  toggleRestaurantStatus,
  updateRestaurantCommission,
  updateRestaurant,
  addRestaurant,
  deleteRestaurant,
} = restaurantsSlice.actions;

export default restaurantsSlice.reducer;

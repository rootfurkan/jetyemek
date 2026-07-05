import { createSlice } from '@reduxjs/toolkit';
import { GOURMET_MENU } from '../../data.jsx';

// Başlangıç menü itemleri — restaurantId ile etiketlendi
const INITIAL_MENU_ITEMS = [
  ...GOURMET_MENU.map(item => ({ ...item, restaurantId: 'gourmet-burger' })),
  // Lezzet Sofrası başlangıç menüsü
  {
    id: 'lezzet-mercimek-corbasi',
    restaurantId: 'lezzet-sofrasi',
    name: 'Mercimek Çorbası',
    price: 75,
    description: 'Geleneksel kırmızı mercimek çorbası, tereyağı ve nane ile servis edilir.',
    time: '10-15 dk',
    category: 'Popüler',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U',
  },
  {
    id: 'lezzet-kuru-fasulye',
    restaurantId: 'lezzet-sofrasi',
    name: 'Kuru Fasulye Pilav',
    price: 120,
    description: 'Ev yapımı kuru fasulye, pirinç pilavı ve turşu ile servis edilir.',
    time: '15-20 dk',
    category: 'Ana Yemekler',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U',
  },
  {
    id: 'lezzet-karisik-izgara',
    restaurantId: 'lezzet-sofrasi',
    name: 'Karışık Izgara Tabağı',
    price: 280,
    description: 'Köfte, tavuk sis ve kuzu pirzola. Yanında pilav ve ızgara sebze.',
    time: '25-35 dk',
    category: 'Popüler',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U',
  },
];

// Restoran menü ürünlerinin Redux tarafını yönetir.
const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: INITIAL_MENU_ITEMS,
  },
  reducers: {
    // db.json menü ürünlerini Redux state içine aktarır.
    setMenuItems: (state, action) => {
      // API'den gelen veriler ile mevcut state'i birleştir (restaurantId ekle)
      const apiItems = action.payload.map(item => ({
        ...item,
        restaurantId: item.restaurantId || 'gourmet-burger',
      }));
      // Mevcut eklenen itemleri koru, sadece API kayıtlarını güncelle
      state.items = apiItems;
    },
    // Restoran panelinden eklenen ürünü liste başına koyar.
    addMenuItem: (state, action) => {
      state.items.unshift({
        id: 'item-' + Date.now(),
        status: 'Active',
        ...action.payload,
      });
    },
    // Silinen ürünü menü listesinden çıkarır.
    deleteMenuItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    // Ürün düzenleme, fiyat ve aktiflik değişimini işler.
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

import { createSlice } from '@reduxjs/toolkit';
import { INITIAL_USER, INITIAL_ADDRESSES, INITIAL_CARDS } from '../../data.jsx';

// Başlangıç hesap listesi (db.json ile senkronize)
const INITIAL_ACCOUNTS = [
  {
    id: 1,
    type: 'admin',
    email: 'admin@jetyemek.com',
    password: 'admin123',
    name: 'Platform Admin',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1OnzU0H07Jl19OAJhRmnrjZ1nAia79SjMtiOy3icj_YvZO5DNspysFfERiG-MU5GAqwRkXTj-VdE5FNzuC503l8VsgNko6DqRo3LlwHUacAkoepZaI4yDBXXY4qRe44OrrodkHRwmf9nEd3gnRjdgAgTorRBJeWhqfVu9Q9BWI8BafCM9juKMCEArpEvFb5Czp_JVB6lLvLJxMMRdTywYRRpHSle7Bg_4btImvyUWekAuCeN2AcTlYQ',
  },
  {
    id: 2,
    type: 'restaurant',
    email: 'gourmet@jetyemek.com',
    password: 'rest123',
    restaurantId: 'gourmet-burger',
    name: 'Gourmet Burger House',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdjrsT9Ktj1yZGgop0d8nrS1TsyeJIP4RonQZLlchh1vlAM3nmjFdF6UNKbgug-T12zhD7iCHI9cGKLIZrOfuHK1x8_pul3qzJ4_sjG1yQXWPNmAe43xo7PvPFVy7QSqmCguNviM-K3-Ww1N4kJVBm5-gV2c8u451IRcAV6kTEWilXjikql8G4_3f9Ys9tLQQx0zKehgs4zJDZvBqbEV2XnxJnE3QzIwghdO9OKBBTzSyY6lbAV0r7xSoXwwphKDnMC3uGq2w8XjA',
  },
  {
    id: 3,
    type: 'restaurant',
    email: 'lezzet@jetyemek.com',
    password: 'rest123',
    restaurantId: 'lezzet-sofrasi',
    name: 'Lezzet Sofrası',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBRPoRs6VKT-ySLSQhdu8Boq9afALJYNi_qrxHW-yLf_DmqyDxotD82BvURB4QL-MlsTp2H8vqXlt1wKPxvYswVY99Au7AamrCyBaahAzRkn5kFLIX-KgTpWc-in1avO-e_2PAF4dENFsQbj_rgqNpYrhGZ0ts-zVI_y95NpjAqahKSopcwfRkK51fX0_bxNsfcoIlzBfCilwibiS63DPsMkr-Tl1_Y4PCq8YrGFEchU9eSaiEywQw4fB8hU_4EykbBLLWrVMQpj_U',
  },
  {
    id: 4,
    type: 'customer',
    email: 'musteri@jetyemek.com',
    password: 'musteri123',
    name: 'Demo Müşteri',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1OnzU0H07Jl19OAJhRmnrjZ1nAia79SjMtiOy3icj_YvZO5DNspysFfERiG-MU5GAqwRkXTj-VdE5FNzuC503l8VsgNko6DqRo3LlwHUacAkoepZaI4yDBXXY4qRe44OrrodkHRwmf9nEd3gnRjdgAgTorRBJeWhqfVu9Q9BWI8BafCM9juKMCEArpEvFb5Czp_JVB6lLvLJxMMRdTywYRRpHSle7Bg_4btImvyUWekAuCeN2AcTlYQ',
  },
];

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    // --- Hesap Listesi (dinamik, admin yeni hesap ekleyebilir) ---
    accounts: INITIAL_ACCOUNTS,

    // --- Kimlik Doğrulama State ---
    isAuthenticated: false,
    userType: null,        // 'customer' | 'restaurant' | 'admin'
    currentUser: null,     // Giriş yapan kullanıcının bilgileri
    loginError: null,      // Hata mesajı

    // --- Müşteri Profili State (mevcut yapı korunuyor) ---
    userProfile: INITIAL_USER,
    addresses: INITIAL_ADDRESSES,
    savedCards: INITIAL_CARDS,
    favorites: ['gourmet-burger'],
  },
  reducers: {
    // --- Auth Reducer'ları ---
    login: (state, action) => {
      const { email, password } = action.payload;
      const account = state.accounts.find(
        acc => acc.email === email && acc.password === password
      );

      if (account) {
        state.isAuthenticated = true;
        state.userType = account.type;
        state.loginError = null;
        // Şifreyi state'e kaydetmiyoruz
        const { password: _pw, ...safeAccount } = account;
        state.currentUser = safeAccount;
        // Müşteri girişinde profil bilgisini güncelle
        if (account.type === 'customer') {
          state.userProfile = {
            ...state.userProfile,
            name: account.name,
            avatar: account.avatar,
          };
        }
      } else {
        state.loginError = 'E-posta veya şifre hatalı. Lütfen tekrar deneyin.';
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userType = null;
      state.currentUser = null;
      state.loginError = null;
    },
    clearLoginError: (state) => {
      state.loginError = null;
    },
    // Admin yeni restoran/kullanıcı hesabı eklediğinde login listesini güncelle
    addAccount: (state, action) => {
      const exists = state.accounts.find(a => a.email === action.payload.email);
      if (!exists) {
        state.accounts.push({
          id: Date.now(),
          ...action.payload,
        });
      }
    },

    // --- Müşteri Profili Reducer'ları (mevcut yapı korunuyor) ---
    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(favId => favId !== id);
      } else {
        state.favorites.push(id);
      }
    },
    updateProfile: (state, action) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
    },
    changeAvatar: (state, action) => {
      state.userProfile.avatar = action.payload;
    },
    addAddress: (state, action) => {
      state.addresses.push({
        id: action.payload.id || Date.now(),
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
  login,
  logout,
  clearLoginError,
  addAccount,
  toggleFavorite,
  updateProfile,
  changeAvatar,
  addAddress,
  deleteAddress,
  addCard,
  deleteCard,
} = authSlice.actions;

export default authSlice.reducer;

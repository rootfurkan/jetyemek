import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { updateUser } from '../../services/api.js';

// ─── localStorage yardımcıları ─────────────────────────────────────────────────
const STORAGE_KEY = 'jetyemek_auth';

function saveToStorage(authData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
  } catch (_) { /* ignore */ }
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_) {
    return null;
  }
}

function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_) { /* ignore */ }
}

// ─── Initial State (localStorage'dan oku) ─────────────────────────────────────
const persisted = loadFromStorage();

const initialState = {
  // Auth
  isAuthenticated: persisted?.isAuthenticated || false,
  userRole: persisted?.userRole || null,   // 'customer' | 'restaurant' | 'admin'
  currentUser: persisted?.currentUser || null,
  loginError: null,

  // Müşteri Profil
  userProfile: persisted?.userProfile || {
    name: '',
    surname: '',
    email: '',
    phone: '',
    birthdate: '',
    avatar: '',
  },

  // Adresler — App.jsx'te giriş sonrası db'den çekilir
  addresses: persisted?.addresses || [],

  // Kayıtlı Kartlar
  savedCards: persisted?.savedCards || [],

  // Favoriler
  favorites: persisted?.favorites || [],
};

// ─── Slice ────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Başarılı giriş (db'den dönen kullanıcı objesi ile çağrılır)
    loginSuccess: (state, action) => {
      const user = action.payload;
      // Şifreyi Redux state'e kaydetmiyoruz
      const { password: _pw, ...safeUser } = user;

      state.isAuthenticated = true;
      state.userRole = user.role;
      state.currentUser = safeUser;
      state.loginError = null;

      // Müşteri ise profil bilgilerini güncelle
      if (user.role === 'customer') {
        state.userProfile = {
          name: user.name || '',
          surname: user.surname || '',
          email: user.email || '',
          phone: user.phone || '',
          birthdate: user.birthdate || '',
          avatar: user.avatar || '',
        };
      }

      // localStorage'a kaydet
      saveToStorage({
        isAuthenticated: true,
        userRole: user.role,
        currentUser: safeUser,
        userProfile: state.userProfile,
        addresses: state.addresses,
        savedCards: state.savedCards,
        favorites: state.favorites,
      });
    },

    setLoginError: (state, action) => {
      state.loginError = action.payload;
    },

    clearLoginError: (state) => {
      state.loginError = null;
    },

    logout: (state) => {
      state.isAuthenticated = false;
      state.userRole = null;
      state.currentUser = null;
      state.loginError = null;
      state.userProfile = { name: '', surname: '', email: '', phone: '', birthdate: '', avatar: '' };
      state.addresses = [];
      state.savedCards = [];
      state.favorites = [];
      clearStorage();
    },

    // ─── Müşteri Profil ───────────────────────────────────────────────────────
    updateProfile: (state, action) => {
      state.userProfile = { ...state.userProfile, ...action.payload };
      // Profil değiştiğinde localStorage güncelle
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, userProfile: state.userProfile });
      }
    },

    changeAvatar: (state, action) => {
      state.userProfile.avatar = action.payload;
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, userProfile: state.userProfile });
      }
    },

    // ─── Adresler ─────────────────────────────────────────────────────────────
    setAddresses: (state, action) => {
      state.addresses = action.payload;
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, addresses: state.addresses });
      }
    },

    addAddress: (state, action) => {
      state.addresses.push(action.payload);
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, addresses: state.addresses });
      }
    },

    deleteAddress: (state, action) => {
      state.addresses = state.addresses.filter((addr) => addr.id !== action.payload);
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, addresses: state.addresses });
      }
    },

    // ─── Kartlar ──────────────────────────────────────────────────────────────
    addCard: (state, action) => {
      // DB'den dönen obje zaten id içeriyorsa override etme
      const card = action.payload.id
        ? action.payload
        : { id: 'card-' + Date.now(), ...action.payload };
      // Duplicate kontrolü
      if (!state.savedCards.find((c) => c.id === card.id)) {
        state.savedCards.push(card);
      }
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, savedCards: state.savedCards });
      }
    },

    deleteCard: (state, action) => {
      state.savedCards = state.savedCards.filter((card) => card.id !== action.payload);
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, savedCards: state.savedCards });
      }
    },

    // ─── Favoriler ────────────────────────────────────────────────────────────
    setFavorites: (state, action) => {
      state.favorites = action.payload || [];
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, favorites: state.favorites });
      }
    },

    toggleFavorite: (state, action) => {
      const id = action.payload;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter((fid) => fid !== id);
      } else {
        state.favorites.push(id);
      }
      const stored = loadFromStorage();
      if (stored) {
        saveToStorage({ ...stored, favorites: state.favorites });
      }
    },
  },
});

export const toggleFavoriteAsync = createAsyncThunk(
  'auth/toggleFavoriteAsync',
  async (productId, { getState, dispatch }) => {
    try {
      const state = getState();
      const currentUser = state.auth.currentUser;
      
      // Hemen UI güncellenmesi için standart reducer'ı çağırıyoruz (optimistic update)
      dispatch(authSlice.actions.toggleFavorite(productId));

      // Eğer kullanıcı giriş yapmışsa db.json'ı da güncelle
      if (currentUser && currentUser.id) {
        const newFavorites = getState().auth.favorites;
        await updateUser(currentUser.id, { favorites: newFavorites });
      }
      
      return productId;
    } catch (error) {
      console.error('Favori güncellenirken hata:', error);
      // Hata durumunda işlemi geri almak isterseniz dispatch(authSlice.actions.toggleFavorite(productId))
      throw error;
    }
  }
);

export const {
  loginSuccess,
  setLoginError,
  clearLoginError,
  logout,
  updateProfile,
  changeAvatar,
  setAddresses,
  addAddress,
  deleteAddress,
  addCard,
  deleteCard,
  toggleFavorite,
  setFavorites,
} = authSlice.actions;

export default authSlice.reducer;

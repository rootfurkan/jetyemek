import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getReviews, createReview, updateReview } from '../../services/api.js';

// Async Thunks
// Yorumları restoran bazlı veya genel olarak db.jsondan çeker.
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (restaurantId, { rejectWithValue }) => {
    try {
      const data = await getReviews(restaurantId);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Yorumlar yüklenemedi.');
    }
  }
);

// Müşterinin yorumunu moderasyon kurallarıyla kaydeder.
export const addReview = createAsyncThunk(
  'reviews/addReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const data = await createReview(reviewData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Yorum eklenemedi.');
    }
  }
);

// Restoran cevabını ilgili yoruma kaydeder.
export const replyToReview = createAsyncThunk(
  'reviews/replyToReview',
  async ({ id, reply }, { rejectWithValue }) => {
    try {
      const data = await updateReview(id, { reply });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Yanıt gönderilemedi.');
    }
  }
);

// Yorum listesini ve yüklenme durumunu yönetir.
const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    // Yorum listesini ve hata bilgisini temizler.
    clearReviews: (state) => {
      state.list = [];
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Reviews
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Review
    builder
      .addCase(addReview.fulfilled, (state, action) => {
        state.list.unshift(action.payload); // Add to the beginning
      });

    // Reply to Review
    builder
      .addCase(replyToReview.fulfilled, (state, action) => {
        const index = state.list.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.list[index] = action.payload;
        }
      });
  },
});

export const { clearReviews } = reviewsSlice.actions;
export default reviewsSlice.reducer;

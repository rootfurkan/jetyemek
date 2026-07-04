import { createSlice } from '@reduxjs/toolkit';

const INITIAL_REVIEWS = [
  { id: 1, user: 'Ahmet Y.', rating: 5, date: 'Bugün', comment: 'Sıcak ve lezzetli geldi, kurye arkadaş çok nazikti.' },
  { id: 2, user: 'Selin K.', rating: 4, date: 'Dün', comment: 'Pizzanın malzemesi boldu ama biraz soğuktu.' },
  { id: 3, user: 'Can D.', rating: 5, date: '2 gün önce', comment: 'Harika hamburgerler!' }
];

const reviewsSlice = createSlice({
  name: 'reviews',
  initialState: {
    list: INITIAL_REVIEWS,
  },
  reducers: {
    setReviews: (state, action) => {
      state.list = action.payload;
    },
    addReview: (state, action) => {
      state.list.unshift({
        id: Date.now(),
        date: 'Bugün',
        ...action.payload,
      });
    },
  },
});

export const { setReviews, addReview } = reviewsSlice.actions;

export default reviewsSlice.reducer;

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

export async function loginUser(email, password) {
  const response = await api.get(`/users?email=${encodeURIComponent(email)}`);
  const users = response.data;
  if (!users || users.length === 0) return null;
  const user = users.find((u) => u.email === email && u.password === password);
  return user || null;
}

export async function registerUser(userData) {
  const response = await api.post('/users', userData);
  return response.data;
}

export async function updateUser(id, data) {
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
}

export async function getUserById(id) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

export async function getRestaurants() {
  const response = await api.get('/restaurants');
  return response.data;
}

export async function updateRestaurant(id, data) {
  const response = await api.patch(`/restaurants/${id}`, data);
  return response.data;
}

export async function getMenuItems(restaurantId) {
  const url = restaurantId ? `/menuItems?restaurantId=${restaurantId}` : '/menuItems';
  const response = await api.get(url);
  return response.data;
}

export async function createMenuItem(menuItem) {
  const response = await api.post('/menuItems', menuItem);
  return response.data;
}

export async function updateMenuItemApi(id, menuItem) {
  const response = await api.patch(`/menuItems/${id}`, menuItem);
  return response.data;
}

export async function deleteMenuItemApi(id) {
  const response = await api.delete(`/menuItems/${id}`);
  return response.data;
}

export async function getAddresses(userId) {
  const response = await api.get(`/addresses?userId=${userId}`);
  return response.data;
}

export async function createAddress(addressData) {
  const response = await api.post('/addresses', addressData);
  return response.data;
}

export async function deleteAddressApi(id) {
  const response = await api.delete(`/addresses/${id}`);
  return response.data;
}

export async function getCards(userId) {
  const response = await api.get(`/cards?userId=${userId}`);
  return response.data;
}

export async function createCard(cardData) {
  const response = await api.post('/cards', cardData);
  return response.data;
}

export async function deleteCardApi(id) {
  const response = await api.delete(`/cards/${id}`);
  return response.data;
}

export async function getOrders(userId) {
  const response = await api.get('/orders');
  const orders = response.data || [];
  const filteredOrders = userId
    ? orders.filter((order) => String(order.userId) === String(userId))
    : orders;

  return filteredOrders.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0);
    const dateB = new Date(b.createdAt || 0);
    return dateB - dateA;
  });
}

// Old getReviews removed

export async function createOrder(order) {
  const response = await api.post('/orders', order);
  return response.data;
}

export async function updateOrder(id, data) {
  const response = await api.patch(`/orders/${id}`, data);
  return response.data;
}

export async function getCampaigns() {
  const response = await api.get('/campaigns');
  return response.data || [];
}

export async function createCampaign(campaign) {
  const response = await api.post('/campaigns', campaign);
  return response.data;
}

export async function updateCampaign(id, data) {
  const response = await api.patch(`/campaigns/${id}`, data);
  return response.data;
}

// ─── Reviews ──────────────────────────────────────────────────────────────────
export async function getReviews(restaurantId) {
  const url = restaurantId ? `/reviews?restaurantId=${restaurantId}` : '/reviews';
  const response = await api.get(url);
  // Sort by date (newest first)
  const reviews = (response.data || []).filter((review) => review.status !== 'Onay Bekliyor' && review.status !== 'Silindi');
  return reviews.sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB - dateA;
  });
}

function normalizeReviewText(text) {
  return String(text || '')
    .toLocaleLowerCase('tr-TR')
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
}

async function getModerationWords() {
  try {
    const response = await api.get('/settings');
    const settings = (response.data || [])[0] || {};
    return settings.forbiddenReviewWords || [];
  } catch (error) {
    return [];
  }
}

export async function createReview(reviewData) { // yasaklı kelimelerin kontrol edilir
  const forbiddenWords = await getModerationWords(); //db den yasaklı kelimeler çekilir
  const normalizedComment = normalizeReviewText(reviewData.comment || reviewData.text); // yorumu normalize eder küçük büyük harf
  const matchedWord = forbiddenWords.find((word) => normalizedComment.includes(normalizeReviewText(word))); // yasaklı kelimelerde gezer ilk bulduğunu alır
  const moderationData = matchedWord // eşleşen verileri alıp koşul oluşturur
    ? {
        status: 'Onay Bekliyor',
        moderationReason: `"${matchedWord}" kelimesi nedeniyle admin onayı bekliyor.`, // eğer yasaklı kelimeyle eşleşirse onay bekliyor a atar
        moderationMatchedWord: matchedWord,
      }
    : { // değilse yayına al
        status: 'Yayında',
        moderationReason: '',
        moderationMatchedWord: '',
      };

  const response = await api.post('/reviews', { ...reviewData, ...moderationData });
  return response.data;
}

export async function updateReview(id, data) {
  const response = await api.patch(`/reviews/${id}`, data);
  return response.data;
}

export async function deleteReview(id) {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
}

export default api;

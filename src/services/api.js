import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

// ─── Auth ─────────────────────────────────────────────────────────────────────
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

// ─── Restaurants ──────────────────────────────────────────────────────────────
export async function getRestaurants() {
  const response = await api.get('/restaurants');
  return response.data;
}

// ─── Menu Items ───────────────────────────────────────────────────────────────
export async function getMenuItems(restaurantId) {
  const url = restaurantId ? `/menuItems?restaurantId=${restaurantId}` : '/menuItems';
  const response = await api.get(url);
  return response.data;
}

// ─── Addresses ────────────────────────────────────────────────────────────────
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

// ─── Cards ────────────────────────────────────────────────────────────────────
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

// ─── Orders ───────────────────────────────────────────────────────────────────
export async function getOrders(userId) {
  if (!userId) {
    const response = await api.get('/orders?_sort=createdAt&_order=desc');
    return response.data;
  }
  // userId hem string ("1") hem number (1) olabilir — ikisini de çek ve birleştir
  const strId = String(userId);
  const [res1, res2] = await Promise.allSettled([
    api.get(`/orders?userId=${strId}&_sort=createdAt&_order=desc`),
    api.get(`/orders?userId=${Number(strId)}&_sort=createdAt&_order=desc`),
  ]);
  const arr1 = res1.status === 'fulfilled' ? res1.value.data : [];
  const arr2 = res2.status === 'fulfilled' ? res2.value.data : [];
  // Duplicate'leri id'ye göre temizle
  const seen = new Set();
  const merged = [...arr1, ...arr2].filter((o) => {
    if (seen.has(o.id)) return false;
    seen.add(o.id);
    return true;
  });
  // createdAt'e göre sırala (en yeni önce)
  merged.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return merged;
}

export async function createOrder(order) {
  const response = await api.post('/orders', order);
  return response.data;
}

export async function updateOrder(id, data) {
  const response = await api.patch(`/orders/${id}`, data);
  return response.data;
}

export default api;

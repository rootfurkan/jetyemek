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

export async function getRestaurants() {
  const response = await api.get('/restaurants');
  return response.data;
}

export async function getMenuItems(restaurantId) {
  const url = restaurantId ? `/menuItems?restaurantId=${restaurantId}` : '/menuItems';
  const response = await api.get(url);
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

export async function createOrder(order) {
  const response = await api.post('/orders', order);
  return response.data;
}

export async function updateOrder(id, data) {
  const response = await api.patch(`/orders/${id}`, data);
  return response.data;
}

export default api;

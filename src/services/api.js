import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

export async function getRestaurants() {
  const response = await api.get('/restaurants');
  return response.data;
}

export async function getMenuItems(restaurantId) {
  const url = restaurantId ? `/menuItems?restaurantId=${restaurantId}` : '/menuItems';
  const response = await api.get(url);
  return response.data;
}

export async function createOrder(order) {
  const response = await api.post('/orders', order);
  return response.data;
}

export async function updateOrder(id, order) {
  const response = await api.patch(`/orders/${id}`, order);
  return response.data;
}

export default api;

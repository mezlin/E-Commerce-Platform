import axios from 'axios';

const API_URL = process.env.REACT_APP_ORDER_API_URL || 'http://localhost:4002/api';

const getAuthHeader = () => {
  const user = localStorage.getItem('user');
  if (user) {
    const { token } = JSON.parse(user);
    return { headers: { Authorization: `Bearer ${token}` } };
  }
  return {};
};

export interface OrderData {
  userId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
}

export const createOrder = (orderData: OrderData) => 
  axios.post(`${API_URL}/orders`, orderData, getAuthHeader());
export const getOrders = () => 
  axios.get(`${API_URL}/orders`, getAuthHeader());
export const getOrderById = (id: string) => 
  axios.get(`${API_URL}/orders/${id}`, getAuthHeader());
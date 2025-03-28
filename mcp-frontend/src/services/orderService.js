import axios from 'axios';

const API_URL = 'http://localhost:5000/api/orders'; // Update with your backend URL

const createOrder = async (orderData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(API_URL, orderData, config);
  return response.data;
};

const getOrders = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const assignOrder = async (orderId, partnerId, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.post(
    `${API_URL}/${orderId}/assign`,
    { partnerId },
    config
  );
  return response.data;
};

export default {
  createOrder,
  getOrders,
  assignOrder,
};
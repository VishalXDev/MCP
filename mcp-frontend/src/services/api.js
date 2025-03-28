// src/services/api.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Remove if authentication is not needed
  headers: {
    "Content-Type": "application/json",
  },
});

export const fetchOrdersWithLocations = async () => {
  try {
    const response = await api.get("/orders-with-locations");
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    return { error: error.message };
  }
};

export default api;

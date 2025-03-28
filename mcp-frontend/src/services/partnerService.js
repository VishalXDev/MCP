// In your frontend service file (e.g., src/services/partnerService.js)
import axios from 'axios';

const API_URL = '/api/partners';

const getPartners = async (token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.get(API_URL, config);
  return response.data;
};

const addPartner = async (partnerData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.post(API_URL, partnerData, config);
  return response.data;
};

const deletePartner = async (partnerId, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const response = await axios.delete(`${API_URL}/${partnerId}`, config);
  return response.data;
};

export default { getPartners, addPartner, deletePartner };
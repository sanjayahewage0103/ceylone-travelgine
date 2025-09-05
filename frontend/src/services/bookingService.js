import axios from 'axios';

const API_URL = '/api/bookings';

const createBooking = async (data, token) => {
  const res = await axios.post(API_URL, data, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  return res.data;
};

const getUserBookings = async (token) => {
  const res = await axios.get(`${API_URL}/my`, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : {},
  });
  return res.data;
};

export default { createBooking, getUserBookings };

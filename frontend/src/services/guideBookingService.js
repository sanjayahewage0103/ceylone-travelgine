import axios from 'axios';

const API_URL = '/api/guide/bookings';

const getBookings = async (token, { status = '', search = '' } = {}) => {
  const res = await axios.get(API_URL, {
    headers: { Authorization: `Bearer ${token}` },
    params: { status, search },
  });
  return res.data;
};

const updateStatus = async (id, status, token) => {
  const res = await axios.patch(`${API_URL}/${id}/status`, { status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

const getDetail = async (id, token) => {
  const res = await axios.get(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export default { getBookings, updateStatus, getDetail };

import axios from 'axios';

const API_URL = '/api/tour-packages';

const createTourPackage = async (data, token) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) && key === 'images') {
      value.forEach(img => formData.append('images', img));
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  const res = await axios.post(API_URL, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

const getTourPackageById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

const getTourPackagesByGuide = async (guide_id) => {
  const res = await axios.get(`${API_URL}?guide_id=${guide_id}`);
  return res.data;
};

const updateTourPackage = async (id, data, token) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (Array.isArray(value) && key === 'images') {
      value.forEach(img => formData.append('images', img));
    } else if (typeof value === 'object') {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });
  const res = await axios.put(`${API_URL}/${id}`, formData, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};


const getAllPublicTours = async (params = {}) => {
  // params: { search, tourType, tourCategory, minPrice, maxPrice, sortBy, sortOrder }
  const res = await axios.get(`${API_URL}/public/all`, { params });
  return res;
};

const deleteTourPackage = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return res.data;
};

export default {
  createTourPackage,
  getTourPackageById,
  getTourPackagesByGuide,
  updateTourPackage,
  deleteTourPackage,
  getAllPublicTours,
};

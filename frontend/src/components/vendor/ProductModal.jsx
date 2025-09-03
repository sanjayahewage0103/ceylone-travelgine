import React, { useState } from 'react';
import productService from '../../services/productService';

const categories = [
  'Handicrafts',
  'Gems & Jewellery',
  'Food & Spices',
  'Wellness & Ayurveda',
  'Other'
];

const ProductModal = ({ open, onClose, onProductAdded }) => {
  const [form, setForm] = useState({
    originalItemId: '',
    name: '',
    description: '',
    price: '',
    category: categories[0],
    stockQuantity: '',
    images: []
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, images: Array.from(files) });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (form.images.length < 1) throw new Error('At least one image is required.');
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach(img => data.append('images', img));
        } else {
          data.append(key, value);
        }
      });
      const product = await productService.addProduct(data);
      onProductAdded(product);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form className="bg-white p-8 rounded shadow w-full max-w-lg relative" onSubmit={handleSubmit}>
        <button type="button" className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">Add Product</h2>
        <div className="mb-2">
          <label className="block font-bold mb-1">Original Item ID</label>
          <input name="originalItemId" value={form.originalItemId} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Product Name</label>
          <input name="name" value={form.name} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="border rounded px-2 py-1 w-full" required rows={3} />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Price (LKR)</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Category</label>
          <select name="category" value={form.category} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Current Stock</label>
          <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Images (min 1, any number)</label>
          <input name="images" type="file" accept="image/*" multiple onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded w-full" disabled={loading}>{loading ? 'Adding...' : 'Add Product'}</button>
      </form>
    </div>
  );
};

export default ProductModal;

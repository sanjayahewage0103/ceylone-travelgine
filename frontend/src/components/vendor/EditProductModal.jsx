import React, { useState } from 'react';
import productService from '../../services/productService';

const EditProductModal = ({ open, onClose, product, onProductUpdated }) => {
  const [form, setForm] = useState({
    description: product.description,
    price: product.price,
    stockQuantity: product.stockQuantity,
    isActive: product.isActive,
    images: product.images || [],
    newImages: []
  });
  // For slider preview
  const [sliderIdx, setSliderIdx] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setForm({ ...form, newImages: Array.from(files) });
      setSliderIdx(form.images.length); // Show first new image if added
    } else if (type === 'checkbox') {
      setForm({ ...form, [name]: checked });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleRemoveImage = idx => {
    if (form.images.length + form.newImages.length <= 1) return;
    setForm(prev => {
      const newImages = prev.images.filter((_, i) => i !== idx);
      // Adjust sliderIdx if needed
      let newIdx = sliderIdx;
      if (sliderIdx >= newImages.length + prev.newImages.length) newIdx = 0;
      return { ...prev, images: newImages };
    });
  };

  const handleRemoveNewImage = idx => {
    if (form.images.length + form.newImages.length <= 1) return;
    setForm(prev => {
      const newNewImages = prev.newImages.filter((_, i) => i !== idx);
      let newIdx = sliderIdx;
      if (sliderIdx >= prev.images.length + newNewImages.length) newIdx = 0;
      return { ...prev, newImages: newNewImages };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = new FormData();
      data.append('description', form.description);
      data.append('price', form.price);
      data.append('stockQuantity', form.stockQuantity);
      data.append('isActive', form.isActive);
      data.append('existingImages', JSON.stringify(form.images));
      form.newImages.forEach(img => data.append('images', img));
      const updated = await productService.updateProduct(product._id, data);
      onProductUpdated(updated);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Combine all images for slider
  const allImages = [
    ...form.images.map(img => (typeof img === 'string' ? (img.startsWith('http') ? img : `http://localhost:5000${img}`) : img)),
    ...form.newImages.map(img => URL.createObjectURL(img))
  ];

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <form className="bg-white p-8 rounded shadow w-full max-w-lg relative" onSubmit={handleSubmit}>
        <button type="button" className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
        <div className="mb-2">
          <label className="block font-bold mb-1">Product Name</label>
          <input value={product.name} disabled className="border rounded px-2 py-1 w-full bg-gray-100" />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Original Item ID</label>
          <input value={product.originalItemId} disabled className="border rounded px-2 py-1 w-full bg-gray-100" />
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
          <label className="block font-bold mb-1">Current Stock</label>
          <input name="stockQuantity" type="number" value={form.stockQuantity} onChange={handleChange} className="border rounded px-2 py-1 w-full" required />
        </div>
        <div className="mb-2">
          <label className="block font-bold mb-1">Status</label>
          <select name="isActive" value={form.isActive} onChange={handleChange} className="border rounded px-2 py-1 w-full">
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
        </div>
        {/* Image slider preview */}
        <div className="mb-2 flex flex-col items-center">
          <label className="block font-bold mb-1 self-start">Images</label>
          {allImages.length > 0 && (
            <div className="relative flex items-center justify-center mb-2 w-full" style={{ minHeight: 120 }}>
              <button type="button" onClick={() => setSliderIdx(idx => (idx === 0 ? allImages.length - 1 : idx - 1))} disabled={allImages.length < 2} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow text-lg">&#8592;</button>
              <img src={allImages[sliderIdx]} alt="Preview" className="h-28 object-contain mx-auto" style={{ maxWidth: 220 }} />
              <button type="button" onClick={() => setSliderIdx(idx => (idx === allImages.length - 1 ? 0 : idx + 1))} disabled={allImages.length < 2} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow text-lg">&#8594;</button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {allImages.map((_, i) => (
                  <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === sliderIdx ? 'bg-blue-500' : 'bg-gray-300'}`}></span>
                ))}
              </div>
            </div>
          )}
          {/* Thumbnails for remove/add */}
          <div className="flex gap-2 flex-wrap mb-2">
            {form.images.map((img, idx) => (
              <div key={img} className="relative group">
                <img src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="Product" className="h-16 w-16 object-cover rounded border-2 cursor-pointer" onClick={() => setSliderIdx(idx)} />
                {form.images.length + form.newImages.length > 1 && (
                  <button type="button" className="absolute -top-2 -right-2 bg-white border rounded-full p-1 text-xs group-hover:block" onClick={() => handleRemoveImage(idx)} title="Remove image">&times;</button>
                )}
              </div>
            ))}
            {form.newImages.map((img, idx) => (
              <div key={img.name + idx} className="relative group">
                <img src={URL.createObjectURL(img)} alt="New" className="h-16 w-16 object-cover rounded border-2 cursor-pointer" onClick={() => setSliderIdx(form.images.length + idx)} />
                {form.images.length + form.newImages.length > 1 && (
                  <button type="button" className="absolute -top-2 -right-2 bg-white border rounded-full p-1 text-xs group-hover:block" onClick={() => handleRemoveNewImage(idx)} title="Remove image">&times;</button>
                )}
              </div>
            ))}
          </div>
          <input name="images" type="file" accept="image/*" multiple onChange={handleChange} className="border rounded px-2 py-1 w-full" />
        </div>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded w-full" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
      </form>
    </div>
  );
};

export default EditProductModal;

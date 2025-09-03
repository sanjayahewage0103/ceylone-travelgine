import React from 'react';

const ProductApprovalModal = ({ product, onClose, onAction }) => {
  if (!product) return null;
  const vendor = product.vendorId || {};
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-lg relative">
        <button type="button" className="absolute top-2 right-2 text-xl" onClick={onClose}>&times;</button>
        <h2 className="text-2xl font-bold mb-4">Product Details</h2>
        <div className="mb-2"><b>Name:</b> {product.name}</div>
        <div className="mb-2"><b>Category:</b> {product.category}</div>
        <div className="mb-2"><b>Description:</b> {product.description}</div>
        <div className="mb-2"><b>Stock:</b> {product.stockQuantity}</div>
        <div className="mb-2"><b>Price:</b> LKR {product.price}</div>
        <div className="mb-2"><b>Status:</b> {product.isApproved}</div>
        <div className="mb-2"><b>Shop Name:</b> {vendor.shopName}</div>
        <div className="mb-2"><b>Shop Address:</b> {vendor.address}</div>
        <div className="mb-2"><b>Business Reg. No:</b> {vendor.businessRegNum}</div>
        <div className="mb-2"><b>Vendor Location:</b> {vendor.location}</div>
        <div className="mb-2"><b>Images:</b>
          <div className="flex gap-2 mt-1 flex-wrap">
            {product.images && product.images.length > 0 ? product.images.map((img, idx) => (
              <img key={idx} src={img.startsWith('http') ? img : `http://localhost:5000${img}`} alt="Product" className="h-20 w-20 object-cover rounded" />
            )) : <span>No images</span>}
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={() => onAction(product, 'approve')}>Approve</button>
          <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={() => onAction(product, 'reject')}>Reject</button>
          <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ProductApprovalModal;

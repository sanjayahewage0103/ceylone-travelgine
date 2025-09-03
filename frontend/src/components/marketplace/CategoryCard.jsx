import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ label, image }) => (
  <Link to={`/marketplace/category/${encodeURIComponent(label)}`}
    className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col items-center cursor-pointer"
  >
    <img src={image} alt={label} className="h-20 w-20 object-cover rounded-full mb-2" />
    <span className="font-semibold text-gray-700 text-center">{label}</span>
  </Link>
);

export default CategoryCard;

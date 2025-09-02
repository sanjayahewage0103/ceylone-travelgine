import React from 'react';
import { createRoot } from 'react-dom/client';
import VendorApp from './App';
import './index.css';

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <VendorApp />
  </React.StrictMode>
);

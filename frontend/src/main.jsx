

console.log('DEBUG: main.jsx loaded');
const rootDiv = document.getElementById('root');
if (rootDiv) {
  rootDiv.innerHTML = '<div style="background: orange; color: black; font-size: 32px; text-align: center; padding: 16px;">DEBUG: main.jsx loaded</div>';
}

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { CartProvider } from './context/CartContext';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CartProvider>
        <App />
      </CartProvider>
    </BrowserRouter>
  </StrictMode>
);

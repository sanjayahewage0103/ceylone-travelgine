const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const adminRoutes = require('./routes/admin.routes');

const userRoutes = require('./routes/user.routes');

const vendorRoutes = require('./routes/vendor.routes');
const productRoutes = require('./routes/product.routes');

dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());
// Serve uploaded images
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

connectDB();



app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

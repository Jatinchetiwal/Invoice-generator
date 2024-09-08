const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);
const quotationRoutes = require('./routes/quotations');
pp.use('/api/quotations', quotationRoutes);

app.get('/', (req, res) => {
   res.send('Invoice Generator API');
});

mongoose.connect("mongodb://localhost:27017/invoice-generator")
   .then(() => console.log('MongoDB connected'))
   .catch((error) => console.log('MongoDB connection failed', error));

mongoose.connection.setMaxListeners(20);

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

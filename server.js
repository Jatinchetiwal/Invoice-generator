const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongo:27017/invoice-generator';

// Middleware to parse JSON
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

// Home Route
app.get('/', (req, res) => {
   res.send('Invoice Generator API');
});

// Connect to MongoDB
mongoose.connect(MONGO_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    
    // Start the Server after DB connection is successful
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit if MongoDB connection fails
  });

// Set max listeners to avoid memory leak warning
mongoose.connection.setMaxListeners(20);
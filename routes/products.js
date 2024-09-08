const express = require('express');
const router = express.Router();
const { addProducts } = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');

// Add Products Route
router.post('/add', authenticate, addProducts);

module.exports = router;

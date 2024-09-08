const express = require('express');
const router = express.Router();
const { addProducts } = require('../controllers/productController');
const authenticate = require('../middleware/authenticate');

router.post('/add', addProducts);

module.exports = router;

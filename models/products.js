const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   qty: {
      type: Number,
      required: true,
   },
   rate: {
      type: Number,
      required: true,
   },
   gst: {
      type: Number,
      required: true,
   },
   total: {
      type: Number,
      required: true,
   },
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;

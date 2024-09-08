const mongoose = require('mongoose');

const quotationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    products: [
        {
            name: String,
            qty: Number,
            rate: Number,
            gst: Number,
        },
    ],
    total: Number,
    createdAt: { type: Date, default: Date.now },
    pdfPath: { type: String },
});

const Quotation = mongoose.model('Quotation', quotationSchema);
module.exports = Quotation;

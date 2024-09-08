const express = require('express');
const path = require('path');
const fs = require('fs');
const Quotation = require('../models/Quotation');
const router = express.Router();
const authenticate = require('../middleware/authenticate');
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id; 
        const quotations = await Quotation.find({ userId });

        if (!quotations || quotations.length === 0) {
            return res.status(404).json({ message: 'No quotations found.' });
        }

        const quotationList = quotations.map(quotation => ({
            id: quotation._id,
            createdAt: quotation.createdAt,
            pdfPath: `/api/quotations/download/${quotation._id}`,
        }));

        res.status(200).json(quotationList);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/download/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const quotation = await Quotation.findById(id);

        if (!quotation || quotation.userId.toString() !== req.user.id) {
            return res.status(404).json({ message: 'Quotation not found or access denied.' });
        }

        const filePath = path.join(__dirname, '..', quotation.pdfPath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'PDF file not found.' });
        }

        res.download(filePath, 'quotation.pdf', (err) => {
            if (err) {
                return res.status(500).json({ message: 'Error downloading PDF.' });
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;

const Product = require('../models/products');
const puppeteer = require('puppeteer');

// Helper function to generate PDF
const generatePDF = async (invoiceData) => {
   const browser = await puppeteer.launch();
   const page = await browser.newPage();
   await page.setContent(invoiceData);
   const pdf = await page.pdf({ format: 'A4' });
   await browser.close();
   return pdf;
};

const path = require('path');
const Quotation = require('../models/Quotation');

exports.addProducts = async (req, res) => {
    const { products } = req.body;

    try {
        const userId = req.user.id;

        // Calculate total and GST for each product
        const gstProducts = products.map(product => ({
            ...product,
            gst: product.rate * product.qty * 0.18, // 18% GST
        }));

        const total = gstProducts.reduce((acc, product) => acc + product.rate * product.qty + product.gst, 0);

        // Generate PDF using Puppeteer
        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        await page.setContent(`
            <h1>Quotation</h1>
            <p>User ID: ${userId}</p>
            <ul>
                ${gstProducts.map(p => `<li>${p.name}: ${p.qty} x ${p.rate} + GST: ${p.gst}</li>`).join('')}
            </ul>
            <p>Total: ${total}</p>
        `);

        const pdfFileName = `quotation-${Date.now()}.pdf`;
        const pdfPath = path.join(__dirname, '..', 'pdfs', pdfFileName); // Store PDFs in a 'pdfs' folder

        await page.pdf({ path: pdfPath, format: 'A4' });
        await browser.close();

        const quotation = new Quotation({
            userId,
            products: gstProducts,
            total,
            pdfPath: `pdfs/${pdfFileName}`,
        });

        await quotation.save();

        res.status(201).json({ message: 'Quotation added', pdfPath });
    } catch (error) {
        res.status(500).json({ message: 'Error adding products and generating PDF' });
    }
};


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

exports.addProducts = async (req, res) => {
   const { products } = req.body;
   const userId = req.user.id; // From authenticated user

   if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: 'Invalid products data' });
   }

   try {
      const productData = products.map(product => {
         const gst = product.rate * product.qty * 0.18;
         const total = product.rate * product.qty + gst;

         return {
            ...product,
            gst,
            total,
            userId,
         };
      });

      const savedProducts = await Product.insertMany(productData);

      // Generate PDF content
      const invoiceData = `<h1>Invoice</h1>
                           ${savedProducts.map(p => `<p>${p.name}: ${p.qty} x ${p.rate} = ${p.total}</p>`).join('')}
                           <p>GST Included</p>`;

      const pdf = await generatePDF(invoiceData);

      res.status(201).contentType("application/pdf").send(pdf);
   } catch (error) {
      res.status(500).json({ message: 'Server error', error });
   }
};

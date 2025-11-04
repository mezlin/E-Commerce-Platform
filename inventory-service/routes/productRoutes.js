const express = require('express');
const router = express.Router();
const productController = require('../controller/productController');
const upload = require('../middleware/upload');

// Upload product image
router.post('/upload', upload.single('image'), productController.uploadImage);

// Create a new product
router.post('/', productController.createProduct);

// Get all products
router.get('/', productController.getProducts);

// Get product by ID
router.get('/:id', productController.getProductById);

// Update product
router.put('/:id', productController.updateProduct);

// Delete product
router.delete('/:id', productController.deleteProduct);

// Update product quantity
router.patch('/:id/quantity', productController.updateQuantity);

module.exports = router;
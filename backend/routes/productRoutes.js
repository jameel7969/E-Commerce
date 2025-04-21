const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { hasPermission } = require('../middleware/permissionMiddleware');
const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    deleteAllProducts,
    getProductById
} = require('../controllers/productController');

const router = express.Router();

router.get('/get', getProducts);
router.get('/get/:id', getProductById);

router.post('/create', protect, hasPermission('create:product'), createProduct);
router.put('/update/:id', protect, hasPermission('update:product'), updateProduct);
router.delete('/delete/:id', protect, hasPermission('delete:product'), deleteProduct);
router.delete('/deleteall', protect, hasPermission('delete:product'), deleteAllProducts);

module.exports = router;

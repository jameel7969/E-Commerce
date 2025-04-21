const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { hasPermission } = require('../middleware/permissionMiddleware');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug
} = require('../controllers/categoryController');

const router = express.Router();

// Public routes
router.get('/', getCategories);
router.get('/slug/:slug', getCategoryBySlug);

// Protected routes
router.post('/create', protect, hasPermission('manage:categories'), createCategory);
router.put('/:id', protect, hasPermission('manage:categories'), updateCategory);
router.delete('/:id', protect, hasPermission('manage:categories'), deleteCategory);

module.exports = router;
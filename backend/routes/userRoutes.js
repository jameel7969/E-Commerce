const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    assignRole,
    removeRole,
    getAllUsers
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');
const { hasPermission } = require('../middleware/permissionMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.get('/all', protect, hasPermission('manage:users'), getAllUsers);
router.post('/role/assign', protect, hasPermission('manage:users'), assignRole);
router.post('/role/remove', protect, hasPermission('manage:users'), removeRole);

module.exports = router;
const express = require('express');
const { createRole, getRoles, updateRole, deleteRole } = require('../controllers/roleController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', protect, admin, createRole);
router.get('/', protect, getRoles);
router.put('/:id', protect, admin, updateRole);
router.delete('/:id', protect, admin, deleteRole);

module.exports = router;
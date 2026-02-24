const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { getUsers, getUser, createUser, updateUser, deleteUser, getUserStats } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

const createUserValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password min 6 chars'),
  body('role').isIn(['employee', 'manager', 'admin']).withMessage('Valid role required')
];

router.get('/stats', protect, authorize('admin'), getUserStats);
router.get('/', protect, authorize('admin', 'manager', 'employee'), getUsers);
router.get('/:id', protect, authorize('admin'), getUser);
router.post('/', protect, authorize('admin'), createUserValidation, createUser);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;

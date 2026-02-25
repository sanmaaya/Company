const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { register, login, getMe, updateProfile, forgotPasswordPhone, resetPasswordPhone } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const registerValidation = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('phoneNumber').notEmpty().withMessage('Phone number is required')
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.post('/forgot-password-phone', [
  body('phoneNumber').notEmpty().withMessage('Phone number is required')
], forgotPasswordPhone);
router.post('/reset-password-phone', [
  body('phoneNumber').notEmpty().withMessage('Phone number is required'),
  body('otp').notEmpty().withMessage('OTP is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], resetPasswordPhone);

router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

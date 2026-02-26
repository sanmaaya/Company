const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, phoneNumber, role, department } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ success: false, message: 'Phone number already registered.' });
    }

    // Only allow admin to create admin/manager accounts
    const safeRole = role === 'admin' || role === 'manager' ? 'employee' : (role || 'employee');

    const user = await User.create({
      name,
      email,
      password,
      phoneNumber,
      role: safeRole,
      department: department || 'General'
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Mail is wrong' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Contact admin.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Password is wrong' });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update own profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, title, department, profilePic, phoneNumber } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, title, department, profilePic, phoneNumber },
      { new: true, runValidators: true }
    );
    res.json({ success: true, message: 'Profile updated.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request OTP for password reset
// @route   POST /api/auth/forgot-password-phone
// @access  Public
const forgotPasswordPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No user found with this number.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetOTP = otp;
    user.resetOTPExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    // In a real app, send OTP via SMS. For now, return it in the response for demo.
    res.json({
      success: true,
      message: 'OTP sent to your registered phone number.',
      demoOTP: otp // EXPOSED FOR DEMO PURPOSES
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password-phone
// @access  Public
const resetPasswordPhone = async (req, res) => {
  try {
    const { phoneNumber, otp, password } = req.body;
    const user = await User.findOne({
      phoneNumber,
      resetOTP: otp,
      resetOTPExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }

    user.password = password;
    user.resetOTP = null;
    user.resetOTPExpire = null;
    await user.save();

    res.json({ success: true, message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { register, login, getMe, updateProfile, forgotPasswordPhone, resetPasswordPhone };

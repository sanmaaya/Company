const { validationResult } = require('express-validator');
const User = require('../models/User');
const Leave = require('../models/Leave');

// @desc    Get all users
// @route   GET /api/users
// @access  Private (Admin, Manager) — or all users when ?all=true for chat
const getUsers = async (req, res) => {
  try {
    const { role, department, search, all } = req.query;
    let query = {};

    // ?all=true → return all users (needed for chat contact list)
    if (all !== 'true') {
      if (req.user.role === 'manager') {
        query.managerId = req.user._id;
      } else if (req.user.role === 'employee') {
        // Employees only allowed with all=true (for chat)
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }
    }

    if (role) query.role = role;
    if (department) query.department = department;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .populate('managerId', 'name email')
      .sort({ name: 1 });

    res.json({ success: true, users, total: users.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private (Admin)
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('managerId', 'name email');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create user (Admin only)
// @route   POST /api/users
// @access  Private (Admin)
const createUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role, department, managerId } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered.' });
    }

    const user = await User.create({ name, email, password, role, department, managerId });

    res.status(201).json({ success: true, message: 'User created successfully.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user role / details (Admin)
// @route   PUT /api/users/:id
// @access  Private (Admin)
const updateUser = async (req, res) => {
  try {
    const { name, role, department, managerId, isActive, leaveBalance } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, role, department, managerId, isActive, leaveBalance },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({ success: true, message: 'User updated successfully.', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private (Admin)
const deleteUser = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    await Leave.deleteMany({ employee: req.params.id });

    res.json({ success: true, message: 'User deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get user stats for admin dashboard
// @route   GET /api/users/stats
// @access  Private (Admin)
const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const byRole = await User.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);
    const activeUsers = await User.countDocuments({ isActive: true });

    res.json({
      success: true,
      stats: { totalUsers, activeUsers, byRole }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getUsers, getUser, createUser, updateUser, deleteUser, getUserStats };

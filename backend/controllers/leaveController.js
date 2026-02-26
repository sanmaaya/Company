const { validationResult } = require('express-validator');
const Leave = require('../models/Leave');
const User = require('../models/User');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private (Employee, Manager)
const applyLeave = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    if (req.user.role === 'admin') {
      return res.status(403).json({ success: false, message: 'Admins cannot apply for leave.' });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      return res.status(400).json({ success: false, message: 'End date must be after start date.' });
    }

    // Check if the user already has a pending leave request
    const existingPendingLeave = await Leave.findOne({ employee: req.user._id, status: 'pending' });
    if (existingPendingLeave) {
      return res.status(400).json({
        success: false,
        message: 'You already have a pending leave request. Please wait for it to be reviewed before applying for another leave.'
      });
    }

    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // Check leave balance
    const user = await User.findById(req.user._id);
    if (leaveType !== 'unpaid' && user.leaveBalance[leaveType] < totalDays) {
      return res.status(400).json({
        success: false,
        message: `Insufficient ${leaveType} leave balance. Available: ${user.leaveBalance[leaveType]} days.`
      });
    }

    // Check for overlapping leaves
    const overlap = await Leave.findOne({
      employee: req.user._id,
      status: { $ne: 'rejected' },
      $or: [
        { startDate: { $lte: end }, endDate: { $gte: start } }
      ]
    });
    if (overlap) {
      return res.status(400).json({ success: false, message: 'You already have a leave request for overlapping dates.' });
    }

    const leave = await Leave.create({
      employee: req.user._id,
      leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason
    });

    await leave.populate('employee', 'name email department profilePic');

    res.status(201).json({ success: true, message: 'Leave applied successfully.', leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get leaves (role-based)
// @route   GET /api/leaves
// @access  Private
const getLeaves = async (req, res) => {
  try {
    const { status, leaveType, page = 1, limit = 10, startDate, endDate, date, all } = req.query;
    let query = {};

    // Role-based filtering
    if (all === 'true') {
      // If requesting 'all', we only allow viewing 'approved' leaves for non-admins
      if (req.user.role !== 'admin') {
        query.status = 'approved';
      }
    } else {
      if (req.user.role === 'employee') {
        query.employee = req.user._id;
      } else if (req.user.role === 'manager') {
        const teamMembers = await User.find({ managerId: req.user._id }).select('_id');
        const teamIds = teamMembers.map(m => m._id);
        teamIds.push(req.user._id);
        query.employee = { $in: teamIds };
      }
    }

    if (status) query.status = status;
    if (leaveType) query.leaveType = leaveType;

    // Date filtering
    if (date) {
      const d = new Date(date);
      query.startDate = { $lte: d };
      query.endDate = { $gte: d };
    } else if (startDate && endDate) {
      query.$or = [
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(endDate) } }
      ];
    }

    const total = await Leave.countDocuments(query);
    const leaves = await Leave.find(query)
      .populate('employee', 'name email department role profilePic title managerId')
      .populate('reviewedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({
      success: true,
      leaves,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single leave
// @route   GET /api/leaves/:id
// @access  Private
const getLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id)
      .populate('employee', 'name email department profilePic')
      .populate('reviewedBy', 'name email');

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found.' });
    }

    if (req.user.role === 'employee' && leave.employee._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.json({ success: true, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Review leave (Approve/Reject)
// @route   PUT /api/leaves/:id/review
// @access  Private (Manager, Admin)
const reviewLeave = async (req, res) => {
  try {
    const { status, reviewComment } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected.' });
    }

    const leave = await Leave.findById(req.params.id).populate('employee', 'name email department profilePic role managerId');
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found.' });
    }

    // Role-based Approval Checks
    if (req.user.role === 'manager') {
      // 1. Manager can only approve if they are the direct manager
      if (leave.employee.managerId?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'You can only approve leaves of your direct team members.' });
      }
      // 2. Already handled by existing logic (status check), but for clarity:
      // Manager can't approve if the leave's employee is also an admin or something unusual, 
      // but strictly speaking they are restricted by managerId here.
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This leave has already been reviewed.' });
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    leave.reviewedAt = new Date();
    leave.reviewComment = reviewComment || '';
    await leave.save();

    if (status === 'approved' && leave.leaveType !== 'unpaid') {
      await User.findByIdAndUpdate(leave.employee._id, {
        $inc: { [`leaveBalance.${leave.leaveType}`]: -leave.totalDays }
      });
    }

    await leave.populate('employee', 'name email department profilePic');
    await leave.populate('reviewedBy', 'name email');

    res.json({ success: true, message: `Leave ${status} successfully.`, leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel leave (own pending leave)
// @route   DELETE /api/leaves/:id
// @access  Private
const cancelLeave = async (req, res) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave not found.' });
    }

    if (leave.employee.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (leave.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Only pending leaves can be cancelled.' });
    }

    await leave.deleteOne();
    res.json({ success: true, message: 'Leave cancelled successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get leave statistics
// @route   GET /api/leaves/stats
// @access  Private
const getLeaveStats = async (req, res) => {
  try {
    let matchQuery = {};

    if (req.user.role === 'employee') {
      matchQuery.employee = req.user._id;
    } else if (req.user.role === 'manager') {
      const teamMembers = await User.find({ managerId: req.user._id }).select('_id');
      const teamIds = teamMembers.map(m => m._id);
      teamIds.push(req.user._id);
      matchQuery.employee = { $in: teamIds };
    }

    const stats = await Leave.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalDays: { $sum: '$totalDays' }
        }
      }
    ]);

    const formatted = { pending: 0, approved: 0, rejected: 0, totalDays: 0, totalUsers: 0 };
    stats.forEach(s => {
      formatted[s._id] = s.count;
      if (s._id === 'approved') formatted.totalDays = s.totalDays;
    });

    if (req.user.role === 'admin' || req.user.role === 'manager') {
      formatted.totalUsers = await User.countDocuments(req.user.role === 'manager' ? { managerId: req.user._id } : {});
    }

    res.json({ success: true, stats: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyLeave, getLeaves, getLeave, reviewLeave, cancelLeave, getLeaveStats };

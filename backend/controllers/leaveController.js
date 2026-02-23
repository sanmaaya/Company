const Leave = require('../models/Leave');

// @desc    Apply for leave
// @route   POST /api/leaves
// @access  Private (Employee)
exports.applyLeave = async (req, res) => {
    try {
        const { leaveType, startDate, endDate, reason } = req.body;

        const leave = await Leave.create({
            user: req.user._id,
            leaveType,
            startDate,
            endDate,
            reason,
        });

        res.status(201).json(leave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all leave requests (for Manager/Admin)
// @route   GET /api/leaves
// @access  Private (Manager/Admin)
exports.getAllLeaves = async (req, res) => {
    try {
        let query = {};

        // If manager, maybe restrict to their department (simplified here for all)
        // For now, managers and admins see all

        const leaves = await Leave.find(query)
            .populate('user', 'name email department')
            .sort('-appliedDate');

        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get user's leaves
// @route   GET /api/leaves/my-leaves
// @access  Private (Employee)
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ user: req.user._id }).sort('-appliedDate');
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update leave status (Approve/Reject)
// @route   PUT /api/leaves/:id
// @access  Private (Manager/Admin)
exports.updateLeaveStatus = async (req, res) => {
    try {
        const { status, reviewMessage } = req.body;

        const leave = await Leave.findById(req.params.id);

        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        leave.status = status;
        leave.reviewMessage = reviewMessage;
        leave.reviewedBy = req.user._id;

        const updatedLeave = await leave.save();
        res.json(updatedLeave);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

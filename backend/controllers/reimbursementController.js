const Reimbursement = require('../models/Reimbursement');
const User = require('../models/User');

// @desc    Get all reimbursements for logged in user
// @route   GET /api/reimbursements/me
// @access  Private
exports.getMyReimbursements = async (req, res) => {
    try {
        const reimbursements = await Reimbursement.find({ employee: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reimbursements.length, data: reimbursements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Apply for a reimbursement
// @route   POST /api/reimbursements
// @access  Private
exports.applyReimbursement = async (req, res) => {
    try {
        const { type, amount, date, description, receiptUrl } = req.body;
        const reimbursement = await Reimbursement.create({
            employee: req.user.id,
            type,
            amount,
            date,
            description,
            receiptUrl
        });
        res.status(201).json({ success: true, data: reimbursement });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message || 'Invalid data' });
    }
};

// @desc    Get reimbursements (Admin/Manager)
// @route   GET /api/reimbursements
// @access  Private/Admin/Manager
exports.getAllReimbursements = async (req, res) => {
    try {
        // If manager, maybe get team reimbursements. Leaving open for now, returning all
        let query = {};
        if (req.user.role === 'manager') {
            const teamQuery = req.user.department ? { department: req.user.department } : {};
            const teamUsers = await User.find(teamQuery).select('_id');
            const teamIds = teamUsers.map(u => u._id);
            query = { employee: { $in: teamIds } };
        } else if (req.user.role === 'employee') {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const reimbursements = await Reimbursement.find(query).populate('employee', 'name email department').sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: reimbursements.length, data: reimbursements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Review a reimbursement
// @route   PUT /api/reimbursements/:id/review
// @access  Private/Admin/Manager
exports.reviewReimbursement = async (req, res) => {
    try {
        const { status, reviewComment } = req.body;
        let reimbursement = await Reimbursement.findById(req.params.id);

        if (!reimbursement) {
            return res.status(404).json({ success: false, message: 'Reimbursement not found' });
        }

        reimbursement.status = status;
        reimbursement.reviewComment = reviewComment;
        reimbursement.reviewedBy = req.user.id;
        reimbursement.reviewedAt = Date.now();

        await reimbursement.save();

        res.status(200).json({ success: true, data: reimbursement });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Cancel a reimbursement (Only if pending)
// @route   DELETE /api/reimbursements/:id
// @access  Private
exports.cancelReimbursement = async (req, res) => {
    try {
        const reimbursement = await Reimbursement.findById(req.params.id);
        if (!reimbursement) {
            return res.status(404).json({ success: false, message: 'Reimbursement not found' });
        }
        if (reimbursement.employee.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }
        if (reimbursement.status !== 'pending') {
            return res.status(400).json({ success: false, message: 'Cannot cancel reviewed reimbursement' });
        }
        await reimbursement.remove();
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

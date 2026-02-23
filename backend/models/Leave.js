const mongoose = require('mongoose');

const leaveSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    leaveType: {
        type: String,
        enum: ['sick', 'casual', 'annual', 'maternity', 'paternity'],
        required: [true, 'Please select leave type'],
    },
    startDate: {
        type: Date,
        required: [true, 'Please add a start date'],
    },
    endDate: {
        type: Date,
        required: [true, 'Please add an end date'],
    },
    reason: {
        type: String,
        required: [true, 'Please add a reason'],
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    appliedDate: {
        type: Date,
        default: Date.now,
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    reviewMessage: {
        type: String,
    }
});

module.exports = mongoose.model('Leave', leaveSchema);

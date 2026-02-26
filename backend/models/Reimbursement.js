const mongoose = require('mongoose');

const reimbursementSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Employee is required']
    },
    type: {
        type: String,
        enum: ['Travel', 'Meals', 'Supplies', 'Others'],
        required: [true, 'Reimbursement type is required']
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [1, 'Amount must be at least 1']
    },
    date: {
        type: Date,
        required: [true, 'Expense date is required']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        minlength: [5, 'Description must be at least 5 characters'],
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    receiptUrl: {
        type: String,
        trim: true,
        default: ''
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    reviewedAt: {
        type: Date,
        default: null
    },
    reviewComment: {
        type: String,
        trim: true,
        default: ''
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reimbursement', reimbursementSchema);

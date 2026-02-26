const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { applyReimbursement, getMyReimbursements, getAllReimbursements, reviewReimbursement, cancelReimbursement } = require('../controllers/reimbursementController');
const { protect, authorize } = require('../middleware/auth');

const reimbursementValidation = [
    body('type').isIn(['Travel', 'Meals', 'Supplies', 'Others']).withMessage('Invalid reimbursement type'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('date').isISO8601().withMessage('Valid date required'),
    body('description').trim().isLength({ min: 5 }).withMessage('Description must be at least 5 characters')
];

router.get('/me', protect, getMyReimbursements);
router.get('/', protect, authorize('manager', 'admin'), getAllReimbursements);
router.post('/', protect, reimbursementValidation, applyReimbursement);
router.put('/:id/review', protect, authorize('manager', 'admin'), reviewReimbursement);
router.delete('/:id', protect, cancelReimbursement);

module.exports = router;

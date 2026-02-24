const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const { applyLeave, getLeaves, getLeave, reviewLeave, cancelLeave, getLeaveStats } = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

const leaveValidation = [
  body('leaveType').isIn(['casual', 'sick', 'earned', 'unpaid']).withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('reason').trim().isLength({ min: 5 }).withMessage('Reason must be at least 5 characters')
];

router.get('/stats', protect, getLeaveStats);
router.get('/', protect, getLeaves);
router.get('/:id', protect, getLeave);
router.post('/', protect, leaveValidation, applyLeave);
router.put('/:id/review', protect, authorize('manager', 'admin'), reviewLeave);
router.delete('/:id', protect, cancelLeave);

module.exports = router;

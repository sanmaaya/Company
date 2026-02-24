const express = require('express');
const { body } = require('express-validator');
const {
  applyLeave, getMyLeaves, getAllLeaves, reviewLeave, cancelLeave, getLeaveStats,
} = require('../controllers/leaveController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

const applyValidation = [
  body('leaveType').isIn(['sick', 'casual', 'earned', 'unpaid']).withMessage('Invalid leave type'),
  body('startDate').isISO8601().withMessage('Valid start date required'),
  body('endDate').isISO8601().withMessage('Valid end date required'),
  body('reason').trim().isLength({ min: 10, max: 500 }).withMessage('Reason must be 10-500 characters'),
];

// All routes require authentication
router.use(protect);

router.get('/stats', authorize('manager', 'admin'), getLeaveStats);
router.get('/my', getMyLeaves);
router.post('/', applyValidation, applyLeave);
router.get('/', authorize('manager', 'admin'), getAllLeaves);
router.put('/:id/review', authorize('manager', 'admin'), reviewLeave);
router.delete('/:id', cancelLeave);

module.exports = router;

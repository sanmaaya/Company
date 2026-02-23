const express = require('express');
const router = express.Router();
const {
    applyLeave,
    getAllLeaves,
    getMyLeaves,
    updateLeaveStatus,
} = require('../controllers/leaveController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, authorize('employee'), applyLeave);
router.get('/', protect, authorize('manager', 'admin'), getAllLeaves);
router.get('/my-leaves', protect, authorize('employee'), getMyLeaves);
router.put('/:id', protect, authorize('manager', 'admin'), updateLeaveStatus);

module.exports = router;

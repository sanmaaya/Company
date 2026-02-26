const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getGroups, createGroup, getUnreadCounts } = require('../controllers/chatController');

router.use(protect);

router.get('/groups', getGroups);
router.post('/groups', createGroup);
router.get('/unread-counts', getUnreadCounts);

module.exports = router;

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getGroups, createGroup } = require('../controllers/chatController');

router.use(protect);

router.get('/groups', getGroups);
router.post('/groups', createGroup);

module.exports = router;

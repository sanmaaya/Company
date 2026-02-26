const Group = require('../models/Group');

// @desc    Get all groups for a user
// @route   GET /api/chat/groups
// @access  Private
const getGroups = async (req, res) => {
    try {
        const groups = await Group.find({
            $or: [
                { members: req.user._id },
                { isPrivate: false }
            ]
        }).populate('members', 'name email profilePic');

        res.json({ success: true, groups });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a new group
// @route   POST /api/chat/groups
// @access  Private
const createGroup = async (req, res) => {
    try {
        const { name, description, members, isPrivate } = req.body;

        // Always include creator in members
        const groupMembers = [...new Set([...(members || []), req.user._id.toString()])];

        const group = await Group.create({
            name,
            description,
            members: groupMembers,
            createdBy: req.user._id,
            isPrivate: !!isPrivate
        });

        res.status(201).json({ success: true, group });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const Message = require('../models/Message');

const getUnreadCounts = async (req, res) => {
    try {
        const userId = req.user._id;

        // Find all messages that are not sent by this user and where readBy doesn't include user
        const unreadMessages = await Message.find({
            senderId: { $ne: userId },
            readBy: { $ne: userId }
        });

        const counts = {};
        unreadMessages.forEach(msg => {
            counts[msg.roomId] = (counts[msg.roomId] || 0) + 1;
        });

        res.json({ success: true, counts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getGroups,
    createGroup,
    getUnreadCounts
};

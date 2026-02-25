const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
    try {
        let query = {};
        if (req.user.role === 'employee') {
            query.members = req.user._id;
        }

        const projects = await Project.find(query)
            .populate('members', 'name email title profilePic')
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, projects });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create project (Admin, Manager)
// @route   POST /api/projects
// @access  Private (Admin, Manager)
const createProject = async (req, res) => {
    try {
        const { name, description, client, deadline, members } = req.body;

        const project = await Project.create({
            name,
            description,
            client,
            deadline,
            members: members || [req.user._id],
            createdBy: req.user._id
        });

        res.status(201).json({ success: true, project });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get tasks for a project
// @route   GET /api/projects/:id/tasks
// @access  Private
const getProjectTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ project: req.params.id })
            .populate('assignedTo', 'name email title profilePic')
            .sort({ deadline: 1 });
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create task (Admin, Manager)
// @route   POST /api/projects/:id/tasks
// @access  Private (Admin, Manager)
const createTask = async (req, res) => {
    try {
        const { title, description, assignedTo, deadline, priority } = req.body;

        const task = await Task.create({
            project: req.params.id,
            title,
            description,
            assignedTo,
            deadline,
            priority
        });

        res.status(201).json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update task status (Anyone assigned)
// @route   PUT /api/projects/tasks/:taskId
// @access  Private
const updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findById(req.params.taskId);

        if (!task) {
            return res.status(404).json({ success: false, message: 'Task not found' });
        }

        // Check if user is assigned or is admin/manager
        if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role === 'employee') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        task.status = status;
        if (status === 'completed') {
            task.completedAt = Date.now();
        } else {
            task.completedAt = null;
        }

        await task.save();
        res.json({ success: true, task });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get my tasks (Employee)
// @route   GET /api/projects/my-tasks
// @access  Private
const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id })
            .populate('project', 'name deadline')
            .sort({ deadline: 1 });
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all active tasks (In Progress)
// @route   GET /api/projects/tasks/active
// @access  Private
const getActiveTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ status: 'in-progress' })
            .populate('assignedTo', 'name email profilePic')
            .populate('project', 'name');
        res.json({ success: true, tasks });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getProjects,
    createProject,
    getProjectTasks,
    createTask,
    updateTaskStatus,
    getMyTasks,
    getActiveTasks
};

const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getProjects,
    createProject,
    getProjectTasks,
    createTask,
    updateTaskStatus,
    getMyTasks,
    getActiveTasks
} = require('../controllers/projectController');

router.use(protect);

router.get('/my-tasks', getMyTasks);
router.get('/tasks/active', getActiveTasks);
router.put('/tasks/:taskId', updateTaskStatus);

router.route('/')
    .get(getProjects)
    .post(authorize('admin', 'manager'), createProject);

router.route('/:id/tasks')
    .get(getProjectTasks)
    .post(authorize('admin', 'manager'), createTask);

module.exports = router;

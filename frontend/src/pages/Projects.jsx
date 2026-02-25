import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import { Plus, Calendar, Clock, CheckCircle2, Circle, User as UserIcon, PlusCircle, Layout, ListTodo, MoreVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import Avatar from '../components/common/Avatar';

const Projects = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    // Form states
    const [projectForm, setProjectForm] = useState({ name: '', description: '', client: '', deadline: '', members: [] });
    const [taskForm, setTaskForm] = useState({ title: '', description: '', assignedTo: '', deadline: '', priority: 'medium' });

    useEffect(() => {
        fetchProjects();
        if (user.role !== 'employee') fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/users');
            setAllUsers(data.users || []);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const { data } = await api.get('/projects');
            setProjects(data.projects);
            if (data.projects.length > 0 && !selectedProject) {
                setSelectedProject(data.projects[0]);
                fetchTasks(data.projects[0]._id);
            }
        } catch (err) {
            toast.error('Failed to load projects');
        } finally {
            setLoading(false);
        }
    };

    const fetchTasks = async (projectId) => {
        try {
            const { data } = await api.get(`/projects/${projectId}/tasks`);
            setTasks(data.tasks);
        } catch (err) {
            toast.error('Failed to load tasks');
        }
    };

    const handleSelectProject = (project) => {
        setSelectedProject(project);
        fetchTasks(project._id);
    };

    const handleCreateProject = async (e) => {
        e.preventDefault();
        try {
            await api.post('/projects', projectForm);
            toast.success('Project created!');
            setShowProjectModal(false);
            fetchProjects();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating project');
        }
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        try {
            await api.post(`/projects/${selectedProject._id}/tasks`, taskForm);
            toast.success('Task assigned!');
            setShowTaskModal(false);
            fetchTasks(selectedProject._id);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Error creating task');
        }
    };

    const toggleTaskStatus = async (taskId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'completed' ? 'todo' : 'completed';
            await api.put(`/projects/tasks/${taskId}`, { status: newStatus });
            fetchTasks(selectedProject._id);
            toast.success(`Task marked as ${newStatus}`);
        } catch (err) {
            toast.error('Failed to update task');
        }
    };

    return (
        <DashboardLayout title="Project Command Center">
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-180px)]">

                {/* ── Project List Sidebar ────────────────────── */}
                <div className="w-full lg:w-80 flex flex-col gap-4 overflow-hidden">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Your Projects</h2>
                        {(user.role === 'admin' || user.role === 'manager') && (
                            <button
                                onClick={() => setShowProjectModal(true)}
                                className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition shadow-lg shadow-emerald-500/20"
                            >
                                <Plus size={16} />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {loading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />)
                        ) : (
                            projects.map(p => (
                                <button
                                    key={p._id}
                                    onClick={() => handleSelectProject(p)}
                                    className={`w-full text-left p-4 rounded-2xl border transition-all group relative overflow-hidden ${selectedProject?._id === p._id
                                            ? 'bg-emerald-600 border-emerald-500 text-white shadow-xl shadow-emerald-600/20'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-emerald-500'
                                        }`}
                                >
                                    <div className="relative z-10">
                                        <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${selectedProject?._id === p._id ? 'text-emerald-100' : 'text-slate-400'}`}>
                                            {p.client}
                                        </p>
                                        <h3 className="font-black text-sm mb-2">{p.name}</h3>
                                        <div className="flex items-center gap-2 text-[10px] font-bold opacity-80">
                                            <Calendar size={12} />
                                            {format(new Date(p.deadline), 'MMM dd, yyyy')}
                                        </div>
                                    </div>
                                    {selectedProject?._id === p._id && (
                                        <div className="absolute top-0 right-0 w-16 h-16 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl" />
                                    )}
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* ── Task Board ────────────────────────────── */}
                <div className="flex-1 bg-white dark:bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 dark:border-slate-800/60 p-6 flex flex-col gap-6 shadow-sm overflow-hidden">
                    {selectedProject ? (
                        <>
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                                <div>
                                    <h1 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">{selectedProject.name}</h1>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">{selectedProject.description}</p>
                                </div>
                                {(user.role === 'admin' || user.role === 'manager') && (
                                    <button
                                        onClick={() => setShowTaskModal(true)}
                                        className="btn-primary !py-2.5 !px-5 rounded-xl flex items-center gap-2 text-xs font-black"
                                    >
                                        <PlusCircle size={16} /> Assign New Task
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
                                {tasks.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-50">
                                        <ListTodo size={48} className="mb-4" />
                                        <p className="font-bold">No tasks assigned yet</p>
                                    </div>
                                ) : (
                                    tasks.map(task => (
                                        <motion.div
                                            layout
                                            key={task._id}
                                            className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${task.status === 'completed'
                                                    ? 'bg-slate-50 dark:bg-slate-800/30 border-emerald-100/50 opacity-70'
                                                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 hover:shadow-lg'
                                                }`}
                                        >
                                            <button
                                                onClick={() => toggleTaskStatus(task._id, task.status)}
                                                className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${task.status === 'completed'
                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                        : 'border-2 border-slate-200 dark:border-slate-600 hover:border-emerald-500'
                                                    }`}
                                            >
                                                {task.status === 'completed' && <CheckCircle2 size={16} />}
                                            </button>

                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-sm font-black truncate ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'}`}>
                                                    {task.title}
                                                </h4>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 truncate font-medium mt-0.5">{task.description}</p>
                                            </div>

                                            <div className="flex items-center gap-4 flex-shrink-0">
                                                <div className="text-right hidden sm:block">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Assigned To</p>
                                                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400">{task.assignedTo?.name}</p>
                                                </div>
                                                <Avatar src={task.assignedTo?.profilePic} name={task.assignedTo?.name} size="sm" />

                                                <div className="w-px h-8 bg-slate-100 dark:bg-slate-700" />

                                                <div className="text-right">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Deadline</p>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-500">
                                                        <Clock size={12} />
                                                        {format(new Date(task.deadline), 'MMM dd')}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-300">
                            <Layout size={64} className="mb-4 opacity-20" />
                            <p className="font-black uppercase tracking-widest text-sm opacity-50">Select a project to view tasks</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Project Creation Modal ──────────────────── */}
            <AnimatePresence>
                {showProjectModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowProjectModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border border-white/10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">Launch New Project</h2>
                            <form onSubmit={handleCreateProject} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="form-label ml-1">Project Name</label>
                                    <input required value={projectForm.name} onChange={e => setProjectForm({ ...projectForm, name: e.target.value })} className="input" placeholder="e.g. Q3 Marketing Revamp" />
                                </div>
                                <div className="space-y-1">
                                    <label className="form-label ml-1">Client / Department</label>
                                    <input required value={projectForm.client} onChange={e => setProjectForm({ ...projectForm, client: e.target.value })} className="input" placeholder="e.g. Sales Department" />
                                </div>
                                <div className="space-y-1">
                                    <label className="form-label ml-1">Description</label>
                                    <textarea required value={projectForm.description} onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} className="input min-h-[100px]" placeholder="Briefly describe the objective..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="form-label ml-1">Final Deadline</label>
                                        <input type="date" required value={projectForm.deadline} onChange={e => setProjectForm({ ...projectForm, deadline: e.target.value })} className="input" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="form-label ml-1">Team Members</label>
                                        <select multiple className="input min-h-[44px]" onChange={e => {
                                            const values = Array.from(e.target.selectedOptions, option => option.value);
                                            setProjectForm({ ...projectForm, members: values });
                                        }}>
                                            {allUsers.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl hover:bg-slate-200 transition">Cancel</button>
                                    <button type="submit" className="flex-1 btn-primary rounded-2xl font-black">Create Project</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {/* ── Task Creation Modal ─────────────────────── */}
                {showTaskModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowTaskModal(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white dark:bg-[#0f172a] rounded-[2.5rem] p-8 w-full max-w-lg shadow-2xl border border-white/10 overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                            <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-6 tracking-tight">Assign Mission</h2>
                            <form onSubmit={handleCreateTask} className="space-y-4">
                                <div className="space-y-1">
                                    <label className="form-label ml-1">Task Title</label>
                                    <input required value={taskForm.title} onChange={e => setTaskForm({ ...taskForm, title: e.target.value })} className="input" placeholder="e.g. Design Login UI" />
                                </div>
                                <div className="space-y-1">
                                    <label className="form-label ml-1">Assign To</label>
                                    <select required value={taskForm.assignedTo} onChange={e => setTaskForm({ ...taskForm, assignedTo: e.target.value })} className="input">
                                        <option value="">Select an employee</option>
                                        {allUsers.map(u => <option key={u._id} value={u._id}>{u.name} ({u.title})</option>)}
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="form-label ml-1">Description</label>
                                    <textarea required value={taskForm.description} onChange={e => setTaskForm({ ...taskForm, description: e.target.value })} className="input min-h-[100px]" placeholder="Specific instructions for this task..." />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="form-label ml-1">Task Deadline</label>
                                        <input type="date" required value={taskForm.deadline} onChange={e => setTaskForm({ ...taskForm, deadline: e.target.value })} className="input" />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="form-label ml-1">Priority</label>
                                        <select value={taskForm.priority} onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })} className="input">
                                            <option value="low">Low Priority</option>
                                            <option value="medium">Medium Priority</option>
                                            <option value="high">High Priority</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowTaskModal(false)} className="flex-1 px-6 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-black rounded-2xl hover:bg-slate-200 transition">Cancel</button>
                                    <button type="submit" className="flex-1 btn-primary rounded-2xl font-black">Assign Task</button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
};

export default Projects;

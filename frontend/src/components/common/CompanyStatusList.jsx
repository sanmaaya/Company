import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Avatar from './Avatar';
import { io } from 'socket.io-client';

const CompanyStatusList = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [activeTasks, setActiveTasks] = useState([]);
    const [activeLeaves, setActiveLeaves] = useState([]);

    useEffect(() => {
        fetchData();

        // Socket connection for real-time online status
        const socket = io('/', { transports: ['websocket'] });

        if (user) {
            socket.emit('user:online', {
                userId: user._id,
                name: user.name,
                role: user.role,
                profilePic: user.profilePic
            });
        }

        socket.on('users:online', (data) => {
            setOnlineUsers(data);
        });

        return () => {
            socket.disconnect();
        };
    }, [user]);

    const fetchData = async () => {
        try {
            const today = new Date().toISOString();
            // Added all: true to bypass employee role restrictions
            const [uRes, tRes, lRes] = await Promise.all([
                api.get('/users', { params: { all: 'true' } }),
                api.get('/projects/tasks/active'),
                api.get('/leaves', { params: { status: 'approved', date: today, all: 'true' } })
            ]);
            setUsers(uRes.data.users || []);
            setActiveTasks(tRes.data.tasks || []);
            setActiveLeaves(lRes.data.leaves || []);
        } catch (err) {
            console.error('Status fetch error:', err);
        }
    };

    const getUserStatus = (userId) => {
        const isOnline = onlineUsers.some(u => u.userId === userId);
        const isOnLeave = activeLeaves.some(l => l.employee?._id === userId || l.employee === userId);
        const isWorking = activeTasks.some(t => t.assignedTo?._id === userId || t.assignedTo === userId);

        if (isOnLeave) return { label: 'On Leave', color: 'bg-rose-500', text: 'text-rose-500' };
        if (isWorking) return { label: 'Working', color: 'bg-blue-500', text: 'text-blue-500' };
        if (isOnline) return { label: 'Online', color: 'bg-blue-500', text: 'text-blue-500' };
        return { label: 'Offline', color: 'bg-slate-300', text: 'text-slate-400' };
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 transition-colors duration-300">
            <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight mb-8 flex items-center justify-between">
                Live Status
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                    <span className="text-[10px] text-blue-600 font-black uppercase tracking-[0.2em] italic">Active Now</span>
                </div>
            </h3>

            <div className="space-y-6">
                {users.length === 0 ? (
                    <p className="text-center text-xs text-slate-400 font-bold uppercase tracking-widest py-10 opacity-50">Synchronizing team...</p>
                ) : (
                    users.map(u => {
                        const status = getUserStatus(u._id);
                        return (
                            <div key={u._id} className="flex items-center gap-4 group">
                                <div className="relative">
                                    <Avatar src={u.profilePic} name={u.name} size="md" className="border-2 border-white dark:border-slate-800 shadow-sm transition-transform group-hover:scale-110" />
                                    <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 ${status.color} border-2 border-white dark:border-slate-900 rounded-full shadow-sm`}></div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-black text-slate-800 dark:text-slate-200 text-sm truncate leading-tight group-hover:text-blue-600 transition-colors">
                                        {u.name}
                                    </p>
                                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-0.5 truncate">
                                        {u.title}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <div className={`${status.text} text-[9px] font-black uppercase tracking-[0.15em] bg-current/10 px-2.5 py-1 rounded-lg`}>
                                        {status.label}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default CompanyStatusList;

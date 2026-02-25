import React, { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import api from '../../utils/api';
import Avatar from './Avatar';

const LeaveCalendar = () => {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [leaves, setLeaves] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApprovedLeaves();
    }, [currentMonth]);

    const fetchApprovedLeaves = async () => {
        try {
            setLoading(true);
            // Fetch leaves for the current month interval
            const start = startOfMonth(currentMonth);
            const end = endOfMonth(currentMonth);
            const { data } = await api.get('/leaves', {
                params: {
                    status: 'approved',
                    startDate: start.toISOString(),
                    endDate: end.toISOString()
                }
            });
            setLeaves(data.leaves || []);
        } catch (err) {
            console.error('Failed to fetch calendar leaves', err);
        } finally {
            setLoading(false);
        }
    };

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
    });

    const getLeavesForDay = (day) => {
        return leaves.filter(l => {
            const start = new Date(l.startDate);
            const end = new Date(l.endDate);
            return day >= start && day <= end;
        });
    };

    return (
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-6">
            <div className="flex items-center justify-between mb-8 px-2">
                <h3 className="text-xl font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-3">
                    Leave Calendar
                    <span className="text-[10px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full uppercase tracking-widest leading-none">Global</span>
                </h3>
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 rounded-xl p-1">
                    <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition text-slate-400"><ChevronLeft size={16} /></button>
                    <span className="text-[11px] font-black uppercase tracking-widest text-slate-800 dark:text-slate-200 px-3">{format(currentMonth, 'MMMM yyyy')}</span>
                    <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-lg transition text-slate-400"><ChevronRight size={16} /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                    <div key={d} className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center py-2">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day, idx) => {
                    const dayLeaves = getLeavesForDay(day);
                    return (
                        <div
                            key={idx}
                            className={`min-h-[72px] p-2 rounded-2xl border transition-all ${isToday(day)
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500 shadow-lg shadow-emerald-500/10'
                                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800'
                                }`}
                        >
                            <p className={`text-[10px] font-black mb-1.5 ${isToday(day) ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-400'}`}>
                                {format(day, 'd')}
                            </p>
                            <div className="flex flex-wrap gap-1">
                                {dayLeaves.map((l, lid) => (
                                    <div
                                        key={lid}
                                        title={`${l.employee.name}: ${l.leaveType}`}
                                        className="group relative"
                                    >
                                        <Avatar
                                            src={l.employee.profilePic}
                                            name={l.employee.name}
                                            size="xs"
                                            className={`ring-2 ring-white dark:ring-slate-800 ${l.leaveType === 'sick' ? 'opacity-90' : ''
                                                }`}
                                        />
                                        {/* Tooltip on hover */}
                                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-50 pointer-events-none">
                                            {l.employee.name}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LeaveCalendar;

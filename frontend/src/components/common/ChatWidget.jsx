import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Plus, Users, MessageSquare, Send, X, ArrowLeft, ChevronRight, Hash } from 'lucide-react';

let socket = null;

// Generate roomId for DMs, Groups use their own _id
const getRoomId = (id1, id2) => [id1, id2].sort().join('_');

const ChatWidget = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('list'); // 'list' | 'chat' | 'create-group'
    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);
    const [onlineIds, setOnlineIds] = useState([]);
    const [activeTarget, setActiveTarget] = useState(null); // User or Group
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [typing, setTyping] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({}); // { roomId: count }

    // Group Creation State
    const [groupName, setGroupName] = useState('');
    const [selectedMembers, setSelectedMembers] = useState([]);

    const bottomRef = useRef(null);
    const typingTimer = useRef(null);

    // Initial Data Fetch
    useEffect(() => {
        if (!user) return;
        fetchUsers();
        fetchGroups();
    }, [user]);

    const fetchUsers = async () => {
        try {
            const res = await api.get('/users?all=true');
            setUsers((res.data.users || []).filter(u => u._id !== user._id));
        } catch (err) { }
    };

    const fetchGroups = async () => {
        try {
            const res = await api.get('/chat/groups');
            setGroups(res.data.groups || []);
        } catch (err) { }
    };

    // Socket Connection
    useEffect(() => {
        if (!user) return;

        socket = io('/', { transports: ['websocket'] });

        socket.emit('user:online', {
            userId: user._id,
            name: user.name,
            role: user.role,
            profilePic: user.profilePic
        });

        socket.on('users:online', (list) => {
            setOnlineIds(list.map(u => u.userId));
        });

        socket.on('message:new', (msg) => {
            const currentRoomId = activeTarget ? (activeTarget.name ? activeTarget._id : getRoomId(user._id, activeTarget._id)) : null;

            if (msg.roomId === currentRoomId) {
                setMessages(prev => [...prev, msg]);
                setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            } else {
                // Handle unread count if it's not the active chat or widget is closed
                if (msg.senderId !== user._id) {
                    setUnreadCounts(prev => ({
                        ...prev,
                        [msg.roomId]: (prev[msg.roomId] || 0) + 1
                    }));

                    // Show Toast Notification
                    toast((t) => (
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => {
                            toast.dismiss(t.id);
                            setOpen(true);
                            const target = groups.find(g => g._id === msg.roomId) || users.find(u => getRoomId(user._id, u._id) === msg.roomId);
                            if (target) openChat(target);
                        }}>
                            <Avatar src={msg.senderPic} name={msg.senderName} size="sm" />
                            <div className="flex-1 min-w-0">
                                <p className="font-black text-[10px] text-white uppercase tracking-tighter opacity-70">
                                    {groups.find(g => g._id === msg.roomId) ? `Group: ${groups.find(g => g._id === msg.roomId).name}` : 'Private Message'}
                                </p>
                                <p className="font-black text-xs text-white uppercase tracking-tight">{msg.senderName}</p>
                                <p className="text-[11px] text-emerald-100/80 truncate font-medium">{msg.text}</p>
                            </div>
                        </div>
                    ), {
                        duration: 5000,
                        position: 'bottom-right',
                        style: { background: '#020617', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', padding: '12px 16px' }
                    });
                }
            }
        });

        socket.on('messages:history', (history) => {
            setMessages(history);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        socket.on('typing:update', ({ name, typing }) => {
            setTyping(typing ? name : false);
        });

        return () => socket?.disconnect();
    }, [user, activeTarget, open, groups, users]);

    const openChat = (target) => {
        const roomId = target.name && target.members ? target._id : getRoomId(user._id, target._id);
        setActiveTarget(target);
        setView('chat');
        setMessages([]);
        setUnreadCounts(prev => ({ ...prev, [roomId]: 0 }));
        socket?.emit('room:join', { roomId });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() || !activeTarget) return;

        const roomId = activeTarget.name && activeTarget.members ? activeTarget._id : getRoomId(user._id, activeTarget._id);

        socket?.emit('message:send', {
            roomId,
            senderId: user._id,
            senderName: user.name,
            senderPic: user.profilePic,
            text: text.trim()
        });

        socket?.emit('typing:stop', { roomId });
        setText('');
    };

    const handleTyping = (e) => {
        setText(e.target.value);
        if (!activeTarget) return;
        const roomId = activeTarget.name && activeTarget.members ? activeTarget._id : getRoomId(user._id, activeTarget._id);
        socket?.emit('typing:start', { roomId, name: user.name });
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => socket?.emit('typing:stop', { roomId }), 1500);
    };

    const createGroupChat = async () => {
        if (!groupName.trim() || selectedMembers.length === 0) return;
        try {
            const res = await api.post('/chat/groups', {
                name: groupName,
                members: selectedMembers,
                isPrivate: false
            });
            setGroups(prev => [...prev, res.data.group]);
            setView('list');
            setGroupName('');
            setSelectedMembers([]);
            toast.success('Group Created!');
        } catch (err) {
            toast.error('Failed to create group');
        }
    };

    const toggleMember = (id) => {
        setSelectedMembers(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

    return (
        <>
            <button
                onClick={() => { setOpen(!open); if (!open) setUnreadCounts({}); }}
                className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full shadow-2xl flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 group ring-4 ring-emerald-500/20"
            >
                {open ? <X size={28} /> : <MessageSquare size={28} />}
                {totalUnread > 0 && !open && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-rose-500 rounded-full text-[10px] flex items-center justify-center font-black animate-bounce shadow-lg">
                        {totalUnread}
                    </span>
                )}
            </button>

            {open && (
                <div className="fixed bottom-28 right-6 z-50 w-[380px] h-[600px] bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">

                    {/* Header */}
                    <div className="bg-slate-900 p-6 flex items-center gap-4 border-b border-white/5">
                        {view !== 'list' && (
                            <button onClick={() => setView('list')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-white/10 transition">
                                <ArrowLeft size={20} className="text-white" />
                            </button>
                        )}
                        <div className="flex-1">
                            <h3 className="text-white font-black text-lg tracking-tight">
                                {view === 'list' && "Operations Hub"}
                                {view === 'chat' && (activeTarget.name || activeTarget.name)}
                                {view === 'create-group' && "Form New Squad"}
                            </h3>
                            <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest opacity-80 leading-none mt-1">
                                {view === 'list' && `${onlineIds.length} Agents Online`}
                                {view === 'chat' && (activeTarget.members ? `${activeTarget.members.length} Members` : (onlineIds.includes(activeTarget._id) ? 'Online Now' : 'Last seen recently'))}
                                {view === 'create-group' && "Select your team members"}
                            </p>
                        </div>
                        {view === 'list' && (
                            <button onClick={() => setView('create-group')} className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-slate-900 hover:scale-105 transition active:scale-95">
                                <Plus size={20} />
                            </button>
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden relative">

                        {/* LIST VIEW */}
                        {view === 'list' && (
                            <div className="h-full overflow-y-auto p-4 space-y-6 custom-scrollbar">
                                {/* Groups Section */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <Users size={12} /> Active Squads
                                    </p>
                                    <div className="space-y-2">
                                        {groups.map(g => (
                                            <button key={g._id} onClick={() => openChat(g)} className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition group relative">
                                                <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-inner">
                                                    <Hash size={24} />
                                                </div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <p className="font-black text-slate-800 dark:text-slate-100 text-sm truncate">{g.name}</p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{g.members.length} Members</p>
                                                </div>
                                                {unreadCounts[g._id] > 0 && (
                                                    <span className="w-5 h-5 bg-emerald-500 rounded-full text-[9px] font-black text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-950">
                                                        {unreadCounts[g._id]}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Direct Messages Section */}
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                        <MessageSquare size={12} /> Direct COMMS
                                    </p>
                                    <div className="space-y-2">
                                        {users.map(u => (
                                            <button key={u._id} onClick={() => openChat(u)} className="w-full flex items-center gap-4 p-4 rounded-[1.5rem] hover:bg-slate-50 dark:hover:bg-slate-900 border border-transparent hover:border-slate-100 dark:hover:border-slate-800 transition group">
                                                <div className="relative">
                                                    <Avatar src={u.profilePic} name={u.name} size="md" className="ring-2 ring-transparent group-hover:ring-emerald-500 transition-all" />
                                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white dark:border-slate-950 ${onlineIds.includes(u._id) ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                                                </div>
                                                <div className="text-left flex-1 min-w-0">
                                                    <p className="font-black text-slate-800 dark:text-slate-100 text-sm truncate">{u.name}</p>
                                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{u.title}</p>
                                                </div>
                                                {unreadCounts[getRoomId(user._id, u._id)] > 0 && (
                                                    <span className="w-5 h-5 bg-emerald-500 rounded-full text-[9px] font-black text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-950">
                                                        {unreadCounts[getRoomId(user._id, u._id)]}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CREATE GROUP VIEW */}
                        {view === 'create-group' && (
                            <div className="h-full flex flex-col p-6 space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Squad Designation</label>
                                    <input
                                        value={groupName}
                                        onChange={(e) => setGroupName(e.target.value)}
                                        placeholder="e.g. ALPHA SQUAD"
                                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 font-black text-sm text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Deploy Operatives</label>
                                    {users.map(u => (
                                        <button
                                            key={u._id}
                                            onClick={() => toggleMember(u._id)}
                                            className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all ${selectedMembers.includes(u._id) ? 'bg-emerald-500/10 border-emerald-500' : 'border-slate-100 dark:border-slate-800'}`}
                                        >
                                            <Avatar src={u.profilePic} name={u.name} size="sm" />
                                            <span className={`text-xs font-black flex-1 text-left ${selectedMembers.includes(u._id) ? 'text-emerald-600' : 'text-slate-600 dark:text-slate-400'}`}>{u.name}</span>
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMembers.includes(u._id) ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200 dark:border-slate-700'}`}>
                                                {selectedMembers.includes(u._id) && <Plus size={12} className="rotate-45" />}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={createGroupChat}
                                    disabled={!groupName.trim() || selectedMembers.length === 0}
                                    className="w-full bg-emerald-500 text-slate-900 font-black py-5 rounded-2xl shadow-xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95 transition disabled:opacity-40 disabled:hover:scale-100 uppercase tracking-widest text-xs"
                                >
                                    Confirm Strategic Unit
                                </button>
                            </div>
                        )}

                        {/* CHAT VIEW */}
                        {view === 'chat' && (
                            <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950">
                                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                    {messages.map((msg, i) => {
                                        const isMine = msg.senderId === user._id;
                                        return (
                                            <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                                                <div className={`max-w-[85%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                                                    {!isMine && (
                                                        <div className="flex items-center gap-2 mb-1 px-1">
                                                            <Avatar src={msg.senderPic} name={msg.senderName} size="xs" />
                                                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{msg.senderName}</span>
                                                        </div>
                                                    )}
                                                    <div className={`px-5 py-3 rounded-2xl text-xs font-bold leading-relaxed shadow-sm ${isMine
                                                        ? 'bg-emerald-600 text-white rounded-tr-none'
                                                        : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-800'
                                                        }`}>
                                                        {msg.text}
                                                    </div>
                                                    <span className="text-[8px] font-black text-slate-400 mt-1 uppercase opacity-60">
                                                        {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {typing && (
                                        <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-3 py-2 rounded-full w-fit">
                                            <span className="flex gap-1">
                                                <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                                                <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                                                <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                                            </span>
                                            <span className="uppercase tracking-widest">{typing} is typing…</span>
                                        </div>
                                    )}
                                    <div ref={bottomRef} />
                                </div>
                                <form onSubmit={sendMessage} className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex gap-3">
                                    <input
                                        value={text}
                                        onChange={handleTyping}
                                        placeholder="Enter secure message..."
                                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl px-5 py-4 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                    <button type="submit" className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-900 shadow-lg shadow-emerald-500/20 hover:scale-110 active:scale-95 transition">
                                        <Send size={20} />
                                    </button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;

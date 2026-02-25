import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

let socket = null;

// Generate a consistent room ID for two users
const getRoomId = (id1, id2) => [id1, id2].sort().join('_');

const ChatWidget = () => {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [view, setView] = useState('list'); // 'list' | 'chat'
    const [users, setUsers] = useState([]);
    const [onlineIds, setOnlineIds] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [typing, setTyping] = useState(false);
    const [unread, setUnread] = useState(0);
    const bottomRef = useRef(null);
    const typingTimer = useRef(null);

    // Load all users to chat with
    useEffect(() => {
        api.get('/users?all=true').then(res => {
            const list = (res.data.users || []).filter(u => u._id !== user?._id);
            setUsers(list);
        }).catch(() => { });
    }, [user]);

    // Connect socket once
    useEffect(() => {
        if (!user) return;
        socket = io('/', { transports: ['websocket'] });

        socket.emit('user:online', { userId: user._id, name: user.name, role: user.role, profilePic: user.profilePic });

        socket.on('users:online', (list) => {
            setOnlineIds(list.map(u => u.userId));
        });

        socket.on('message:new', (msg) => {
            setMessages(prev => [...prev, msg]);

            // Show notification if window is closed or chatting with someone else
            const isActiveChat = activeUser?._id === msg.senderId || msg.senderId === user._id;

            if (msg.senderId !== user._id && (!open || !isActiveChat)) {
                setUnread(n => n + 1);
                toast((t) => (
                    <div className="flex items-center gap-3">
                        <Avatar src={msg.senderPic} name={msg.senderName} size="sm" />
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-xs text-white uppercase tracking-tighter">{msg.senderName}</p>
                            <p className="text-[11px] text-emerald-100/80 truncate font-medium">{msg.text}</p>
                        </div>
                        <button onClick={() => toast.dismiss(t.id)} className="text-white/40 hover:text-white">✕</button>
                    </div>
                ), {
                    duration: 4000,
                    position: 'bottom-right',
                    style: {
                        background: '#020617',
                        borderRadius: '20px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '12px 16px',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
                    }
                });
            }

            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        });

        socket.on('messages:history', (history) => {
            setMessages(history);
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
        });

        socket.on('typing:update', ({ name, typing }) => {
            setTyping(typing ? name : false);
        });

        return () => socket?.disconnect();
    }, [user, activeUser, open]);

    const openChat = (peer) => {
        setActiveUser(peer);
        setView('chat');
        setMessages([]);
        const roomId = getRoomId(user._id, peer._id);
        socket?.emit('room:join', { roomId });
    };

    const sendMessage = (e) => {
        e.preventDefault();
        if (!text.trim() || !activeUser) return;
        const roomId = getRoomId(user._id, activeUser._id);
        socket?.emit('message:send', { roomId, senderId: user._id, senderName: user.name, senderPic: user.profilePic, text: text.trim() });
        socket?.emit('typing:stop', { roomId });
        setText('');
    };

    const handleTyping = (e) => {
        setText(e.target.value);
        const roomId = getRoomId(user._id, activeUser?._id);
        socket?.emit('typing:start', { roomId, name: user.name });
        clearTimeout(typingTimer.current);
        typingTimer.current = setTimeout(() => socket?.emit('typing:stop', { roomId }), 1500);
    };

    const handleOpen = () => {
        setOpen(o => !o);
        setUnread(0);
    };

    const formatTime = (iso) => {
        const d = new Date(iso);
        return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <>
            {/* ── Floating Chat Button ─────────────────────── */}
            <button
                onClick={handleOpen}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-white text-2xl transition-all hover:scale-110 active:scale-95"
                title="Team Chat"
            >
                {open ? '✕' : '💬'}
                {unread > 0 && !open && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold">
                        {unread}
                    </span>
                )}
            </button>

            {/* ── Chat Panel ───────────────────────────────── */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-80 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 animate-fade-in"
                    style={{ height: '520px' }}>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-5 flex items-center gap-3 shadow-md">
                        {view === 'chat' ? (
                            <>
                                <button onClick={() => setView('list')} className="text-white hover:bg-white/20 w-8 h-8 rounded-full flex items-center justify-center transition mr-1">←</button>
                                <Avatar name={activeUser?.name} email={activeUser?.email} src={activeUser?.profilePic} size="sm" className="border-2 border-white/20" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold text-sm truncate">{activeUser?.name}</p>
                                    <p className="text-green-100 text-[10px] font-bold uppercase tracking-wider">{activeUser?.department}</p>
                                </div>
                                <div className={`w-2.5 h-2.5 rounded-full border-2 border-green-600 ${onlineIds.includes(activeUser?._id) ? 'bg-green-300 animate-pulse' : 'bg-gray-400'}`} />
                            </>
                        ) : (
                            <>
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">💬</div>
                                <div>
                                    <p className="text-white font-extrabold text-sm tracking-tight">Team Messages</p>
                                    <p className="text-green-100 text-[10px] font-bold uppercase tracking-wider">{onlineIds.length} users online</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── User List View ─────────────────── */}
                    {view === 'list' && (
                        <div className="flex-1 overflow-y-auto scrollbar-hide py-2">
                            {users.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">
                                    <p className="text-4xl mb-2">👥</p>
                                    <p className="text-sm">No colleagues found</p>
                                </div>
                            ) : (
                                users.map(u => (
                                    <button
                                        key={u._id}
                                        onClick={() => openChat(u)}
                                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition border-b border-gray-50 dark:border-slate-800/50 text-left"
                                    >
                                        <div className="relative">
                                            <Avatar name={u.name} email={u.email} src={u.profilePic} size="md" className="shadow-sm" />
                                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${onlineIds.includes(u._id) ? 'bg-green-500' : 'bg-slate-300'}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{u.name}</p>
                                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{u.role} · {u.department}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* ── Chat View ────────────────────────── */}
                    {view === 'chat' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-[#0f172a]/50 scrollbar-hide">
                                {messages.length === 0 && (
                                    <div className="text-center py-10 px-4">
                                        <p className="text-4xl mb-3">👋</p>
                                        <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                                            Start a conversation with {activeUser?.name?.split(' ')[0]}
                                        </p>
                                    </div>
                                )}
                                {messages.map(msg => {
                                    const isMine = msg.senderId === user._id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2`}>
                                            {!isMine && (
                                                <Avatar name={msg.senderName} src={msg.senderPic} size="sm" className="mt-1 flex-shrink-0" />
                                            )}
                                            <div className={`max-w-[80%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                                                <div className={`px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${isMine
                                                    ? 'bg-emerald-600 text-white rounded-tr-none'
                                                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 mt-1 px-1 uppercase">{formatTime(msg.time)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {typing && (
                                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1.5 rounded-full w-fit">
                                        <span className="flex gap-1">
                                            <span className="w-1 h-1 bg-current rounded-full animate-bounce" />
                                            <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.2s]" />
                                            <span className="w-1 h-1 bg-current rounded-full animate-bounce [animation-delay:0.4s]" />
                                        </span>
                                        <span>{typing} is typing…</span>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input Area */}
                            <form onSubmit={sendMessage} className="p-4 border-t border-slate-100 dark:border-slate-800 flex gap-2 bg-white dark:bg-slate-900">
                                <input
                                    value={text}
                                    onChange={handleTyping}
                                    placeholder="Type a message…"
                                    className="flex-1 text-sm px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!text.trim()}
                                    className="w-10 h-10 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 rounded-xl flex items-center justify-center text-white transition shadow-lg shadow-emerald-500/20"
                                >
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 -rotate-45 translate-x-0.5 -translate-y-0.5">
                                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                                    </svg>
                                </button>
                            </form>
                        </>
                    )}
                </div>
            )}
        </>
    );
};

export default ChatWidget;

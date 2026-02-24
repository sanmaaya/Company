import React, { useState, useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from '../../context/AuthContext';
import Avatar from './Avatar';
import api from '../../utils/api';

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
        socket = io('http://localhost:5000', { transports: ['websocket'] });

        socket.emit('user:online', { userId: user._id, name: user.name, role: user.role });

        socket.on('users:online', (list) => {
            setOnlineIds(list.map(u => u.userId));
        });

        socket.on('message:new', (msg) => {
            setMessages(prev => [...prev, msg]);
            if (!open) setUnread(n => n + 1);
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
    }, [user]);

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
        socket?.emit('message:send', { roomId, senderId: user._id, senderName: user.name, text: text.trim() });
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
                <div className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
                    style={{ height: '480px' }}>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-4 flex items-center gap-3">
                        {view === 'chat' ? (
                            <>
                                <button onClick={() => setView('list')} className="text-green-100 hover:text-white text-lg mr-1">←</button>
                                <Avatar name={activeUser?.name} email={activeUser?.email} size="sm" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-semibold text-sm truncate">{activeUser?.name}</p>
                                    <p className="text-green-100 text-xs capitalize">{activeUser?.department}</p>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${onlineIds.includes(activeUser?._id) ? 'bg-green-300' : 'bg-gray-400'}`} />
                            </>
                        ) : (
                            <>
                                <span className="text-2xl">💬</span>
                                <div>
                                    <p className="text-white font-bold text-sm">Team Chat</p>
                                    <p className="text-green-100 text-xs">{onlineIds.length} online</p>
                                </div>
                            </>
                        )}
                    </div>

                    {/* ── User List View ─────────────────── */}
                    {view === 'list' && (
                        <div className="flex-1 overflow-y-auto">
                            {users.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 text-sm">No other users found</div>
                            ) : (
                                users.map(u => (
                                    <button
                                        key={u._id}
                                        onClick={() => openChat(u)}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition border-b border-gray-50 text-left"
                                    >
                                        <div className="relative">
                                            <Avatar name={u.name} email={u.email} size="md" />
                                            <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${onlineIds.includes(u._id) ? 'bg-green-400' : 'bg-gray-300'}`} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-gray-800 truncate">{u.name}</p>
                                            <p className="text-xs text-gray-400 capitalize">{u.role} · {u.department}</p>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    )}

                    {/* ── Chat View ────────────────────────── */}
                    {view === 'chat' && (
                        <>
                            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                                {messages.length === 0 && (
                                    <div className="text-center text-gray-400 text-xs pt-8">
                                        👋 Say hello to {activeUser?.name?.split(' ')[0]}!
                                    </div>
                                )}
                                {messages.map(msg => {
                                    const isMine = msg.senderId === user._id;
                                    return (
                                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'} gap-2`}>
                                            {!isMine && (
                                                <Avatar name={msg.senderName} size="sm" className="mt-1 flex-shrink-0" />
                                            )}
                                            <div className={`max-w-[70%] ${isMine ? 'items-end' : 'items-start'} flex flex-col`}>
                                                {!isMine && (
                                                    <span className="text-xs text-gray-400 mb-0.5 ml-1">{msg.senderName?.split(' ')[0]}</span>
                                                )}
                                                <div className={`px-3 py-2 rounded-2xl text-sm ${isMine
                                                        ? 'bg-green-600 text-white rounded-br-sm'
                                                        : 'bg-white text-gray-800 shadow-sm rounded-bl-sm border border-gray-100'
                                                    }`}>
                                                    {msg.text}
                                                </div>
                                                <span className="text-[10px] text-gray-400 mt-0.5 px-1">{formatTime(msg.time)}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                                {typing && (
                                    <div className="flex items-center gap-2 text-xs text-gray-400">
                                        <div className="flex gap-0.5">
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                        <span>{typing} is typing…</span>
                                    </div>
                                )}
                                <div ref={bottomRef} />
                            </div>

                            {/* Input */}
                            <form onSubmit={sendMessage} className="p-3 border-t border-gray-100 flex gap-2 bg-white">
                                <input
                                    value={text}
                                    onChange={handleTyping}
                                    placeholder={`Message ${activeUser?.name?.split(' ')[0]}…`}
                                    className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-gray-50"
                                    autoFocus
                                />
                                <button
                                    type="submit"
                                    disabled={!text.trim()}
                                    className="w-9 h-9 bg-green-600 hover:bg-green-700 disabled:opacity-40 rounded-xl flex items-center justify-center text-white text-lg transition"
                                >
                                    ➤
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

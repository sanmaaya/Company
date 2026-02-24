import React from 'react';

// Map of email → avatar photo path (public/avatars/)
export const AVATAR_PHOTOS = {
    'hr@leavesync.com': '/avatars/meera.jpg',
    'employee@leavesync.com': '/avatars/rahul.jpg',
    'anita@leavesync.com': '/avatars/anita.jpg',
    'dev@leavesync.com': '/avatars/dev.jpg',
};

// 12 vibrant gradients, deterministically assigned by name
const GRADIENTS = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-orange-500',
    'from-indigo-500 to-blue-600',
    'from-fuchsia-500 to-purple-500',
    'from-cyan-500 to-sky-600',
    'from-lime-500 to-green-600',
    'from-red-500 to-rose-600',
    'from-sky-500 to-indigo-500',
    'from-orange-500 to-amber-600',
];

export const getGradient = (name = '') => {
    if (!name) return GRADIENTS[0];
    const code = name.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    return GRADIENTS[code % GRADIENTS.length];
};

const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-xl',
    xl: 'w-20 h-20 text-3xl',
};

// Avatar — shows real photo if available, otherwise colored initials
const Avatar = ({ name = '', email = '', size = 'md', className = '' }) => {
    const photo = AVATAR_PHOTOS[email];
    const gradient = getGradient(name);
    const initials = name
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || '?';

    if (photo) {
        return (
            <img
                src={photo}
                alt={name}
                className={`${sizes[size]} rounded-full object-cover flex-shrink-0 shadow-sm ring-2 ring-white ${className}`}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
        );
    }

    return (
        <div
            className={`bg-gradient-to-br ${gradient} ${sizes[size]} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0 shadow-sm ${className}`}
        >
            {initials}
        </div>
    );
};

export default Avatar;

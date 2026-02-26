import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
            <h1 className="text-6xl font-bold text-blue-600 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Oops! Page not found.</p>
            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                Go Home
            </Link>
        </div>
    );
};

export default NotFound;

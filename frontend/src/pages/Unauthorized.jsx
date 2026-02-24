import React from 'react';
import { Link } from 'react-router-dom';
const Unauthorized = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-8xl mb-4">🚫</div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Access Denied</h1>
      <p className="text-gray-500 mb-6">You don't have permission to access this page.</p>
      <Link to="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition">Go to Dashboard</Link>
    </div>
  </div>
);
export default Unauthorized;

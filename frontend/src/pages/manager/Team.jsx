import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { RoleBadge } from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Avatar from '../../components/common/Avatar';

const Team = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(res => setMembers(res.data.users)).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout title="My Team">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">Team Members ({members.length})</h3>
        </div>
        {loading ? (
          <div className="p-10 flex justify-center"><LoadingSpinner /></div>
        ) : members.length === 0 ? (
          <div className="p-12 text-center text-gray-400"><p className="text-4xl mb-3">👥</p><p>No team members found</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
            {members.map(m => (
              <div key={m._id} className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={m.name} size="md" />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <RoleBadge role={m.role} />
                  <span className="text-xs text-gray-400 font-medium">{m.department}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-1 text-center text-xs">
                  {['casual', 'sick', 'earned'].map(t => (
                    <div key={t} className="bg-gray-50 rounded-lg p-1.5">
                      <div className="font-bold text-gray-700">{m.leaveBalance?.[t] ?? 0}</div>
                      <div className="text-gray-400 capitalize">{t}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Team;

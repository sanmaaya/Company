import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const LeaveContext = createContext();

const leaveReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING': return { ...state, loading: action.payload };
    case 'SET_LEAVES': return { ...state, leaves: action.payload, loading: false };
    case 'ADD_LEAVE': return { ...state, leaves: [action.payload, ...state.leaves] };
    case 'UPDATE_LEAVE':
      return { ...state, leaves: state.leaves.map(l => l._id === action.payload._id ? action.payload : l) };
    case 'REMOVE_LEAVE':
      return { ...state, leaves: state.leaves.filter(l => l._id !== action.payload) };
    case 'SET_STATS': return { ...state, stats: action.payload };
    case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
    default: return state;
  }
};

export const LeaveProvider = ({ children }) => {
  const [state, dispatch] = useReducer(leaveReducer, {
    leaves: [],
    stats: null,
    loading: false,
    error: null
  });

  const fetchLeaves = useCallback(async (params = {}) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    try {
      const res = await api.get('/leaves', { params });
      dispatch({ type: 'SET_LEAVES', payload: res.data.leaves });
      return res.data;
    } catch (err) {
      dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message });
      throw err;
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/leaves/stats');
      dispatch({ type: 'SET_STATS', payload: res.data.stats });
    } catch (err) {
      console.error('Stats fetch error', err);
    }
  }, []);

  const applyLeave = async (data) => {
    const res = await api.post('/leaves', data);
    dispatch({ type: 'ADD_LEAVE', payload: res.data.leave });
    return res.data.leave;
  };

  const reviewLeave = async (id, status, comment) => {
    const res = await api.put(`/leaves/${id}/review`, { status, reviewComment: comment });
    dispatch({ type: 'UPDATE_LEAVE', payload: res.data.leave });
    return res.data.leave;
  };

  const cancelLeave = async (id) => {
    await api.delete(`/leaves/${id}`);
    dispatch({ type: 'REMOVE_LEAVE', payload: id });
  };

  return (
    <LeaveContext.Provider value={{ ...state, fetchLeaves, fetchStats, applyLeave, reviewLeave, cancelLeave }}>
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => useContext(LeaveContext);

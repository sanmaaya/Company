import React, { createContext, useContext, useReducer, useCallback } from 'react';
import api from '../utils/api';

const ReimbursementContext = createContext();

const reimbursementReducer = (state, action) => {
    switch (action.type) {
        case 'SET_LOADING': return { ...state, loading: action.payload };
        case 'SET_REIMBURSEMENTS': return { ...state, reimbursements: action.payload, loading: false };
        case 'ADD_REIMBURSEMENT': return { ...state, reimbursements: [action.payload, ...state.reimbursements] };
        case 'UPDATE_REIMBURSEMENT':
            return { ...state, reimbursements: state.reimbursements.map(r => r._id === action.payload._id ? action.payload : r) };
        case 'REMOVE_REIMBURSEMENT':
            return { ...state, reimbursements: state.reimbursements.filter(r => r._id !== action.payload) };
        case 'SET_ERROR': return { ...state, error: action.payload, loading: false };
        default: return state;
    }
};

export const ReimbursementProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reimbursementReducer, {
        reimbursements: [],
        loading: false,
        error: null
    });

    const fetchMyReimbursements = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await api.get('/reimbursements/me');
            dispatch({ type: 'SET_REIMBURSEMENTS', payload: res.data.data });
            return res.data;
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message });
            throw err;
        }
    }, []);

    const fetchAllReimbursements = useCallback(async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const res = await api.get('/reimbursements');
            dispatch({ type: 'SET_REIMBURSEMENTS', payload: res.data.data });
            return res.data;
        } catch (err) {
            dispatch({ type: 'SET_ERROR', payload: err.response?.data?.message });
            throw err;
        }
    }, []);

    const applyReimbursement = async (data) => {
        const res = await api.post('/reimbursements', data);
        dispatch({ type: 'ADD_REIMBURSEMENT', payload: res.data.data });
        return res.data.data;
    };

    const reviewReimbursement = async (id, status, comment) => {
        const res = await api.put(`/reimbursements/${id}/review`, { status, reviewComment: comment });
        dispatch({ type: 'UPDATE_REIMBURSEMENT', payload: res.data.data });
        return res.data.data;
    };

    const cancelReimbursement = async (id) => {
        await api.delete(`/reimbursements/${id}`);
        dispatch({ type: 'REMOVE_REIMBURSEMENT', payload: id });
    };

    return (
        <ReimbursementContext.Provider value={{ ...state, fetchMyReimbursements, fetchAllReimbursements, applyReimbursement, reviewReimbursement, cancelReimbursement }}>
            {children}
        </ReimbursementContext.Provider>
    );
};

export const useReimbursement = () => useContext(ReimbursementContext);

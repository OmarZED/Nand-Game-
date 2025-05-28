import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from './auth/LoginForm';

export const AuthGuard = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <LoginForm />;
  }

  return children;
}; 
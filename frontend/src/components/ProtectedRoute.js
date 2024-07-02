
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, isAuthenticated}) => {
  const { user } = useContext(AuthContext);

  return isAuthenticated ? children : <Navigate to="/login" />
};

export default ProtectedRoute;

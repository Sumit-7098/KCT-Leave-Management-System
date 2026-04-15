import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuth(!!token);
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  if (isLoading) return <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-50 to-slate-100 p-8">
    <Loader size={48} message="Checking authentication..." />
  </div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;

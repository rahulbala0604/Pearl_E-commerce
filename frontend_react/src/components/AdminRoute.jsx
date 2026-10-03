import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Loader from './Loader';

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader fullScreen />;

  return user && user.role === 'admin' ? <Outlet /> : <Navigate to="/" replace />;
};

export default AdminRoute;

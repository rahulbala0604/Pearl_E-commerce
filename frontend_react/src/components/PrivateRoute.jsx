import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Loader from './Loader';

const PrivateRoute = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <Loader fullScreen />;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

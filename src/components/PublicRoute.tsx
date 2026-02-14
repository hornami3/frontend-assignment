import {Navigate, Outlet} from 'react-router';
import {TOKEN_KEY} from '../constants';

export const PublicRoute = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (token) {
    return <Navigate to="/overview" replace />;
  }

  return <Outlet />;
};

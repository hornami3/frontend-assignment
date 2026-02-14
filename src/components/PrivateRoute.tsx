import {Navigate, Outlet} from 'react-router';
import {TOKEN_KEY} from '../constants';

export const PrivateRoute = () => {
  const token = localStorage.getItem(TOKEN_KEY);

  if (!token) {
    return <Navigate to="/sign-in" replace />;
  }

  return <Outlet />;
};

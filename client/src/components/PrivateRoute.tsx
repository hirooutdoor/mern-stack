import { useAppSelector } from '../app/store';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
  const { currentUser } = useAppSelector((state) => state.user);

  return currentUser ? <Outlet /> : <Navigate to="/sign-in" />;
};

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks';
import { Layout } from '../components';

export const PrivateLayout = () => {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

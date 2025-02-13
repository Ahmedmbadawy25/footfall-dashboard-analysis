import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import NotificationHandler from './Notification';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <NotificationHandler status="loading" message="Processing..." />;  // Prevents flickering before auth state is known

    if (!user) return <Navigate to="/" />; // Redirect if not logged in

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" />; // Redirect if role is not allowed
    }

    return <Outlet />; // Render the protected component
};

export default ProtectedRoute;

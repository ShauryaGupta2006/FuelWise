import { Navigate, Outlet } from 'react-router-dom';

export function ProtectedRoute() {
    const user = localStorage.getItem('fuelwise_user');
    const token = localStorage.getItem('fuelwise_token');

    if (!user && !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}

export function PublicRoute() {
    const user = localStorage.getItem('fuelwise_user');
    const token = localStorage.getItem('fuelwise_token');

    if (user || token) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}

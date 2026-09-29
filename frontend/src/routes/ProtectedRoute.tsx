import { Navigate, Outlet } from "react-router-dom";

import Loading from "../components/common/Loading";
import { useAuth } from "../context/AuthContext";
import type { User } from "../services/authService";

interface ProtectedRouteProps {
    allowedRoles?: User["role"][];
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem("accessToken");

    const { user, loading } = useAuth();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return <Loading />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
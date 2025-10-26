import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

interface RouteProtectorProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    redirectTo?: string;
}

const ProtectedRoute = ({ children, requireAuth = true, redirectTo }: RouteProtectorProps) => {
    const { isAuthenticated, isLoading } = useAuthStore();
    const location = useLocation();

    // Show loading while verifying authentication
    if(isLoading){
        return(
            <div className="w-full h-full flex gap-2 absolute top-0 left-0 z-100 bg-base-100 justify-center items-center">
                <span className="loading loading-infinity loading-xl"></span>
                <p>Connecting to Server. Please Wait</p>
            </div>
        );
    };

    // Protect authenticated routes
    if (requireAuth && !isAuthenticated) {
        return <Navigate to={redirectTo || "/login"} state={{ from: location.pathname }} replace />;
    };

    // Protect guest-only routes (login, signup)
    if (!requireAuth && isAuthenticated) {
        return <Navigate to={redirectTo || "/"} replace />;
    };

    return <>{children}</>;
};

export default ProtectedRoute
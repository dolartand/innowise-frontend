import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from './LoadingSpinner';

const AdminRoute = ({children}) => {
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }

    if (!isAdmin) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">
                    <h4>Access denied</h4>
                    <p>You dont have permissions to view this page</p>
                </div>
            </div>
        )
    }
    return children;
}

export default AdminRoute;
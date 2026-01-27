import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import LoadingSpinner from './LoadingSpinner';

const PrivateRoute = ({ children }) => {
    const {isAuthenticated, loading} = useAuth();
    const location = useLocation();

    if (loading) {
        return <LoadingSpinner />;
    }
    
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{from: location}} replace/>;
    }
    return children;
}

export default PrivateRoute;
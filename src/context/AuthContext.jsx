import {createContext, useContext, useEffect, useState} from "react";
import {decodeToken, isAuthenticated} from "../utils/auth.js";
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated()) {
            const decoded = decodeToken();
            if (decoded) {
                setUser({
                    userId: decoded.userId,
                    email: decoded.email,
                    role: decoded.role
                });
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const userData = await authService.login(email, password);
        setUser(userData);
        return userData;
    }

    const register = async (userData) => {
        const newUser = await authService.register(userData);
        setUser(newUser);
        return newUser;
    }

    const logout = async () => {
        await authService.logout();
        setUser(null);
    }

    const isAdmin = () => {
        return user?.role === 'ADMIN';
    }

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin
    }

    return (
        <AuthContext.Provider value={value}>
        {children}
        </AuthContext.Provider>
    )
}
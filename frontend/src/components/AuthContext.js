import { createContext, useContext, useEffect, useState } from 'react';
import { makeRequest } from '../fetcher';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Fetch the authenticated user from the backend
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await makeRequest('GET', '/api/auth/me');  // Endpoint to get user info from the backend
                setUser(res.data.user);  // Example: { id, role, name }
            } catch (error) {
                setUser(null);
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    const login = async (credentials) => {
        try {
            const response = await makeRequest('POST', '/api/auth/login', credentials);
            if (response.status === '200') {
                setUser({ ...response.data.user });
                return response
            }
            else {
                return response
            }
        } catch (error) {
            console.error('Login failed:', error.message);
        }
    };

    // 🔹 Centralized logout function
    const logout = async () => {
        try {
            await makeRequest('POST', '/api/auth/logout');
            setUser(null); // ✅ Clear user in AuthContext
        } catch (error) {
            console.error('Logout failed:', error.message);
        }
    };


    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);

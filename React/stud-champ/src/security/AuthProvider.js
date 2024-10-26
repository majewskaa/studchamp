import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            if (checkToken(token)) {
                setUser({ token });
            } else {
                setUser(null);
            }
        }
    }, []);

    const checkToken = (token) => {
        // Implement token validation logic here
        // For example, you can decode the token and check its expiration
        return true; // Placeholder, replace with actual validation
    };

    const login = async (userLogin, password) => {
        const response = await fetch(process.env.REACT_APP_API_URL + '/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                username: userLogin,
                password: password
            })
        });

        const data = await response.json();
        if (data.access_token) {
            localStorage.setItem('token', data.access_token);
            setUser({ token: data.access_token });
            navigate('/home');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
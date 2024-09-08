import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkToken } from './usosAuthorisation';

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
        if (data.success) {
            localStorage.setItem('token', data.token);
            setUser({ token: data.token });
            navigate('/');
            return { "success": true, "message": data.message };
        } else {
            return { "success": false, "message": data.message };
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
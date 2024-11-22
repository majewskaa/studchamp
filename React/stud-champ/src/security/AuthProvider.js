import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user_id = localStorage.getItem('user_id');
        if (token) {
            if (true) {
                setUser({ token, user_id });
            } else {
                setUser(null);
                navigate('/');
            }
        }
    }, []);

    const checkToken = (token) => {
        fetch(process.env.REACT_APP_API_URL + '/token/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer ' + token
            }
        }).then(response => {
            if (response.status === 200) {
                return true;
            } else {
                return false;
            }
        });
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
            localStorage.setItem('user_id', data.user_id);
            setUser({ token: data.access_token, user_id: data.user_id });
            navigate('/home');
            return data;
        } else {
            return data;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_id');
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
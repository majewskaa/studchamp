import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ element: Component, ...rest }) => {
    const { user } = useAuth();
    return (
        <Route
            {...rest}
            element={user != null ? <Component /> : <Navigate to="/" />}
        />
    );
};

export default PrivateRoute;